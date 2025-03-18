
import axios from 'axios';

const API_URL = 'https://parallelum.com.br/fipe/api/v1';

export type TipoVeiculo = 'carros' | 'motos' | 'caminhoes';

export interface Marca {
  codigo: string;
  nome: string;
}

export interface Modelo {
  codigo: string;
  nome: string;
}

export interface Ano {
  codigo: string;
  nome: string;
}

export interface ValorFipe {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

export const FipeService = {
  async getMarcas(tipoVeiculo: TipoVeiculo): Promise<Marca[]> {
    try {
      const response = await axios.get(`${API_URL}/${tipoVeiculo}/marcas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      throw error;
    }
  },

  async getModelos(tipoVeiculo: TipoVeiculo, codigoMarca: string): Promise<{ modelos: Modelo[] }> {
    try {
      const response = await axios.get(`${API_URL}/${tipoVeiculo}/marcas/${codigoMarca}/modelos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      throw error;
    }
  },

  async getAnos(tipoVeiculo: TipoVeiculo, codigoMarca: string, codigoModelo: string): Promise<Ano[]> {
    try {
      const response = await axios.get(`${API_URL}/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anos:', error);
      throw error;
    }
  },

  async getValor(tipoVeiculo: TipoVeiculo, codigoMarca: string, codigoModelo: string, ano: string): Promise<ValorFipe> {
    try {
      const response = await axios.get(`${API_URL}/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${ano}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar valor:', error);
      throw error;
    }
  }
};
