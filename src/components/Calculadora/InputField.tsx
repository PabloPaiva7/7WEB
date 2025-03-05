
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

export function InputField({ id, label, value, onChange, placeholder, icon }: InputFieldProps) {
  const { toast } = useToast();

  const copiarValor = () => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: "Copiado!",
        description: `O valor do campo ${label} foi copiado para a área de transferência.`,
      });
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id}>{label}</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={copiarValor}
          className="h-6"
        >
          <Copy className="h-3 w-3 mr-1" />
          Copiar
        </Button>
      </div>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={icon ? "pr-8" : ""}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
