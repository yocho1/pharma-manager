import { useState } from "react";
import { useVentes, useCreateVente, useAnnulerVente } from "../hooks/useVentes";
import VenteForm from "../components/ventes/VenteForm";
import VenteTable from "../components/ventes/VenteTable";

function VentesPage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useVentes();
  const ventes = data?.results ?? data ?? [];

  const createMutation = useCreateVente();
  const annulerMutation = useAnnulerVente();

  const handleCreate = (payload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowForm(false);
        createMutation.reset();
      },
    });
  };

  const handleAnnuler = (venteId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette vente ?")) {
      annulerMutation.mutate(venteId);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Ventes</h2>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Nouvelle vente
          </button>
        )}
      </div>

      {showForm && (
        <VenteForm
          onSubmit={handleCreate}
          onCancel={() => { setShowForm(false); createMutation.reset(); }}
          isPending={createMutation.isPending}
          error={createMutation.error}
        />
      )}

      <h3 style={{ marginTop: "2rem" }}>Historique des ventes</h3>
      <VenteTable
        ventes={ventes}
        isLoading={isLoading}
        onAnnuler={handleAnnuler}
        annulerPending={annulerMutation.isPending}
      />
    </div>
  );
}

export default VentesPage;
