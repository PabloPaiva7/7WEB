
import { Pasta, Documento } from './types';

// Add the missing filtrarPastas function
export const filtrarPastas = (pastas: Pasta[], searchTerm: string): Pasta[] => {
  if (!searchTerm) return pastas;
  
  const termoBusca = searchTerm.toLowerCase();
  
  return pastas.filter(pasta => 
    pasta.nome.toLowerCase().includes(termoBusca) || 
    pasta.documentos.some(doc => 
      doc.nome.toLowerCase().includes(termoBusca) || 
      doc.tipo.toLowerCase().includes(termoBusca)
    )
  );
};

// Add the missing search functions used in DocumentosTab
export const searchDocumentos = (documentos: Documento[], searchTerm: string): Documento[] => {
  if (!searchTerm) return documentos;
  
  const term = searchTerm.toLowerCase();
  return documentos.filter(doc => 
    doc.nome.toLowerCase().includes(term) || 
    doc.tipo.toLowerCase().includes(term) ||
    (doc.protocolo && doc.protocolo.toLowerCase().includes(term))
  );
};

export const filterDocumentosByTipo = (documentos: Documento[], tipo: string): Documento[] => {
  if (tipo === 'todos') return documentos;
  return documentos.filter(doc => doc.tipo === tipo);
};

export const filterDocumentosByData = (
  documentos: Documento[], 
  dataInicio: Date, 
  dataFim: Date
): Documento[] => {
  return documentos.filter(doc => {
    const docDate = new Date(doc.data);
    return docDate >= dataInicio && docDate <= dataFim;
  });
};

export const sortDocumentos = (
  documentos: Documento[], 
  key: "nome" | "data" | "tipo", 
  direction: "asc" | "desc"
): Documento[] => {
  return [...documentos].sort((a, b) => {
    let comparison = 0;
    
    if (key === "nome") {
      comparison = a.nome.localeCompare(b.nome);
    } else if (key === "data") {
      comparison = new Date(a.data).getTime() - new Date(b.data).getTime();
    } else if (key === "tipo") {
      comparison = a.tipo.localeCompare(b.tipo);
    }
    
    return direction === "asc" ? comparison : -comparison;
  });
};

export const verificarAutenticidadeDocumento = (protocolo: string): boolean => {
  // Simulação de verificação de autenticidade
  // Em um cenário real, isso envolveria verificação com blockchain ou APIs de validação
  if (!protocolo) return false;
  
  // Simulamos que protocolos que começam com determinados caracteres são autênticos
  const primeiroCaractere = protocolo.charAt(0).toLowerCase();
  return ['a', 'b', 'c', 'd', 'e', '1', '2', '3'].includes(primeiroCaractere);
};

export const gerarProtocoloDocumento = (): string => {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${ano}${mes}${dia}-${random}`;
};
