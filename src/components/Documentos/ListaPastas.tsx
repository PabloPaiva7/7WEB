
import React from "react";
import { PastaCard } from "./PastaCard";
import { EmptyState } from "./EmptyState";
import { Pasta } from "@/utils/documentUtils";

interface ListaPastasProps {
  pastas: Pasta[];
  onSelectPasta: (pasta: Pasta) => void;
  permissionError: boolean;
}

export const ListaPastas: React.FC<ListaPastasProps> = ({
  pastas,
  onSelectPasta,
  permissionError,
}) => {
  if (pastas.length === 0) {
    return <EmptyState type="pastas" permissionError={permissionError} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {pastas.map((pasta) => (
        <PastaCard
          key={pasta.id}
          pasta={pasta}
          onClick={() => onSelectPasta(pasta)}
        />
      ))}
    </div>
  );
};
