
import { useState } from "react";
import { v4 } from "@/lib/utils";
import { Ideia, Usuario } from "@/types/chat.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, MessageCircle, Lightbulb, CalendarDays, Plus, Search } from "lucide-react";

// Usuário fictício atual
const usuarioAtual: Usuario = {
  id: "user1",
  nome: "Maria Silva",
  avatar: "https://i.pravatar.cc/150?u=maria"
};

// Dados de exemplo
const usuariosMock: Usuario[] = [
  usuarioAtual,
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

const ideiasIniciais: Ideia[] = [
  {
    id: "i1",
    titulo: "Implementar chat com IA para atendimento",
    descricao: "Poderíamos implementar um chatbot com IA para responder perguntas frequentes dos clientes e agilizar o atendimento inicial.",
    autor: usuariosMock[1],
    likes: 7,
    comentarios: 3,
    dataCriacao: new Date(Date.now() - 172800000).toISOString(),
    tags: ["inovação", "atendimento", "tecnologia"]
  },
  {
    id: "i2",
    titulo: "Criar programa de fidelidade",
    descricao: "Podemos criar um programa de pontos para clientes que trazem mais negócios, oferecendo benefícios exclusivos.",
    autor: usuariosMock[2],
    likes: 5,
    comentarios: 2,
    dataCriacao: new Date(Date.now() - 432000000).toISOString(),
    tags: ["marketing", "relacionamento", "fidelização"]
  },
  {
    id: "i3",
    titulo: "Melhorar processo de análise de crédito",
    descricao: "Podemos otimizar nosso fluxo de análise de crédito para reduzir o tempo de resposta aos clientes.",
    autor: usuariosMock[0],
    likes: 3,
    comentarios: 4,
    dataCriacao: new Date(Date.now() - 604800000).toISOString(),
    tags: ["processos", "crédito", "eficiência"]
  }
];

export function Ideias() {
  const [ideias, setIdeias] = useState<Ideia[]>(ideiasIniciais);
  const [busca, setBusca] = useState("");
  const [ideiasCurtidas, setIdeiasCurtidas] = useState<Record<string, boolean>>({});
  const [novaIdeia, setNovaIdeia] = useState<Partial<Ideia>>({
    titulo: "",
    descricao: "",
    tags: []
  });
  const [tagsInput, setTagsInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filtrar ideias com base na busca
  const ideiasFiltradas = ideias.filter(ideia => 
    ideia.titulo.toLowerCase().includes(busca.toLowerCase()) || 
    ideia.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    ideia.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
  );

  const handleLike = (id: string) => {
    setIdeiasCurtidas(prev => {
      const novoEstado = { ...prev };
      novoEstado[id] = !novoEstado[id];
      return novoEstado;
    });

    setIdeias(ideias.map(ideia => {
      if (ideia.id === id) {
        return {
          ...ideia,
          likes: ideiasCurtidas[id] ? ideia.likes - 1 : ideia.likes + 1
        };
      }
      return ideia;
    }));
  };

  const handleAddIdeia = () => {
    if (!novaIdeia.titulo) return;
    
    // Processar tags
    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    
    const ideia: Ideia = {
      id: v4(),
      titulo: novaIdeia.titulo,
      descricao: novaIdeia.descricao || "",
      autor: usuarioAtual,
      likes: 0,
      comentarios: 0,
      dataCriacao: new Date().toISOString(),
      tags
    };
    
    setIdeias([ideia, ...ideias]);
    
    // Resetar form
    setNovaIdeia({
      titulo: "",
      descricao: "",
      tags: []
    });
    setTagsInput("");
    
    setDialogOpen(false);
  };

  const formatarTempo = (data: string) => {
    return formatDistanceToNow(new Date(data), {
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ideias..."
            className="pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ideia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartilhar Nova Ideia</DialogTitle>
              <DialogDescription>
                Compartilhe sua ideia com a equipe para discutir e melhorar os processos.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título da Ideia</Label>
                <Input
                  id="titulo"
                  value={novaIdeia.titulo}
                  onChange={(e) => setNovaIdeia({...novaIdeia, titulo: e.target.value})}
                  placeholder="Um título claro e conciso"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novaIdeia.descricao}
                  onChange={(e) => setNovaIdeia({...novaIdeia, descricao: e.target.value})}
                  placeholder="Descreva sua ideia em detalhes"
                  rows={4}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: inovação, atendimento, tecnologia"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddIdeia}>Compartilhar Ideia</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {ideiasFiltradas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideiasFiltradas.map((ideia) => (
            <Card key={ideia.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={ideia.autor.avatar} />
                      <AvatarFallback>
                        {ideia.autor.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{ideia.autor.nome}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {formatarTempo(ideia.dataCriacao)}
                      </p>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{ideia.titulo}</CardTitle>
                <CardDescription className="flex flex-wrap gap-1 mt-1">
                  {ideia.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm">{ideia.descricao}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={ideiasCurtidas[ideia.id] ? "text-red-500" : ""}
                    onClick={() => handleLike(ideia.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${ideiasCurtidas[ideia.id] ? "fill-current" : ""}`} />
                    {ideia.likes}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {ideia.comentarios}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhuma ideia encontrada</h3>
          <p className="text-muted-foreground mt-1">
            {busca 
              ? "Nenhuma ideia corresponde à sua busca." 
              : "Compartilhe a primeira ideia com a equipe!"}
          </p>
          {busca && (
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setBusca("")}
            >
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
