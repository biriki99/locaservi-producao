import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Usuario, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Usuarios() {
  const { usuarios, updateUsuario } = useData();
  const { userRole } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user_comum");

  // Verificar se o usuário é admin
  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAprovar = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setSelectedRole(usuario.role === "nenhum" ? "user_comum" : usuario.role);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!editingUsuario) return;

    try {
      await updateUsuario(editingUsuario.id, selectedRole);
      setIsDialogOpen(false);
      setEditingUsuario(null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const config = {
      admin: { label: "Administrador", className: "bg-primary text-primary-foreground" },
      user_comum: { label: "Usuário", className: "bg-secondary text-secondary-foreground" },
      nenhum: { label: "Pendente", className: "bg-warning text-warning-foreground" }
    };
    
    const { label, className } = config[role as keyof typeof config] || config.nenhum;
    return <Badge className={className}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      ativo: { label: "Ativo", className: "bg-success text-success-foreground" },
      pendente: { label: "Pendente", className: "bg-warning text-warning-foreground" },
      inativo: { label: "Inativo", className: "bg-destructive text-destructive-foreground" }
    };
    
    const { label, className } = config[status as keyof typeof config] || config.pendente;
    return <Badge className={className}>{label}</Badge>;
  };

  const columns = [
    { header: "Nome", accessor: "nome" as keyof Usuario, sortable: true },
    { header: "Email", accessor: "email" as keyof Usuario },
    { 
      header: "Papel", 
      accessor: ((item: Usuario) => getRoleBadge(item.role)) as any
    },
    { 
      header: "Status", 
      accessor: ((item: Usuario) => getStatusBadge(item.status)) as any
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie usuários e permissões</p>
        </div>
      </div>

      <DataTable
        data={usuarios}
        columns={columns}
        onEdit={handleAprovar}
        searchPlaceholder="Buscar usuários..."
        emptyMessage="Nenhum usuário cadastrado"
        canEdit={true}
        canDelete={false}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Usuário</DialogTitle>
            <DialogDescription>
              Altere o papel e o status do usuário
            </DialogDescription>
          </DialogHeader>

          {editingUsuario && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Usuário</Label>
                <div className="rounded-lg border p-3 bg-muted">
                  <p className="font-medium">{editingUsuario.nome}</p>
                  <p className="text-sm text-muted-foreground">{editingUsuario.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: UserRole) => setSelectedRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user_comum">Usuário Comum</SelectItem>
                    <SelectItem value="nenhum">Pendente (Sem Acesso)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {selectedRole === "admin" && "Acesso total ao sistema"}
                  {selectedRole === "user_comum" && "Acesso de leitura"}
                  {selectedRole === "nenhum" && "Sem acesso - conta pendente"}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
