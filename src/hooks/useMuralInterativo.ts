import { useState, useEffect } from "react";
import { Aniversariante, ConteudoRecomendado, TipoConteudo, DicaHack, CategoriaDica } from "@/types/mural.types";
import { v4 as uuidv4 } from "uuid";
import { dadosExemploAniversariantes, dadosExemploConteudos } from "@/data/muralInterativoData";
import { toast } from "sonner";

const STORAGE_KEY_ANIVERSARIANTES = "mural_aniversariantes";
const STORAGE_KEY_CONTEUDOS = "mural_conteudos";
const STORAGE_KEY_DICAS = "mural_dicas";

const dadosExemploDicas: DicaHack[] = [
  {
    id: "1",
    titulo: "Atalhos do teclado para aumentar produtividade",
    conteudo: "Use Ctrl+C para copiar, Ctrl+V para colar e Ctrl+Z para desfazer. Aprenda mais atalhos para economizar tempo no seu trabalho diário!",
    categoria: "produtividade",
    autor: "João Silva",
    dataCriacao: new Date(2023, 4, 15).toISOString(),
    curtidas: 12
  },
  {
    id: "2",
    titulo: "Técnica Pomodoro para foco",
    conteudo: "Trabalhe por 25 minutos e descanse por 5. Após 4 ciclos, faça uma pausa mais longa de 15-30 minutos. Essa técnica ajuda a manter o foco e reduzir a fadiga mental.",
    categoria: "trabalho",
    autor: "Maria Oliveira",
    dataCriacao: new Date(2023, 5, 2).toISOString(),
    curtidas: 8
  },
  {
    id: "3",
    titulo: "Como configurar múltiplos monitores corretamente",
    conteudo: "Posicione os monitores no mesmo nível de altura dos olhos. Mantenha o monitor principal diretamente à sua frente e os secundários em ângulos confortáveis para evitar torcer o pescoço.",
    categoria: "tecnologia",
    autor: "Pedro Costa",
    dataCriacao: new Date(2023, 6, 12).toISOString(),
    curtidas: 15
  }
];

