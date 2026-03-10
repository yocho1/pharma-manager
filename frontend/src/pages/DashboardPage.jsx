import { useDashboardStats } from "../hooks/useDashboard";
import { useMedicaments } from "../hooks/useMedicaments";

function StatCard({ label, value, color }) {
  return (
    <div className="card stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <p className="stat-value" style={{ color }}>{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { data: medData } = useMedicaments({ page_size: 200 });
  const medicaments = medData?.results ?? medData ?? [];

  const alertes = medicaments.filter((m) => m.en_alerte_stock);

  if (isLoading) return <p className="loading">Chargement du tableau de bord…</p>;
  if (error) return <p className="error">Erreur de chargement des statistiques.</p>;

  return (
    <div>
      <h2>Tableau de bord</h2>

      <div className="stats-grid">
        <StatCard label="Médicaments actifs" value={stats.total_medicaments} color="var(--primary)" />
        <StatCard label="Alertes de stock" value={stats.alertes_stock} color="var(--warning)" />
        <StatCard label="Ventes du jour" value={stats.ventes_du_jour} color="var(--success)" />
        <StatCard label="CA du jour" value={`${stats.chiffre_affaires_jour} €`} color="var(--primary-dark)" />
        <StatCard label="Médicaments expirés" value={stats.medicaments_expires} color="var(--danger)" />
      </div>

      {alertes.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Médicaments en alerte de stock</h3>
          <table>
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Stock actuel</th>
                <th>Stock minimum</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map((m) => (
                <tr key={m.id}>
                  <td>{m.nom}</td>
                  <td style={{ color: "var(--danger)", fontWeight: 600 }}>{m.stock_actuel}</td>
                  <td>{m.stock_minimum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
