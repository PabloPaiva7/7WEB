
import { Aniversariante, ConteudoRecomendado } from "@/types/mural.types";

// Helper para criar datas de aniversário
const criarDataAniversario = (dia: number, mes: number): string => {
  const dataAtual = new Date();
  // Mês em JavaScript é 0-indexed (janeiro = 0)
  const data = new Date(dataAtual.getFullYear(), mes - 1, dia);
  return data.toISOString();
};

// Lista de exemplo de aniversariantes
// Os dados são gerados para incluir aniversários no mês atual
export const dadosExemploAniversariantes: Aniversariante[] = [
  {
    id: "1",
    nome: "Ana Silva",
    departamento: "RH",
    data: criarDataAniversario(15, new Date().getMonth() + 1),
  },
  {
    id: "2",
    nome: "Carlos Oliveira",
    departamento: "TI",
    data: criarDataAniversario(new Date().getDate(), new Date().getMonth() + 1), // Hoje
  },
  {
    id: "3",
    nome: "Mariana Costa",
    departamento: "Marketing",
    data: criarDataAniversario(new Date().getDate() + 2, new Date().getMonth() + 1), // Daqui a 2 dias
  },
  {
    id: "4",
    nome: "Roberto Almeida",
    departamento: "Financeiro",
    data: criarDataAniversario(new Date().getDate() + 5, new Date().getMonth() + 1), // Daqui a 5 dias
  },
  {
    id: "5",
    nome: "Juliana Torres",
    departamento: "Vendas",
    data: criarDataAniversario(28, new Date().getMonth() + 1),
  }
];

// Lista de exemplo de conteúdos recomendados
export const dadosExemploConteudos: ConteudoRecomendado[] = [
  {
    id: "1",
    titulo: "Pense e Enriqueça",
    descricao: "Um dos livros mais influentes sobre desenvolvimento pessoal e sucesso financeiro.",
    tipo: "livro",
    autor: "Napoleon Hill",
    imagem: "https://m.media-amazon.com/images/I/71UM0hAI05L._AC_UF1000,1000_QL80_.jpg",
    dataCriacao: new Date().toISOString()
  },
  {
    id: "2",
    titulo: "Tudo se ilumina",
    descricao: "Filipenses 4:13 - Tudo posso naquele que me fortalece.",
    tipo: "versiculo",
    autor: "Apóstolo Paulo",
    dataCriacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    titulo: "Oppenheimer",
    descricao: "A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.",
    tipo: "filme",
    autor: "Christopher Nolan",
    imagem: "https://upload.wikimedia.org/wikipedia/pt/9/9b/Oppenheimer_%28filme%29.jpg",
    dataCriacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    titulo: "Excel Avançado para Análise de Dados",
    descricao: "Aprenda técnicas avançadas de Excel para análise de dados e business intelligence.",
    tipo: "curso",
    link: "https://exemplo.com/curso-excel",
    dataCriacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    titulo: "The Last of Us",
    descricao: "Série baseada no aclamado jogo que mostra um mundo pós-apocalíptico.",
    tipo: "serie",
    autor: "HBO",
    imagem: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUzLWI4NWEtOGUyNTkwMjI2Zjk2XkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_.jpg",
    dataCriacao: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];
