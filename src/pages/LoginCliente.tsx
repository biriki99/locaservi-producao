import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validations";
import { Smartphone } from "lucide-react";

export default function LoginCliente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userRole) {
      if (userRole === 'nenhum') {
        navigate("/pendente");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, userRole, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = loginSchema.safeParse({ email, password });
      
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { error } = await signIn(result.data.email, result.data.password);
      
      if (error) {
        toast.error(error.message || "Erro ao fazer login");
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Locaservi</h1>
          <p className="text-muted-foreground">Acesso do Cliente</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
            {loading ? "Entrando..." : "Acessar Sistema"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Problemas para acessar?{" "}
            <a href="mailto:suporte@locaservi.com.br" className="text-primary hover:underline">
              Fale com o suporte
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
