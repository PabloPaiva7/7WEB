
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MovimentacaoHistorico } from '@/data/historicoData';

// Função para exportar dados para CSV
export const exportarParaCSV = (dados: any[], nomeArquivo: string) => {
  // Verificar se existem dados
  if (!dados || dados.length === 0) {
    console.error('Não há dados para exportar para CSV');
    return;
  }

  // Obter as chaves dos objetos (cabeçalhos)
  const headers = Object.keys(dados[0]);
  
  // Função para escapar valores com vírgulas ou aspas
  const escaparValor = (valor: any): string => {
    if (valor === null || valor === undefined) return '';
    
    const str = String(valor);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Criar linhas de dados
  const csvLinhas = [
    // Linha de cabeçalho
    headers.join(','),
    // Linhas de dados
    ...dados.map(item => 
      headers.map(chave => escaparValor(item[chave])).join(',')
    )
  ];

  // Juntar as linhas em uma string
  const csvString = csvLinhas.join('\n');
  
  // Criar blob e baixar
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
export const exportarParaPDF = (dados: MovimentacaoHistorico[], nomeArquivo: string) => {
  // Verificar se existem dados
  if (!dados || dados.length === 0) {
    console.error('Não há dados para exportar para PDF');
    return;
  }

  // Criar um novo documento PDF
  const doc = new jsPDF();
  
  // Adicionar informações de cabeçalho
  doc.setFontSize(18);
  doc.text('Histórico de Movimentações', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
  doc.text(`Total de registros: ${dados.length}`, 14, 36);
  
  // Adicionar informações de autenticação
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Este documento possui validade jurídica e pode ser verificado online através do protocolo.', 14, 44);
  
  // Configurar tabela de dados
  const cabecalhos = [
    'Data', 
    'Contrato', 
    'Cliente', 
    'Tipo', 
    'Módulo', 
    'Descrição', 
    'Usuário', 
    'Status',
    'Protocolo'
  ];
  
  // Mapear dados para o formato da tabela
  const corpoTabela = dados.map(item => [
    new Date(item.data).toLocaleString('pt-BR'),
    item.contrato,
    item.cliente,
    item.tipo,
    item.modulo,
    item.descricao.length > 40 ? item.descricao.substring(0, 40) + '...' : item.descricao,
    item.usuario,
    item.status,
    item.protocolo
  ]);
  
  // Adicionar tabela ao documento
  autoTable(doc, {
    head: [cabecalhos],
    body: corpoTabela,
    startY: 50,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      5: { cellWidth: 'auto' }, // Descrição com largura automática
      8: { cellWidth: 30 }      // Protocolo com largura fixa
    },
    margin: { top: 50 }
  });
  
  // Adicionar rodapé com informações de autenticidade
  const totalPaginas = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    // Linha de rodapé
    const larguraPagina = doc.internal.pageSize.getWidth();
    doc.line(14, doc.internal.pageSize.getHeight() - 15, larguraPagina - 14, doc.internal.pageSize.getHeight() - 15);
    
    // Texto de rodapé com informações de autenticidade
    doc.text(
      `Documento gerado eletronicamente em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${totalPaginas}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Salvar o PDF
  doc.save(`${nomeArquivo}.pdf`);
};
