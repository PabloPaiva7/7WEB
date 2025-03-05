
import { AnaliseCarteiraCard } from "./Cards/AnaliseCarteiraCard";
import { DistribuicaoBancoCard } from "./Cards/DistribuicaoBancoCard";
import { EvolucaoCarteiraCard } from "./Cards/EvolucaoCarteiraCard";

interface ChartAnalysisProps {
  estatisticas: {
    totalClientes: number;
    porSituacao: Record<string, number>;
    porBanco: Record<string, number>;
    valorTotal: number;
  };
}

export const ChartAnalysis = ({ estatisticas }: ChartAnalysisProps) => {
  // Preparar dados para os gráficos
  const dadosGrafico = Object.entries(estatisticas.porSituacao).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  const dadosPizza = Object.entries(estatisticas.porBanco).map(([nome, valor]) => ({
    name: nome,
    value: valor,
  }));

  const dadosTendencia = [
    { mes: 'Jan', valor: 42000 },
    { mes: 'Fev', valor: 53000 },
    { mes: 'Mar', valor: 48000 },
    { mes: 'Abr', valor: 62000 },
    { mes: 'Mai', valor: 78000 },
    { mes: 'Jun', valor: 83000 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnaliseCarteiraCard 
          totalClientes={estatisticas.totalClientes}
          valorTotal={estatisticas.valorTotal}
          dadosGrafico={dadosGrafico}
        />
        <DistribuicaoBancoCard dadosPizza={dadosPizza} />
      </div>

      <EvolucaoCarteiraCard dadosTendencia={dadosTendencia} />
    </>
  );
};
