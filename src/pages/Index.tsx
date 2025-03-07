
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

  // Buscar dados do Supabase
  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from("carteira_clientes")
        .select("*");

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        return;
      }

      if (data) {
        console.log("Dados recebidos:", data);
        setClientes(data);
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

  // Gerar dados de exemplo para teste
  const dadosExemplo = gerarDadosExemplo();

  // Filtrar dados de exemplo com o mesmo critério
  const exemplosFiltrados = dadosExemplo.filter(
    exemplo => statusFilter === "todos" || exemplo.situacao.toLowerCase() === statusFilter.toLowerCase()
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exemplosFiltrados.map((exemplo, index) => (
          <ClienteCard key={`test-card-${index}`} cliente={exemplo as Cliente} />
        ))}
      </div>
    </div>
  );
};

export default Index;
