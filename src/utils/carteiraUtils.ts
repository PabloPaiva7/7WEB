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
            // Mantém o valor original formatado para exibição
            const formattedValue = config.format ? config.format(value) : value;
            (cliente[key as keyof Cliente] as any) = formattedValue;
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

// Função aprimorada para lidar com diferentes formatos de valores monetários brasileiros
export const formatCurrencyValue = (value: string): number => {
  if (!value) return 0;
  
  // Remove R$, espaços e outros caracteres não relevantes
  let cleanValue = value.replace(/[^\d,.]/g, '');
  
  // Trata o formato brasileiro específico (R$ 1.234,56 ou 1.234,56)
  if (cleanValue.includes('.') && cleanValue.includes(',')) {
    // Formato brasileiro típico com ponto como separador de milhar e vírgula como decimal
    // Remove todos os pontos (separadores de milhar)
    cleanValue = cleanValue.replace(/\./g, '');
    // Substitui a vírgula por ponto para converter para número
    cleanValue = cleanValue.replace(',', '.');
  } else if (cleanValue.includes(',')) {
    // Se tem apenas vírgula, assume que é separador decimal
    cleanValue = cleanValue.replace(',', '.');
  }
  
  // Converte para número
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

// Função para calcular estatísticas
export const calcularEstatisticas = (clientes: Cliente[]) => {
  return {
    totalClientes: clientes.length,
    porSituacao: clientes.reduce((acc, cliente) => {
      const situacao = cliente.situacao || 'Não definido';
      acc[situacao] = (acc[situacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    porBanco: clientes.reduce((acc, cliente) => {
      const banco = cliente.banco || 'Não definido';
      acc[banco] = (acc[banco] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    valorTotal: clientes.reduce((acc, cliente) => {
      const valor = formatCurrencyValue(cliente.valorCliente);
      return acc + valor;
    }, 0),
    mediaPrazo: clientes.reduce((acc, cliente) => {
      // Tenta extrair o número do prazo (remove 'dias' ou outros textos)
      const prazoStr = cliente.prazo || '0';
      const prazoNum = parseInt(prazoStr.replace(/\D/g, ''));
      return acc + (isNaN(prazoNum) ? 0 : prazoNum);
    }, 0) / (clientes.length || 1),
  };
};
