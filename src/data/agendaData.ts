
import { 
  Cliente, 
  Ramal, 
  Assessoria, 
  Banco, 
  LinkUtil, 
  PaginaJuridica 
} from "@/types/agenda.types";

// Dados de exemplo para a agenda
export const clientesExemplo: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    contrato: "CT-2023-001",
    tipoContrato: "Financiamento",
    telefone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    regiao: "São Paulo",
    escritorio: "Central",
    status: "Pendente",
    ultimoContato: "2023-05-10",
    proximoContato: "2023-06-15"
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    contrato: "CT-2023-042",
    tipoContrato: "Consultoria",
    telefone: "(21) 98765-1234",
    email: "maria.oliveira@email.com",
    regiao: "Rio de Janeiro",
    escritorio: "Sul",
    status: "Quitado",
    ultimoContato: "2023-05-22",
    proximoContato: "2023-06-22"
  },
  {
    id: "3",
    nome: "Carlos Pereira",
    contrato: "CT-2023-108",
    tipoContrato: "Aquisição",
    telefone: "(31) 99876-5432",
    email: "carlos.pereira@email.com",
    regiao: "Minas Gerais",
    escritorio: "Leste",
    status: "Prioridade",
    ultimoContato: "2023-05-18",
    proximoContato: "2023-06-01"
  },
  {
    id: "4",
    nome: "Ana Santos",
    contrato: "CT-2023-067",
    tipoContrato: "Financiamento",
    telefone: "(41) 99123-4567",
    email: "ana.santos@email.com",
    regiao: "Paraná",
    escritorio: "Sul",
    status: "Análise",
    ultimoContato: "2023-05-25",
    proximoContato: "2023-06-05"
  },
  {
    id: "5",
    nome: "Rodrigo Lima",
    contrato: "CT-2023-089",
    tipoContrato: "Aquisição",
    telefone: "(51) 98877-6655",
    email: "rodrigo.lima@email.com",
    regiao: "Rio Grande do Sul",
    escritorio: "Sul",
    status: "Verificado",
    ultimoContato: "2023-05-20",
    proximoContato: "2023-06-10"
  },
  {
    id: "6",
    nome: "Fernanda Costa",
    contrato: "CT-2023-023",
    tipoContrato: "Consultoria",
    telefone: "(81) 99887-7665",
    email: "fernanda.costa@email.com",
    regiao: "Pernambuco",
    escritorio: "Nordeste",
    status: "Aprovado",
    ultimoContato: "2023-05-15",
    proximoContato: "2023-06-18"
  },
  {
    id: "7",
    nome: "Bruno Almeida",
    contrato: "CT-2023-056",
    tipoContrato: "Financiamento",
    telefone: "(27) 98765-1122",
    email: "bruno.almeida@email.com",
    regiao: "Espírito Santo",
    escritorio: "Leste",
    status: "Prioridade Total",
    ultimoContato: "2023-05-12",
    proximoContato: "2023-05-29"
  },
  {
    id: "8",
    nome: "Camila Martins",
    contrato: "CT-2023-078",
    tipoContrato: "Consultoria",
    telefone: "(62) 99112-3344",
    email: "camila.martins@email.com",
    regiao: "Goiás",
    escritorio: "Centro-Oeste",
    status: "Cancelado",
    ultimoContato: "2023-05-05",
    proximoContato: "2023-06-25"
  },
  {
    id: "9",
    nome: "Diego Souza",
    contrato: "CT-2023-091",
    tipoContrato: "Aquisição",
    telefone: "(71) 98765-9900",
    email: "diego.souza@email.com",
    regiao: "Bahia",
    escritorio: "Nordeste",
    status: "Apreendido",
    ultimoContato: "2023-05-08",
    proximoContato: "2023-06-12"
  },
  {
    id: "10",
    nome: "Juliana Vieira",
    contrato: "CT-2023-113",
    tipoContrato: "Financiamento",
    telefone: "(85) 99876-5544",
    email: "juliana.vieira@email.com",
    regiao: "Ceará",
    escritorio: "Nordeste",
    status: "Outros Acordos",
    ultimoContato: "2023-05-17",
    proximoContato: "2023-06-07"
  }
];

// Dados de exemplo para ramais
export const ramaisExemplo: Ramal[] = [
  {
    id: "1",
    departamento: "Financeiro",
    responsavel: "Carlos Silva",
    numero: "1001",
    email: "financeiro@empresa.com"
  },
  {
    id: "2",
    departamento: "Recursos Humanos",
    responsavel: "Mariana Souza",
    numero: "1002",
    email: "rh@empresa.com"
  },
  {
    id: "3",
    departamento: "Atendimento",
    responsavel: "Pedro Oliveira",
    numero: "1003",
    email: "atendimento@empresa.com"
  },
  {
    id: "4",
    departamento: "Comercial",
    responsavel: "Amanda Costa",
    numero: "1004",
    email: "comercial@empresa.com"
  },
  {
    id: "5",
    departamento: "Suporte Técnico",
    responsavel: "Lucas Mendes",
    numero: "1005",
    email: "suporte@empresa.com"
  }
];

