
import { Aniversariante } from "@/types/mural.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake, Users, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AniversariantesProps {
  aniversariantesDoDia: Aniversariante[];
  aniversariantesDaSemana: Aniversariante[];
  aniversariantesDoMes: Aniversariante[];
}

export const Aniversariantes = ({ 
  aniversariantesDoDia, 
  aniversariantesDaSemana, 
  aniversariantesDoMes 
}: AniversariantesProps) => {
  // Formatar data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Aniversariantes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aniversariantes do Dia */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Hoje</CardTitle>
              <Cake className="h-5 w-5 text-pink-500" />
            </div>
            <CardDescription>
              {aniversariantesDoDia.length} aniversariante(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aniversariantesDoDia.length > 0 ? (
              <ul className="space-y-3">
                {aniversariantesDoDia.map(aniversariante => (
                  <li key={aniversariante.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={aniversariante.foto} />
                      <AvatarFallback className="bg-pink-100 text-pink-500">
                        {aniversariante.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{aniversariante.nome}</p>
                      <p className="text-sm text-muted-foreground">{aniversariante.departamento}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum aniversariante hoje
              </p>
            )}
          </CardContent>
        </Card>

        {/* Aniversariantes da Semana */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Próximos Dias</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>
              {aniversariantesDaSemana.length} aniversariante(s) da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aniversariantesDaSemana.length > 0 ? (
              <ul className="space-y-3">
                {aniversariantesDaSemana.map(aniversariante => (
                  <li key={aniversariante.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={aniversariante.foto} />
                      <AvatarFallback className="bg-blue-100 text-blue-500">
                        {aniversariante.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{aniversariante.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {aniversariante.departamento} • {formatarData(aniversariante.data)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum aniversariante nos próximos dias
              </p>
            )}
          </CardContent>
        </Card>

        {/* Aniversariantes do Mês */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Do Mês</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>
              {aniversariantesDoMes.length} aniversariante(s) este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aniversariantesDoMes.length > 0 ? (
              <ul className="space-y-3">
                {aniversariantesDoMes.map(aniversariante => (
                  <li key={aniversariante.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={aniversariante.foto} />
                      <AvatarFallback className="bg-purple-100 text-purple-500">
                        {aniversariante.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{aniversariante.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {aniversariante.departamento} • {formatarData(aniversariante.data)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum aniversariante este mês
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
