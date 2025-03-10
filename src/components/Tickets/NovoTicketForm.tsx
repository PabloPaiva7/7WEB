
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { v4 } from "@/lib/utils";
import { Ticket } from "@/types/ticket.types";

interface NovoTicketFormProps {
  onSave: (ticket: Ticket) => void;
  onCancel: () => void;
}

export function NovoTicketForm({ onSave, onCancel }: NovoTicketFormProps) {
  const { toast } = useToast();
  const [clienteNome, setClienteNome] = useState("");
  const [clienteContato, setClienteContato] = useState("");
  const [oferta, setOferta] = useState("");
  const [valor, setValor] = useState("");
  const [banco, setBanco] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!clienteNome || !clienteContato || !oferta || !valor || !banco) {
      toast({
        variant: "destructive",
        title: "Erro ao criar ticket",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }
    
    // Criação do novo ticket
    const novoTicket: Ticket = {
      id: v4(),
      clienteNome,
      clienteContato,
      oferta,
      valor: parseFloat(valor), // Convertendo string para número
      data: new Date().toISOString(),
      banco,
      status: "novo",
      atendente: "Atendente Atual", // Em um sistema real, seria o usuário logado
      progressos: []
    };
    
    onSave(novoTicket);
    
    toast({
      title: "Ticket criado com sucesso",
      description: "O ticket foi adicionado à lista de tickets."
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clienteNome">Nome do Cliente</Label>
          <Input
            id="clienteNome"
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
            placeholder="Nome completo do cliente"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clienteContato">Contato</Label>
          <Input
            id="clienteContato"
            value={clienteContato}
            onChange={(e) => setClienteContato(e.target.value)}
            placeholder="Telefone ou e-mail"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="oferta">Descrição da Oferta</Label>
        <Input
          id="oferta"
          value={oferta}
          onChange={(e) => setOferta(e.target.value)}
          placeholder="Detalhes da oferta"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor</Label>
          <Input
            id="valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor da oferta"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="banco">Banco</Label>
          <Select value={banco} onValueChange={setBanco}>
            <SelectTrigger id="banco">
              <SelectValue placeholder="Selecione o banco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Banco A">Banco A</SelectItem>
              <SelectItem value="Banco B">Banco B</SelectItem>
              <SelectItem value="Banco C">Banco C</SelectItem>
              <SelectItem value="Banco D">Banco D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Ticket</Button>
      </div>
    </form>
  );
}