export const useMuralInterativo = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [conteudosRecomendados, setConteudosRecomendados] = useState<ConteudoRecomendado[]>([]);
  const [dicas, setDicas] = useState<DicaHack[]>([]);
  const [filtroConteudo, setFiltroConteudo] = useState<TipoConteudo | "todos">("todos");
  const [filtroDica, setFiltroDica] = useState<CategoriaDica | "todos">("todos");

  useEffect(() => {
    const storedAniversariantes = localStorage.getItem(STORAGE_KEY_ANIVERSARIANTES);
    const storedConteudos = localStorage.getItem(STORAGE_KEY_CONTEUDOS);
    const storedDicas = localStorage.getItem(STORAGE_KEY_DICAS);
    
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
    
    if (storedDicas) {
      setDicas(JSON.parse(storedDicas));
    } else {
      setDicas(dadosExemploDicas);
      localStorage.setItem(STORAGE_KEY_DICAS, JSON.stringify(dadosExemploDicas));
    }
  }, []);

  const filtrarAniversariantes = (periodo: 'dia' | 'semana' | 'mes') => {
    const hoje = new Date();
    const aniversariantesComDataJs = aniversariantes.map(aniv => ({
      ...aniv,
      dataJs: new Date(aniv.data)
    }));
    
    return aniversariantesComDataJs.filter(aniv => {
      const dataAniversario = new Date(aniv.dataJs);
      dataAniversario.setFullYear(hoje.getFullYear());
      
      if (periodo === 'dia') {
        return dataAniversario.getDate() === hoje.getDate() && 
               dataAniversario.getMonth() === hoje.getMonth();
      } else if (periodo === 'semana') {
        const umDiaEmMs = 1000 * 60 * 60 * 24;
        const diffEmDias = Math.round(Math.abs((dataAniversario.getTime() - hoje.getTime()) / umDiaEmMs));
        return diffEmDias <= 7 && dataAniversario >= hoje;
      } else {
        return dataAniversario.getMonth() === hoje.getMonth();
      }
    }).map(aniv => {
      const { dataJs, ...anivSemDataJs } = aniv;
      return anivSemDataJs;
    });
  };

  const aniversariantesDoDia = filtrarAniversariantes('dia');
  
  const aniversariantesDaSemana = filtrarAniversariantes('semana');
  
  const aniversariantesDoMes = filtrarAniversariantes('mes');

  const conteudosFiltrados = conteudosRecomendados.filter(conteudo => 
    filtroConteudo === "todos" || conteudo.tipo === filtroConteudo
  ).sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

  const dicasFiltradas = dicas.filter(dica => 
    filtroDica === "todos" || dica.categoria === filtroDica
  ).sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

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

  const editarConteudo = (id: string, conteudoAtualizado: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => {
    const conteudoExistente = conteudosRecomendados.find(c => c.id === id);
    
    if (!conteudoExistente) {
      toast.error("Conteúdo não encontrado");
      return null;
    }
    
    const novosConteudos = conteudosRecomendados.map(c => 
      c.id === id 
        ? { ...conteudoAtualizado, id, dataCriacao: conteudoExistente.dataCriacao } 
        : c
    );
    
    setConteudosRecomendados(novosConteudos);
    localStorage.setItem(STORAGE_KEY_CONTEUDOS, JSON.stringify(novosConteudos));
    
    return { ...conteudoAtualizado, id, dataCriacao: conteudoExistente.dataCriacao };
  };

  const excluirConteudo = (id: string) => {
    const novosConteudos = conteudosRecomendados.filter(c => c.id !== id);
    setConteudosRecomendados(novosConteudos);
    localStorage.setItem(STORAGE_KEY_CONTEUDOS, JSON.stringify(novosConteudos));
  };

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

  const editarAniversariante = (id: string, aniversarianteAtualizado: Omit<Aniversariante, "id">) => {
    const aniversarianteExistente = aniversariantes.find(a => a.id === id);
    
    if (!aniversarianteExistente) {
      toast.error("Aniversariante não encontrado");
      return null;
    }
    
    const novosAniversariantes = aniversariantes.map(a => 
      a.id === id 
        ? { ...aniversarianteAtualizado, id } 
        : a
    );
    
    setAniversariantes(novosAniversariantes);
    localStorage.setItem(STORAGE_KEY_ANIVERSARIANTES, JSON.stringify(novosAniversariantes));
    
    return { ...aniversarianteAtualizado, id };
  };

  const excluirAniversariante = (id: string) => {
    const novosAniversariantes = aniversariantes.filter(a => a.id !== id);
    setAniversariantes(novosAniversariantes);
    localStorage.setItem(STORAGE_KEY_ANIVERSARIANTES, JSON.stringify(novosAniversariantes));
  };

  const adicionarDica = (novaDica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => {
    const dicaCompleta: DicaHack = {
      ...novaDica,
      id: uuidv4(),
      dataCriacao: new Date().toISOString(),
      curtidas: 0
    };
    
    const novasDicas = [dicaCompleta, ...dicas];
    setDicas(novasDicas);
    localStorage.setItem(STORAGE_KEY_DICAS, JSON.stringify(novasDicas));
    toast.success("Dica adicionada com sucesso!");
    
    return dicaCompleta;
  };

  const editarDica = (id: string, dicaAtualizada: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => {
    const dicaExistente = dicas.find(d => d.id === id);
    
    if (!dicaExistente) {
      toast.error("Dica não encontrada");
      return null;
    }
    
    const novasDicas = dicas.map(d => 
      d.id === id 
        ? { 
            ...dicaAtualizada, 
            id, 
            dataCriacao: dicaExistente.dataCriacao,
            curtidas: dicaExistente.curtidas 
          } 
        : d
    );
    
    setDicas(novasDicas);
    localStorage.setItem(STORAGE_KEY_DICAS, JSON.stringify(novasDicas));
    toast.success("Dica atualizada com sucesso!");
    
    return { 
      ...dicaAtualizada, 
      id, 
      dataCriacao: dicaExistente.dataCriacao,
      curtidas: dicaExistente.curtidas 
    };
  };

  const excluirDica = (id: string) => {
    const novasDicas = dicas.filter(d => d.id !== id);
    setDicas(novasDicas);
    localStorage.setItem(STORAGE_KEY_DICAS, JSON.stringify(novasDicas));
    toast.success("Dica excluída com sucesso!");
  };

  const curtirDica = (id: string) => {
    const novasDicas = dicas.map(d => 
      d.id === id 
        ? { ...d, curtidas: d.curtidas + 1 } 
        : d
    );
    
    setDicas(novasDicas);
    localStorage.setItem(STORAGE_KEY_DICAS, JSON.stringify(novasDicas));
  };

  return {
    aniversariantesDoDia,
    aniversariantesDaSemana,
    aniversariantesDoMes,
    conteudosFiltrados,
    dicasFiltradas,
    filtroConteudo,
    filtroDica,
    setFiltroConteudo,
    setFiltroDica,
    adicionarConteudo,
    editarConteudo,
    excluirConteudo,
    adicionarAniversariante,
    editarAniversariante,
    excluirAniversariante,
    adicionarDica,
    editarDica,
    excluirDica,
    curtirDica
  };
};
