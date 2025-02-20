
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/', { replace: true });
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Registro realizado com sucesso!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro. Tente novamente.";
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirme seu email antes de fazer login.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Este email já está registrado.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      }

      toast({
        title: "Erro!",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Criar conta' : 'Login'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Carregando...' : isRegistering ? 'Registrar' : 'Entrar'}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Registre-se'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
