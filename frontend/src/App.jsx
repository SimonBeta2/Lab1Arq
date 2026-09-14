import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import TransferPage from "./pages/TransferPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1>UdeaBank</h1>
        <nav>
          <NavLink to="/" end>
            Clientes
          </NavLink>
          <NavLink to="/transferencia">Transferencia</NavLink>
          <NavLink to="/historico">Histórico</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CustomersPage />} />
          <Route path="/transferencia" element={<TransferPage />} />
          <Route path="/historico" element={<HistoryPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
