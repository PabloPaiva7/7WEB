
import { useMuralAnuncios } from "@/hooks/useMuralAnuncios";
import { useMuralInterativo } from "@/hooks/useMuralInterativo";
import { FiltroAnuncios } from "@/components/Mural/FiltroAnuncios";
import { AnuncioForm } from "@/components/Mural/AnuncioForm";
import { MuralHeader } from "@/components/Mural/MuralHeader";
import { MuralContent } from "@/components/Mural/MuralContent";
import { ExcluirAnuncioDialog } from "@/components/Mural/ExcluirAnuncioDialog";
import { Aniversariantes } from "@/components/Mural/Aniversariantes";
import { ConteudosRecomendados } from "@/components/Mural/ConteudosRecomendados";
import { DicasHacks } from "@/components/Mural/DicasHacks";
import { QuizEnquete } from "@/components/Mural/QuizEnquete";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Cake, BookOpen, Lightbulb, BarChart } from "lucide-react";

export default function Mural() {
  const {
    anunciosFiltrados,
    anuncioSelecionado,
    mostrarNovoAnuncio,
    filtroTexto,
    filtroTipo,
    visualizacao,
    excluirId,
    modoVisualizacao,
    setMostrarNovoAnuncio,
    setFiltroTexto,
    setFiltroTipo,
    setVisualizacao,
    setAnuncioSelecionado,
    setExcluirId,
    handleSalvarAnuncio,
    handleEditar,
    handleExcluir,
    confirmarExclusao,
    toggleModoVisualizacao,
    handleUpdate
  } = useMuralAnuncios();

  const {
    aniversariantesDoDia,
    aniversariantesDaSemana,
    aniversariantesDoMes,
    conteudosFiltrados,
    dicasFiltradas,
    quizzes,
    filtroConteudo,
    filtroDica,
    filtroQuiz,
    setFiltroConteudo,
    setFiltroDica,
    setFiltroQuiz,
    adicionarAniversariante,
    editarAniversariante,
    excluirAniversariante,
    adicionarConteudo,
    editarConteudo,
    excluirConteudo,
    adicionarDica,
    editarDica,
    excluirDica,
    curtirDica,
    adicionarQuiz,
    editarQuiz,
    excluirQuiz,
    votarQuiz,
    alternarAtivoQuiz
  } = useMuralInterativo();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mural</h1>
        <p className="text-muted-foreground mt-1">Central de Informações e Engajamento Corporativo</p>
      </div>
      
      <MuralHeader 
        visualizacao={visualizacao}
        setVisualizacao={setVisualizacao}
        modoVisualizacao={modoVisualizacao}
        toggleModoVisualizacao={toggleModoVisualizacao}
      />
      
      <Tabs defaultValue="anuncios" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="anuncios" className="flex items-center">
            <Megaphone className="h-4 w-4 mr-2 text-purple-500" />
            Anúncios
          </TabsTrigger>
          <TabsTrigger value="aniversariantes" className="flex items-center">
            <Cake className="h-4 w-4 mr-2 text-pink-500" />
            Aniversariantes
          </TabsTrigger>
          <TabsTrigger value="conteudos" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
            Conteúdos Recomendados
          </TabsTrigger>
          <TabsTrigger value="dicas" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
            Dicas e Hacks
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-green-500" />
            Quiz e Enquetes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="anuncios">
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-medium">Anúncios e Comunicados</h2>
            <p className="text-sm text-muted-foreground">
              Fique por dentro dos treinamentos, mudanças e avisos corporativos.
              Anúncios marcados como importantes aparecem destacados.
            </p>
          </div>
          
          <FiltroAnuncios
            filtroTexto={filtroTexto}
            setFiltroTexto={setFiltroTexto}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            setMostrarNovoAnuncio={setMostrarNovoAnuncio}
          />
          
          <MuralContent 
            anuncios={anunciosFiltrados}
            filtroTexto={filtroTexto}
            filtroTipo={filtroTipo}
            modoVisualizacao={modoVisualizacao}
            onEdit={handleEditar}
            onDelete={handleExcluir}
            onUpdate={handleUpdate}
          />
        </TabsContent>
        
        <TabsContent value="aniversariantes">
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-medium">Aniversariantes</h2>
            <p className="text-sm text-muted-foreground">
              Celebre os aniversários da equipe. Veja quem está completando mais um ano de vida hoje,
              nos próximos dias e durante este mês.
            </p>
          </div>
          
          <Aniversariantes 
            aniversariantesDoDia={aniversariantesDoDia}
            aniversariantesDaSemana={aniversariantesDaSemana}
            aniversariantesDoMes={aniversariantesDoMes}
            onAdd={adicionarAniversariante}
            onEdit={editarAniversariante}
            onDelete={excluirAniversariante}
          />
        </TabsContent>
        
        <TabsContent value="conteudos">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-medium">Conteúdos Recomendados - Fé Cristã</h2>
            <p className="text-sm text-muted-foreground">
              Descubra livros, versículos, filmes, séries e cursos relacionados à fé cristã.
              Sugestões da empresa e compartilhamentos dos usuários.
            </p>
          </div>
          
          <ConteudosRecomendados 
            conteudos={conteudosFiltrados}
            filtroConteudo={filtroConteudo}
            setFiltroConteudo={(filtro) => setFiltroConteudo(filtro === "todos" ? "" : filtro)}
            onAdd={adicionarConteudo}
            onEdit={editarConteudo}
            onDelete={excluirConteudo}
          />
        </TabsContent>
        
        <TabsContent value="dicas">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-medium">Dicas e Hacks</h2>
            <p className="text-sm text-muted-foreground">
              Compartilhe e descubra dicas úteis sobre bem-estar, trabalho, produtividade e tecnologia.
              Curta as mais úteis e ajude a destacar as melhores dicas.
            </p>
          </div>
          
          <DicasHacks
            dicas={dicasFiltradas}
            filtroDica={filtroDica}
            setFiltroDica={(categoria) => setFiltroDica(categoria === "todos" ? "" : categoria)}
            onAdd={adicionarDica}
            onEdit={editarDica}
            onDelete={excluirDica}
            onLike={curtirDica}
          />
        </TabsContent>
        
        <TabsContent value="quizzes">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-medium">Quiz e Enquetes</h2>
            <p className="text-sm text-muted-foreground">
              Participe de quizzes interativos e enquetes sobre preferências, opiniões, feedback e conhecimento.
              Sua participação vale pontos de engajamento!
            </p>
          </div>
          
          <QuizEnquete
            quizzes={quizzes}
            filtroQuiz={filtroQuiz}
            setFiltroQuiz={setFiltroQuiz}
            onAdd={adicionarQuiz}
            onEdit={editarQuiz}
            onDelete={excluirQuiz}
            onVote={votarQuiz}
            onToggleActive={alternarAtivoQuiz}
          />
        </TabsContent>
      </Tabs>
      
      <AnuncioForm
        anuncio={anuncioSelecionado}
        isOpen={mostrarNovoAnuncio}
        onClose={() => {
          setMostrarNovoAnuncio(false);
          setAnuncioSelecionado(undefined);
        }}
        onSave={handleSalvarAnuncio}
      />
      
      <ExcluirAnuncioDialog 
        isOpen={!!excluirId}
        onClose={() => setExcluirId(null)}
        onConfirm={confirmarExclusao}
      />
    </div>
  );
}
