import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useEffect } from "react";

export default function Pendente() {
  const { signOut, userName, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário não está com role "nenhum", redirecionar para dashboard
    if (userRole && userRole !== 'nenhum') {
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center card-shadow">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
          <Clock className="h-10 w-10 text-warning" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold">Conta Pendente de Aprovação</h1>
        
        <p className="mb-6 text-muted-foreground">
          Olá, <span className="font-medium">{userName}</span>! Sua conta ainda está em processo de aprovação.
          <br /><br />
          Um administrador irá revisar seu cadastro em breve. Você receberá um email quando sua conta for ativada.
        </p>

        <div className="space-y-3">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sair
          </Button>
        </div>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-xs text-muted-foreground">
            Se você acredita que isso é um erro, entre em contato com o suporte em contato@locaservi.com.br
          </p>
        </div>
      </Card>
    </div>
  );
}
