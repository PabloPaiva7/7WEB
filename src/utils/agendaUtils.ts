
import { Assessoria } from "@/types/agenda.types";

// Função para verificar se a assessoria está disponível no momento
export const verificarDisponibilidade = (horarioFuncionamento: Assessoria['horarioFuncionamento']): boolean => {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  
  // Verifica se hoje é um dia de funcionamento
  if (!horarioFuncionamento.diasFuncionamento.includes(diaSemana)) {
    return false;
  }
  
  // Obtém a hora e minuto atual
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  
  // Converte a hora atual para minutos desde meia-noite
  const minutosAtuais = horaAtual * 60 + minutoAtual;
  
  // Converte a hora de início para minutos desde meia-noite
  const [horaInicio, minutoInicio] = horarioFuncionamento.inicio.split(':').map(Number);
  const minutosInicio = horaInicio * 60 + minutoInicio;
  
  // Converte a hora de fim para minutos desde meia-noite
  const [horaFim, minutoFim] = horarioFuncionamento.fim.split(':').map(Number);
  const minutosFim = horaFim * 60 + minutoFim;
  
  // Verifica se o horário atual está dentro do horário de funcionamento
  return minutosAtuais >= minutosInicio && minutosAtuais <= minutosFim;
};

// Formatar o horário de funcionamento para exibição
export const formatarHorarioFuncionamento = (horario: Assessoria['horarioFuncionamento']) => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const diasFormatados = horario.diasFuncionamento.map(dia => diasSemana[dia]);
  
  // Agrupar dias consecutivos (ex: "Segunda a Sexta" em vez de "Segunda, Terça, Quarta, Quinta, Sexta")
  let resultado = '';
  let inicio = -1;
  let fim = -1;
  
  for (let i = 0; i <= horario.diasFuncionamento.length; i++) {
    if (i < horario.diasFuncionamento.length && (i === 0 || horario.diasFuncionamento[i] === horario.diasFuncionamento[i-1] + 1)) {
      if (inicio === -1) inicio = horario.diasFuncionamento[i];
      fim = horario.diasFuncionamento[i];
    } else if (inicio !== -1) {
      if (resultado) resultado += ', ';
      if (inicio === fim) {
        resultado += diasSemana[inicio];
      } else if (fim - inicio === 1) {
        resultado += `${diasSemana[inicio]}, ${diasSemana[fim]}`;
      } else {
        resultado += `${diasSemana[inicio]} a ${diasSemana[fim]}`;
      }
      inicio = -1;
    }
  }
  
  return `${resultado} das ${horario.inicio} às ${horario.fim}`;
};
