
import { Anuncio } from "@/types/mural.types";

export const dadosExemplo: Anuncio[] = [
  {
    id: "1",
    titulo: "Treinamento de Excel Avançado",
    conteudo: "Estamos organizando um treinamento de Excel Avançado para todos os colaboradores interessados. O treinamento abordará fórmulas avançadas, tabelas dinâmicas e automação com macros.\n\nVagas limitadas!",
    tipo: "treinamento",
    dataPublicacao: new Date().toISOString(),
    dataEvento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    autor: "Departamento de RH",
    importante: true,
    permitirInscricao: true
  },
  {
    id: "2",
    titulo: "Novos procedimentos para solicitação de férias",
    conteudo: "A partir do próximo mês, todas as solicitações de férias deverão ser feitas através do novo sistema online. O prazo mínimo para solicitação será de 30 dias de antecedência.",
    tipo: "corporativo",
    dataPublicacao: new Date().toISOString(),
    autor: "Diretoria",
    importante: false,
    permitirInscricao: false
  },
  {
    id: "3",
    titulo: "Mudança no horário de funcionamento",
    conteudo: "Informamos que a partir da próxima semana nosso horário de funcionamento será das 9h às 18h, de segunda a sexta-feira.",
    tipo: "mudanca",
    dataPublicacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    autor: "Administração",
    importante: true,
    permitirInscricao: false
  }
];
