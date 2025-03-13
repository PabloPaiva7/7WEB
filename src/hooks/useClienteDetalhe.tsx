
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Cliente {
  id: string;
  contrato: string;
  banco: string | null;
  valor_cliente: number | null;
  escritorio: string | null;
  data: string | null;
  situacao: string | null;
  codigo: string | null;
  contato: string | null;
  created_at: string;
  entrada: string | null;
  negociacao: string | null;
  prazo: string | null;
  resolucao: string | null;
  ultimo_pagamento: string | null;
  upload_id: string | null;
}

export const useClienteDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("carteira_clientes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar cliente:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do cliente."
        });
        navigate("/");
        return;
      }

      if (data) {
        console.log("Dados do cliente:", data);
        setCliente(data);
      }
      
      setLoading(false);
    };

    fetchCliente();
  }, [id, navigate, toast]);

  const updateClienteFields = async (fields: Partial<Cliente>) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("carteira_clientes")
        .update(fields)
        .eq("id", id);
        
      if (error) throw error;
      
      if (cliente) {
        setCliente({ ...cliente, ...fields });
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar os dados do cliente."
      });
      return false;
    }
  };

  return {
    cliente,
    loading,
    updateClienteFields
  };
};
