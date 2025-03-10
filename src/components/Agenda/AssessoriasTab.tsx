
import { useState, useEffect } from "react";
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { assessoriasExemplo } from "@/data/agendaData";
import { verificarDisponibilidade, formatarHorarioFuncionamento } from "@/utils/agendaUtils";
import { Assessoria } from "@/types/agenda.types";

interface AssessoriasTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AssessoriasTab = ({ searchTerm, setSearchTerm }: AssessoriasTabProps) => {
  const [disponibilidadeAssessorias, setDisponibilidadeAssessorias] = useState<Record<string, boolean>>({});

  // Efeito para verificar a disponibilidade das assessorias
  useEffect(() => {
    const checkDisponibilidade = () => {
      const disponibilidade: Record<string, boolean> = {};
      
      assessoriasExemplo.forEach(assessoria => {
        disponibilidade[assessoria.id] = verificarDisponibilidade(assessoria.horarioFuncionamento);
      });
      
      setDisponibilidadeAssessorias(disponibilidade);
    };
    
    // Verifica a disponibilidade inicialmente
    checkDisponibilidade();
    
    // Configura um intervalo para verificar a disponibilidade a cada minuto
    const intervalId = setInterval(checkDisponibilidade, 60000);
    
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  // Filtrar assessorias
  const assessoriasFiltradas = assessoriasExemplo.filter(assessoria => {
    return (
      assessoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessoria.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessoria.telefone.includes(searchTerm) ||
      assessoria.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessoria.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Assessorias</CardTitle>
        <CardDescription>Contatos de assessorias parceiras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar assessoria por nome, contato..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessoriasFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhuma assessoria encontrada com os filtros selecionados.
            </div>
          ) : (
            assessoriasFiltradas.map((assessoria) => (
              <Card key={assessoria.id}>
                <CardHeader className="pb-2 relative">
                  {/* Ícone de disponibilidade no canto superior esquerdo */}
                  <div className="absolute top-3 left-3">
                    <StatusIcon disponivel={disponibilidadeAssessorias[assessoria.id] || false} />
                  </div>
                  
                  <div className="flex justify-end">
                    <StatusIndicator disponivel={disponibilidadeAssessorias[assessoria.id] || false} />
                  </div>
                  <CardTitle className="text-lg mt-2">{assessoria.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{assessoria.contato}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{assessoria.telefone}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{assessoria.email}</span>
                    </div>

                    <div className="flex items-start text-sm">
                      <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                      <span>{assessoria.endereco}</span>
                    </div>

                    <div className="flex items-start text-sm">
                      <Clock className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                      <span>{formatarHorarioFuncionamento(assessoria.horarioFuncionamento)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para ícone de status no canto superior esquerdo
const StatusIcon = ({ disponivel }: { disponivel: boolean }) => {
  return disponivel ? (
    <CheckCircle className="w-5 h-5 text-green-600" />
  ) : (
    <XCircle className="w-5 h-5 text-red-600" />
  );
};

// Componente para indicador de status de disponibilidade
const StatusIndicator = ({ disponivel }: { disponivel: boolean }) => {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      disponivel ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}>
      {disponivel ? (
        <>
          <CheckCircle className="w-3 h-3" />
          <span>Disponível</span>
        </>
      ) : (
        <>
          <XCircle className="w-3 h-3" />
          <span>Indisponível</span>
        </>
      )}
    </div>
  );
};

export default AssessoriasTab;
