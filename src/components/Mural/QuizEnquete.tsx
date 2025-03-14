
import { useState } from "react";
import { Quiz, TipoQuiz } from "@/types/mural.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, ChevronRight, Clock, PlusCircle, UserCheck, Users, VoteIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { QuizEnqueteForm } from "./QuizEnqueteForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { Progress } from "@/components/ui/progress";
import { QuizDetalheDialog } from "./QuizDetalheDialog";

interface QuizEnqueteProps {
  quizzes: Quiz[];
  filtroQuiz: TipoQuiz | "";
  setFiltroQuiz: (tipo: TipoQuiz | "") => void;
  onAdd: (quiz: Omit<Quiz, "id" | "dataCriacao" | "respostas">) => void;
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
  const [showForm, setShowForm] = useState(false);
  const [quizParaEditar, setQuizParaEditar] = useState<Quiz | undefined>(undefined);
  const [quizParaExcluir, setQuizParaExcluir] = useState<string | null>(null);
  const [quizSelecionado, setQuizSelecionado] = useState<Quiz | null>(null);

  // Filtros
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearchTerm = quiz.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filtroQuiz === "" || quiz.tipo === filtroQuiz;
    return matchesSearchTerm && matchesTipo;
  });

  // Ordenar por data (mais recentes primeiro)
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
  });

  // Calcula a porcentagem de votos para uma opção
  const percentualVotos = (quiz: Quiz, opcaoId: string): number => {
    const opcao = quiz.opcoes.find(op => op.id === opcaoId);
    if (!opcao) return 0;
    
    const totalVotos = quiz.opcoes.reduce((sum, op) => sum + op.votos, 0);
    return totalVotos > 0 ? Math.round((opcao.votos / totalVotos) * 100) : 0;
  };

  // Esta função será substituída pelo estado no diálogo
  const usuarioJaVotou = (): boolean => {
    return false; // Agora sempre permitimos tentar votar
  };

  const handleEdit = (quiz: Quiz) => {
    setQuizParaEditar(quiz);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setQuizParaExcluir(id);
  };

  const confirmarExclusao = () => {
    if (quizParaExcluir) {
      onDelete(quizParaExcluir);
      setQuizParaExcluir(null);
    }
  };

  const handleFormSave = (quizData: Omit<Quiz, "id" | "dataCriacao" | "respostas">) => {
    if (quizParaEditar) {
      const quizAtualizado = {
        ...quizParaEditar,
        ...quizData
      };
      onEdit(quizAtualizado);
    } else {
      onAdd(quizData);
    }
    setShowForm(false);
    setQuizParaEditar(undefined);
  };

  const handleCardClick = (quiz: Quiz) => {
    setQuizSelecionado(quiz);
  };

  // Helper para obter rótulo do tipo de quiz
  const getTipoQuizLabel = (tipo: TipoQuiz): string => {
    const tipoMap: Record<TipoQuiz, string> = {
      "opiniao": "Opinião",
      "conhecimento": "Conhecimento",
      "preferencia": "Preferência",
      "feedback": "Feedback",
      "outro": "Outro"
    };
    
    return tipoMap[tipo] || tipo;
  };

  // Helper para obter cor do tipo de quiz
  const getTipoQuizColor = (tipo: TipoQuiz): string => {
    const colorMap: Record<TipoQuiz, string> = {
      "opiniao": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      "conhecimento": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      "preferencia": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      "feedback": "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
      "outro": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    };
    
    return colorMap[tipo] || "";
  };

  // Formatação de data
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM", { locale: ptBR });
  };

  // Renderizar filtros
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
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-primary" />
          Quiz e Enquetes
        </h2>
        <Button onClick={() => {
          setQuizParaEditar(undefined);
          setShowForm(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Enquete
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Buscar quiz e enquetes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {renderFiltros()}
      </div>

      {sortedQuizzes.length === 0 ? (
        <div className="text-center py-10">
          <BarChart className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma enquete encontrada</h3>
          <p className="text-muted-foreground mt-2">
            Crie uma nova enquete para coletar opiniões ou compartilhar conhecimentos
          </p>
          <Button onClick={() => {
            setQuizParaEditar(undefined);
            setShowForm(true);
          }} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Enquete
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedQuizzes.map((quiz) => {
            const totalVotos = quiz.opcoes.reduce((sum, op) => sum + op.votos, 0);
            const usuarioVotou = usuarioJaVotou();
            
            // Selecionar a opção mais votada para exibir
            let opcaoMaisVotada = quiz.opcoes[0];
            quiz.opcoes.forEach(op => {
              if (op.votos > opcaoMaisVotada.votos) {
                opcaoMaisVotada = op;
              }
            });
            
            const percentMaisVotada = percentualVotos(quiz, opcaoMaisVotada.id);
            
            return (
              <Card 
                key={quiz.id} 
                className={cn(
                  "h-full flex flex-col hover:shadow-lg transition-all cursor-pointer",
                  !quiz.ativo && "opacity-80"
                )}
                onClick={() => handleCardClick(quiz)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{quiz.titulo}</CardTitle>
                    <div className="flex flex-col gap-1">
                      <Badge variant={quiz.ativo ? "default" : "secondary"} className="ml-auto">
                        {quiz.ativo ? "Ativo" : "Encerrado"}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn("ml-auto", getTipoQuizColor(quiz.tipo))}
                      >
                        {getTipoQuizLabel(quiz.tipo)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Por {quiz.autor} • {formatarData(quiz.dataCriacao)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex-grow">
                  <p className="whitespace-pre-line line-clamp-2 mb-4">{quiz.descricao}</p>
                  
                  {totalVotos > 0 && (
                    <div className="space-y-2 border p-3 rounded-md bg-muted/20">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Opção mais votada:</span>
                        <span>{percentMaisVotada}%</span>
                      </div>
                      <div className="text-sm line-clamp-1">{opcaoMaisVotada.texto}</div>
                      <Progress value={percentMaisVotada} className="h-2" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{totalVotos} votos</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-sm font-medium">Ver detalhes</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <QuizEnqueteForm
        isOpen={showForm}
        quiz={quizParaEditar}
        onClose={() => {
          setShowForm(false);
          setQuizParaEditar(undefined);
        }}
        onSave={handleFormSave}
      />

      <ConfirmDeleteDialog
        isOpen={!!quizParaExcluir}
        onClose={() => setQuizParaExcluir(null)}
        onConfirm={confirmarExclusao}
        title="Excluir enquete"
        description="Tem certeza que deseja excluir esta enquete? Esta ação não pode ser desfeita."
      />

      <QuizDetalheDialog
        quiz={quizSelecionado}
        isOpen={!!quizSelecionado}
        onClose={() => setQuizSelecionado(null)}
        onVote={onVote}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={onToggleActive}
      />
    </div>
  );
};
