
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Demanda } from "@/types/demanda";

type DemandaNotification = {
  id: string;
  demandaId: string;
  titulo: string;
  tipo: 'nova' | 'atualizada' | 'confirmada' | 'finalizada';
  lida: boolean;
  data: Date;
};

export function useDemandaNotifications(demandas: Demanda[]) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DemandaNotification[]>([]);
  
  useEffect(() => {
    // Em uma implementação real, buscaríamos as notificações do Supabase
    // Por enquanto, vamos gerar notificações fictícias
    
    if (user && demandas.length > 0) {
      const demandasDoUsuario = demandas.filter(d => 
        d.responsavel === user.id || 
        (d.colaborador && d.colaborador.id === user.id)
      );
      
      const notificacoesSimuladas: DemandaNotification[] = demandasDoUsuario.map(demanda => ({
        id: `notif-${demanda.id}`,
        demandaId: demanda.id,
        titulo: demanda.titulo,
        tipo: demanda.status === 'pendente' ? 'nova' : 
              demanda.status === 'confirmado' ? 'confirmada' : 
              demanda.status === 'finalizada' ? 'finalizada' : 'atualizada',
        lida: false,
        data: new Date()
      }));
      
      setNotifications(notificacoesSimuladas);
    }
  }, [user, demandas]);
  
  const marcarComoLida = (notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, lida: true } 
          : notif
      )
    );
  };
  
  const marcarTodasComoLidas = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, lida: true }))
    );
  };
  
  const notificacoesNaoLidas = notifications.filter(n => !n.lida);
  
  return {
    notifications,
    notificacoesNaoLidas,
    totalNaoLidas: notificacoesNaoLidas.length,
    marcarComoLida,
    marcarTodasComoLidas
  };
}
