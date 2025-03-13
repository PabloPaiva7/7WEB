
import { useState, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Copy, Plus, Pencil, Trash, Key } from "lucide-react";
import { Senha } from "@/types/agenda.types";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo para senhas (em uma aplicação real, isso viria de uma API ou banco de dados)
const senhasExemplo: Senha[] = [
  {
    id: "1",
    nome: "Gmail",
    url: "https://mail.google.com",
    usuario: "usuario@gmail.com",
    senha: "senha123",
    ultimaAtualizacao: "2023-10-15"
  },
  {
    id: "2",
    nome: "Banco Itaú",
    url: "https://www.itau.com.br",
    usuario: "123456789",
    senha: "senhabanco456",
    observacoes: "Agência: 1234 / Conta: 56789-0",
    ultimaAtualizacao: "2023-11-20"
  },
  {
    id: "3",
    nome: "Sistema Interno",
    url: "https://intranet.empresa.com.br",
    usuario: "funcionario123",
    senha: "empresaXYZ!",
    observacoes: "Acesso à intranet da empresa",
    ultimaAtualizacao: "2023-12-05"
  }
];

interface SenhasTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SenhasTab = ({ searchTerm, setSearchTerm }: SenhasTabProps) => {
  const { toast } = useToast();
  const [senhas, setSenhas] = useState<Senha[]>(senhasExemplo);
  const [senhaVisivel, setSenhaVisivel] = useState<Record<string, boolean>>({});
  const [novaSenha, setNovaSenha] = useState<Omit<Senha, "id" | "ultimaAtualizacao">>({
    nome: "",
    url: "",
    usuario: "",
    senha: "",
    observacoes: ""
  });
  const [editandoSenha, setEditandoSenha] = useState<Senha | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState(false);

  // Filtrar senhas com base no termo de busca
  const senhasFiltradas = useMemo(() => {
    if (!searchTerm) return senhas;
    
    const termLower = searchTerm.toLowerCase();
    return senhas.filter(senha => 
      senha.nome.toLowerCase().includes(termLower) ||
      senha.url.toLowerCase().includes(termLower) ||
      senha.usuario.toLowerCase().includes(termLower)
    );
  }, [senhas, searchTerm]);

  // Alternar visibilidade da senha
  const toggleSenhaVisivel = (id: string) => {
    setSenhaVisivel(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copiar para a área de transferência
  const copiarParaClipboard = (texto: string, tipo: string) => {
    navigator.clipboard.writeText(texto)
      .then(() => {
        toast({
          title: "Copiado!",
          description: `${tipo} copiado para a área de transferência.`,
        });
      })
      .catch(() => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar para a área de transferência.",
          variant: "destructive",
        });
      });
  };

  // Abrir diálogo de edição
  const abrirEdicao = (senha: Senha) => {
    setEditandoSenha(senha);
    setNovaSenha({
      nome: senha.nome,
      url: senha.url,
      usuario: senha.usuario,
      senha: senha.senha,
      observacoes: senha.observacoes || ""
    });
    setEditando(true);
    setDialogAberto(true);
  };

  // Abrir diálogo de nova senha
  const abrirNovaSenha = () => {
    setNovaSenha({
      nome: "",
      url: "",
      usuario: "",
      senha: "",
      observacoes: ""
    });
    setEditando(false);
    setDialogAberto(true);
  };

  // Salvar senha (nova ou editada)
  const salvarSenha = () => {
    if (!novaSenha.nome || !novaSenha.url || !novaSenha.usuario || !novaSenha.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const agora = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    if (editando && editandoSenha) {
      // Editando senha existente
      setSenhas(prevSenhas => 
        prevSenhas.map(s => 
          s.id === editandoSenha.id 
            ? { 
                ...s, 
                ...novaSenha, 
                ultimaAtualizacao: agora 
              } 
            : s
        )
      );
      toast({
        title: "Senha atualizada",
        description: `A senha para ${novaSenha.nome} foi atualizada com sucesso.`,
      });
    } else {
      // Nova senha
      const id = `${Date.now()}`;
      setSenhas(prev => [...prev, { 
        id, 
        ...novaSenha, 
        ultimaAtualizacao: agora 
      }]);
      toast({
        title: "Senha adicionada",
        description: `Nova senha para ${novaSenha.nome} foi adicionada com sucesso.`,
      });
    }

    setDialogAberto(false);
  };

  // Excluir senha
  const excluirSenha = (id: string) => {
    const senhaParaExcluir = senhas.find(s => s.id === id);
    if (!confirm(`Tem certeza que deseja excluir a senha para "${senhaParaExcluir?.nome}"?`)) {
      return;
    }
    
    setSenhas(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Senha excluída",
      description: `A senha para ${senhaParaExcluir?.nome} foi excluída com sucesso.`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <Key className="mr-2 h-5 w-5 text-primary" />
          Senhas
        </CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Buscar senhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={abrirNovaSenha} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {senhasFiltradas.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">Nenhuma senha encontrada.</p>
            <Button onClick={abrirNovaSenha} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Nova Senha
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Senha</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {senhasFiltradas.map((senha) => (
                  <TableRow key={senha.id}>
                    <TableCell className="font-medium">{senha.nome}</TableCell>
                    <TableCell>
                      <a 
                        href={senha.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        {senha.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{senha.usuario}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copiarParaClipboard(senha.usuario, "Usuário")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>
                          {senhaVisivel[senha.id] ? senha.senha : "••••••••"}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => toggleSenhaVisivel(senha.id)}
                        >
                          {senhaVisivel[senha.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copiarParaClipboard(senha.senha, "Senha")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{senha.ultimaAtualizacao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => abrirEdicao(senha)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => excluirSenha(senha.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Diálogo para adicionar/editar senha */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editando ? "Editar Senha" : "Adicionar Nova Senha"}
              </DialogTitle>
              <DialogDescription>
                {editando 
                  ? "Atualize as informações da senha existente." 
                  : "Preencha os detalhes para adicionar uma nova senha."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome*
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: Gmail, Banco, etc."
                  className="col-span-3"
                  value={novaSenha.nome}
                  onChange={(e) => setNovaSenha({...novaSenha, nome: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL*
                </Label>
                <Input
                  id="url"
                  placeholder="https://exemplo.com"
                  className="col-span-3"
                  value={novaSenha.url}
                  onChange={(e) => setNovaSenha({...novaSenha, url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usuario" className="text-right">
                  Usuário*
                </Label>
                <Input
                  id="usuario"
                  placeholder="Seu nome de usuário"
                  className="col-span-3"
                  value={novaSenha.usuario}
                  onChange={(e) => setNovaSenha({...novaSenha, usuario: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="senha" className="text-right">
                  Senha*
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  className="col-span-3"
                  value={novaSenha.senha}
                  onChange={(e) => setNovaSenha({...novaSenha, senha: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="observacoes" className="text-right">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais (opcional)"
                  className="col-span-3"
                  value={novaSenha.observacoes || ""}
                  onChange={(e) => setNovaSenha({...novaSenha, observacoes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={salvarSenha}>
                {editando ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SenhasTab;
