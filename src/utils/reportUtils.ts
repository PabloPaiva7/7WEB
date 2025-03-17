
/**
 * Utility functions for generating and downloading reports
 */

// Generate mock data for reports based on type
export const generateReportData = (reportType: string, rowCount: number = 50) => {
  switch (reportType) {
    case 'artes':
      return generateArtesData(rowCount);
    case 'consultores':
      return generateConsultoresData(rowCount);
    case 'aprovados':
      return generateAprovadosData(rowCount);
    default:
      return [];
  }
};

// Helper to convert data to CSV string
export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Function to download data as CSV
export const downloadCSV = (data: any[], fileName: string) => {
  const csvString = convertToCSV(data);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${fileName}.csv`);
};

// Function to download data as XLSX (mock - in real app would use xlsx library)
export const downloadXLSX = (data: any[], fileName: string) => {
  // This is a simplified mock - in a real application you would use a library like xlsx
  // to actually generate a real XLSX file
  const csvString = convertToCSV(data);
  const blob = new Blob([csvString], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, `${fileName}.xlsx`);
};

// Helper to trigger browser download
const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Mock data generators
const generateArtesData = (count: number) => {
  const status = ['Pendente', 'Em análise', 'Aprovado', 'Rejeitado'];
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      data: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      titulo: `Arte ${i + 1}`,
      responsavel: `Responsável ${Math.floor(Math.random() * 5) + 1}`,
      status: status[Math.floor(Math.random() * status.length)],
      observacoes: `Observação da arte ${i + 1}`
    });
  }
  
  return data;
};

const generateConsultoresData = (count: number) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const clientes = Math.floor(Math.random() * 50) + 1;
    const taxa = Math.random() * 0.5 + 0.3; // 30% - 80%
    
    data.push({
      id: i + 1,
      nome: `Consultor ${i + 1}`,
      clientes: clientes,
      valorNegociado: Math.floor(Math.random() * 500000) + 50000,
      taxaConversao: (taxa * 100).toFixed(2) + '%',
      ultimaAtividade: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }
  
  return data;
};

const generateAprovadosData = (count: number) => {
  const bancos = ['Banco X', 'Banco Y', 'Banco Z', 'Banco W'];
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      contrato: `CT00${i + 1}`,
      cliente: `Cliente ${i + 1}`,
      valor: Math.floor(Math.random() * 100000) + 10000,
      banco: bancos[Math.floor(Math.random() * bancos.length)],
      dataAprovacao: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsavel: `Aprovador ${Math.floor(Math.random() * 3) + 1}`
    });
  }
  
  return data;
};
