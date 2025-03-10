
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClienteCard } from "@/components/Carteira/ClienteCard";
import { SearchFilterBar } from "@/components/Carteira/SearchFilterBar";
import { ValoresCard } from "@/components/Carteira/ValoresCard";
import { DistribuicaoGrafico } from "@/components/Carteira/DistribuicaoGrafico";
import { 
  Cliente, 
  filtrarClientes, 
  getClientesComStatus, 
  calcularValoresPorBanco,
  calcularValorTotal,
  gerarDadosExemplo
} from "@/utils/clienteUtils";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do Supabase
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("carteira_clientes")
          .select("*");

        if (error) {
          console.error("Erro ao buscar clientes:", error);
          setError("Erro ao carregar dados dos clientes");
          // Carregando dados de exemplo em caso de erro
          setClientes(gerarDadosExemplo() as Cliente[]);
          return;
        }

        if (data) {
          console.log("Dados recebidos:", data);
          setClientes(data);
        } else {
          // Se não houver dados, usar dados de exemplo
          setClientes(gerarDadosExemplo() as Cliente[]);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        setError("Erro inesperado ao carregar dados");
        setClientes(gerarDadosExemplo() as Cliente[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Filtrar clientes baseado na busca e no status selecionado
  const clientesFiltrados = filtrarClientes(clientes, searchTerm, statusFilter);
  
  // Calcular valores por banco usando os clientes filtrados
  const valoresPorBanco = calcularValoresPorBanco(clientesFiltrados);
  
  // Preparar dados para o gráfico
  const dadosGrafico = Object.entries(valoresPorBanco).map(([banco, valor]) => ({
    banco,
    valor,
  }));

  // Calcular valor total dos clientes filtrados
  const valorTotal = calcularValorTotal(valoresPorBanco);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Filtrar dados de exemplo com o mesmo critério
  const exemplosFiltrados = (error || clientes.length === 0) ? 
    gerarDadosExemplo().filter(
      exemplo => statusFilter === "todos" || exemplo.situacao.toLowerCase() === statusFilter.toLowerCase()
    ) : [];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Carteira de Clientes</h1>
        <SearchFilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ValoresCard 
          valoresPorBanco={valoresPorBanco} 
          valorTotal={valorTotal}
        />
        <DistribuicaoGrafico dadosGrafico={dadosGrafico} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getClientesComStatus(clientesFiltrados).map((cliente) => (
          <ClienteCard key={cliente.id} cliente={cliente} />
        ))}
      </div>

      {/* Cards adicionais para testes */}
      {(error || clientes.length === 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exemplosFiltrados.map((exemplo, index) => (
            <ClienteCard key={`test-card-${index}`} cliente={exemplo as Cliente} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
