
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flag, User, UserPlus, Users, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Anuncio, Participante } from "@/types/mural.types";
import { ParticipanteForm } from "./ParticipanteForm";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface DetalhesAnuncioProps {
  anuncio: Anuncio;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (anuncio: Anuncio) => void;
}

export const DetalhesAnuncio = ({ anuncio, isOpen, onClose, onUpdate }: DetalhesAnuncioProps) => {
  const [showForm, setShowForm] = useState(false);
  
  const handleInscrever = (dados: Omit<Participante, "id" | "dataInscricao">) => {
    const novoParticipante: Participante = {
      ...dados,
      id: uuidv4(),
      dataInscricao: new Date().toISOString()
    };
    
    const participantes = [...(anuncio.participantes || []), novoParticipante];
    onUpdate({ ...anuncio, participantes });
    toast.success("Inscrição realizada com sucesso!");
  };

  const handleExportarParticipantes = () => {
    if (!anuncio.participantes?.length) {
      toast.error("Não há participantes para exportar");
      return;
    }

    const csvContent = [
      ["Nome Completo", "E-mail", "Departamento", "Data de Inscrição", "Observações"].join(","),
      ...anuncio.participantes.map(p => [
        p.nomeCompleto,
        p.email,
        p.departamento,
        format(new Date(p.dataInscricao), "dd/MM/yyyy HH:mm"),
        p.observacoes || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `participantes_${anuncio.titulo.toLowerCase().replace(/\s+/g, "_")}.csv`;
    link.click();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] bg-card text-card-foreground">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {anuncio.importante && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Flag className="h-3 w-3" /> Importante
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl mt-2 text-foreground">{anuncio.titulo}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Publicado em {format(new Date(anuncio.dataPublicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              {anuncio.dataEvento && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-foreground">Data do evento: {format(new Date(anuncio.dataEvento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
              )}
            </div>

            <div className="whitespace-pre-wrap text-foreground">{anuncio.conteudo}</div>

            {anuncio.permitirInscricao && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-foreground">Participantes: {anuncio.participantes?.length || 0}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportarParticipantes}
                      disabled={!anuncio.participantes?.length}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Lista
                    </Button>
                    <Button
                      onClick={() => setShowForm(true)}
                      size="sm"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Inscrever-se
                    </Button>
                  </div>
                </div>

                {anuncio.participantes && anuncio.participantes.length > 0 && (
                  <div className="border rounded-lg p-4 space-y-3 bg-background">
                    <h3 className="font-medium text-foreground">Lista de Participantes</h3>
                    <div className="space-y-2">
                      {anuncio.participantes.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-foreground">{p.nomeCompleto}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">{p.departamento}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-sm text-gray-500 pt-4">
              Por: {anuncio.autor}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ParticipanteForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleInscrever}
      />
    </>
  );
};
