import { useState } from "react";
import api, { extractErrorMessage } from "../api/client";

const emptyForm = { senderAccountNumber: "", receiverAccountNumber: "", amount: "" };

export default function TransferPage() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSubmitting(true);
    api
      .post("/transactions", {
        senderAccountNumber: form.senderAccountNumber,
        receiverAccountNumber: form.receiverAccountNumber,
        amount: parseFloat(form.amount),
      })
      .then((res) => {
        setResult(res.data);
        setForm(emptyForm);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="page">
      <h2>Realizar transferencia</h2>

      <form className="card form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            name="senderAccountNumber"
            placeholder="Cuenta origen"
            value={form.senderAccountNumber}
            onChange={handleChange}
            required
          />
          <input
            name="receiverAccountNumber"
            placeholder="Cuenta destino"
            value={form.receiverAccountNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Monto"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Procesando..." : "Transferir"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && (
        <div className="card success">
          <h3>Transferencia exitosa</h3>
          <p>
            ${Number(result.amount).toFixed(2)} de {result.senderAccountNumber} a {result.receiverAccountNumber}
          </p>
          <p className="muted">ID de transacción: {result.id}</p>
        </div>
      )}
    </div>
  );
}
