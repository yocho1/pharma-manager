import { useState } from "react";
import { useCategories, useCreateCategorie } from "../../hooks/useCategories";

/**
 * Dropdown select for categories + inline creation form.
 *
 * Props:
 *  - value: currently selected category id
 *  - onChange: callback(categoryId)
 */
function CategorieSelect({ value, onChange }) {
  const { data, isLoading, isError } = useCategories();
  const createMutation = useCreateCategorie();

  const [showForm, setShowForm] = useState(false);
  const [newNom, setNewNom] = useState("");

  const categories = data?.results ?? data ?? [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNom.trim()) return;

    try {
      const created = await createMutation.mutateAsync({ nom: newNom.trim() });
      onChange(created.id);
      setNewNom("");
      setShowForm(false);
    } catch {
      // error is handled via mutation state
    }
  };

  if (isLoading) return <span className="loading">Chargement des catégories…</span>;
  if (isError) return <span className="error">Erreur de chargement des catégories</span>;

  return (
    <div className="categorie-select">
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          title="Ajouter une catégorie"
        >
          +
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={newNom}
            onChange={(e) => setNewNom(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? "…" : "Créer"}
          </button>
        </form>
      )}

      {createMutation.isError && (
        <p className="error" style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>
          Erreur lors de la création de la catégorie.
        </p>
      )}
    </div>
  );
}

export default CategorieSelect;
