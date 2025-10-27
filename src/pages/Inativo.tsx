import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useEffect } from "react";

export default function Inativo() {
  const { signOut, userName, userStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário não está inativo, redirecionar
    if (userStatus && userStatus !== 'inativo') {
      navigate("/dashboard");
    }
  }, [userStatus, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center card-shadow">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold">Conta Inativada</h1>
        
        <p className="mb-6 text-muted-foreground">
          Olá, <span className="font-medium">{userName}</span>! Sua conta foi desativada por um administrador.
          <br /><br />
          Você não possui mais acesso ao sistema. Se acredita que isso é um erro, entre em contato com o administrador.
        </p>

        <div className="space-y-3">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sair
          </Button>
        </div>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-xs text-muted-foreground">
            Para solicitar a reativação da sua conta, entre em contato em contato@crm.com.br
          </p>
        </div>
      </Card>
    </div>
  );
}
