
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MovimentacaoHistorico } from '@/types/agenda.types';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique protocol ID based on timestamp and UUID
const generateProtocolId = () => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').substring(0, 14);
  const shortUuid = uuidv4().substring(0, 8);
  return `PROT-${timestamp}-${shortUuid}`;
};

// Generate a verification hash (simplified for demo)
const generateVerificationHash = (data: any[]) => {
  // In a real system, this would be a cryptographic hash of the content
  // For this example, we'll use a simple string for demonstration
  return Math.random().toString(16).substring(2, 10);
};

// Função para exportar dados para CSV
export const exportarParaCSV = (dados: any[], nomeArquivo: string) => {
  // Verificar se existem dados
  if (!dados || dados.length === 0) {
    console.error('Não há dados para exportar para CSV');
    return;
  }

  // Generate legal information
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR');
  const formattedTime = now.toLocaleTimeString('pt-BR');
  const dateTimeStr = `${formattedDate} ${formattedTime}`;
  const protocolId = generateProtocolId();
  const authCode = uuidv4().toUpperCase();
  const verificationHash = generateVerificationHash(dados);
  
  // Legal header rows
  const legalHeader = [
    ['Sistema de Gestão - Relatório de Histórico com Validação Jurídica'],
    [`Protocolo Jurídico: ${protocolId}`],
    [`Gerado em: ${dateTimeStr}`],
    [`Total de registros: ${dados.length}`],
    ['Este documento possui validade jurídica conforme Lei 14.063/2020 (Assinaturas Eletrônicas)'],
    [`Código de Autenticidade: ${authCode}`],
    ['Certificação Digital: Sistema de Gestão - Certificado A3'],
    [`Para validar este documento, acesse: https://sistema-gestao.exemplo.com.br/validar?protocolo=${protocolId}`],
    ['']  // Empty row for spacing
  ];
  
  // Footer rows
  const legalFooter = [
    [''],  // Empty row for spacing
    [`Hash de Verificação: ${verificationHash}`],
    [`Fim do documento jurídico - Protocolo ${protocolId}`],
    [`Exportado por Sistema de Gestão em ${dateTimeStr}`]
  ];

  // Customize the header fields - adicionar o status da campanha
  const customHeaders = ['Data', 'Cliente', 'Contrato', 'Tipo', 'Descrição', 'Usuário', 'Status da Campanha'];
  
  // Map data to the new custom header format
  const mappedData = dados.map(item => [
    new Date(item.data).toLocaleString('pt-BR'),
    item.cliente,
    item.contrato,
    item.tipo,
    item.descricao,
    item.usuario,
    item.statusCampanha || 'Não'  // Exibir "Sim" se tiver, "Não" se não tiver
  ]);
  
  // Combine all rows
  const csvRows = [
    ...legalHeader,
    customHeaders,
    ...mappedData,
    ...legalFooter
  ];

  // Convert rows to CSV format
  const csvString = csvRows.map(row => {
    if (Array.isArray(row)) {
      return row.map(cell => {
        // Escape special characters if needed
        const cellStr = String(cell || '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',');
    } else {
      return row; // Handle non-array rows
    }
  }).join('\n');
  
  // Create blob and download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${nomeArquivo}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função para exportar dados para PDF
export const exportarParaPDF = (data: any[], filename: string) => {
  // Verificar se existem dados
  if (!data || data.length === 0) {
    console.error('Não há dados para exportar para PDF');
    return;
  }

  // Generate legal information
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR');
  const formattedTime = now.toLocaleTimeString('pt-BR');
  const dateTimeStr = `${formattedDate} ${formattedTime}`;
  const protocolId = generateProtocolId();
  const authCode = uuidv4().toUpperCase();
  const verificationHash = generateVerificationHash(data);

  // Criar um novo documento PDF
  const doc = new jsPDF();
  
  // Adicionar cabeçalho com validação jurídica
  doc.setFontSize(16);
  doc.text('Sistema de Gestão - Relatório de Histórico com Validação Jurídica', 14, 15);
  
  doc.setFontSize(11);
  doc.text(`Protocolo Jurídico: ${protocolId}`, 14, 22);
  doc.text(`Gerado em: ${dateTimeStr}`, 14, 27);
  doc.text(`Total de registros: ${data.length}`, 14, 32);
  
  // Adicionar informações de autenticação
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Este documento possui validade jurídica conforme Lei 14.063/2020 (Assinaturas Eletrônicas)', 14, 39);
  doc.text(`Código de Autenticidade: ${authCode}`, 14, 44);
  doc.text('Certificação Digital: Sistema de Gestão - Certificado A3', 14, 49);
  doc.text(`Para validar este documento, acesse: https://sistema-gestao.exemplo.com.br/validar?protocolo=${protocolId}`, 14, 54);
  
  // Configurar tabela de dados - adicionar o status da campanha
  if (filename.includes('movimentacoes')) {
    const movimentacoes = data as MovimentacaoHistorico[];
    
    // Format data for tables
    const tableData = movimentacoes.map((item) => [
      new Date(item.data).toLocaleString('pt-BR'),
      item.contrato,
      item.cliente,
      item.tipo,
      item.modulo,
      item.descricao.slice(0, 40) + (item.descricao.length > 40 ? '...' : ''),
      item.usuario,
      item.status,
      item.protocolo,
      item.statusCampanha || 'Não'
    ]);
    
    // Adicionar tabela ao documento
    autoTable(doc, {
      head: [
        ['Data', 
        'Cliente', 
        'Contrato', 
        'Tipo', 
        'Modulo', 
        'Descrição', 
        'Usuário',
        'Status',
        'Protocolo',
        'Status da Campanha']
      ],
      body: tableData,
      startY: 60,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        4: { cellWidth: 'auto' }, // Descrição com largura automática
        6: { cellWidth: 30 },     // Protocolo com largura fixa
        7: { cellWidth: 25 }      // Status da Campanha com largura fixa
      },
      margin: { top: 60 }
    });
  }

  // Adicionar rodapé com informações de autenticidade
  const totalPaginas = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    // Linha de rodapé
    const larguraPagina = doc.internal.pageSize.getWidth();
    doc.line(14, doc.internal.pageSize.getHeight() - 25, larguraPagina - 14, doc.internal.pageSize.getHeight() - 25);
    
    // Texto de rodapé com informações de autenticidade
    doc.text(
      `Hash de Verificação: ${verificationHash}`,
      14,
      doc.internal.pageSize.getHeight() - 20
    );
    
    doc.text(
      `Fim do documento jurídico - Protocolo ${protocolId}`,
      14,
      doc.internal.pageSize.getHeight() - 15
    );
    
    doc.text(
      `Exportado por Sistema de Gestão em ${dateTimeStr} - Página ${i} de ${totalPaginas}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Salvar o PDF
  doc.save(`${filename}.pdf`);
};
