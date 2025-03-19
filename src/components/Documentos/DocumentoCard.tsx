
import React from "react";
import { Button } from "@/components/ui/button";
import { File, X } from "lucide-react";
import { Documento } from "@/utils/documentUtils";

interface DocumentoCardProps {
  documento: Documento;
  onRemove: () => void;
  permissionError: boolean;
}

export const DocumentoCard: React.FC<DocumentoCardProps> = ({ 
  documento, 
  onRemove,
  permissionError
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors card-hover">
      <div className="flex items-center gap-3">
        <File className="h-5 w-5 text-muted-foreground" />
        <div>
          <a 
            href={documento.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {documento.nome}
          </a>
          <p className="text-sm text-muted-foreground">
            {new Date(documento.data).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
      {!permissionError && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
