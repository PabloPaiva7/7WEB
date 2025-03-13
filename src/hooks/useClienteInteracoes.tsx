
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Interacao {
  id: string;
  data: string;
  tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
  conteudo: string;
  atendente: string;
}

export const useClienteInteracoes = (clienteId: string | undefined, onAddPagamento?: (data: string) => void) => {
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!clienteId) return;
    
    const fetchInteracoes = async () => {
      try {
        const storedInteracoes = localStorage.getItem(`interacoes-cliente-${clienteId}`);
        if (storedInteracoes) {
          setInteracoes(JSON.parse(storedInteracoes));
        }
      } catch (error) {
        console.error("Erro ao buscar interações:", error);
      }
    };

    fetchInteracoes();
  }, [clienteId]);

  const handleAddInteracao = (interacao: {
    tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
    conteudo: string;
    atendente: string;
  }) => {
    if (!clienteId) return;
    
    const novaInteracao: Interacao = {
      id: String(Date.now()),
      data: new Date().toISOString(),
      ...interacao
    };
    
    const novasInteracoes = [novaInteracao, ...interacoes];
    setInteracoes(novasInteracoes);
    
    localStorage.setItem(`interacoes-cliente-${clienteId}`, JSON.stringify(novasInteracoes));
    
    toast({
      title: "Interação adicionada",
      description: "A interação foi registrada com sucesso."
    });

    if (interacao.tipo === "pagamento" && onAddPagamento) {
      onAddPagamento(new Date().toISOString());
    }
  };

  const handleRemoveInteracao = (interacaoId: string) => {
    if (!clienteId) return;
    
    const novasInteracoes = interacoes.filter(i => i.id !== interacaoId);
    setInteracoes(novasInteracoes);
    
    localStorage.setItem(`interacoes-cliente-${clienteId}`, JSON.stringify(novasInteracoes));
    
    toast({
      title: "Interação removida",
      description: "A interação foi removida com sucesso."
    });
  };

  return {
    interacoes,
    handleAddInteracao,
    handleRemoveInteracao
  };
};
