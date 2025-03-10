
import React, { useState } from "react";
import { NovoTicketForm } from "@/components/Tickets/NovoTicketForm";
import { TicketCard } from "@/components/Tickets/TicketCard";
import { ProgressoTicketDialog } from "@/components/Tickets/ProgressoTicketDialog";
import { TicketDetalhesDialog } from "@/components/Tickets/TicketDetalhesDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, TicketStatus } from "@/types/ticket.types";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter } from "lucide-react";
import { v4 as uuidv4 } from "@/lib/utils";

const Tickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  
  const [ticketProgressoId, setTicketProgressoId] = useState<string | null>(null);
  const [progressoDialogOpen, setProgressoDialogOpen] = useState(false);
  
  const [ticketDetalhe, setTicketDetalhe] = useState<Ticket | null>(null);
  const [detalheDialogOpen, setDetalheDialogOpen] = useState(false);

  const handleNovoTicket = (data: any) => {
    const novoTicket: Ticket = {
      id: uuidv4(),
      clienteNome: data.clienteNome,
      clienteContato: data.clienteContato,
      oferta: data.oferta,
      valor: data.valor,
      data: new Date().toISOString(),
      banco: data.banco,
      status: 'novo',
      atendente: data.atendente,
      progressos: []
    };
    
    setTickets([novoTicket, ...tickets]);
    toast({
      title: "Ticket criado",
      description: `Ticket para ${data.clienteNome} criado com sucesso.`
    });
  };

  const handleStatusChange = (id: string, novoStatus: string) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === id) {
          toast({
            title: "Status atualizado",
            description: `Ticket alterado para ${novoStatus}`
          });
          return { ...ticket, status: novoStatus as TicketStatus };
        }
        return ticket;
      })
    );
  };

  const handleAdicionarProgresso = (id: string) => {
    setTicketProgressoId(id);
    setProgressoDialogOpen(true);
  };

  const handleSubmitProgresso = (ticketId: string, data: any) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const novoProgresso = {
            id: uuidv4(),
            ticketId,
            data: new Date().toISOString(),
            descricao: data.descricao,
            usuario: data.usuario
          };
          
          const progressos = [...ticket.progressos, novoProgresso];
          
          toast({
            title: "Progresso registrado",
            description: "Detalhes do progresso da negociação foram salvos."
          });
          
          return { ...ticket, progressos };
        }
        return ticket;
      })
    );
  };

  const handleAbrirDetalhes = (ticket: Ticket) => {
    setTicketDetalhe(ticket);
    setDetalheDialogOpen(true);
  };

  const ticketsFiltrados = tickets.filter((ticket) => {
    const matchesFiltro = 
      ticket.clienteNome.toLowerCase().includes(filtro.toLowerCase()) ||
      ticket.banco.toLowerCase().includes(filtro.toLowerCase()) ||
      ticket.oferta.toLowerCase().includes(filtro.toLowerCase());
    
    return statusFiltro === "todos" || ticket.status === statusFiltro 
      ? matchesFiltro
      : false;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets de Ofertas</h1>
        <NovoTicketForm onSubmit={handleNovoTicket} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Pesquisar tickets..." 
            className="pl-9"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <Tabs 
          defaultValue="todos" 
          className="w-full" 
          onValueChange={(value) => setStatusFiltro(value)}
        >
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="novo">Novos</TabsTrigger>
            <TabsTrigger value="encaminhado">Encaminhados</TabsTrigger>
            <TabsTrigger value="confirmado">Confirmados</TabsTrigger>
            <TabsTrigger value="finalizado">Finalizados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {ticketsFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ticketsFiltrados.map((ticket) => (
            <div 
              key={ticket.id} 
              className="cursor-pointer" 
              onClick={() => handleAbrirDetalhes(ticket)}
            >
              <TicketCard 
                ticket={ticket} 
                onStatusChange={(id, status) => {
                  // Prevent dialog from opening when clicking buttons
                  setTimeout(() => handleStatusChange(id, status), 0);
                }}
                onAdicionarProgresso={(id) => {
                  // Prevent dialog from opening when clicking buttons
                  setTimeout(() => handleAdicionarProgresso(id), 0);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum ticket encontrado</p>
          <p className="text-sm text-muted-foreground mt-2">
            {tickets.length === 0 
              ? "Crie um novo ticket usando o botão acima"
              : "Tente ajustar seus filtros de pesquisa"}
          </p>
        </div>
      )}
      
      <ProgressoTicketDialog 
        ticketId={ticketProgressoId}
        open={progressoDialogOpen}
        onOpenChange={setProgressoDialogOpen}
        onSubmit={handleSubmitProgresso}
      />
      
      <TicketDetalhesDialog 
        ticket={ticketDetalhe}
        open={detalheDialogOpen}
        onOpenChange={setDetalheDialogOpen}
        onAdicionarProgresso={handleAdicionarProgresso}
      />
    </div>
  );
};

export default Tickets;
