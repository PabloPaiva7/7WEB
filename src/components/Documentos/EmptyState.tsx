
import React from "react";
import { FolderPlus, UploadCloud } from "lucide-react";

interface EmptyStateProps {
  type: "pastas" | "documentos";
  permissionError: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, permissionError }) => {
  if (type === "pastas") {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FolderPlus className="mx-auto h-12 w-12 mb-4" />
        <p>Nenhuma pasta encontrada</p>
        <p className="text-sm">
          {!permissionError ? 
            "Crie uma pasta para começar a adicionar documentos" : 
            "Entre em contato com o administrador para adicionar pastas e documentos"
          }
        </p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-12 text-muted-foreground">
      <UploadCloud className="mx-auto h-12 w-12 mb-4" />
      <p>Nenhum documento encontrado</p>
      <p className="text-sm">
        {!permissionError ? "Faça upload de arquivos para começar" : "Entre em contato com o administrador para adicionar documentos"}
      </p>
    </div>
  );
};
