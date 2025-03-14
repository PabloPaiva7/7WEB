
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Calendar, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
interface InformacoesTabProps {
  cliente: {
    contato: string | null;
    entrada: string | null;
    prazo: string | null;
    negociacao: string | null;
    resolucao: string | null;
  };
  onUpdateCliente?: (fields: Partial<InformacoesTabProps['cliente']>) => void;
}
export const InformacoesTab = ({
  cliente,
  onUpdateCliente
}: InformacoesTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableInfo, setEditableInfo] = useState(cliente);
  const {
    toast
  } = useToast();
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setEditableInfo(cliente);
    setIsEditing(false);
  };
  const handleSave = () => {
    if (onUpdateCliente) {
      onUpdateCliente(editableInfo);
      toast({
        title: "Informações atualizadas",
        description: "As informações do cliente foram atualizadas com sucesso."
      });
    }
    setIsEditing(false);
  };
  const handleChange = (field: keyof typeof cliente, value: string) => {
    setEditableInfo({
      ...editableInfo,
      [field]: value
    });
  };
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return date.split('T')[0]; // YYYY-MM-DD format for input type="date"
  };
  return <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center dark:text-[#D9B300]">
            <Phone className="mr-2 h-4 w-4" />
            Informações de Contato
          </h3>
          {!isEditing ? <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-1" /> <span className="dark:text-[#D9B300]">Editar</span>
            </Button> : <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" /> <span className="dark:text-[#D9B300]">Cancelar</span>
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" /> <span className="dark:text-[#D9B300]">Salvar</span>
              </Button>
            </div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Contato</p>
            {isEditing ? <Input value={editableInfo.contato || ""} onChange={e => handleChange("contato", e.target.value)} placeholder="Informe o contato" /> : <p className="font-medium dark:text-[#D9B300]">{cliente.contato || "Não informado"}</p>}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center dark:text-[#D9B300]">
            <Calendar className="mr-2 h-4 w-4" />
            Datas Importantes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Data de Entrada</p>
            {isEditing ? <Input type="date" value={formatDate(editableInfo.entrada)} onChange={e => handleChange("entrada", e.target.value)} /> : <p className="font-medium dark:text-[#D9B300]">
                {cliente.entrada ? new Date(cliente.entrada).toLocaleDateString('pt-BR') : "Não informado"}
              </p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Prazo do Contrato</p>
            {isEditing ? <Input type="date" value={formatDate(editableInfo.prazo)} onChange={e => handleChange("prazo", e.target.value)} /> : <p className="font-medium dark:text-[#D9B300]">
                {cliente.prazo ? new Date(cliente.prazo).toLocaleDateString('pt-BR') : "Não informado"}
              </p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Negociação</p>
            {isEditing ? <Input type="date" value={formatDate(editableInfo.negociacao)} onChange={e => handleChange("negociacao", e.target.value)} /> : <p className="font-medium dark:text-[#D9B300]">
                {cliente.negociacao ? new Date(cliente.negociacao).toLocaleDateString('pt-BR') : "Não informado"}
              </p>}
          </div>
          <div>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Resolução</p>
            {isEditing ? <Input type="date" value={formatDate(editableInfo.resolucao)} onChange={e => handleChange("resolucao", e.target.value)} /> : <p className="font-medium dark:text-[#D9B300]">
                {cliente.resolucao ? new Date(cliente.resolucao).toLocaleDateString('pt-BR') : "Não informado"}
              </p>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
