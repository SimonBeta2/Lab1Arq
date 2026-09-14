import { useEffect, useState } from "react";
import api, { extractErrorMessage } from "../api/client";

const emptyForm = { firstName: "", lastName: "", accountNumber: "", balance: "" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadCustomers = () => {
    setLoading(true);
    api
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(loadCustomers, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (customer) => {
    setError(null);
    setSuccessMsg(null);
    setEditingId(customer.id);
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      accountNumber: customer.accountNumber,
      balance: String(customer.balance),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      accountNumber: form.accountNumber,
      balance: parseFloat(form.balance),
    };
    const request = editingId ? api.put(`/customers/${editingId}`, payload) : api.post("/customers", payload);
    request
      .then(() => {
        setSuccessMsg(editingId ? "Cliente actualizado correctamente." : "Cliente creado correctamente.");
        setForm(emptyForm);
        setEditingId(null);
        loadCustomers();
      })
      .catch((err) => setError(extractErrorMessage(err)));
  };

  const handleDelete = (customer) => {
    if (!window.confirm(`¿Eliminar a ${customer.firstName} ${customer.lastName}?`)) return;
    setError(null);
    setSuccessMsg(null);
    api
      .delete(`/customers/${customer.id}`)
      .then(() => {
        setSuccessMsg("Cliente eliminado correctamente.");
        if (editingId === customer.id) cancelEdit();
        loadCustomers();
      })
      .catch((err) => setError(extractErrorMessage(err)));
  };

  return (
    <div className="page">
      <h2>Consultar clientes</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Editar cliente" : "Crear cliente"}</h3>
        <div className="form-row">
          <input name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <input
            name="accountNumber"
            placeholder="Número de cuenta"
            value={form.accountNumber}
            onChange={handleChange}
            required
          />
          <input
            name="balance"
            type="number"
            step="0.01"
            placeholder="Saldo inicial"
            value={form.balance}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row" style={{ flex: "none" }}>
          <button type="submit">{editingId ? "Guardar cambios" : "Crear cliente"}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}

      <div className="card">
        <h3>Clientes registrados</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : customers.length === 0 ? (
          <p>No hay clientes registrados todavía.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cuenta</th>
                <th>Saldo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    {c.firstName} {c.lastName}
                  </td>
                  <td>{c.accountNumber}</td>
                  <td>${Number(c.balance).toFixed(2)}</td>
                  <td className="actions">
                    <button type="button" className="btn-link" onClick={() => startEdit(c)}>
                      Editar
                    </button>
                    <button type="button" className="btn-link danger" onClick={() => handleDelete(c)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
