
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Cliente {
  id: string;
  contrato: string;
  banco: string | null;
  valor_cliente: number | null;
  escritorio: string | null;
  data: string | null;
  situacao: string | null;
  codigo: string | null;
  contato: string | null;
  created_at: string;
  entrada: string | null;
  negociacao: string | null;
  prazo: string | null;
  resolucao: string | null;
  ultimo_pagamento: string | null;
  upload_id: string | null;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const navigate = useNavigate();

  const handleClienteClick = (id: string) => {
    console.log("Navegando para o cliente:", id);
    navigate(`/cliente/${id}`);
  };

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

  // Calcular valores por banco
  const valoresPorBanco = clientes.reduce((acc, cliente) => {
    if (cliente.banco && cliente.valor_cliente) {
      acc[cliente.banco] = (acc[cliente.banco] || 0) + cliente.valor_cliente;
    }
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
  const clientesFiltrados = clientes.filter(cliente =>
    (cliente.contrato && cliente.contrato.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.banco && cliente.banco.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.escritorio && cliente.escritorio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-fadeIn">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
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

        <Card className="p-4">
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
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleClienteClick(cliente.id)}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Contrato</p>
                <h3 className="text-lg font-medium">{cliente.contrato}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{cliente.banco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Escritório</p>
                  <p className="font-medium">{cliente.escritorio}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {cliente.data ? new Date(cliente.data).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {cliente.valor_cliente 
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(cliente.valor_cliente)
                      : 'R$ 0,00'
                    }
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cliente.situacao === "Em andamento" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {cliente.situacao || 'Pendente'}
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
