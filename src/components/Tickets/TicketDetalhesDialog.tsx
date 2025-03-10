
import React from "react";
import { Ticket } from "@/types/ticket.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TicketProgressoCard } from "./TicketProgressoCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TicketDetalhesDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdicionarProgresso: (id: string) => void;
}

export function TicketDetalhesDialog({ 
  ticket, 
  open, 
  onOpenChange,
  onAdicionarProgresso
}: TicketDetalhesDialogProps) {
  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-100 text-blue-800';
      case 'encaminhado':
        return 'bg-red-100 text-red-800';
      case 'confirmado':
        return 'bg-amber-100 text-amber-800';
      case 'finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'novo':
        return 'Novo';
      case 'encaminhado':
        return 'Encaminhado';
      case 'confirmado':
        return 'Confirmado';
      case 'finalizado':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const dataFormatada = format(new Date(ticket.data), "dd/MM/yyyy", { locale: ptBR });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ticket - {ticket.clienteNome}</span>
            <Badge className={getStatusColor(ticket.status)}>
              {getStatusText(ticket.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <p className="text-sm text-gray-500">Cliente:</p>
            <p className="font-medium">{ticket.clienteNome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contato:</p>
            <p className="font-medium">{ticket.clienteContato}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Banco:</p>
            <p className="font-medium">{ticket.banco}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor:</p>
            <p className="font-medium">{formatCurrency(ticket.valor)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data:</p>
            <p className="font-medium">{dataFormatada}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Atendente:</p>
            <p className="font-medium">{ticket.atendente}</p>
          </div>
        </div>
        
        <div className="py-2">
          <p className="text-sm text-gray-500 mb-2">Oferta:</p>
          <div className="bg-gray-50 p-3 rounded text-sm">{ticket.oferta}</div>
        </div>
        
        <div className="py-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Histórico de Progresso</h3>
            {ticket.status === 'confirmado' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAdicionarProgresso(ticket.id)}
              >
                Registrar progresso
              </Button>
            )}
          </div>
          
          {ticket.progressos && ticket.progressos.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {ticket.progressos.map((progresso) => (
                <TicketProgressoCard key={progresso.id} progresso={progresso} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">
              Nenhum progresso registrado
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
