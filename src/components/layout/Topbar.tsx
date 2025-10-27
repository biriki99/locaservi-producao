import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export const Topbar = () => {
  const {
    user,
    userName,
    userRole,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };
  const getRoleBadge = (role: string) => {
    const badges = {
      admin: {
        label: "Administrador",
        className: "bg-primary text-primary-foreground"
      },
      user_comum: {
        label: "Usuário",
        className: "bg-muted text-muted-foreground"
      },
      nenhum: {
        label: "Pendente",
        className: "bg-warning text-warning-foreground"
      }
    };
    return badges[role as keyof typeof badges] || badges.nenhum;
  };
  const badge = userRole ? getRoleBadge(userRole) : null;
  return <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground px-[40px]">
            <span className="text-sm font-bold">LocaServi</span>
          </div>
          <span className="text-lg font-semibold">Sistema de Gestão</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  {badge && <span className={`mt-1 inline-flex w-fit rounded-full px-2 py-0.5 text-xs ${badge.className}`}>
                      {badge.label}
                    </span>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
      </div>
    </header>;
};