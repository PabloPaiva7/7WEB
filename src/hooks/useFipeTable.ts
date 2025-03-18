
import { useState, useEffect } from 'react';
import { FipeService, TipoVeiculo, Marca, Modelo, Ano, ValorFipe } from '@/services/FipeService';
import { useToast } from '@/hooks/use-toast';
import { v4 } from '@/lib/utils';

// Define the record structure for saved vehicles
export interface FipeRecord {
  id: string;
  tipoVeiculo: TipoVeiculo;
  marca: string;
  modelo: string;
  ano: string;
  valor: string;
  codigoFipe: string;
  combustivel: string;
  data: Date;
}

export function useFipeTable() {
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>('carros');
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [selectedModelo, setSelectedModelo] = useState<string>('');
  const [anos, setAnos] = useState<Ano[]>([]);
  const [selectedAno, setSelectedAno] = useState<string>('');
  const [valorFipe, setValorFipe] = useState<ValorFipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historico, setHistorico] = useState<FipeRecord[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false);
  const { toast } = useToast();

  // Load saved records from localStorage on component mount
  useEffect(() => {
    const savedHistorico = localStorage.getItem('fipe-historico');
    if (savedHistorico) {
      try {
        const parsed = JSON.parse(savedHistorico);
        setHistorico(parsed.map((item: any) => ({
          ...item,
          data: new Date(item.data)
        })));
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
      }
    }
  }, []);

  // Save records to localStorage when historico changes
  useEffect(() => {
    if (historico.length > 0) {
      localStorage.setItem('fipe-historico', JSON.stringify(historico));
    }
  }, [historico]);

  // Load marcas when tipoVeiculo changes
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setIsLoading(true);
        const data = await FipeService.getMarcas(tipoVeiculo);
        setMarcas(data);
        // Reset selection
        setSelectedMarca('');
        setModelos([]);
        setSelectedModelo('');
        setAnos([]);
        setSelectedAno('');
        setValorFipe(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar marcas de veículos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarcas();
  }, [tipoVeiculo, toast]);

  // Load modelos when marca changes
  useEffect(() => {
    if (!selectedMarca) return;

    const fetchModelos = async () => {
      try {
        setIsLoading(true);
        const data = await FipeService.getModelos(tipoVeiculo, selectedMarca);
        setModelos(data.modelos);
        // Reset model and year selection
        setSelectedModelo('');
        setAnos([]);
        setSelectedAno('');
        setValorFipe(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar modelos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelos();
  }, [selectedMarca, tipoVeiculo, toast]);

  // Load anos when modelo changes
  useEffect(() => {
    if (!selectedMarca || !selectedModelo) return;

    const fetchAnos = async () => {
      try {
        setIsLoading(true);
        const data = await FipeService.getAnos(tipoVeiculo, selectedMarca, selectedModelo);
        setAnos(data);
        // Reset year selection
        setSelectedAno('');
        setValorFipe(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar anos disponíveis.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnos();
  }, [selectedMarca, selectedModelo, tipoVeiculo, toast]);

  // Load valor when ano changes
  useEffect(() => {
    if (!selectedMarca || !selectedModelo || !selectedAno) return;

    const fetchValor = async () => {
      try {
        setIsLoading(true);
        const data = await FipeService.getValor(tipoVeiculo, selectedMarca, selectedModelo, selectedAno);
        setValorFipe(data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao consultar valor FIPE.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchValor();
  }, [selectedMarca, selectedModelo, selectedAno, tipoVeiculo, toast]);

  const salvarConsulta = () => {
    if (!valorFipe) {
      toast({
        title: "Consulta incompleta",
        description: "Por favor, complete a consulta antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const marcaNome = marcas.find(m => m.codigo === selectedMarca)?.nome || '';
    const modeloNome = modelos.find(m => m.codigo === selectedModelo)?.nome || '';
    const anoNome = anos.find(a => a.codigo === selectedAno)?.nome || '';

    const novaConsulta: FipeRecord = {
      id: v4(),
      tipoVeiculo,
      marca: marcaNome,
      modelo: modeloNome,
      ano: anoNome,
      valor: valorFipe.Valor,
      codigoFipe: valorFipe.CodigoFipe,
      combustivel: valorFipe.Combustivel,
      data: new Date()
    };

    setHistorico(prev => [novaConsulta, ...prev]);
    
    toast({
      title: "Consulta salva",
      description: "A consulta foi salva no histórico.",
    });
  };

  const carregarConsulta = async (record: FipeRecord) => {
    try {
      setTipoVeiculo(record.tipoVeiculo);
      
      // Await the marcas to load first
      const marcasData = await FipeService.getMarcas(record.tipoVeiculo);
      setMarcas(marcasData);
      
      // Find the marca by name
      const marca = marcasData.find(m => m.nome === record.marca);
      if (!marca) throw new Error("Marca não encontrada");
      setSelectedMarca(marca.codigo);
      
      // Load modelos and wait for them
      const modelosData = await FipeService.getModelos(record.tipoVeiculo, marca.codigo);
      setModelos(modelosData.modelos);
      
      // Find the modelo by name
      const modelo = modelosData.modelos.find(m => m.nome === record.modelo);
      if (!modelo) throw new Error("Modelo não encontrado");
      setSelectedModelo(modelo.codigo);
      
      // Load anos and wait for them
      const anosData = await FipeService.getAnos(record.tipoVeiculo, marca.codigo, modelo.codigo);
      setAnos(anosData);
      
      // Find the ano by name/codigo
      const ano = anosData.find(a => a.nome === record.ano);
      if (!ano) throw new Error("Ano não encontrado");
      setSelectedAno(ano.codigo);
      
      toast({
        title: "Consulta carregada",
        description: "Os valores da consulta foram carregados.",
      });
    } catch (error) {
      console.error("Erro ao carregar consulta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar esta consulta. Os dados podem estar desatualizados.",
        variant: "destructive",
      });
    }
  };

  const excluirConsulta = (id: string) => {
    setHistorico(prev => prev.filter(record => record.id !== id));
    
    toast({
      title: "Consulta excluída",
      description: "A consulta foi removida do histórico.",
    });
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('fipe-historico');
    
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico de consultas foi apagado.",
    });
  };

  const copiarValor = () => {
    if (!valorFipe) {
      toast({
        title: "Valor não disponível",
        description: "Não há valor para copiar.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(valorFipe.Valor);
    toast({
      title: "Valor copiado",
      description: "O valor FIPE foi copiado para a área de transferência.",
    });
  };

  return {
    tipoVeiculo,
    setTipoVeiculo,
    marcas,
    selectedMarca,
    setSelectedMarca,
    modelos,
    selectedModelo,
    setSelectedModelo,
    anos,
    selectedAno,
    setSelectedAno,
    valorFipe,
    isLoading,
    historico,
    mostrarHistorico,
    setMostrarHistorico,
    salvarConsulta,
    carregarConsulta,
    excluirConsulta,
    limparHistorico,
    copiarValor
  };
}
