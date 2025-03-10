
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Conversa, Usuario } from "@/types/chat.types";
import { Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ListaConversasProps {
  conversas: Conversa[];
  usuarioAtual: Usuario;
  conversaAtiva: Conversa | null;
  onSelectConversa: (conversa: Conversa) => void;
}

export function ListaConversas({ 
  conversas, 
  usuarioAtual, 
  conversaAtiva, 
  onSelectConversa 
}: ListaConversasProps) {
  const [filtro, setFiltro] = useState("");
  
  const conversasFiltradas = conversas.filter(conversa => {
    const outroParticipante = conversa.participantes.find(p => p.id !== usuarioAtual.id);
    return outroParticipante?.nome.toLowerCase().includes(filtro.toLowerCase());
  });

  const formatarData = (isoData: string) => {
    const dataMsg = new Date(isoData);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    if (dataMsg.toDateString() === hoje.toDateString()) {
      return format(dataMsg, "HH:mm", { locale: ptBR });
    } else if (dataMsg.toDateString() === ontem.toDateString()) {
      return "Ontem";
    } else {
      return format(dataMsg, "dd/MM/yyyy", { locale: ptBR });
    }
  };

  const obterOutroParticipante = (conversa: Conversa) => {
    return conversa.participantes.find(p => p.id !== usuarioAtual.id) || conversa.participantes[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Conversas</h3>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conversa..."
          className="pl-8"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      
      <div className="space-y-1">
        {conversasFiltradas.length > 0 ? (
          conversasFiltradas.map(conversa => {
            const outroParticipante = obterOutroParticipante(conversa);
            const mensagem = conversa.ultimaMensagem;
            const isAtiva = conversaAtiva?.id === conversa.id;
            
            return (
              <div
                key={conversa.id}
                className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-accent ${
                  isAtiva ? "bg-accent" : ""
                }`}
                onClick={() => onSelectConversa(conversa)}
              >
                <Avatar>
                  <AvatarImage src={outroParticipante.avatar} />
                  <AvatarFallback>
                    {outroParticipante.nome.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{outroParticipante.nome}</p>
                    {mensagem && (
                      <span className="text-xs text-muted-foreground">
                        {formatarData(mensagem.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {mensagem && (
                      <p className={`text-sm truncate ${!mensagem.lida && mensagem.usuario.id !== usuarioAtual.id ? "font-semibold" : "text-muted-foreground"}`}>
                        {mensagem.usuario.id === usuarioAtual.id ? "Você: " : ""}{mensagem.conteudo}
                      </p>
                    )}
                    
                    {conversa.naoLidas > 0 && (
                      <Badge variant="destructive" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                        {conversa.naoLidas}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Nenhuma conversa encontrada
          </div>
        )}
      </div>
    </div>
  );
}
