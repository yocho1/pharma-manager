import { useState } from "react";
import { useMedicaments } from "../../hooks/useMedicaments";

/**
 * Form component for creating a new vente.
 *
 * Allows selecting multiple medicaments with quantities,
 * displays live total, and submits the full sale.
 *
 * Props:
 *  - onSubmit: async ({ lignes: [{ medicament, quantite }] }) => void
 *  - onCancel: () => void
 *  - isPending: boolean
 *  - error: mutation error object
 */
function VenteForm({ onSubmit, onCancel, isPending, error }) {
  const { data, isLoading } = useMedicaments({ page_size: 200 });
  const medicaments = data?.results ?? data ?? [];

  const [lignes, setLignes] = useState([{ medicament: "", quantite: 1 }]);

  const addLigne = () => {
    setLignes((prev) => [...prev, { medicament: "", quantite: 1 }]);
  };

  const removeLigne = (index) => {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLigne = (index, field, value) => {
    setLignes((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const getMedById = (id) => medicaments.find((m) => m.id === Number(id));

  const totalEstime = lignes.reduce((acc, l) => {
    const med = getMedById(l.medicament);
    if (!med) return acc;
    return acc + Number(med.prix_vente) * Number(l.quantite || 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      lignes: lignes
        .filter((l) => l.medicament)
        .map((l) => ({
          medicament: Number(l.medicament),
          quantite: Number(l.quantite),
        })),
    };
    onSubmit(payload);
  };

  const apiErrors = error?.response?.data;

  if (isLoading) return <p className="loading">Chargement des médicaments…</p>;

  return (
    <form className="card" onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      <h3>Nouvelle vente</h3>

      {apiErrors && (
        <div className="error">
          {typeof apiErrors === "string" ? (
            <p>{apiErrors}</p>
          ) : (
            Object.entries(apiErrors).map(([field, msgs]) => (
              <p key={field}>
                <strong>{field}:</strong> {Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}
              </p>
            ))
          )}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Médicament</th>
            <th>Stock dispo</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, index) => {
            const med = getMedById(ligne.medicament);
            return (
              <tr key={index}>
                <td>
                  <select
                    value={ligne.medicament}
                    onChange={(e) => updateLigne(index, "medicament", e.target.value)}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {medicaments.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nom} ({m.dosage || m.forme})
                      </option>
                    ))}
                  </select>
                </td>
                <td>{med ? med.stock_actuel : "—"}</td>
                <td>{med ? `${med.prix_vente} €` : "—"}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={med ? med.stock_actuel : undefined}
                    value={ligne.quantite}
                    onChange={(e) => updateLigne(index, "quantite", e.target.value)}
                    style={{ width: "80px" }}
                    required
                  />
                </td>
                <td>
                  {med ? (Number(med.prix_vente) * Number(ligne.quantite || 0)).toFixed(2) + " €" : "—"}
                </td>
                <td>
                  {lignes.length > 1 && (
                    <button type="button" className="btn-danger" onClick={() => removeLigne(index)}>
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button type="button" onClick={addLigne} style={{ justifySelf: "start" }}>
        + Ajouter une ligne
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: "1.1rem" }}>Total estimé : {totalEstime.toFixed(2)} €</strong>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Enregistrement…" : "Valider la vente"}
          </button>
          {onCancel && <button type="button" onClick={onCancel}>Annuler</button>}
        </div>
      </div>
    </form>
  );
}

export default VenteForm;
