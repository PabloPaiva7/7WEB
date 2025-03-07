
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [statusFilter, setStatusFilter] = useState("todos");
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

  // Filtrar clientes baseado na busca e no status selecionado
  const clientesFiltrados = clientes.filter(cliente =>
    (cliente.contrato && cliente.contrato.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.banco && cliente.banco.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cliente.escritorio && cliente.escritorio.toLowerCase().includes(searchTerm.toLowerCase()))
  ).filter(cliente => 
    statusFilter === "todos" || 
    (cliente.situacao && cliente.situacao.toLowerCase() === statusFilter.toLowerCase())
  );

  // Gerar status padronizados para clientes sem status
  const getClientesComStatus = (clientesArr: Cliente[]) => {
    return clientesArr.map(cliente => ({
      ...cliente,
      situacao: cliente.situacao || gerarStatusAleatorio()
    }));
  };

  // Gerar alguns status de exemplo para teste
  const gerarStatusAleatorio = () => {
    const status = [
      "Pendente", 
      "Prioridade Total", 
      "Prioridade", 
      "Verificado", 
      "Análise", 
      "Aprovado", 
      "Quitado", 
      "Apreendido", 
      "Cancelado", 
      "Outros Acordos"
    ];
    return status[Math.floor(Math.random() * status.length)];
  };

  // Calcular valores por banco usando os clientes filtrados
  const valoresPorBanco = clientesFiltrados.reduce((acc, cliente) => {
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

  // Calcular valor total dos clientes filtrados
  const valorTotal = Object.values(valoresPorBanco).reduce((a, b) => a + b, 0);

  // Gerar dados de exemplo para teste
  const dadosExemplo = [...Array(6)].map((_, index) => {
    const status = [
      "Pendente", 
      "Prioridade Total", 
      "Prioridade", 
      "Verificado", 
      "Análise", 
      "Aprovado", 
      "Quitado", 
      "Apreendido", 
      "Cancelado", 
      "Outros Acordos"
    ][index % 10];
    
    const bancos = ["Banco do Brasil", "Itaú", "Caixa", "Santander", "Bradesco", "Nubank"];
    const escritorios = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Brasília"];
    const valores = [15000, 25000, 75000, 35000, 45000, 55000];
    
    return {
      id: `test-${index + 1000}`,
      contrato: `TESTE-${index + 1000}`,
      banco: bancos[index % bancos.length],
      escritorio: escritorios[index % escritorios.length],
      data: new Date(2023, 5, index + 1).toISOString(),
      valor_cliente: valores[index % valores.length],
      situacao: status
    };
  });

  // Filtrar dados de exemplo com o mesmo critério
  const exemplosFiltrados = dadosExemplo.filter(
    exemplo => statusFilter === "todos" || exemplo.situacao.toLowerCase() === statusFilter.toLowerCase()
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Carteira de Clientes</h1>
        <div className="flex gap-2 items-center">
          <div className="w-48">
            <Select defaultValue="todos" onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="h-9">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="prioridade total">Prioridade Total</SelectItem>
                <SelectItem value="prioridade">Prioridade</SelectItem>
                <SelectItem value="verificado">Verificado</SelectItem>
                <SelectItem value="análise">Análise</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="quitado">Quitado</SelectItem>
                <SelectItem value="apreendido">Apreendido</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="outros acordos">Outros Acordos</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        {getClientesComStatus(clientesFiltrados).map((cliente) => (
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
                  cliente.situacao === "Pendente" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : cliente.situacao === "Prioridade Total"
                    ? "bg-red-100 text-red-800"
                    : cliente.situacao === "Prioridade"
                    ? "bg-orange-100 text-orange-800"
                    : cliente.situacao === "Verificado"
                    ? "bg-green-100 text-green-800"
                    : cliente.situacao === "Análise"
                    ? "bg-blue-100 text-blue-800"
                    : cliente.situacao === "Aprovado"
                    ? "bg-emerald-100 text-emerald-800"
                    : cliente.situacao === "Quitado"
                    ? "bg-teal-100 text-teal-800"
                    : cliente.situacao === "Apreendido"
                    ? "bg-purple-100 text-purple-800"
                    : cliente.situacao === "Cancelado"
                    ? "bg-slate-100 text-slate-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {cliente.situacao || 'Pendente'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cards adicionais para testes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exemplosFiltrados.map((exemplo, index) => (
          <Card 
            key={`test-card-${index}`} 
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Contrato</p>
                <h3 className="text-lg font-medium">{exemplo.contrato}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{exemplo.banco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Escritório</p>
                  <p className="font-medium">{exemplo.escritorio}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {new Date(exemplo.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(exemplo.valor_cliente)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  exemplo.situacao === "Pendente" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : exemplo.situacao === "Prioridade Total"
                    ? "bg-red-100 text-red-800"
                    : exemplo.situacao === "Prioridade"
                    ? "bg-orange-100 text-orange-800"
                    : exemplo.situacao === "Verificado"
                    ? "bg-green-100 text-green-800"
                    : exemplo.situacao === "Análise"
                    ? "bg-blue-100 text-blue-800"
                    : exemplo.situacao === "Aprovado"
                    ? "bg-emerald-100 text-emerald-800"
                    : exemplo.situacao === "Quitado"
                    ? "bg-teal-100 text-teal-800"
                    : exemplo.situacao === "Apreendido"
                    ? "bg-purple-100 text-purple-800"
                    : exemplo.situacao === "Cancelado"
                    ? "bg-slate-100 text-slate-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {exemplo.situacao}
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
