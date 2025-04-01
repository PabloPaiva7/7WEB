
import { Cliente, Banco, Ramal, Assessoria, LinkUtil, PaginaJuridica } from "@/types/agenda.types";

// Dados de exemplo para clientes
export const clientesExemplo: Cliente[] = [
  {
    id: "cliente-1",
    nome: "João da Silva",
    contrato: "CT-2023-001",
    tipoContrato: "Financiamento",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    regiao: "São Paulo",
    escritorio: "Central",
    status: "Pendente",
    responsavel: "Ana Silva",
    proximoContato: "2023-12-15"
  },
  {
    id: "cliente-2",
    nome: "Maria Oliveira",
    contrato: "CT-2023-002",
    tipoContrato: "Empréstimo",
    email: "maria.oliveira@email.com",
    telefone: "(21) 98765-4321",
    regiao: "Rio de Janeiro",
    escritorio: "Zona Sul",
    status: "Prioridade",
    responsavel: "Carlos Mendes",
    proximoContato: "2023-12-10"
  },
  {
    id: "cliente-3",
    nome: "Pedro Santos",
    contrato: "CT-2023-003",
    tipoContrato: "Financiamento",
    email: "pedro.santos@email.com",
    telefone: "(31) 98765-4321",
    regiao: "Minas Gerais",
    escritorio: "Central",
    status: "Verificado",
    responsavel: "Juliana Costa",
    proximoContato: "2023-12-18"
  },
  {
    id: "cliente-4",
    nome: "Ana Souza",
    contrato: "CT-2023-004",
    tipoContrato: "Consórcio",
    email: "ana.souza@email.com",
    telefone: "(41) 98765-4321",
    regiao: "Paraná",
    escritorio: "Norte",
    status: "Análise",
    responsavel: "Felipe Oliveira",
    proximoContato: "2023-12-20"
  },
  {
    id: "cliente-5",
    nome: "Carlos Ferreira",
    contrato: "CT-2023-005",
    tipoContrato: "Empréstimo",
    email: "carlos.ferreira@email.com",
    telefone: "(51) 98765-4321",
    regiao: "Rio Grande do Sul",
    escritorio: "Central",
    status: "Aprovado",
    responsavel: "Mariana Santos",
    proximoContato: "2023-12-12"
  },
  {
    id: "cliente-6",
    nome: "Luciana Costa",
    contrato: "CT-2023-006",
    tipoContrato: "Financiamento",
    email: "luciana.costa@email.com",
    telefone: "(61) 98765-4321",
    regiao: "Distrito Federal",
    escritorio: "Sul",
    status: "Quitado",
    responsavel: "Ana Silva",
    proximoContato: "2023-12-25"
  },
  {
    id: "cliente-7",
    nome: "Rafael Almeida",
    contrato: "CT-2023-007",
    tipoContrato: "Consórcio",
    email: "rafael.almeida@email.com",
    telefone: "(71) 98765-4321",
    regiao: "Bahia",
    escritorio: "Leste",
    status: "Apreendido",
    responsavel: "Carlos Mendes",
    proximoContato: "2023-12-17"
  },
  {
    id: "cliente-8",
    nome: "Fernanda Lima",
    contrato: "CT-2023-008",
    tipoContrato: "Financiamento",
    email: "fernanda.lima@email.com",
    telefone: "(81) 98765-4321",
    regiao: "Pernambuco",
    escritorio: "Centro",
    status: "Cancelado",
    responsavel: "Juliana Costa",
    proximoContato: "2023-12-19"
  },
  {
    id: "cliente-9",
    nome: "Marcelo Ribeiro",
    contrato: "CT-2023-009",
    tipoContrato: "Empréstimo",
    email: "marcelo.ribeiro@email.com",
    telefone: "(91) 98765-4321",
    regiao: "Pará",
    escritorio: "Norte",
    status: "Prioridade Total",
    responsavel: "Felipe Oliveira",
    proximoContato: "2023-12-05"
  },
  {
    id: "cliente-10",
    nome: "Camila Rodrigues",
    contrato: "CT-2023-010",
    tipoContrato: "Consórcio",
    email: "camila.rodrigues@email.com",
    telefone: "(27) 98765-4321",
    regiao: "Espírito Santo",
    escritorio: "Sul",
    status: "Outros Acordos",
    responsavel: "Mariana Santos",
    proximoContato: "2023-12-22"
  }
];

