
import { supabase } from "@/integrations/supabase/client";

export type ValidationError = {
  row: number;
  field: string;
  message: string;
};

export const validateCsvData = (data: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  data.forEach((row, index) => {
    // Validar valor do cliente
    if (row.valorCliente) {
      const value = Number(row.valorCliente.replace(/[^0-9.-]+/g, ""));
      if (isNaN(value)) {
        errors.push({
          row: index,
          field: "valorCliente",
          message: "Valor inválido",
        });
      }
    }

    // Validar datas
    ["data", "ultimoPagamento"].forEach((field) => {
      if (row[field] && isNaN(Date.parse(row[field]))) {
        errors.push({
          row: index,
          field,
          message: "Data inválida",
        });
      }
    });

    // Validar campos obrigatórios
    ["contrato", "cliente", "banco"].forEach((field) => {
      if (!row[field] || row[field].trim() === "") {
        errors.push({
          row: index,
          field,
          message: "Campo obrigatório",
        });
      }
    });
  });

  return errors;
};

export const processAndUploadCsv = async (
  file: File,
  data: any[]
): Promise<{ success: boolean; message: string }> => {
  try {
    // Criar registro do upload
    const { data: uploadData, error: uploadError } = await supabase
      .from("carteira_uploads")
      .insert({
        nome_arquivo: file.name,
        registros_importados: data.length,
        status: "processando",
      })
      .select()
      .single();

    if (uploadError) throw uploadError;

    // Processar e inserir os registros
    const { error: insertError } = await supabase.from("carteira_clientes").insert(
      data.map((row) => ({
        upload_id: uploadData.id,
        data: row.data,
        resolucao: row.resolucao,
        contrato: row.contrato,
        escritorio: row.escritorio,
        ultimo_pagamento: row.ultimoPagamento,
        prazo: row.prazo,
        entrada: row.entrada,
        banco: row.banco,
        codigo: row.codigo,
        valor_cliente: Number(row.valorCliente.replace(/[^0-9.-]+/g, "")),
        contato: row.contato,
        negociacao: row.negociacao,
        situacao: row.situacao,
      }))
    );

    if (insertError) throw insertError;

    // Atualizar status do upload
    const { error: updateError } = await supabase
      .from("carteira_uploads")
      .update({ status: "concluido" })
      .eq("id", uploadData.id);

    if (updateError) throw updateError;

    return { success: true, message: "Importação concluída com sucesso" };
  } catch (error: any) {
    console.error("Erro na importação:", error);
    return {
      success: false,
      message: `Erro na importação: ${error.message}`,
    };
  }
};
