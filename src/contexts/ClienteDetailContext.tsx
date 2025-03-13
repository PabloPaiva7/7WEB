
import React, { createContext, useContext, ReactNode } from "react";
import { useClienteDetalhe } from "@/hooks/useClienteDetalhe";
import { useClienteDocumentos } from "@/hooks/useClienteDocumentos";
import { useClienteInteracoes } from "@/hooks/useClienteInteracoes";

interface ClienteDetailContextType {
  cliente: any;
  loading: boolean;
  documentos: any[];
  interacoes: any[];
  handleUploadDocumento: (files: FileList | null) => Promise<void>;
  handleRemoveDocumento: (nome: string) => Promise<void>;
  handleAddInteracao: (interacao: {
    tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
    conteudo: string;
    atendente: string;
  }) => void;
  handleRemoveInteracao: (id: string) => void;
  updateClienteFields: (fields: any) => Promise<boolean>;
}

const ClienteDetailContext = createContext<ClienteDetailContextType | undefined>(undefined);

export const ClienteDetailProvider = ({ children, clienteId }: { children: ReactNode, clienteId: string | undefined }) => {
  const { cliente, loading, updateClienteFields } = useClienteDetalhe();
  
  const handleUpdateField = async (fields: any) => {
    if (fields.codigo && !fields.tipo) {
      const newFields = { ...fields };
      if (cliente && cliente.codigo !== fields.codigo) {
        // do something special with codigo if needed
      }
      return updateClienteFields(newFields);
    }
    return updateClienteFields(fields);
  };
  
  const handlePagamentoAdded = async (data: string) => {
    await updateClienteFields({ ultimo_pagamento: data });
  };
  
  const { 
    documentos, 
    handleUploadDocumento, 
    handleRemoveDocumento 
  } = useClienteDocumentos(clienteId);
  
  const { 
    interacoes, 
    handleAddInteracao, 
    handleRemoveInteracao 
  } = useClienteInteracoes(clienteId, handlePagamentoAdded);

  const handleInteracaoAdded = (interacao: {
    tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
    conteudo: string;
    atendente: string;
  }) => {
    handleAddInteracao(interacao);
    
    if (interacao.tipo === "negociacao") {
      updateClienteFields({ negociacao: new Date().toISOString() });
    } else if (interacao.tipo === "contato" && interacao.conteudo.includes("Código:")) {
      updateClienteFields({ codigo: interacao.conteudo.split("Código:")[1].trim() });
    }
  };
  
  return (
    <ClienteDetailContext.Provider value={{
      cliente,
      loading,
      documentos,
      interacoes,
      handleUploadDocumento,
      handleRemoveDocumento,
      handleAddInteracao: handleInteracaoAdded,
      handleRemoveInteracao,
      updateClienteFields: handleUpdateField
    }}>
      {children}
    </ClienteDetailContext.Provider>
  );
};

export const useClienteDetailContext = () => {
  const context = useContext(ClienteDetailContext);
  if (context === undefined) {
    throw new Error("useClienteDetailContext must be used within a ClienteDetailProvider");
  }
  return context;
};
