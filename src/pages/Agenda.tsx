
import { useState, useEffect } from "react";
import { Calendar, User, Phone, GanttChart, Landmark, Link as LinkIcon, Scale, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Componentes
import LoadingIndicator from "@/components/Agenda/LoadingIndicator";
import ErrorDisplay from "@/components/Agenda/ErrorDisplay";
import ClientesTab from "@/components/Agenda/ClientesTab";
import RamaisTab from "@/components/Agenda/RamaisTab";
import AssessoriasTab from "@/components/Agenda/AssessoriasTab";
import BancosTab from "@/components/Agenda/BancosTab";
import LinksUteisTab from "@/components/Agenda/LinksUteisTab";
import PaginasJuridicasTab from "@/components/Agenda/PaginasJuridicasTab";
import SenhasTab from "@/components/Agenda/SenhasTab";

// Tipos de dados
import { 
  clientesExemplo, 
  ramaisExemplo 
} from "@/data/agendaData";

const Agenda = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [secaoAtual, setSecaoAtual] = useState("clientes");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generalSearchTerm, setGeneralSearchTerm] = useState("");
  
  // Efeito para simular carregamento e detectar erros
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simula o tempo de carregamento e verifica se há erro
    const timer = setTimeout(() => {
      try {
        // Verificação simbólica para garantir que os dados foram carregados
        if (!clientesExemplo || !ramaisExemplo) {
          throw new Error("Erro ao carregar dados da agenda");
        }
        setIsLoading(false);
      } catch (err) {
        setError("Houve um erro ao carregar os dados. Por favor, tente novamente.");
        setIsLoading(false);
        toast({
          title: "Erro ao carregar",
          description: "Houve um problema ao carregar a página. Tente novamente.",
          variant: "destructive",
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  // Se estiver carregando, mostre um indicador de carregamento
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Se houver um erro, mostre uma mensagem de erro
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  // Define o termo de busca correto de acordo com a seção atual
  const handleTabChange = (value: string) => {
    setSecaoAtual(value);
    
    // Reseta o termo de busca ao trocar de tab
    if (value === 'clientes') {
      setGeneralSearchTerm(searchTerm);
      setSearchTerm("");
    } else {
      setSearchTerm(generalSearchTerm);
      setGeneralSearchTerm("");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Agenda</h1>
        </div>
      </div>

      <Tabs value={secaoAtual} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-7 mb-4">
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="ramais" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Ramais</span>
          </TabsTrigger>
          <TabsTrigger value="assessorias" className="flex items-center gap-2">
            <GanttChart className="h-4 w-4" />
            <span className="hidden sm:inline">Assessorias</span>
          </TabsTrigger>
          <TabsTrigger value="bancos" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            <span className="hidden sm:inline">Bancos</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Links Úteis</span>
          </TabsTrigger>
          <TabsTrigger value="juridico" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Jurídico</span>
          </TabsTrigger>
          <TabsTrigger value="senhas" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Senhas</span>
          </TabsTrigger>
        </TabsList>

        {/* Seção de Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <ClientesTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>

        {/* Seção de Ramais */}
        <TabsContent value="ramais" className="space-y-4">
          <RamaisTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>

        {/* Seção de Assessorias */}
        <TabsContent value="assessorias" className="space-y-4">
          <AssessoriasTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>

        {/* Seção de Bancos */}
        <TabsContent value="bancos" className="space-y-4">
          <BancosTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>

        {/* Seção de Links Úteis */}
        <TabsContent value="links" className="space-y-4">
          <LinksUteisTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>

        {/* Seção de Páginas Jurídicas */}
        <TabsContent value="juridico" className="space-y-4">
          <PaginasJuridicasTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>

        {/* Seção de Senhas */}
        <TabsContent value="senhas" className="space-y-4">
          <SenhasTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Agenda;
