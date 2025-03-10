
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TicketProgress } from "@/types/ticket.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TicketProgressoCardProps {
  progresso: TicketProgress;
}

export function TicketProgressoCard({ progresso }: TicketProgressoCardProps) {
  const dataFormatada = format(new Date(progresso.data), "dd/MM/yyyy HH:mm", { locale: ptBR });
  
  return (
    <Card className="w-full bg-gray-50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{progresso.usuario}</span>
          <span className="text-xs text-gray-500">{dataFormatada}</span>
        </div>
        <p className="text-sm">{progresso.descricao}</p>
      </CardContent>
    </Card>
  );
}
