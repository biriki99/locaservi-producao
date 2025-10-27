import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { loginSchema, signupSchema } from "@/lib/validations";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const {
    signIn,
    signUp,
    user,
    userRole
  } = useAuth();
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
      // Validate login data with zod
      const result = loginSchema.safeParse({
        email,
        password
      });
      if (!result.success) {
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }
      const {
        error
      } = await signIn(result.data.email, result.data.password);
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
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate signup data with zod
      const result = signupSchema.safeParse({
        nome,
        email,
        password
      });
      if (!result.success) {
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }
      const {
        error
      } = await signUp(result.data.email, result.data.password, result.data.nome);
      if (error) {
        toast.error(error.message || "Erro ao criar conta");
      } else {
        toast.success("Conta criada! Aguarde aprovação do administrador.");
        // Limpar campos
        setEmail("");
        setPassword("");
        setNome("");
        // Mudar para aba de login
        setActiveTab("login");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };
  return <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 card-shadow">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground px-[70px]">
            <span className="text-2xl font-bold">LocaServi</span>
          </div>
          <h1 className="text-2xl font-bold">Sistema de Gestão</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Faça login ou crie sua conta
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input id="email-login" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-login">Senha</Label>
                <Input id="password-login" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="cadastro">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" type="text" placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-signup">Senha</Label>
                <Input id="password-signup" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-xs text-muted-foreground">
            Após criar sua conta, aguarde a aprovação do administrador para acessar o sistema.
          </p>
        </div>
      </Card>
    </div>;
}