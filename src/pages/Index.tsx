
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Dados de exemplo atualizados com valores
const clientesExemplo = [
  {
    id: 1,
    nome: "João Silva",
    banco: "Banco BV",
    mesesAtraso: 3,
    codigoAssessoria: "ASS001",
    regiao: "Sul",
    status: "Em andamento",
    valorDivida: 200000,
  },
  {
    id: 2,
    nome: "Maria Santos",
    banco: "Banco Santander",
    mesesAtraso: 2,
    codigoAssessoria: "ASS002",
    regiao: "Sudeste",
    status: "Pendente",
    valorDivida: 100000,
  },
  {
    id: 3,
    nome: "Pedro Costa",
    banco: "Banco BV",
    mesesAtraso: 4,
    codigoAssessoria: "ASS003",
    regiao: "Norte",
    status: "Em andamento",
    valorDivida: 150000,
  },
  {
    id: 4,
    nome: "Ana Lima",
    banco: "Banco Itaú",
    mesesAtraso: 1,
    codigoAssessoria: "ASS004",
    regiao: "Nordeste",
    status: "Pendente",
    valorDivida: 50000,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleClienteClick = (id: number) => {
    navigate(`/cliente/${id}`);
  };

  // Calcular valores por banco
  const valoresPorBanco = clientesExemplo.reduce((acc, cliente) => {
    acc[cliente.banco] = (acc[cliente.banco] || 0) + cliente.valorDivida;
    return acc;
  }, {} as Record<string, number>);

  // Preparar dados para o gráfico
  const dadosGrafico = Object.entries(valoresPorBanco).map(([banco, valor]) => ({
    banco,
    valor,
  }));

  // Calcular valor total
  const valorTotal = Object.values(valoresPorBanco).reduce((a, b) => a + b, 0);

  // Filtrar clientes baseado na busca
  const clientesFiltrados = clientesExemplo.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.codigoAssessoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Carteira de Clientes</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Análise de Valores por Banco</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total da Carteira</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(valorTotal)}
              </p>
            </div>
            <div className="space-y-2">
              {Object.entries(valoresPorBanco).map(([banco, valor]) => (
                <div key={banco} className="flex justify-between items-center">
                  <span className="font-medium">{banco}</span>
                  <span className="text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Distribuição por Banco</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  dataKey="valor"
                  nameKey="banco"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ banco, percent }) => 
                    `${banco} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => 
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(value)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((cliente) => (
          <Card 
            key={cliente.id} 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleClienteClick(cliente.id)}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <h3 className="text-lg font-medium">{cliente.nome}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{cliente.banco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meses em Atraso</p>
                  <p className="font-medium">{cliente.mesesAtraso}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Região</p>
                  <p className="font-medium">{cliente.regiao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(cliente.valorDivida)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cliente.status === "Em andamento" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {cliente.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
