
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo para a tabela
const tableData = [
  {
    id: 1,
    ctt: "CTT-0011",
    desconto: "15%",
    processo: "PRO-1234",
    consultor: "Ana Silva",
    banco: "Banco A",
    situacao: "Aprovado",
  },
  {
    id: 2,
    ctt: "CTT-0034",
    desconto: "12%",
    processo: "PRO-2245",
    consultor: "Carlos Santos",
    banco: "Banco B",
    situacao: "Em análise",
  },
  {
    id: 3,
    ctt: "CTT-0078",
    desconto: "18%",
    processo: "PRO-3322",
    consultor: "Mariana Oliveira",
    banco: "Banco C",
    situacao: "Pendente",
  },
  {
    id: 4,
    ctt: "CTT-0091",
    desconto: "10%",
    processo: "PRO-4455",
    consultor: "Ricardo Ferreira",
    banco: "Banco A",
    situacao: "Aprovado",
  },
  {
    id: 5,
    ctt: "CTT-0102",
    desconto: "22%",
    processo: "PRO-5566",
    consultor: "Juliana Costa",
    banco: "Banco D",
    situacao: "Recusado",
  },
];

// Função para determinar a cor do status
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "aprovado":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pendente":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "em análise":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "recusado":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const DataTable = () => {
  return (
    <Card className="h-[450px] overflow-hidden">
      <CardHeader>
        <CardTitle className="dark:text-[#D9B300]">Últimos Processos</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80">
          Processos mais recentes adicionados ao sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[350px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="dark:text-[#D9B300]">CTT</TableHead>
                <TableHead className="dark:text-[#D9B300]">Desconto</TableHead>
                <TableHead className="dark:text-[#D9B300]">Processo</TableHead>
                <TableHead className="dark:text-[#D9B300]">Consultor</TableHead>
                <TableHead className="dark:text-[#D9B300]">Banco</TableHead>
                <TableHead className="dark:text-[#D9B300]">Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium dark:text-[#D9B300]">{row.ctt}</TableCell>
                  <TableCell className="dark:text-[#D9B300]">{row.desconto}</TableCell>
                  <TableCell className="dark:text-[#D9B300]">{row.processo}</TableCell>
                  <TableCell className="dark:text-[#D9B300]">{row.consultor}</TableCell>
                  <TableCell className="dark:text-[#D9B300]">{row.banco}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(row.situacao)}`}>
                      {row.situacao}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
