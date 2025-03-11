
import { Pasta } from "./types";

export const filtrarPastas = (pastas: Pasta[], searchTerm: string): Pasta[] => {
  if (!searchTerm) return pastas;
  
  return pastas.map(pasta => ({
    ...pasta,
    documentos: pasta.documentos.filter(doc =>
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(pasta =>
    pasta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pasta.documentos.length > 0
  );
};
