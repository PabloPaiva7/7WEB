
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
            // Mantém o valor original para exibição
            const originalValue = value;
            // Armazena o valor numérico para cálculos internos
            (cliente[key as keyof Cliente] as any) = originalValue;
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

// Função melhorada para lidar com diferentes formatos de valores monetários
export const formatCurrencyValue = (value: string): number => {
  if (!value) return 0;
  
  // Remove R$, espaços e outros caracteres não relevantes
  let cleanValue = value.replace(/[^\d,.]/g, '');
  
  // Verifica se está no formato brasileiro (R$ 1.234,56)
  if (cleanValue.indexOf('.') !== -1 && cleanValue.indexOf(',') !== -1) {
    // Se tem pontos como separadores de milhar e vírgula como decimal
    if (cleanValue.lastIndexOf('.') < cleanValue.lastIndexOf(',')) {
      // Remove todos os pontos (separadores de milhar)
      cleanValue = cleanValue.replace(/\./g, '');
      // Substitui a vírgula por ponto
      cleanValue = cleanValue.replace(',', '.');
    }
    // Se tem vírgulas como separadores de milhar e ponto como decimal
    else if (cleanValue.lastIndexOf(',') < cleanValue.lastIndexOf('.')) {
      // Remove todas as vírgulas (separadores de milhar)
      cleanValue = cleanValue.replace(/,/g, '');
    }
  } 
  // Se tem apenas vírgula, assume que é separador decimal
  else if (cleanValue.indexOf(',') !== -1) {
    cleanValue = cleanValue.replace(',', '.');
  }
  
  // Certifica-se de que há apenas um ponto decimal
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    // Se houver múltiplos pontos, assume que os primeiros são separadores de milhar
    cleanValue = parts.slice(0, -1).join('') + '.' + parts.slice(-1);
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
