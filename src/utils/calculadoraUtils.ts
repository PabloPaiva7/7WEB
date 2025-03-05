
export const formatarMoeda = (valor: string): string => {
  const numero = valor.replace(/[^\d]/g, '');
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(numero) / 100);
};

export const limparValorNumerico = (valor: string): number => {
  return parseFloat(valor.replace(/[^\d.-]/g, ''));
};

export const calcularDescontoPorPorcentagem = (saldo: number, percentagem: number): number => {
  return (saldo * percentagem) / 100;
};

export const calcularPorcentagemDesconto = (saldo: number, desconto: number): number => {
  return (desconto / saldo) * 100;
};