// Dados de exemplo para bancos
export const bancosExemplo: Banco[] = [
  {
    id: "banco-1",
    nome: "Banco Nacional",
    contato: "Carlos Oliveira",
    telefone: "(11) 3333-4444",
    email: "carlos@banconacional.com",
    website: "https://www.banconacional.com"
  },
  {
    id: "banco-2",
    nome: "Financeira Rápida",
    contato: "Ana Pereira",
    telefone: "(21) 5555-6666",
    email: "ana@financeirarapida.com",
    website: "https://www.financeirarapida.com"
  },
  {
    id: "banco-3",
    nome: "Crédito Fácil",
    contato: "Roberto Santos",
    telefone: "(31) 7777-8888",
    email: "roberto@creditofacil.com",
    website: "https://www.creditofacil.com"
  }
];

// Dados de exemplo para ramais
export const ramaisExemplo: Ramal[] = [
  {
    id: "ramal-1",
    departamento: "Financeiro",
    responsavel: "Mariana Costa",
    numero: "2001",
    email: "financeiro@empresa.com"
  },
  {
    id: "ramal-2",
    departamento: "Jurídico",
    responsavel: "Ricardo Soares",
    numero: "2002",
    email: "juridico@empresa.com"
  },
  {
    id: "ramal-3",
    departamento: "Atendimento",
    responsavel: "Juliana Ferreira",
    numero: "2003",
    email: "atendimento@empresa.com"
  }
];

// Dados de exemplo para assessorias
export const assessoriasExemplo: Assessoria[] = [
  {
    id: "assessoria-1",
    nome: "Assessoria Jurídica Silva & Associados",
    contato: "Fernando Silva",
    telefone: "(11) 99999-8888",
    email: "contato@silvaassociados.com",
    endereco: "Av. Paulista, 1000, São Paulo - SP",
    horarioFuncionamento: {
      inicio: "09:00",
      fim: "18:00",
      diasFuncionamento: [1, 2, 3, 4, 5] // Segunda a sexta
    }
  },
  {
    id: "assessoria-2",
    nome: "Consultoria Financeira RealValue",
    contato: "Patricia Mendes",
    telefone: "(21) 88888-7777",
    email: "atendimento@realvalue.com",
    endereco: "Rua da Quitanda, 50, Rio de Janeiro - RJ",
    horarioFuncionamento: {
      inicio: "08:30",
      fim: "17:30",
      diasFuncionamento: [1, 2, 3, 4, 5] // Segunda a sexta
    }
  }
];

// Dados de exemplo para links úteis
export const linksUteisExemplo: LinkUtil[] = [
  {
    id: "link-1",
    nome: "Sistema Interno",
    url: "https://sistema.interno.empresa.com",
    categoria: "Sistemas",
    descricao: "Acesso ao sistema de gestão interna da empresa"
  },
  {
    id: "link-2",
    nome: "Portal do Colaborador",
    url: "https://portal.colaborador.empresa.com",
    categoria: "RH",
    descricao: "Acesso ao portal de RH e benefícios"
  },
  {
    id: "link-3",
    nome: "Banco de Dados de Clientes",
    url: "https://clientes.empresa.com",
    categoria: "Sistemas",
    descricao: "Base de dados atualizada de clientes"
  }
];

// Dados de exemplo para páginas jurídicas
export const paginasJuridicasExemplo: PaginaJuridica[] = [
  {
    id: "pagina-1",
    titulo: "Lei de Proteção de Dados",
    descricao: "Informações sobre a Lei Geral de Proteção de Dados (LGPD) e suas implicações",
    link: "https://www.planalto.gov.br/lgpd",
    categoria: "Legislação"
  },
  {
    id: "pagina-2",
    titulo: "Código de Defesa do Consumidor",
    descricao: "Texto completo do Código de Defesa do Consumidor",
    link: "https://www.planalto.gov.br/cdc",
    categoria: "Legislação"
  },
  {
    id: "pagina-3",
    titulo: "Modelos de Contratos",
    descricao: "Biblioteca de modelos de contratos para diferentes situações",
    link: "https://juridico.empresa.com/modelos",
    categoria: "Documentos"
  }
];
