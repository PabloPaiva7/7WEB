
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { DocumentoCard } from "./DocumentoCard";
import { EmptyState } from "./EmptyState";
import { Pasta, getNomePastaDisplay } from "@/utils/documentUtils";

interface DetalhesPastaProps {
  pasta: Pasta;
  onVoltar: () => void;
  onUpload: (files: FileList) => void;
  onRemoveDocumento: (documentoId: number) => void;
  permissionError: boolean;
}

export const DetalhesPasta: React.FC<DetalhesPastaProps> = ({
  pasta,
  onVoltar,
  onUpload,
  onRemoveDocumento,
  permissionError,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onVoltar}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">
          {getNomePastaDisplay(pasta.nome)}
        </h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Documentos</h2>
            {!permissionError && (
              <div className="relative">
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.csv,.png,.jpg,.jpeg"
                  onChange={(e) => e.target.files && onUpload(e.target.files)}
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <div>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload
                    </div>
                  </Button>
                </label>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {pasta.documentos.length > 0 ? (
              pasta.documentos.map((doc) => (
                <DocumentoCard
                  key={doc.id}
                  documento={doc}
                  onRemove={() => onRemoveDocumento(doc.id)}
                  permissionError={permissionError}
                />
              ))
            ) : (
              <EmptyState type="documentos" permissionError={permissionError} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
