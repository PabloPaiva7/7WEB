
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="space-y-4 text-center">
        <div className="text-destructive text-3xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold">Erro ao carregar a agenda</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={onRetry}>Tentar novamente</Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
