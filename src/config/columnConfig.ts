import { ColumnConfig } from "@/types/carteira.types";
import { formatCurrencyValue } from "@/utils/carteiraUtils";

// Configuração das colunas para a tabela de clientes
export const columnConfig: ColumnConfig = {
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
      // Se o valor já contém R$, retorna como está para evitar formatação duplicada
      if (value && typeof value === 'string' && value.includes('R$')) {
        return value;
      }
      
      // Usa a função para processar os valores monetários
      const numberValue = formatCurrencyValue(value);
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
