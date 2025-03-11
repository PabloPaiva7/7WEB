
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Documento, Pasta } from "./types";

export const uploadDocumentos = async (pasta: Pasta, files: FileList): Promise<Documento[]> => {
  const novosDocumentos: Documento[] = [];

  for (const file of Array.from(files)) {
    try {
      const { error: uploadError } = await supabase.storage
        .from(pasta.nome)
        .upload(file.name, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(pasta.nome)
        .getPublicUrl(file.name);

      novosDocumentos.push({
        id: Date.now() + Math.random(),
        nome: file.name,
        data: new Date().toISOString(),
        tipo: file.type,
        url: urlData.publicUrl
      });

      toast({
        title: "Arquivo enviado",
        description: `${file.name} foi enviado com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: `Não foi possível enviar ${file.name}.`
      });
    }
  }

  return novosDocumentos;
};

export const removerDocumento = async (pasta: Pasta, documento: Documento): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(pasta.nome)
      .remove([documento.nome]);

    if (error) throw error;

    toast({
      title: "Documento removido",
      description: "O documento foi removido com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    toast({
      variant: "destructive",
      title: "Erro ao remover",
      description: "Não foi possível remover o documento."
    });
    return false;
  }
};
