
import { v4 as uuidv4 } from 'uuid';

export interface MovimentacaoHistorico {
  id: string;
  data: string;
  contrato: string;
  cliente: string;
  tipo: string;
  modulo: string;
  descricao: string;
  usuario: string;
  status: string;
  protocolo: string;
  statusCampanha?: boolean;
}

// Função para gerar um protocolo único
const gerarProtocolo = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}-${random}`;
};

// Datas para os últimos 6 meses
const gerarDataAleatoria = () => {
  const hoje = new Date();
  const diasAleatorios = Math.floor(Math.random() * 180); // últimos 6 meses
  const data = new Date(hoje);
  data.setDate(hoje.getDate() - diasAleatorios);
  
  // Adicionar horas aleatórias
  data.setHours(Math.floor(Math.random() * 24));
  data.setMinutes(Math.floor(Math.random() * 60));
  data.setSeconds(Math.floor(Math.random() * 60));
  
  return data.toISOString();
};

// Lista de módulos possíveis
const modulos = ["Informações", "Interações", "Pagamentos", "Documentos"];

// Lista de tipos de movimentação
const tiposMovimentacao = [
  "Alteração de dados", 
  "Inclusão de documento", 
  "Registro de pagamento", 
  "Atualização de status", 
  "Comentário adicionado", 
  "Contato realizado", 
  "Negociação registrada"
];

// Lista de status possíveis
const statusPossiveis = ["Concluído", "Pendente", "Processando", "Cancelado"];

// Lista de usuários do sistema
const usuarios = [
  "Maria Silva",
  "João Oliveira",
  "Ana Souza",
  "Carlos Pereira",
  "Fernanda Santos",
  "Roberto Lima",
  "Juliana Costa",
  "Marcelo Rodrigues"
];

// Lista de descrições por tipo
const descricoesPorTipo: Record<string, string[]> = {
  "Alteração de dados": [
    "Atualização do endereço do cliente para Rua ABC, 123",
    "Alteração do telefone de contato para (11) 98765-4321",
    "Atualização do email para cliente@email.com",
    "Retificação da data de nascimento para 15/05/1985",
    "Correção do nome completo do cliente para incluir sobrenome"
  ],
  "Inclusão de documento": [
    "Anexo de comprovante de residência atualizado",
    "Upload de documento de identidade (RG)",
    "Inclusão de procuração para representação legal",
    "Adição de contrato assinado pelo cliente",
    "Upload de comprovante de pagamento da entrada"
  ],
  "Registro de pagamento": [
    "Pagamento de parcela #3 no valor de R$ 1.200,00",
    "Registro de entrada de R$ 5.000,00 via transferência bancária",
    "Quitação total do contrato no valor de R$ 15.000,00",
    "Pagamento parcial de R$ 800,00 referente à negociação",
    "Estorno de pagamento indevido de R$ 1.000,00"
  ],
  "Atualização de status": [
    "Contrato movido para status 'Em Análise'",
    "Alteração de 'Pendente' para 'Aprovado'",
    "Atualização para status 'Quitado'",
    "Mudança de status para 'Cancelado' a pedido do cliente",
    "Contrato marcado como 'Prioridade Total'"
  ],
  "Comentário adicionado": [
    "Cliente solicitou revisão dos valores das parcelas",
    "Observação sobre dificuldades financeiras do cliente",
    "Nota sobre divergência de dados cadastrais",
    "Comentário sobre necessidade de atualização documental",
    "Registro de preferência de contato por WhatsApp"
  ],
  "Contato realizado": [
    "Ligação telefônica para avisar sobre vencimento próximo",
    "Email enviado com detalhes da renegociação",
    "SMS de confirmação de pagamento recebido",
    "Contato por WhatsApp para verificar satisfação",
    "Ligação para confirmar recebimento de documentação"
  ],
  "Negociação registrada": [
    "Acordo para parcelamento de dívida em 12x de R$ 500,00",
    "Negociação de desconto de 15% para pagamento à vista",
    "Proposta de carência de 2 meses para reinício dos pagamentos",
    "Acordo judicial homologado para quitação com 30% de desconto",
    "Renegociação com redução de juros de 12% para 9% ao ano"
  ]
};

// Lista de clientes e contratos
const clientesContratos = [
  { cliente: "José da Silva", contrato: "CT-2023-0001" },
  { cliente: "Maria Oliveira", contrato: "CT-2023-0015" },
  { cliente: "Empresa ABC Ltda", contrato: "CT-2023-0022" },
  { cliente: "Marcos Pereira", contrato: "CT-2023-0037" },
  { cliente: "Construtora XYZ", contrato: "CT-2023-0043" },
  { cliente: "Ana Carolina Santos", contrato: "CT-2023-0056" },
  { cliente: "Ricardo Souza ME", contrato: "CT-2023-0064" },
  { cliente: "Farmácia Bem Estar", contrato: "CT-2023-0078" },
  { cliente: "Imobiliária Central", contrato: "CT-2023-0092" },
  { cliente: "Pedro Henrique Costa", contrato: "CT-2023-0105" },
  { cliente: "Supermercado Economia", contrato: "CT-2023-0117" },
  { cliente: "Clínica Saúde Total", contrato: "CT-2023-0129" },
  { cliente: "Auto Peças Genuínas", contrato: "CT-2023-0138" },
  { cliente: "Escola Saber Mais", contrato: "CT-2023-0147" },
  { cliente: "Restaurante Sabor da Terra", contrato: "CT-2023-0159" }
];

// Gerar movimentações aleatórias
export const historicoMovimentacoes: MovimentacaoHistorico[] = Array.from({ length: 60 }, () => {
  const tipo = tiposMovimentacao[Math.floor(Math.random() * tiposMovimentacao.length)];
  const descricoes = descricoesPorTipo[tipo];
  const clienteContrato = clientesContratos[Math.floor(Math.random() * clientesContratos.length)];
  
  return {
    id: uuidv4(),
    data: gerarDataAleatoria(),
    contrato: clienteContrato.contrato,
    cliente: clienteContrato.cliente,
    tipo,
    modulo: modulos[Math.floor(Math.random() * modulos.length)],
    descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
    usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
    status: statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)],
    protocolo: gerarProtocolo(),
    statusCampanha: Math.random() > 0.5
  };
}).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
