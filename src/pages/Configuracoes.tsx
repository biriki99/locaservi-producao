import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

export default function Configuracoes() {
  const { user, userName, userRole } = useAuth();

  const getRoleLabel = (role: UserRole | null) => {
    if (!role) return "Carregando...";
    const labels = {
      admin: "Administrador",
      user_comum: "Usuário Comum",
      nenhum: "Pendente"
    };
    return labels[role];
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
            <CardDescription>Dados da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Nome</Label>
              <p className="font-medium">{userName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Papel Atual</Label>
              <div className="mt-1">
                <Badge className="bg-primary text-primary-foreground">
                  {getRoleLabel(userRole)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>Versão e configurações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Versão</Label>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Backend</Label>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Conectado ao Supabase
                </Badge>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Tecnologias</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Supabase</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Shadcn UI</Badge>
                  <Badge variant="secondary">Recharts</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
