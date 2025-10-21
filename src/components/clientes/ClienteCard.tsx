import { Cliente } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, User, Building2, Mail, Phone, MapPin } from "lucide-react";

interface ClienteCardProps {
  cliente: Cliente;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const getTipoBadge = (cpfCnpj: string) => {
  if (!cpfCnpj) return null;
  const numeros = cpfCnpj.replace(/\D/g, '');
  const isPJ = numeros.length > 11;
  
  return isPJ ? (
    <Badge variant="secondary" className="gap-1">
      <Building2 className="h-3 w-3" />
      Pessoa Jurídica
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1">
      <User className="h-3 w-3" />
      Pessoa Física
    </Badge>
  );
};

export const ClienteCard = ({ 
  cliente, 
  onEdit, 
  onDelete, 
  onView, 
  canEdit, 
  canDelete 
}: ClienteCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Nome */}
          <h3 className="text-lg font-bold mb-1 truncate">{cliente.nome}</h3>
          
          {/* Tipo de Pessoa */}
          {cliente.cpf_cnpj && (
            <div className="mb-3">
              {getTipoBadge(cliente.cpf_cnpj)}
            </div>
          )}
          
          {/* Contato */}
          <div className="space-y-2 mb-3">
            {cliente.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{cliente.email}</span>
              </div>
            )}
            {cliente.telefone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{cliente.telefone}</span>
              </div>
            )}
            {cliente.endereco && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="line-clamp-1">{cliente.endereco}</span>
              </div>
            )}
          </div>
          
          {/* Observações */}
          {cliente.observacoes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {cliente.observacoes}
            </p>
          )}
        </div>
        
        {/* Ações */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-1">
            {onView && (
              <Button variant="ghost" size="icon" onClick={onView} title="Visualizar">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {canEdit && onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} title="Excluir">
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
