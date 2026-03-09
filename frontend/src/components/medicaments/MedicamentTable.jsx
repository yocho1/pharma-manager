import MedicamentRow from "./MedicamentRow";

/**
 * Table component listing medicaments.
 *
 * Props:
 *  - medicaments: array
 *  - onEdit: (medicament) => void
 *  - onDelete: (id) => void
 */
function MedicamentTable({ medicaments, onEdit, onDelete }) {
  if (!medicaments || medicaments.length === 0) {
    return <p>Aucun médicament trouvé.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>DCI</th>
            <th>Catégorie</th>
            <th>Forme</th>
            <th>Dosage</th>
            <th>Prix vente</th>
            <th>Stock</th>
            <th>Expiration</th>
            <th>Ordonnance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((med) => (
            <MedicamentRow
              key={med.id}
              medicament={med}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicamentTable;
