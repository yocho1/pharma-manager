import { useState } from "react";
import MedicamentTable from "../components/medicaments/MedicamentTable";
import MedicamentForm from "../components/medicaments/MedicamentForm";
import {
  useMedicaments,
  useCreateMedicament,
  useUpdateMedicament,
  useDeleteMedicament,
} from "../hooks/useMedicaments";

function MedicamentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading, isError } = useMedicaments();
  const createMutation = useCreateMedicament();
  const updateMutation = useUpdateMedicament();
  const deleteMutation = useDeleteMedicament();

  const medicaments = data?.results ?? data ?? [];

  const handleCreate = async (formData) => {
    await createMutation.mutateAsync(formData);
    setShowForm(false);
  };

  const handleUpdate = async (formData) => {
    await updateMutation.mutateAsync({ id: editing.id, ...formData });
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce médicament ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (medicament) => {
    setEditing(medicament);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (isLoading) return <div className="loading">Chargement des médicaments…</div>;
  if (isError) return <div className="error">Erreur lors du chargement des médicaments.</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Médicaments ({medicaments.length})</h2>
        {!showForm && !editing && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Nouveau médicament
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: "1.5rem" }}>
          <MedicamentForm
            onSubmit={handleCreate}
            onCancel={handleCancel}
            isPending={createMutation.isPending}
            error={createMutation.error}
          />
        </div>
      )}

      {editing && (
        <div style={{ marginBottom: "1.5rem" }}>
          <MedicamentForm
            initialData={{
              nom: editing.nom,
              dci: editing.dci,
              categorie: editing.categorie,
              forme: editing.forme,
              dosage: editing.dosage,
              prix_achat: editing.prix_achat,
              prix_vente: editing.prix_vente,
              stock_actuel: editing.stock_actuel,
              stock_minimum: editing.stock_minimum,
              date_expiration: editing.date_expiration,
              ordonnance_requise: editing.ordonnance_requise,
            }}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isPending={updateMutation.isPending}
            error={updateMutation.error}
          />
        </div>
      )}

      <div className="card">
        <MedicamentTable
          medicaments={medicaments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default MedicamentsPage;
