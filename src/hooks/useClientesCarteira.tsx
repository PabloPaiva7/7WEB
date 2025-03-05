
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Cliente } from "@/components/Carteira/ClientesTable";
import { processCSV, calcularEstatisticas } from "@/utils/carteiraUtils";

// Dados iniciais para teste
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

export const useClientesCarteira = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesCarteira);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>(clientesCarteira);
  const [historico, setHistorico] = useState<{data: string, acao: string}[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    banco: "",
    escritorio: "",
    prazo: ""
  });
  const { toast } = useToast();

  const handleSubmit = (data: Cliente) => {
    if (editingCliente) {
      const updatedClientes = clientes.map(c => 
        c.id === editingCliente.id ? { ...data, id: editingCliente.id } : c
      );
      setClientes(updatedClientes);
      setFilteredClientes(updatedClientes);
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso.",
      });
    } else {
      const newCliente = {
        ...data,
        id: clientes.length + 1,
      };
      const newClientes = [...clientes, newCliente];
      setClientes(newClientes);
      setFilteredClientes(newClientes);
      toast({
        title: "Sucesso!",
        description: "Cliente adicionado com sucesso.",
      });
    }
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: editingCliente ? `Cliente ${editingCliente.id} editado` : "Novo cliente adicionado"
    }]);
    setIsDialogOpen(false);
    setEditingCliente(null);
  };

  const handleDelete = (cliente: Cliente) => {
    const newClientes = clientes.filter(c => c.id !== cliente.id);
    setClientes(newClientes);
    setFilteredClientes(newClientes);
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: `Cliente ${cliente.id} removido`
    }]);
    toast({
      title: "Sucesso!",
      description: "Cliente removido com sucesso.",
    });
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsDialogOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const { data, errors } = processCSV(text, columnConfig);
          
          if (errors.length > 0) {
            toast({
              title: "Aviso",
              description: `${errors.length} erros encontrados no arquivo. Verifique os dados.`,
              variant: "destructive",
            });
          }
          
          if (data.length > 0) {
            setClientes(prev => [...prev, ...data]);
            setFilteredClientes(prev => [...prev, ...data]);
            
            setHistorico(prev => [...prev, {
              data: new Date().toISOString(),
              acao: `Importação de ${data.length} registros via CSV`
            }]);
            
            toast({
              title: "Sucesso!",
              description: `${data.length} registros importados com sucesso.`,
            });
          } else {
            toast({
              title: "Aviso",
              description: "Nenhum registro válido encontrado no arquivo CSV.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao processar arquivo:", error);
          toast({
            title: "Erro",
            description: "Erro ao processar o arquivo. Verifique se o formato do CSV está correto.",
            variant: "destructive",
          });
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Erro",
          description: "Erro ao ler o arquivo.",
          variant: "destructive",
        });
      };
      
      reader.readAsText(file);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    let filtered = clientes;
    
    if (newFilters.banco && newFilters.banco !== 'todos') {
      filtered = filtered.filter(c => c.banco === newFilters.banco);
    }
    if (newFilters.escritorio && newFilters.escritorio !== 'todos') {
      filtered = filtered.filter(c => c.escritorio === newFilters.escritorio);
    }
    if (newFilters.prazo && newFilters.prazo !== 'todos') {
      filtered = filtered.filter(c => c.prazo === newFilters.prazo);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        Object.values(c).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredClientes(filtered);
    
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: `Filtro aplicado: ${type} = ${value}`
    }]);
  };

  // Calcular estatísticas
  const estatisticas = calcularEstatisticas(filteredClientes);

  return {
    clientes,
    filteredClientes,
    historico,
    editingCliente,
    isDialogOpen,
    searchTerm,
    estatisticas,
    setIsDialogOpen,
    setSearchTerm,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleFileUpload,
    handleFilterChange
  };
};

// Configuração das colunas (movido do arquivo principal para ser reutilizado)
export const columnConfig = {
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
