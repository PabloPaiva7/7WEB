
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quiz, TipoQuiz, OpcaoQuiz } from "@/types/mural.types";
import { BarChart, Edit, Trash, VoteIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface QuizDetalheDialogProps {
  quiz: Quiz | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (quizId: string, opcaoId: string) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, ativo: boolean) => void;
}

export const QuizDetalheDialog = ({
  quiz,
  isOpen,
  onClose,
  onVote,
  onEdit,
  onDelete,
  onToggleActive
}: QuizDetalheDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  if (!quiz) return null;

  const totalVotos = quiz.opcoes.reduce((sum, opcao) => sum + opcao.votos, 0);

  const percentualVotos = (quiz: Quiz, opcaoId: string): number => {
    const opcao = quiz.opcoes.find(op => op.id === opcaoId);
    if (!opcao) return 0;
    
    return totalVotos > 0 ? Math.round((opcao.votos / totalVotos) * 100) : 0;
  };

  // In a real implementation, this would check the current user's ID against the quiz's responses
  // For this demo, we'll use the state instead of random simulation
  const usuarioJaVotou = (): boolean => {
    return hasVoted;
  };

  const handleSingleVote = () => {
    if (!selectedOption) {
      toast.error("Selecione uma opção para votar");
      return;
    }
    
    onVote(quiz.id, selectedOption);
    setSelectedOption("");
    setHasVoted(true);
    toast.success("Voto registrado com sucesso!");
  };

  const handleMultipleVote = () => {
    if (selectedOptions.length === 0) {
      toast.error("Selecione pelo menos uma opção para votar");
      return;
    }
    
    // In a real implementation, we would send all votes
    // For this demo, we'll just send the first one
    onVote(quiz.id, selectedOptions[0]);
    setSelectedOptions([]);
    setHasVoted(true);
    toast.success("Votos registrados com sucesso!");
  };

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

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const jaVotou = usuarioJaVotou();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl">{quiz.titulo}</DialogTitle>
            <div className="flex gap-2">
              <Badge variant={quiz.ativo ? "default" : "secondary"}>
                {quiz.ativo ? "Ativo" : "Encerrado"}
              </Badge>
              <Badge variant="outline">
                {getTipoQuizLabel(quiz.tipo)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-sm text-muted-foreground flex justify-between">
            <span>Por {quiz.autor} • {formatarData(quiz.dataCriacao)}</span>
            {quiz.dataEncerramento && (
              <span>Encerrado em {formatarData(quiz.dataEncerramento)}</span>
            )}
          </div>
          
          <div className="whitespace-pre-line text-lg">{quiz.descricao}</div>
          
          <div className="space-y-4 border p-4 rounded-lg">
            <h3 className="font-medium flex items-center gap-2">
              <VoteIcon className="h-4 w-4" />
              {quiz.multiplaEscolha ? "Selecione uma ou mais opções" : "Selecione uma opção"}
            </h3>

            {quiz.multiplaEscolha ? (
              <div className="space-y-3">
                {quiz.opcoes.map((opcao) => {
                  const percent = percentualVotos(quiz, opcao.id);
                  
                  return (
                    <div key={opcao.id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={opcao.id} 
                          checked={selectedOptions.includes(opcao.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOptions([...selectedOptions, opcao.id]);
                            } else {
                              setSelectedOptions(selectedOptions.filter(id => id !== opcao.id));
                            }
                          }}
                          disabled={!quiz.ativo || jaVotou}
                        />
                        <Label htmlFor={opcao.id} className="text-sm">{opcao.texto}</Label>
                        {jaVotou && <span className="text-sm ml-auto">{percent}%</span>}
                      </div>
                      
                      {jaVotou && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {quiz.ativo && !jaVotou && (
                  <Button onClick={handleMultipleVote} className="mt-4">
                    Enviar Votos
                  </Button>
                )}
              </div>
            ) : (
              <RadioGroup 
                value={selectedOption} 
                onValueChange={setSelectedOption}
                className="space-y-3"
                disabled={!quiz.ativo || jaVotou}
              >
                {quiz.opcoes.map((opcao) => {
                  const percent = percentualVotos(quiz, opcao.id);
                  
                  return (
                    <div key={opcao.id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={opcao.id} 
                          id={opcao.id} 
                          disabled={!quiz.ativo || jaVotou}
                        />
                        <Label htmlFor={opcao.id} className="text-sm">{opcao.texto}</Label>
                        {jaVotou && <span className="text-sm ml-auto">{percent}%</span>}
                      </div>
                      
                      {jaVotou && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {quiz.ativo && !jaVotou && (
                  <Button onClick={handleSingleVote} className="mt-4">
                    Votar
                  </Button>
                )}
              </RadioGroup>
            )}
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(quiz)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(quiz.id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
            <Button
              variant={quiz.ativo ? "destructive" : "default"}
              size="sm"
              onClick={() => onToggleActive(quiz.id, !quiz.ativo)}
            >
              {quiz.ativo ? "Encerrar Enquete" : "Reativar Enquete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
