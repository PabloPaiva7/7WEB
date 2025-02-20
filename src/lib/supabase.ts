
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas. Por favor, verifique se o projeto está conectado ao Supabase.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CarteiraItem = {
  id: string;
  user_id: string;
  data: string;
  resolucao: string;
  contrato: string;
  escritorio: string;
  ultimo_pagamento: string;
  prazo: string;
  entrada: string;
  banco: string;
  codigo: string;
  valor_cliente: number;
  contato: string;
  negociacao: string;
  situacao: string;
};

export type Contato = {
  id: string;
  user_id: string;
  nome: string;
  telefone: string;
  email: string;
  observacoes: string;
};
