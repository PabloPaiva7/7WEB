
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { ClienteDetailProvider } from "@/contexts/ClienteDetailContext";
import { ClienteDetalheContent } from "@/components/Carteira/ClienteDetalheContent";

const DetalhesCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate("/")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Detalhes do Cliente</h1>
      </div>

      <ClienteDetailProvider clienteId={id}>
        <ClienteDetalheContent />
      </ClienteDetailProvider>
    </div>
  );
};

export default DetalhesCliente;
