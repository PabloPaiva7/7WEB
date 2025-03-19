
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clipboard, Car, Save, BarChart, Trash, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFipeTable, FipeRecord } from "@/hooks/useFipeTable";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export function TabelaFipe() {
  const {
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
  } = useFipeTable();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Consulta Tabela FIPE</CardTitle>
          <CardDescription>
            Consulte o valor de referência de veículos com base na Tabela FIPE.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
                <Select 
                  disabled={isLoading}
                  value={tipoVeiculo} 
                  onValueChange={(value) => setTipoVeiculo(value as 'carros' | 'motos' | 'caminhoes')}
                >
                  <SelectTrigger id="tipoVeiculo" aria-label="Selecione o tipo de veículo">
                    <SelectValue placeholder="Selecione o tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carros">Carros</SelectItem>
                    <SelectItem value="motos">Motos</SelectItem>
                    <SelectItem value="caminhoes">Caminhões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="marca">Marca</Label>
                <Select 
                  disabled={isLoading || marcas.length === 0} 
                  value={selectedMarca} 
                  onValueChange={setSelectedMarca}
                >
                  <SelectTrigger id="marca" aria-label="Selecione a marca do veículo">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca.codigo} value={marca.codigo}>{marca.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Select 
                  disabled={isLoading || modelos.length === 0} 
                  value={selectedModelo} 
                  onValueChange={setSelectedModelo}
                >
                  <SelectTrigger id="modelo" aria-label="Selecione o modelo do veículo">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelos.map((modelo) => (
                      <SelectItem key={modelo.codigo} value={modelo.codigo}>{modelo.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="ano">Ano/Combustível</Label>
                <Select 
                  disabled={isLoading || anos.length === 0} 
                  value={selectedAno} 
                  onValueChange={setSelectedAno}
                >
                  <SelectTrigger id="ano" aria-label="Selecione o ano e combustível do veículo">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano.codigo} value={ano.codigo}>{ano.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-primary/5 rounded-lg p-6" aria-live="polite" aria-atomic="true">
              <div className="text-center">
                <h2 className="text-lg font-medium text-muted-foreground mb-1">Valor FIPE</h2>
                <div className="text-4xl font-bold text-primary mb-4">
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin h-8 w-8 mx-auto" aria-hidden="true" />
                      <span className="sr-only">Carregando resultado...</span>
                    </>
                  ) : (
                    valorFipe ? valorFipe.Valor : "Faça uma consulta"
                  )}
                </div>
                {valorFipe && (
                  <div className="text-sm mb-4">
                    <p>Código FIPE: {valorFipe.CodigoFipe}</p>
                    <p>Combustível: {valorFipe.Combustivel}</p>
                    <p>Mês Referência: {valorFipe.MesReferencia}</p>
                  </div>
                )}
                <div className="space-x-2">
                  <Button 
                    variant="secondary"
                    className="gap-2"
                    disabled={!valorFipe || isLoading}
                    onClick={copiarValor}
                    aria-label="Copiar valor para a área de transferência"
                  >
                    <Clipboard className="h-4 w-4" aria-hidden="true" />
                    Copiar Valor
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    disabled={!valorFipe || isLoading}
                    onClick={salvarConsulta}
                    aria-label="Salvar esta consulta no histórico"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando dados...</p>
          ) : valorFipe ? (
            <p className="text-sm text-muted-foreground">
              {valorFipe.Marca} {valorFipe.Modelo} ({valorFipe.AnoModelo} - {valorFipe.Combustivel})
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Preencha os campos para consultar o valor</p>
          )}
        </CardFooter>
      </Card>

      {/* Histórico de Consultas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Histórico de Consultas</CardTitle>
            <CardDescription>
              {historico.length} consultas salvas
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMostrarHistorico(!mostrarHistorico)}
              aria-expanded={mostrarHistorico}
              aria-controls="historico-content"
            >
              {mostrarHistorico ? "Ocultar" : "Mostrar"}
            </Button>
            {historico.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={limparHistorico}
                aria-label="Limpar todo o histórico de consultas"
              >
                <Trash className="h-4 w-4 mr-1" aria-hidden="true" />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        {mostrarHistorico && historico.length > 0 && (
          <CardContent id="historico-content">
            <div className="rounded-md border overflow-hidden">
              <Table aria-label="Histórico de consultas da tabela FIPE">
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.marca} {record.modelo}</div>
                        <div className="text-sm text-muted-foreground">{record.ano} - {record.combustivel}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{record.valor}</div>
                        <div className="text-xs text-muted-foreground">Código FIPE: {record.codigoFipe}</div>
                      </TableCell>
                      <TableCell>
                        {record.data.toLocaleDateString()} {record.data.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => carregarConsulta(record)}
                            aria-label={`Carregar consulta: ${record.marca} ${record.modelo}`}
                          >
                            Carregar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => excluirConsulta(record.id)}
                            aria-label={`Excluir consulta: ${record.marca} ${record.modelo}`}
                          >
                            <Trash className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
        {mostrarHistorico && historico.length === 0 && (
          <CardContent id="historico-content">
            <div className="p-8 text-center text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-20" aria-hidden="true" />
              <p>Nenhuma consulta salva. Faça uma consulta e salve-a para visualizar aqui.</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
