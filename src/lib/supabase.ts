
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Credenciais do Supabase não encontradas');
    return createClient('https://placeholder.supabase.co', 'placeholder');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

export type CarteiraUpload = {
  id: string;
  nome_arquivo: string;
  data_upload: string;
  registros_importados: number;
};

export type CarteiraCliente = {
  id: string;
  upload_id: string;
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
  created_at: string;
};
