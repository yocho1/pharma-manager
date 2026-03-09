import { useState } from "react";
import CategorieSelect from "../common/CategorieSelect";

const FORME_OPTIONS = [
  { value: "comprime", label: "Comprimé" },
  { value: "gelule", label: "Gélule" },
  { value: "sirop", label: "Sirop" },
  { value: "injectable", label: "Injectable" },
  { value: "pommade", label: "Pommade" },
  { value: "suppositoire", label: "Suppositoire" },
  { value: "gouttes", label: "Gouttes" },
  { value: "autre", label: "Autre" },
];

const EMPTY_FORM = {
  nom: "",
  dci: "",
  categorie: "",
  forme: "comprime",
  dosage: "",
  prix_achat: "",
  prix_vente: "",
  stock_actuel: "",
  stock_minimum: "10",
  date_expiration: "",
  ordonnance_requise: false,
};

/**
 * Form component for creating / editing a medicament.
 *
 * Props:
 *  - initialData: object (for edit mode, optional)
 *  - onSubmit: async (formData) => void
 *  - onCancel: () => void
 *  - isPending: boolean
 *  - error: mutation error object
 */
function MedicamentForm({ initialData, onSubmit, onCancel, isPending, error }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      categorie: form.categorie ? Number(form.categorie) : null,
      prix_achat: form.prix_achat,
      prix_vente: form.prix_vente,
      stock_actuel: Number(form.stock_actuel),
      stock_minimum: Number(form.stock_minimum),
    });
  };

  const apiErrors = error?.response?.data;

  return (
    <form className="card" onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      <h3>{initialData ? "Modifier le médicament" : "Nouveau médicament"}</h3>

      {apiErrors && typeof apiErrors === "object" && (
        <div className="error">
          {Object.entries(apiErrors).map(([field, msgs]) => (
            <p key={field}>
              <strong>{field}:</strong> {Array.isArray(msgs) ? msgs.join(", ") : msgs}
            </p>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <label>
          Nom *
          <input name="nom" value={form.nom} onChange={handleChange} required />
        </label>
        <label>
          DCI
          <input name="dci" value={form.dci} onChange={handleChange} />
        </label>
        <label>
          Catégorie *
          <CategorieSelect
            value={form.categorie}
            onChange={(val) => setForm((prev) => ({ ...prev, categorie: val }))}
          />
        </label>
        <label>
          Forme
          <select name="forme" value={form.forme} onChange={handleChange}>
            {FORME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label>
          Dosage
          <input name="dosage" value={form.dosage} onChange={handleChange} />
        </label>
        <label>
          Prix d'achat *
          <input name="prix_achat" type="number" step="0.01" min="0.01" value={form.prix_achat} onChange={handleChange} required />
        </label>
        <label>
          Prix de vente *
          <input name="prix_vente" type="number" step="0.01" min="0.01" value={form.prix_vente} onChange={handleChange} required />
        </label>
        <label>
          Stock actuel *
          <input name="stock_actuel" type="number" min="0" value={form.stock_actuel} onChange={handleChange} required />
        </label>
        <label>
          Stock minimum
          <input name="stock_minimum" type="number" min="0" value={form.stock_minimum} onChange={handleChange} />
        </label>
        <label>
          Date d'expiration *
          <input name="date_expiration" type="date" value={form.date_expiration} onChange={handleChange} required />
        </label>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input name="ordonnance_requise" type="checkbox" checked={form.ordonnance_requise} onChange={handleChange} />
        Ordonnance requise
      </label>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Annuler</button>
        )}
      </div>
    </form>
  );
}

export default MedicamentForm;
