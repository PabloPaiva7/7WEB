
import { Pasta } from './types';

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
