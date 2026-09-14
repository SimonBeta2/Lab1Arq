import { useEffect, useState } from "react";
import api, { extractErrorMessage } from "../api/client";

export default function HistoryPage() {
  const [customers, setCustomers] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => setError(extractErrorMessage(err)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!accountNumber) return;
    setError(null);
    setLoading(true);
    setSearched(true);
    api
      .get(`/transactions/${accountNumber}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  return (
    <div className="page">
      <h2>Histórico de transacciones</h2>

      <form className="card form form-row" onSubmit={handleSearch}>
        <select value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required>
          <option value="">Selecciona una cuenta...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.accountNumber}>
              {c.accountNumber} — {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
        <button type="submit">Consultar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && <p>Cargando...</p>}

      {!loading && searched && !error && (
        <div className="card">
          <h3>Transacciones de la cuenta {accountNumber}</h3>
          {transactions.length === 0 ? (
            <p>Esta cuenta no tiene transacciones registradas.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.senderAccountNumber}</td>
                    <td>{t.receiverAccountNumber}</td>
                    <td>${Number(t.amount).toFixed(2)}</td>
                    <td>{t.timestamp ? new Date(t.timestamp).toLocaleString() : "—"}</td>
                    <td>
                      {t.senderAccountNumber === accountNumber ? (
                        <span className="badge out">Enviada</span>
                      ) : (
                        <span className="badge in">Recibida</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
