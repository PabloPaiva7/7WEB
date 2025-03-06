
import { Cliente } from "@/components/Carteira/ClientesTable";

export type ValidationError = {
  row: number;
  column: string;
  message: string;
};

export const validateClientes = (clientes: Cliente[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  clientes.forEach((cliente, index) => {
    if (!cliente.contrato) {
      errors.push({
        row: index,
        column: 'contrato',
        message: 'Contrato é obrigatório'
      });
    }
    
    if (!cliente.banco) {
      errors.push({
        row: index,
        column: 'banco',
        message: 'Banco é obrigatório'
      });
    }
    
    // Adicione mais validações conforme necessário
  });
  
  return errors;
};

export const processCSV = (text: string, columnConfig: Record<string, any>): { data: Cliente[], errors: ValidationError[] } => {
  const lines = text.split("\n").filter(line => line.trim());
  const headers = lines[0].split(",").map(header => header.trim());
  
  const data: Cliente[] = [];
  const errors: ValidationError[] = [];
  
  lines.slice(1).forEach((line, index) => {
    const values = line.split(",").map(value => value.trim());
    const cliente: Partial<Cliente> = { id: index + 1 };
    
    headers.forEach((header, i) => {
      const key = Object.keys(columnConfig).find(
        k => columnConfig[k].label.toLowerCase() === header.toLowerCase()
      );
      
      if (key) {
        const config = columnConfig[key];
        let value = values[i] || "";
        
        try {
          if (config.validate) {
            value = config.validate(value);
          }
          
          // Tratamento especial para o campo valorCliente
          if (key === 'valorCliente') {
            // Remove qualquer formatação existente e converte para um número
            const numericValue = formatCurrencyValue(value);
            // Formata o valor para exibição
            value = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(numericValue);
          } else if (config.format) {
            value = config.format(value);
          }
          
          (cliente[key as keyof Cliente] as any) = value;
        } catch (error) {
          errors.push({
            row: index + 1,
            column: header,
            message: `Erro ao processar ${config.label}`
          });
        }
      }
    });
    
    data.push(cliente as Cliente);
  });
  
  return { data, errors };
};

// Função para lidar com diferentes formatos de valores monetários
export const formatCurrencyValue = (value: string): number => {
  if (!value) return 0;
  
  // Remove todos os caracteres não numéricos, exceto ponto e vírgula
  let cleanValue = value.replace(/[^\d,.-]/g, '');
  
  // Verifica se o valor está no formato brasileiro (ex: 1.000,00)
  if (cleanValue.indexOf(',') > -1 && cleanValue.indexOf('.') > -1 && 
      cleanValue.lastIndexOf('.') < cleanValue.lastIndexOf(',')) {
    // Remove os pontos de milhar
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  } else if (cleanValue.indexOf(',') > -1) {
    // Troca a vírgula por ponto para decimal
    cleanValue = cleanValue.replace(',', '.');
  }
  
  // Converte para número com precisão de 2 casas decimais
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

// Função para calcular estatísticas
export const calcularEstatisticas = (clientes: Cliente[]) => {
  return {
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
      const valor = formatCurrencyValue(cliente.valorCliente);
      return acc + valor;
    }, 0),
    mediaPrazo: clientes.reduce((acc, cliente) => {
      const dias = parseInt(cliente.prazo as string) || 0;
      return acc + dias;
    }, 0) / (clientes.length || 1),
  };
};
