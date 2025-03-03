
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const PermissionAlert: React.FC = () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Aviso de permissão</AlertTitle>
      </div>
      <AlertDescription>
        Você não tem permissões suficientes para gerenciar pastas no armazenamento. 
        Você ainda pode visualizar pastas e documentos existentes, mas não pode criar novas pastas.
        Entre em contato com o administrador para solicitar acesso completo.
      </AlertDescription>
    </Alert>
  );
};
