import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, Download, BarChart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ColumnConfigBase = {
  label: string;
  type: string;
};

type ColumnConfigWithFormat = ColumnConfigBase & {
  format?: (value: string) => string;
};

type ColumnConfigWithValidate = ColumnConfigBase & {
  validate?: (value: string) => string;
};

type ColumnConfig = ColumnConfigWithFormat & ColumnConfigWithValidate;

const columnConfig: Record<string, ColumnConfig> = {
  data: {
    label: "Data",
    format: (value: string) => new Date(value).toLocaleDateString(),
    type: "date",
  },
  resolucao: {
    label: "Resolução",
    type: "text",
  },
  contrato: {
    label: "Contrato",
    type: "text",
  },
  escritorio: {
    label: "Escritório",
    type: "text",
  },
  ultimoPagamento: {
    label: "Último Pagamento",
    format: (value: string) => new Date(value).toLocaleDateString(),
    type: "date",
  },
  prazo: {
    label: "Prazo",
    type: "text",
  },
  entrada: {
    label: "Entrada (Qualidade)",
    type: "text",
  },
  banco: {
    label: "Banco",
    type: "text",
    validate: (value: string) => value.trim().toUpperCase(),
  },
  codigo: {
    label: "Código",
    type: "text",
    validate: (value: string) => value.trim(),
  },
  valorCliente: {
    label: "Valor do Cliente",
    type: "currency",
    format: (value: string) => {
      const numberValue = Number(value.replace(/[^0-9.-]+/g, ""));
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numberValue);
    },
  },
  contato: {
    label: "Contato",
    type: "phone",
    format: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
      }
      return value;
    },
  },
  negociacao: {
    label: "Negociação",
    type: "text",
  },
  situacao: {
    label: "Situação",
    type: "text",
  },
};

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
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Carteira = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>(clientesCarteira);
  const [historico, setHistorico] = useState<{data: string, acao: string}[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
          const cliente: Partial<Cliente> = { id: index + 1 };
          
          Object.entries(columnConfig).forEach(([key, config], i) => {
            let value = values[i] || "";
            
            if (config.validate) {
              value = config.validate(value);
            }
            
            if (config.format) {
              try {
                value = config.format(value);
              } catch (error) {
                console.error(`Error formatting ${key}:`, error);
              }
            }
            
            (cliente[key as keyof Cliente] as any) = value;
          });
          
          return cliente as Cliente;
        });

        setClientes(newClientes);
        setHistorico(prev => [...prev, {
          data: new Date().toISOString(),
          acao: `Importação de ${newClientes.length} registros`
        }]);
        
        toast({
          title: "Sucesso!",
          description: "Dados importados com sucesso.",
        });
      };
      reader.readAsText(file);
    }
  };

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
    valorTotal: clientes.reduce((acc, cliente) => {
      const valor = Number(cliente.valorCliente.replace(/[^0-9.-]+/g, "")) || 0;
      return acc + valor;
    }, 0),
    mediaPrazo: clientes.reduce((acc, cliente) => {
      const dias = parseInt(cliente.prazo) || 0;
      return acc + dias;
    }, 0) / clientes.length,
  };

  const dadosGrafico = Object.entries(estatisticas.porSituacao).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  const dadosPizza = Object.entries(estatisticas.porBanco).map(([nome, valor]) => ({
    name: nome,
    value: valor,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-center gap-4`}>
        <h1 className="text-2xl font-semibold text-foreground">Minha Carteira</h1>
        <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} gap-4 items-center`}>
          <div className={`relative ${isMobile ? 'w-full' : 'w-64'}`}>
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

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Análise da Carteira</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{estatisticas.totalClientes}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estatisticas.valorTotal)}
                </p>
              </div>
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
          <h3 className="text-lg font-semibold mb-4">Distribuição por Banco</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.entries(columnConfig).map(([key, config]) => (
                  <TableHead key={key}>{config.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  {Object.entries(columnConfig).map(([key, config]) => (
                    <TableCell key={`${cliente.id}-${key}`}>
                      {cliente[key as keyof Cliente]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Ações</h3>
          <div className="space-y-2">
            {historico.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{new Date(item.data).toLocaleString()}</span>
                <span>{item.acao}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Carteira;
