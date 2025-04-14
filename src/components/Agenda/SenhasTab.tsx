
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Copy, Pencil, Trash2 } from 'lucide-react';
import { Senha } from "@/types/agenda.types";

interface SenhasTabProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const SenhasTab = ({ searchTerm, setSearchTerm }: SenhasTabProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSenha, setCurrentSenha] = useState<Omit<Senha, "id" | "ultimaAtualizacao">>({
    nome: "",
    sistema: "",
    url: "",
    usuario: "",
    senha: "",
    observacoes: ""
  });
  const [newSenha, setNewSenha] = useState<Omit<Senha, "id" | "ultimaAtualizacao">>({
    nome: "",
    sistema: "",
    url: "",
    usuario: "",
    senha: "",
    observacoes: ""
  });
  const [senhas, setSenhas] = useState<Senha[]>([]);
  const [selectedSenhaId, setSelectedSenhaId] = useState<string | null>(null);

  const handleAddSenha = () => {
    if (!newSenha.nome || !newSenha.sistema || !newSenha.usuario || !newSenha.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const novaSenha: Senha = {
      id: uuidv4(),
      nome: newSenha.nome,
      sistema: newSenha.sistema,
      url: newSenha.url,
      usuario: newSenha.usuario,
      senha: newSenha.senha,
      observacoes: newSenha.observacoes,
      ultimaAtualizacao: new Date().toISOString()
    };

    setSenhas([...senhas, novaSenha]);
    setOpen(false);
    
    toast({
      title: "Senha adicionada",
      description: "A senha foi adicionada com sucesso.",
    });

    setNewSenha({
      nome: "",
      sistema: "",
      url: "",
      usuario: "",
      senha: "",
      observacoes: ""
    });
  };

  const handleEditClick = (senha: Senha) => {
    setCurrentSenha({
      nome: senha.nome,
      sistema: senha.sistema,
      url: senha.url, 
      usuario: senha.usuario,
      senha: senha.senha,
      observacoes: senha.observacoes
    });
    setEditDialogOpen(true);
  };

  const handleUpdateSenha = () => {
    if (!currentSenha.nome || !currentSenha.sistema || !currentSenha.usuario || !currentSenha.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedSenhas = senhas.map(senha => {
      if (senha.id === selectedSenhaId) {
        return {
          ...senha,
          nome: currentSenha.nome,
          sistema: currentSenha.sistema,
          url: currentSenha.url,
          usuario: currentSenha.usuario,
          senha: currentSenha.senha,
          observacoes: currentSenha.observacoes,
          ultimaAtualizacao: new Date().toISOString()
        };
      }
      return senha;
    });

    setSenhas(updatedSenhas);
    setEditDialogOpen(false);

    toast({
      title: "Senha atualizada",
      description: "A senha foi atualizada com sucesso.",
    });
  };

  const handleDeleteSenha = (id: string) => {
    setSenhas(senhas.filter(senha => senha.id !== id));
    toast({
      title: "Senha removida",
      description: "A senha foi removida com sucesso.",
    });
  };

  const filteredSenhas = senhas.filter(senha =>
    senha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    senha.sistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    senha.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado para a área de transferência",
      description: "Senha copiada com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senhas</CardTitle>
        <CardDescription>
          Gerencie suas senhas de forma segura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Buscar senha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Senha</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Senha</DialogTitle>
                <DialogDescription>
                  Preencha os dados para adicionar uma nova senha.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input 
                      id="nome" 
                      placeholder="Nome da senha" 
                      value={newSenha.nome}
                      onChange={(e) => setNewSenha({...newSenha, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sistema">Sistema</Label>
                    <Input 
                      id="sistema" 
                      placeholder="Nome do sistema" 
                      value={newSenha.sistema}
                      onChange={(e) => setNewSenha({...newSenha, sistema: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="URL do sistema"
                    value={newSenha.url}
                    onChange={(e) => setNewSenha({ ...newSenha, url: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuário</Label>
                    <Input
                      id="usuario"
                      placeholder="Usuário"
                      value={newSenha.usuario}
                      onChange={(e) => setNewSenha({ ...newSenha, usuario: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      placeholder="Senha"
                      type="password"
                      value={newSenha.senha}
                      onChange={(e) => setNewSenha({ ...newSenha, senha: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    placeholder="Observações"
                    value={newSenha.observacoes}
                    onChange={(e) => setNewSenha({ ...newSenha, observacoes: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddSenha}>Adicionar</Button>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Sistema</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSenhas.map((senha) => (
                <TableRow key={senha.id}>
                  <TableCell>{senha.nome}</TableCell>
                  <TableCell>{senha.sistema}</TableCell>
                  <TableCell>{senha.usuario}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedSenhaId(senha.id);
                          handleEditClick(senha);
                        }}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(senha.senha)}>
                          <Copy className="mr-2 h-4 w-4" /> Copiar Senha
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteSenha(senha.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Senha</DialogTitle>
              <DialogDescription>
                Edite os dados da senha selecionada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Nome da senha"
                    value={currentSenha.nome}
                    onChange={(e) => setCurrentSenha({ ...currentSenha, nome: e.target.value })}
                  />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="sistema">Sistema</Label>
                    <Input 
                      id="sistema" 
                      placeholder="Nome do sistema" 
                      value={currentSenha.sistema}
                      onChange={(e) => setCurrentSenha({...currentSenha, sistema: e.target.value})}
                    />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="URL do sistema"
                  value={currentSenha.url}
                  onChange={(e) => setCurrentSenha({ ...currentSenha, url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuário</Label>
                  <Input
                    id="usuario"
                    placeholder="Usuário"
                    value={currentSenha.usuario}
                    onChange={(e) => setCurrentSenha({ ...currentSenha, usuario: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    placeholder="Senha"
                    type="password"
                    value={currentSenha.senha}
                    onChange={(e) => setCurrentSenha({ ...currentSenha, senha: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  placeholder="Observações"
                  value={currentSenha.observacoes}
                  onChange={(e) => setCurrentSenha({ ...currentSenha, observacoes: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleUpdateSenha}>Atualizar</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
