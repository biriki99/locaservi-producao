import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Configuracoes() {
  const { user, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || "user_comum");

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    switchRole(role);
    toast.success(`Papel alterado para: ${getRoleLabel(role)}`);
    
    // Recarregar a página para atualizar a navegação
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getRoleLabel = (role: UserRole) => {
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
              <p className="font-medium">{user?.nome}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Papel Atual</Label>
              <div className="mt-1">
                <Badge className="bg-primary text-primary-foreground">
                  {getRoleLabel(user?.role || "user_comum")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle>Modo Desenvolvedor</CardTitle>
            <CardDescription>
              Alterar papel do usuário para testes (apenas em modo mock)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mock-role">Simular Papel de Usuário</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: UserRole) => handleRoleChange(value)}
              >
                <SelectTrigger id="mock-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                  <SelectItem value="user_comum">Usuário Comum (Somente Leitura)</SelectItem>
                  <SelectItem value="nenhum">Pendente (Sem Acesso)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-2">Descrição dos papéis:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Admin:</strong> Vê todas páginas, pode criar/editar/deletar</li>
                <li>• <strong>Usuário:</strong> Vê dashboard e listas em modo leitura</li>
                <li>• <strong>Pendente:</strong> Redirecionado para tela de aprovação</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>Versão e configurações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Versão</Label>
              <p className="font-medium">1.0.0 (Mock)</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Modo</Label>
              <Badge variant="outline">Demonstração - Dados Mock</Badge>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Tecnologias</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Shadcn UI</Badge>
                <Badge variant="secondary">Recharts</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
