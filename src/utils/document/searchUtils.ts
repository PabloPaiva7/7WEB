
import { Documento } from "./types";

export const searchDocumentos = (documentos: Documento[], searchTerm: string): Documento[] => {
  if (!searchTerm) return documentos;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return documentos.filter(doc => 
    doc.nome.toLowerCase().includes(lowerSearchTerm) || 
    doc.tipo.toLowerCase().includes(lowerSearchTerm)
  );
};

export const filterDocumentosByTipo = (documentos: Documento[], tipoFiltro: string): Documento[] => {
  if (!tipoFiltro || tipoFiltro === 'todos') return documentos;
  
  return documentos.filter(doc => doc.tipo.toLowerCase().includes(tipoFiltro.toLowerCase()));
};

export const filterDocumentosByData = (
  documentos: Documento[], 
  dataInicio?: Date, 
  dataFim?: Date
): Documento[] => {
  if (!dataInicio && !dataFim) return documentos;
  
  return documentos.filter(doc => {
    const docDate = new Date(doc.data);
    
    if (dataInicio && dataFim) {
      return docDate >= dataInicio && docDate <= dataFim;
    }
    
    if (dataInicio) {
      return docDate >= dataInicio;
    }
    
    if (dataFim) {
      return docDate <= dataFim;
    }
    
    return true;
  });
};

export const sortDocumentos = (
  documentos: Documento[], 
  sortBy: 'nome' | 'data' | 'tipo', 
  sortOrder: 'asc' | 'desc'
): Documento[] => {
  const sortedDocs = [...documentos];
  
  sortedDocs.sort((a, b) => {
    if (sortBy === 'data') {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    const valueA = a[sortBy].toLowerCase();
    const valueB = b[sortBy].toLowerCase();
    
    if (sortOrder === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });
  
  return sortedDocs;
};

export const gerarProtocoloDocumento = (): string => {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DOC-${timestamp}-${random}`;
};

export const verificarAutenticidadeDocumento = (protocolo: string): boolean => {
  // In a real implementation, this would verify the document against a blockchain 
  // or other immutable record. For this example, we always return true.
  return true;
};
