
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "Concluído":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Pendente":
      return <Badge variant="outline" className="text-yellow-600 border-yellow-500">{status}</Badge>;
    case "Cancelado":
      return <Badge variant="destructive">{status}</Badge>;
    case "Processando":
      return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
