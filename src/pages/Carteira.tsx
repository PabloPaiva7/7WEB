
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, Download, BarChart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Cliente = {
  id: number;
  data: string;
  resolucao: string;
  contrato: string;
  escritorio: string;
  ultimoPagamento: string;
  prazo: string;
  entrada: string;
  banco: string;
  codigo: string;
  valorCliente: string;
  contato: string;
  negociacao: string;
  situacao: string;
};

// Dados de exemplo
const clientesCarteira: Cliente[] = [
  {
    id: 1,
    data: "2024-03-15",
    resolucao: "Pendente",
    contrato: "CT001",
    escritorio: "Escritório A",
    ultimoPagamento: "2024-02-15",
    prazo: "30 dias",
    entrada: "Alta",
    banco: "Banco X",
    codigo: "COD001",
    valorCliente: "R$ 50.000,00",
    contato: "(11) 99999-9999",
    negociacao: "Em andamento",
    situacao: "Ativo",
  },
  // Adicione mais clientes conforme necessário
];

const Carteira = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>(clientesCarteira);
  const { toast } = useToast();

  // Função para importar CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        
        const newClientes = lines.slice(1).map((line, index) => {
          const values = line.split(",");
          return {
            id: index + 1,
            data: values[0] || "",
            resolucao: values[1] || "",
            contrato: values[2] || "",
            escritorio: values[3] || "",
            ultimoPagamento: values[4] || "",
            prazo: values[5] || "",
            entrada: values[6] || "",
            banco: values[7] || "",
            codigo: values[8] || "",
            valorCliente: values[9] || "",
            contato: values[10] || "",
            negociacao: values[11] || "",
            situacao: values[12] || "",
          };
        });

        setClientes(newClientes);
        toast({
          title: "Sucesso!",
          description: "Dados importados com sucesso.",
        });
      };
      reader.readAsText(file);
    }
  };

  // Análise estatística básica
  const estatisticas = {
    totalClientes: clientes.length,
    porSituacao: clientes.reduce((acc, cliente) => {
      acc[cliente.situacao] = (acc[cliente.situacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    porBanco: clientes.reduce((acc, cliente) => {
      acc[cliente.banco] = (acc[cliente.banco] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const dadosGrafico = Object.entries(estatisticas.porSituacao).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Minha Carteira</h1>
        <div className="flex gap-4 items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            <label className="cursor-pointer">
              Importar CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Análise da Carteira</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold">{estatisticas.totalClientes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Distribuição por Situação</p>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estatísticas por Banco</h3>
          <div className="space-y-4">
            {Object.entries(estatisticas.porBanco).map(([banco, quantidade]) => (
              <div key={banco} className="flex justify-between items-center">
                <span>{banco}</span>
                <span className="font-semibold">{quantidade} clientes</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Resolução</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Escritório</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Negociação</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.data}</TableCell>
                  <TableCell>{cliente.resolucao}</TableCell>
                  <TableCell>{cliente.contrato}</TableCell>
                  <TableCell>{cliente.escritorio}</TableCell>
                  <TableCell>{cliente.ultimoPagamento}</TableCell>
                  <TableCell>{cliente.prazo}</TableCell>
                  <TableCell>{cliente.entrada}</TableCell>
                  <TableCell>{cliente.banco}</TableCell>
                  <TableCell>{cliente.codigo}</TableCell>
                  <TableCell>{cliente.valorCliente}</TableCell>
                  <TableCell>{cliente.contato}</TableCell>
                  <TableCell>{cliente.negociacao}</TableCell>
                  <TableCell>{cliente.situacao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Carteira;
