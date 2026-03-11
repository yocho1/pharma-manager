import { Routes, Route, Navigate, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import MedicamentsPage from "./pages/MedicamentsPage";
import VentesPage from "./pages/VentesPage";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="navbar-brand">PharmaManager</h1>
        <ul className="navbar-nav">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/medicaments">Médicaments</Link>
          </li>
          <li>
            <Link to="/ventes">Ventes</Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/medicaments" element={<MedicamentsPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
