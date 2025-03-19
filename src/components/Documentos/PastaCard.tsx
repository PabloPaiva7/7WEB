
import React from "react";
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";
import { Pasta, getNomePastaDisplay } from "@/utils/documentUtils";

interface PastaCardProps {
  pasta: Pasta;
  onClick: () => void;
}

export const PastaCard: React.FC<PastaCardProps> = ({ pasta, onClick }) => {
  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-all card-hover"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <h3 className="font-medium">
              {getNomePastaDisplay(pasta.nome)}
            </h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {pasta.documentos.length} {pasta.documentos.length === 1 ? 'documento' : 'documentos'}
          </span>
        </div>
      </div>
    </Card>
  );
};
