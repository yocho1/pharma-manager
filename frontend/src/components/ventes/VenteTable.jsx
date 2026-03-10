/**
 * Displays a table of past ventes with a cancel button for active sales.
 *
 * Props:
 *  - ventes: array of Vente objects
 *  - isLoading: boolean
 *  - onAnnuler: (venteId) => void
 *  - annulerPending: boolean
 */
function VenteTable({ ventes, isLoading, onAnnuler, annulerPending }) {
  if (isLoading) return <p className="loading">Chargement des ventes…</p>;

  if (!ventes || ventes.length === 0) {
    return <p>Aucune vente enregistrée.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Montant total</th>
          <th>Lignes</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {ventes.map((vente) => (
          <tr key={vente.id}>
            <td>{vente.id}</td>
            <td>{new Date(vente.date_vente).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</td>
            <td>{Number(vente.montant_total).toFixed(2)} €</td>
            <td>
              {vente.lignes && vente.lignes.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: "1.2rem", listStyle: "disc" }}>
                  {vente.lignes.map((l) => (
                    <li key={l.id}>
                      {l.medicament_nom ?? `Med #${l.medicament}`} × {l.quantite} = {Number(l.sous_total).toFixed(2)} €
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </td>
            <td>
              <span className={`badge ${vente.statut === "completee" ? "badge-success" : "badge-danger"}`}>
                {vente.statut === "completee" ? "Complétée" : "Annulée"}
              </span>
            </td>
            <td>
              {vente.statut === "completee" && (
                <button
                  className="btn-danger"
                  onClick={() => onAnnuler(vente.id)}
                  disabled={annulerPending}
                >
                  Annuler
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VenteTable;
