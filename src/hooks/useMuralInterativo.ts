
import { useState, useEffect } from "react";
import { Aniversariante, ConteudoRecomendado, TipoConteudo } from "@/types/mural.types";
import { v4 as uuidv4 } from "uuid";
import { dadosExemploAniversariantes, dadosExemploConteudos } from "@/data/muralInterativoData";

const STORAGE_KEY_ANIVERSARIANTES = "mural_aniversariantes";
const STORAGE_KEY_CONTEUDOS = "mural_conteudos";

export const useMuralInterativo = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [conteudosRecomendados, setConteudosRecomendados] = useState<ConteudoRecomendado[]>([]);
  const [filtroConteudo, setFiltroConteudo] = useState<TipoConteudo | "todos">("todos");

  // Carrega os dados do localStorage na inicialização
  useEffect(() => {
    const storedAniversariantes = localStorage.getItem(STORAGE_KEY_ANIVERSARIANTES);
    const storedConteudos = localStorage.getItem(STORAGE_KEY_CONTEUDOS);
    
    if (storedAniversariantes) {
      setAniversariantes(JSON.parse(storedAniversariantes));
    } else {
      setAniversariantes(dadosExemploAniversariantes);
      localStorage.setItem(STORAGE_KEY_ANIVERSARIANTES, JSON.stringify(dadosExemploAniversariantes));
    }
    
    if (storedConteudos) {
      setConteudosRecomendados(JSON.parse(storedConteudos));
    } else {
      setConteudosRecomendados(dadosExemploConteudos);
      localStorage.setItem(STORAGE_KEY_CONTEUDOS, JSON.stringify(dadosExemploConteudos));
    }
  }, []);

  // Filtra os aniversariantes por período (dia, semana, mês)
  const filtrarAniversariantes = (periodo: 'dia' | 'semana' | 'mes') => {
    const hoje = new Date();
    const aniversariantesComDataJs = aniversariantes.map(aniv => ({
      ...aniv,
      dataJs: new Date(aniv.data)
    }));
    
    return aniversariantesComDataJs.filter(aniv => {
      const dataAniversario = new Date(aniv.dataJs);
      dataAniversario.setFullYear(hoje.getFullYear()); // Ajusta para o ano atual
      
      if (periodo === 'dia') {
        return dataAniversario.getDate() === hoje.getDate() && 
               dataAniversario.getMonth() === hoje.getMonth();
      } else if (periodo === 'semana') {
        // Calcula a diferença em dias
        const umDiaEmMs = 1000 * 60 * 60 * 24;
        const diffEmDias = Math.round(Math.abs((dataAniversario.getTime() - hoje.getTime()) / umDiaEmMs));
        return diffEmDias <= 7 && dataAniversario >= hoje;
      } else { // mês
        return dataAniversario.getMonth() === hoje.getMonth();
      }
    }).map(aniv => {
      const { dataJs, ...anivSemDataJs } = aniv;
      return anivSemDataJs;
    });
  };

  // Obter aniversariantes do dia
  const aniversariantesDoDia = filtrarAniversariantes('dia');
  
  // Obter aniversariantes da semana (próximos 7 dias)
  const aniversariantesDaSemana = filtrarAniversariantes('semana');
  
  // Obter aniversariantes do mês
  const aniversariantesDoMes = filtrarAniversariantes('mes');

  // Filtra conteúdos recomendados por tipo
  const conteudosFiltrados = conteudosRecomendados.filter(conteudo => 
    filtroConteudo === "todos" || conteudo.tipo === filtroConteudo
  ).sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

  // Adicionar novo conteúdo recomendado
  const adicionarConteudo = (novoConteudo: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => {
    const conteudoCompleto: ConteudoRecomendado = {
      ...novoConteudo,
      id: uuidv4(),
      dataCriacao: new Date().toISOString()
    };
    
    const novosConteudos = [conteudoCompleto, ...conteudosRecomendados];
    setConteudosRecomendados(novosConteudos);
    localStorage.setItem(STORAGE_KEY_CONTEUDOS, JSON.stringify(novosConteudos));
    
    return conteudoCompleto;
  };

  // Adicionar novo aniversariante
  const adicionarAniversariante = (novoAniversariante: Omit<Aniversariante, "id">) => {
    const aniversarianteCompleto: Aniversariante = {
      ...novoAniversariante,
      id: uuidv4()
    };
    
    const novosAniversariantes = [...aniversariantes, aniversarianteCompleto];
    setAniversariantes(novosAniversariantes);
    localStorage.setItem(STORAGE_KEY_ANIVERSARIANTES, JSON.stringify(novosAniversariantes));
    
    return aniversarianteCompleto;
  };

  return {
    aniversariantesDoDia,
    aniversariantesDaSemana,
    aniversariantesDoMes,
    conteudosFiltrados,
    filtroConteudo,
    setFiltroConteudo,
    adicionarConteudo,
    adicionarAniversariante
  };
};
