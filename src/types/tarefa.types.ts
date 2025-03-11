
export type PrioridadeTarefa = "baixa" | "media" | "alta";

export type StatusTarefa = "pendente" | "em_andamento" | "concluida" | "todas";

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string | null; // Data ISO
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
  criacao: string; // Data ISO
  categoria: string;
}

export type NovaTarefa = Partial<Omit<Tarefa, "id" | "criacao">> & {
  id?: string;
  criacao?: string;
  titulo: string;
  descricao: string;
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
  categoria: string;
};
