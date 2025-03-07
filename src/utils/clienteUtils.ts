
export interface Cliente {
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

export const gerarStatusAleatorio = () => {
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

export const getClientesComStatus = (clientesArr: Cliente[]) => {
  return clientesArr.map(cliente => ({
    ...cliente,
    situacao: cliente.situacao || gerarStatusAleatorio()
  }));
};

export const filtrarClientes = (
  clientes: Cliente[], 
  searchTerm: string, 
  statusFilter: string
) => {
  return clientes
    .filter(cliente =>
      (cliente.contrato && cliente.contrato.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cliente.banco && cliente.banco.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cliente.escritorio && cliente.escritorio.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(cliente => 
      statusFilter === "todos" || 
      (cliente.situacao && cliente.situacao.toLowerCase() === statusFilter.toLowerCase())
    );
};

export const calcularValoresPorBanco = (clientes: Cliente[]) => {
  const valoresPorBanco = clientes.reduce((acc, cliente) => {
    if (cliente.banco && cliente.valor_cliente) {
      acc[cliente.banco] = (acc[cliente.banco] || 0) + cliente.valor_cliente;
    }
    return acc;
  }, {} as Record<string, number>);

  return valoresPorBanco;
};

export const calcularValorTotal = (valoresPorBanco: Record<string, number>) => {
  return Object.values(valoresPorBanco).reduce((a, b) => a + b, 0);
};

export const gerarDadosExemplo = () => {
  return [...Array(6)].map((_, index) => {
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
};
