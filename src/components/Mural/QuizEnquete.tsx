
import { useState } from "react";
import { Quiz, TipoQuiz, NovoQuiz } from "@/types/mural.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Edit, Trash2, PlusCircle, BarChart } from "lucide-react";
import { QuizEnqueteForm } from "./QuizEnqueteForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QuizEnqueteProps {
  quizzes: Quiz[];
  filtroQuiz: TipoQuiz | "";
  setFiltroQuiz: (filtro: TipoQuiz | "") => void;
  onAdd: (quiz: NovoQuiz) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
  onVote: (quizId: string, opcaoId: string) => void;
  onToggleActive: (quizId: string, ativo: boolean) => void;
}

export const QuizEnquete = ({
  quizzes,
  filtroQuiz,
  setFiltroQuiz,
  onAdd,
  onEdit,
  onDelete,
  onVote,
  onToggleActive
}: QuizEnqueteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [quizParaEditar, setQuizParaEditar] = useState<Quiz | undefined>(undefined);
  const [quizParaExcluir, setQuizParaExcluir] = useState<string | null>(null);
  const [usuarioId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`); // Simulando ID de usuário

  // Filtros
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearchTerm = quiz.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filtroQuiz === "" || quiz.tipo === filtroQuiz;
    return matchesSearchTerm && matchesType;
  });

  // Ordenar por data de criação (mais recentes primeiro) e ativo
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    // Primeiro os ativos
    if (a.ativo && !b.ativo) return -1;
    if (!a.ativo && b.ativo) return 1;
    
    // Depois por data
    return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
  });

  // Verificar se o usuário já votou em um quiz
  const usuarioJaVotou = (quiz: Quiz) => {
    return quiz.respostas.some(resposta => resposta.usuarioId === usuarioId);
  };

  // Calcular total de votos para um quiz
  const totalVotos = (quiz: Quiz) => {
    return quiz.opcoes.reduce((sum, opcao) => sum + opcao.votos, 0);
  };

  // Calcular percentual de votos para uma opção
  const percentualVotos = (quiz: Quiz, opcaoId: string) => {
    const total = totalVotos(quiz);
    if (total === 0) return 0;
    
    const opcao = quiz.opcoes.find(op => op.id === opcaoId);
    if (!opcao) return 0;
    
    return Math.round((opcao.votos / total) * 100);
  };

  const handleVote = (quizId: string, opcaoId: string) => {
    onVote(quizId, opcaoId);
  };

  const handleExcluir = (id: string) => {
    setQuizParaExcluir(id);
  };

  const confirmarExclusao = () => {
    if (quizParaExcluir) {
      onDelete(quizParaExcluir);
      setQuizParaExcluir(null);
    }
  };

  const handleEditar = (quiz: Quiz) => {
    setQuizParaEditar(quiz);
    setShowAddForm(true);
  };
  
  const handleSalvar = (quiz: NovoQuiz) => {
    if (quizParaEditar) {
      onEdit({ ...quizParaEditar, ...quiz });
    } else {
      onAdd(quiz);
    }
    setShowAddForm(false);
    setQuizParaEditar(undefined);
  };

  const renderFiltros = () => (
    <div className="flex items-center space-x-2 mb-4 flex-wrap">
      <Button
        variant={filtroQuiz === "" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroQuiz("")}
      >
        Todos
      </Button>
      <Button
        variant={filtroQuiz === "opiniao" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroQuiz("opiniao")}
      >
        Opinião
      </Button>
      <Button
        variant={filtroQuiz === "conhecimento" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroQuiz("conhecimento")}
      >
        Conhecimento
      </Button>
      <Button
        variant={filtroQuiz === "preferencia" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroQuiz("preferencia")}
      >
        Preferência
      </Button>
      <Button
        variant={filtroQuiz === "feedback" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroQuiz("feedback")}
      >
        Feedback
      </Button>
      <Button
        variant={filtroQuiz === "outro" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroQuiz("outro")}
      >
        Outro
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz e Enquetes</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Enquete
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Buscar enquetes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {renderFiltros()}
      </div>

      {sortedQuizzes.length === 0 ? (
        <div className="text-center py-10">
          <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma enquete encontrada</h3>
          <p className="text-muted-foreground mt-2">
            Crie uma nova enquete ou ajuste seus filtros de busca.
          </p>
          <Button onClick={() => setShowAddForm(true)} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Enquete
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedQuizzes.map((quiz) => (
            <Card key={quiz.id} className={cn("transition-all", !quiz.ativo && "opacity-70")}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{quiz.titulo}</CardTitle>
                  <div className="flex space-x-1">
                    <Badge variant={quiz.ativo ? "default" : "outline"}>
                      {quiz.ativo ? "Ativo" : "Encerrado"}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>Criado em {format(new Date(quiz.dataCriacao), "dd/MM/yyyy", { locale: ptBR })}</span>
                  <span className="mx-1">•</span>
                  <span>por {quiz.autor}</span>
                </div>
                <Badge variant="outline" className="mt-2 w-fit">
                  {quiz.tipo.charAt(0).toUpperCase() + quiz.tipo.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm mb-4">{quiz.descricao}</p>
                <div className="space-y-2">
                  {quiz.opcoes.map((opcao) => {
                    const percent = percentualVotos(quiz, opcao.id);
                    const jaVotou = usuarioJaVotou(quiz);
                    
                    return (
                      <div key={opcao.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{opcao.texto}</span>
                          {jaVotou && <span className="text-sm">{percent}%</span>}
                        </div>
                        
                        {jaVotou ? (
                          // Mostrar progresso se já votou
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{width: `${percent}%`}}
                            />
                          </div>
                        ) : (
                          // Mostrar botão se não votou e quiz está ativo
                          quiz.ativo && (
                            <Button 
                              variant="outline" 
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => handleVote(quiz.id, opcao.id)}
                            >
                              {opcao.texto}
                            </Button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {jaVotou && (
                  <div className="mt-3 text-sm text-muted-foreground text-center">
                    <span>Total: {totalVotos(quiz)} votos</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditar(quiz)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExcluir(quiz.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Excluir
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleActive(quiz.id, !quiz.ativo)}
                >
                  {quiz.ativo ? "Encerrar" : "Reativar"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <QuizEnqueteForm
        quiz={quizParaEditar}
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setQuizParaEditar(undefined);
        }}
        onSave={handleSalvar}
      />

      <ConfirmDeleteDialog
        isOpen={!!quizParaExcluir}
        onClose={() => setQuizParaExcluir(null)}
        onConfirm={confirmarExclusao}
        title="Excluir Enquete"
        message="Tem certeza que deseja excluir esta enquete? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
