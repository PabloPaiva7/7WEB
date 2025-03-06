
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Cliente } from "@/components/Carteira/ClientesTable";
import { HistoricoItem } from "@/types/carteira.types";
import { processCSV, formatCurrencyValue } from "@/utils/carteiraUtils";
import { columnConfig } from "@/config/columnConfig";

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

export const useClientesCrud = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesCarteira);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: Cliente) => {
    // Garantir que o valor do cliente esteja formatado corretamente
    if (data.valorCliente && !data.valorCliente.includes('R$')) {
      data.valorCliente = columnConfig.valorCliente.format(data.valorCliente);
    }
    
    if (editingCliente) {
      const updatedClientes = clientes.map(c => 
        c.id === editingCliente.id ? { ...data, id: editingCliente.id } : c
      );
      setClientes(updatedClientes);
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
            // Calculamos o próximo ID disponível
            const nextId = Math.max(...clientes.map(c => c.id), 0) + 1;
            
            // Garantimos que cada cliente importado tenha um ID único e valores formatados corretamente
            const clientesComId = data.map((cliente, index) => {
              // Certifique-se de que o valor do cliente está formatado corretamente
              let valorClienteFormatado = cliente.valorCliente;
              
              // Se o valor não estiver vazio e não contiver R$, formate-o
              if (valorClienteFormatado && !valorClienteFormatado.includes('R$')) {
                valorClienteFormatado = columnConfig.valorCliente.format(valorClienteFormatado);
              }
              
              return {
                ...cliente,
                id: nextId + index,
                valorCliente: valorClienteFormatado
              };
            });
            
            setClientes(prev => [...prev, ...clientesComId]);
            
            // Somamos o valor total importado para o registro, usando a função aprimorada
            const valorTotalImportado = clientesComId.reduce((acc, cliente) => {
              return acc + formatCurrencyValue(cliente.valorCliente);
            }, 0);
            
            setHistorico(prev => [...prev, {
              data: new Date().toISOString(),
              acao: `Importação de ${data.length} registros via CSV com valor total de ${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(valorTotalImportado)}`
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

  return {
    clientes,
    historico,
    editingCliente,
    isDialogOpen,
    setClientes,
    setHistorico,
    setIsDialogOpen,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleFileUpload
  };
};
