/**
 * Table row display for a single medicament.
 *
 * Props:
 *  - medicament: object
 *  - onEdit: (medicament) => void
 *  - onDelete: (id) => void
 */
function MedicamentRow({ medicament, onEdit, onDelete }) {
  const m = medicament;

  return (
    <tr>
      <td>
        {m.nom}
        {m.en_alerte_stock && (
          <span
            title="Stock bas"
            style={{ color: "var(--danger)", marginLeft: "0.5rem", fontWeight: 700 }}
          >
            ⚠
          </span>
        )}
      </td>
      <td>{m.dci || "—"}</td>
      <td>{m.categorie_nom}</td>
      <td>{m.forme}</td>
      <td>{m.dosage || "—"}</td>
      <td>{m.prix_vente} €</td>
      <td style={{ color: m.en_alerte_stock ? "var(--danger)" : "inherit", fontWeight: m.en_alerte_stock ? 700 : 400 }}>
        {m.stock_actuel}
      </td>
      <td>{m.date_expiration}</td>
      <td>{m.ordonnance_requise ? "Oui" : "Non"}</td>
      <td>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button className="btn-primary" onClick={() => onEdit(m)}>
            Modifier
          </button>
          <button className="btn-danger" onClick={() => onDelete(m.id)}>
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
}

export default MedicamentRow;
