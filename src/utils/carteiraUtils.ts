
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
          
          if (config.format) {
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
      const valor = Number(cliente.valorCliente.replace(/[^0-9.-]+/g, "")) || 0;
      return acc + valor;
    }, 0),
    mediaPrazo: clientes.reduce((acc, cliente) => {
      const dias = parseInt(cliente.prazo as string) || 0;
      return acc + dias;
    }, 0) / (clientes.length || 1),
  };
};
