
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Upload, X } from "lucide-react";

interface Documento {
  id: string;
  nome: string;
  data: string;
  tipo: string;
  url: string;
}

interface DocumentosTabProps {
  documentos: Documento[];
  onUploadDocumento: (files: FileList | null) => void;
  onRemoveDocumento: (nome: string) => void;
}

export const DocumentosTab = ({ 
  documentos, 
  onUploadDocumento, 
  onRemoveDocumento 
}: DocumentosTabProps) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documentos do Cliente
          </h3>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="documento-upload">Selecione os arquivos</Label>
                  <Input 
                    id="documento-upload" 
                    type="file" 
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.zip,.txt"
                    onChange={(e) => onUploadDocumento(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: PDF, Word, Excel, CSV, imagens, ZIP, TXT (máx. 50MB)
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    const fileInput = document.getElementById('documento-upload') as HTMLInputElement;
                    onUploadDocumento(fileInput?.files || null);
                  }}
                >
                  Enviar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {documentos.length > 0 ? (
          <div className="space-y-3">
            {documentos.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {doc.nome}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveDocumento(doc.nome)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum documento disponível</p>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione documentos clicando no botão acima
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
