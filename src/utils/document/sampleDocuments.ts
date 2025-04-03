
import { v4 as uuidv4 } from 'uuid';
import { Documento, pastasPredefinidas, pastasDisplay } from './types';
import { gerarProtocoloDocumento } from './searchUtils';

// Generate random dates within the last 6 months
const generateRandomDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const randomTimestamp = sixMonthsAgo.getTime() + 
    Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  
  return new Date(randomTimestamp).toISOString();
};

// List of common document types by category
const documentTypesByCategory: Record<string, string[]> = {
  "minutas": [
    "Minuta de Contrato", 
    "Minuta de Acordo", 
    "Minuta de Petição", 
    "Minuta de Estatuto",
    "Minuta de Regulamento"
  ],
  "procuracoes": [
    "Procuração Ad Judicia", 
    "Procuração Pública", 
    "Procuração para Representação",
    "Substabelecimento",
    "Procuração para Venda"
  ],
  "prints": [
    "Print de Tela", 
    "Captura de Conversa", 
    "Comprovante Digital",
    "Print de Sistema",
    "Print de Email"
  ],
  "boletos": [
    "Boleto Bancário", 
    "Fatura", 
    "Cobrança",
    "Guia de Pagamento",
    "Carnê"
  ],
  "comprovantes": [
    "Comprovante de Pagamento", 
    "Comprovante de Transferência", 
    "Recibo",
    "Comprovante de Depósito",
    "Comprovante de PIX"
  ],
  "termos_de_distratos": [
    "Distrato Contratual", 
    "Termo de Rescisão", 
    "Dissolução de Sociedade",
    "Rescisão Amigável",
    "Termo de Acordo"
  ],
  "notificacoes_extrajudiciais": [
    "Notificação de Cobrança", 
    "Notificação de Inadimplência", 
    "Aviso Prévio",
    "Notificação de Rescisão",
    "Interpelação Formal"
  ]
};

// List of common clients
const sampleClients = [
  "José da Silva",
  "Maria Oliveira",
  "Empresa ABC Ltda",
  "Marcos Pereira",
  "Construtora XYZ",
  "Ana Carolina Santos",
  "Ricardo Souza ME",
  "Farmácia Bem Estar",
  "Imobiliária Central",
  "Pedro Henrique Costa"
];

// List of contracts matching clients
const sampleContracts = [
  "CT-2023-0001",
  "CT-2023-0015",
  "CT-2023-0022",
  "CT-2023-0037",
  "CT-2023-0043",
  "CT-2023-0056",
  "CT-2023-0064",
  "CT-2023-0078",
  "CT-2023-0092",
  "CT-2023-0105"
];

// Generate sample document names
const generateDocumentName = (type: string, clientIndex: number) => {
  const client = sampleClients[clientIndex % sampleClients.length];
  const contract = sampleContracts[clientIndex % sampleContracts.length];
  
  return `${type} - ${client} - ${contract} - ${new Date().getFullYear()}`;
};

// Generate sample document content
const generateDocumentContent = (type: string, client: string, date: string) => {
  const formattedDate = new Date(date).toLocaleDateString('pt-BR');
  
  return `DOCUMENTO: ${type}\nCLIENTE: ${client}\nDATA: ${formattedDate}\n\nEste documento foi gerado automaticamente para fins de demonstração e possui autenticação digital para garantir sua validade legal.`;
};

// Generate sample documents for each category
export const generateSampleDocuments = (): Documento[] => {
  const allDocuments: Documento[] = [];
  
  pastasPredefinidas.forEach((categoria, categoriaIndex) => {
    const docTypes = documentTypesByCategory[categoria] || ["Documento Geral"];
    
    // Generate 5 documents for each category
    for (let i = 0; i < 5; i++) {
      const clientIndex = (categoriaIndex + i) % sampleClients.length;
      const client = sampleClients[clientIndex];
      const date = generateRandomDate();
      const type = docTypes[i % docTypes.length];
      const nome = generateDocumentName(type, clientIndex);
      const protocolo = gerarProtocoloDocumento();
      const autenticado = Math.random() > 0.2; // 80% chance of being authenticated
      const dataAutenticacao = autenticado ? date : undefined;
      
      allDocuments.push({
        id: (categoriaIndex * 10) + i + 1,
        nome,
        data: date,
        tipo: categoria,
        protocolo,
        autenticado,
        dataAutenticacao,
        hash: autenticado ? `${protocolo}-HASH-${uuidv4().substring(0, 8)}` : undefined,
        conteudo: generateDocumentContent(type, client, date)
      });
    }
  });
  
  // Sort by date, newest first
  return allDocuments.sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
};

// Export a pre-generated list of sample documents
export const sampleDocuments = generateSampleDocuments();
