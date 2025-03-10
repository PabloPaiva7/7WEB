
import { useRef, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send } from "lucide-react";
import { Conversa, Mensagem, Usuario } from "@/types/chat.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface CaixaMensagensProps {
  mensagens: Mensagem[];
  usuarioAtual: Usuario;
  conversa: Conversa;
  onEnviarMensagem: (mensagem: string) => void;
}

export function CaixaMensagens({ 
  mensagens, 
  usuarioAtual, 
  conversa, 
  onEnviarMensagem 
}: CaixaMensagensProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [mensagemTexto, setMensagemTexto] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnviar = () => {
    if (mensagemTexto.trim()) {
      onEnviarMensagem(mensagemTexto);
      setMensagemTexto("");
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const outroParticipante = conversa.participantes.find(p => p.id !== usuarioAtual.id) || conversa.participantes[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 border-b">
        <Avatar className="h-8 w-8">
          <AvatarImage src={outroParticipante.avatar} />
          <AvatarFallback>
            {outroParticipante.nome.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p className="font-medium">{outroParticipante.nome}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem, index) => {
          const isUsuarioAtual = mensagem.usuario.id === usuarioAtual.id;
          const data = new Date(mensagem.timestamp);
          const dataFormatada = format(data, "dd MMM, HH:mm", { locale: ptBR });
          
          // Verificar se devemos exibir cabeçalho de data
          const showDateHeader = index === 0 || 
            format(data, "yyyy-MM-dd") !== 
            format(new Date(mensagens[index - 1].timestamp), "yyyy-MM-dd");
          
          return (
            <div key={mensagem.id}>
              {showDateHeader && (
                <div className="flex items-center justify-center my-4">
                  <Separator className="flex-grow" />
                  <span className="mx-2 text-xs text-muted-foreground">
                    {format(data, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <Separator className="flex-grow" />
                </div>
              )}
              
              <div className={`flex ${isUsuarioAtual ? "justify-end" : "justify-start"}`}>
                <div className={`flex ${isUsuarioAtual ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}>
                  {!isUsuarioAtual && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mensagem.usuario.avatar} />
                      <AvatarFallback>
                        {mensagem.usuario.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`p-3 rounded-lg ${
                    isUsuarioAtual 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-muted rounded-bl-none"
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{mensagem.conteudo}</p>
                    <p className={`text-xs mt-1 ${
                      isUsuarioAtual ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>
                      {dataFormatada}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Digite sua mensagem..."
            value={mensagemTexto}
            onChange={(e) => setMensagemTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
          />
          <Button onClick={handleEnviar} size="icon" className="h-10 w-10 shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const useState = window.React.useState;
