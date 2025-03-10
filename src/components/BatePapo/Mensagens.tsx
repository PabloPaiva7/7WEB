
import { useState, useEffect } from "react";
import { v4 } from "@/lib/utils";
import { Conversa, Mensagem, Usuario } from "@/types/chat.types";
import { ListaConversas } from "./ListaConversas";
import { CaixaMensagens } from "./CaixaMensagens";
import { Card } from "@/components/ui/card";

// Usuário fictício logado
const usuarioAtual: Usuario = {
  id: "user1",
  nome: "Maria Silva",
  avatar: "https://i.pravatar.cc/150?u=maria"
};

// Dados de exemplo
const usuariosMock: Usuario[] = [
  {
    id: "user2",
    nome: "João Oliveira",
    avatar: "https://i.pravatar.cc/150?u=joao"
  },
  {
    id: "user3",
    nome: "Ana Santos",
    avatar: "https://i.pravatar.cc/150?u=ana"
  },
  {
    id: "user4",
    nome: "Carlos Pereira",
    avatar: "https://i.pravatar.cc/150?u=carlos"
  }
];

const conversasMock: Conversa[] = [
  {
    id: "conv1",
    participantes: [usuarioAtual, usuariosMock[0]],
    ultimaMensagem: {
      id: "msg1",
      conteudo: "Bom dia! Como estão os preparativos para a reunião?",
      usuario: usuariosMock[0],
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      lida: false
    },
    naoLidas: 1
  },
  {
    id: "conv2",
    participantes: [usuarioAtual, usuariosMock[1]],
    ultimaMensagem: {
      id: "msg2",
      conteudo: "Você viu o relatório de ontem?",
      usuario: usuariosMock[1],
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      lida: true
    },
    naoLidas: 0
  },
  {
    id: "conv3",
    participantes: [usuarioAtual, usuariosMock[2]],
    ultimaMensagem: {
      id: "msg3",
      conteudo: "Precisamos revisar aquela proposta.",
      usuario: usuarioAtual,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      lida: true
    },
    naoLidas: 0
  }
];

const mensagensMock: Record<string, Mensagem[]> = {
  "conv1": [
    {
      id: "msg1-1",
      conteudo: "Olá! Tudo bem?",
      usuario: usuariosMock[0],
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      lida: true
    },
    {
      id: "msg1-2",
      conteudo: "Estou bem, obrigada! E você?",
      usuario: usuarioAtual,
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      lida: true
    },
    {
      id: "msg1-3",
      conteudo: "Bom dia! Como estão os preparativos para a reunião?",
      usuario: usuariosMock[0],
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      lida: false
    }
  ],
  "conv2": [
    {
      id: "msg2-1",
      conteudo: "Olá Ana, preciso da sua ajuda.",
      usuario: usuarioAtual,
      timestamp: new Date(Date.now() - 172900000).toISOString(),
      lida: true
    },
    {
      id: "msg2-2",
      conteudo: "Você viu o relatório de ontem?",
      usuario: usuariosMock[1],
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      lida: true
    }
  ],
  "conv3": [
    {
      id: "msg3-1",
      conteudo: "Precisamos revisar aquela proposta.",
      usuario: usuarioAtual,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      lida: true
    }
  ]
};

export function Mensagens() {
  const [conversas, setConversas] = useState<Conversa[]>(conversasMock);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  useEffect(() => {
    if (conversaAtiva) {
      // Marcar mensagens como lidas
      const mensagensAtualizadas = mensagensMock[conversaAtiva.id].map(msg => {
        if (msg.usuario.id !== usuarioAtual.id) {
          return { ...msg, lida: true };
        }
        return msg;
      });
      
      setMensagens(mensagensAtualizadas);
      
      // Atualizar conversas para mostrar todas mensagens como lidas
      setConversas(prevConversas => 
        prevConversas.map(conv => 
          conv.id === conversaAtiva.id 
            ? { ...conv, naoLidas: 0 } 
            : conv
        )
      );
    }
  }, [conversaAtiva]);

  const enviarMensagem = (texto: string) => {
    if (!conversaAtiva) return;
    
    const novaMensagem: Mensagem = {
      id: v4(),
      conteudo: texto,
      usuario: usuarioAtual,
      timestamp: new Date().toISOString(),
      lida: true
    };
    
    // Atualizar mensagens locais
    const novasMensagens = [...mensagens, novaMensagem];
    setMensagens(novasMensagens);
    
    // Atualizar conversas
    setConversas(prevConversas => 
      prevConversas.map(conv => 
        conv.id === conversaAtiva.id 
          ? { 
              ...conv, 
              ultimaMensagem: novaMensagem
            } 
          : conv
      )
    );
    
    // Atualizar mensagens mock para persistência local
    mensagensMock[conversaAtiva.id] = novasMensagens;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-13rem)]">
      <Card className="p-4 md:col-span-1 overflow-y-auto">
        <ListaConversas 
          conversas={conversas} 
          usuarioAtual={usuarioAtual}
          conversaAtiva={conversaAtiva}
          onSelectConversa={setConversaAtiva} 
        />
      </Card>
      
      <Card className="p-4 md:col-span-2 flex flex-col h-full">
        {conversaAtiva ? (
          <CaixaMensagens 
            mensagens={mensagens}
            usuarioAtual={usuarioAtual}
            conversa={conversaAtiva}
            onEnviarMensagem={enviarMensagem}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Selecione uma conversa para começar
          </div>
        )}
      </Card>
    </div>
  );
}
