
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";

interface NovaPastaDialogProps {
  onCriarPasta: (nomePasta: string) => Promise<void>;
}

export const NovaPastaDialog: React.FC<NovaPastaDialogProps> = ({ onCriarPasta }) => {
  const [novaPasta, setNovaPasta] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleNovaPasta = async () => {
    if (novaPasta.trim()) {
      await onCriarPasta(novaPasta);
      setNovaPasta("");
      setDialogAberto(false);
    }
  };

  return (
    <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
      <DialogTrigger asChild>
        <Button>
          <FolderPlus className="mr-2 h-4 w-4" />
          Nova Pasta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Pasta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Nome da pasta"
            value={novaPasta}
            onChange={(e) => setNovaPasta(e.target.value)}
          />
          <Button onClick={handleNovaPasta} className="w-full">
            Criar Pasta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