// Dados de exemplo para assessorias com horário de funcionamento
export const assessoriasExemplo: Assessoria[] = [
  {
    id: "1",
    nome: "AssessoriaFin Ltda",
    contato: "Roberto Gomes",
    telefone: "(11) 3456-7890",
    email: "contato@assessoriafin.com",
    endereco: "Av. Paulista, 1000, São Paulo - SP",
    horarioFuncionamento: {
      inicio: "09:00",
      fim: "18:00",
      diasFuncionamento: [1, 2, 3, 4, 5] // segunda a sexta
    }
  },
  {
    id: "2",
    nome: "Consultoria Legal S.A.",
    contato: "Juliana Alves",
    telefone: "(21) 2345-6789",
    email: "contato@consultorialegal.com",
    endereco: "Rua do Ouvidor, 50, Rio de Janeiro - RJ",
    horarioFuncionamento: {
      inicio: "08:30",
      fim: "17:30",
      diasFuncionamento: [1, 2, 3, 4, 5] // segunda a sexta
    }
  },
  {
    id: "3",
    nome: "Assessoria Jurídica Nacional",
    contato: "Fernando Costa",
    telefone: "(31) 3456-7891",
    email: "contato@ajn.com",
    endereco: "Av. Afonso Pena, 1500, Belo Horizonte - MG",
    horarioFuncionamento: {
      inicio: "10:00",
      fim: "19:00",
      diasFuncionamento: [1, 2, 3, 4, 5, 6] // segunda a sábado
    }
  }
];

// Dados de exemplo para bancos
export const bancosExemplo: Banco[] = [
  {
    id: "1",
    nome: "Banco Nacional",
    contato: "Central de Atendimento",
    telefone: "0800 123 4567",
    email: "atendimento@banconacional.com",
    website: "https://www.banconacional.com"
  },
  {
    id: "2",
    nome: "Banco Investimentos",
    contato: "Gerente de Relacionamento",
    telefone: "0800 765 4321",
    email: "contato@bancoinvestimentos.com",
    website: "https://www.bancoinvestimentos.com"
  },
  {
    id: "3",
    nome: "Financeira Crédito Fácil",
    contato: "SAC",
    telefone: "0800 888 9999",
    email: "sac@creditofacil.com",
    website: "https://www.creditofacil.com"
  },
  {
    id: "4",
    nome: "Banco Múltiplo",
    contato: "Ouvidoria",
    telefone: "0800 555 1234",
    email: "ouvidoria@bancomultiplo.com",
    website: "https://www.bancomultiplo.com"
  }
];

// Dados de exemplo para links úteis
export const linksUteisExemplo: LinkUtil[] = [
  {
    id: "1",
    nome: "Portal do Cliente",
    url: "https://cliente.empresa.com",
    categoria: "Interno",
    descricao: "Acesso ao portal do cliente para consultas"
  },
  {
    id: "2",
    nome: "Consulta CPF/CNPJ",
    url: "https://consulta.gov.br",
    categoria: "Externo",
    descricao: "Site para consulta de CPF e CNPJ"
  },
  {
    id: "3",
    nome: "Sistema de Contratos",
    url: "https://contratos.empresa.com",
    categoria: "Interno",
    descricao: "Sistema interno para geração de contratos"
  },
  {
    id: "4",
    nome: "Calculadora Financeira",
    url: "https://calculadora.financeira.com",
    categoria: "Ferramentas",
    descricao: "Ferramenta para cálculos financeiros"
  }
];

// Dados de exemplo para páginas jurídicas
export const paginasJuridicasExemplo: PaginaJuridica[] = [
  {
    id: "1",
    titulo: "Código Civil",
    descricao: "Acesso ao código civil brasileiro atualizado",
    link: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm",
    categoria: "Legislação"
  },
  {
    id: "2",
    titulo: "CLT - Consolidação das Leis do Trabalho",
    descricao: "Consulta à CLT atualizada",
    link: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
    categoria: "Legislação"
  },
  {
    id: "3",
    titulo: "Modelos de Contratos",
    descricao: "Biblioteca de modelos de contratos",
    link: "https://modelos.juridico.empresa.com",
    categoria: "Modelos"
  },
  {
    id: "4",
    titulo: "Consulta Processos",
    descricao: "Sistema de consulta processual",
    link: "https://pje.tjsp.jus.br/",
    categoria: "Consulta"
  }
];
