
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/ticket.types";
import { formatCurrency } from "@/lib/utils";

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (id: string, novoStatus: string) => void;
  onAdicionarProgresso: (id: string) => void;
}

export function TicketCard({ ticket, onStatusChange, onAdicionarProgresso }: TicketCardProps) {
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

  const getNextStatusOptions = () => {
    switch (ticket.status) {
      case 'novo':
        return [
          { value: 'encaminhado', label: 'Encaminhar para banco' }
        ];
      case 'encaminhado':
        return [
          { value: 'confirmado', label: 'Confirmar com banco' }
        ];
      case 'confirmado':
        return [
          { value: 'finalizado', label: 'Finalizar negociação' }
        ];
      default:
        return [];
    }
  };

  const nextStatusOptions = getNextStatusOptions();

  return (
    <Card className="w-full shadow-md card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{ticket.clienteNome}</CardTitle>
          <Badge className={getStatusColor(ticket.status)}>{getStatusText(ticket.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Contato:</span>
            <span className="text-sm font-medium">{ticket.clienteContato}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Banco:</span>
            <span className="text-sm font-medium">{ticket.banco}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Valor:</span>
            <span className="text-sm font-medium">{formatCurrency(ticket.valor)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Atendente:</span>
            <span className="text-sm font-medium">{ticket.atendente}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block mb-1">Oferta:</span>
            <div className="bg-gray-50 p-2 rounded text-sm">{ticket.oferta}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        {nextStatusOptions.map((option) => (
          <Button 
            key={option.value}
            onClick={() => onStatusChange(ticket.id, option.value)}
            className="w-full"
            variant={option.value === 'encaminhado' ? 'destructive' : 'default'}
          >
            {option.label}
          </Button>
        ))}
        {ticket.status === 'confirmado' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onAdicionarProgresso(ticket.id)}
          >
            Registrar progresso
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
