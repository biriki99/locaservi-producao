import { LogOut, User, Menu, ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type SidebarState = 'open' | 'mini' | 'closed';

interface TopbarProps {
  onMenuToggle?: () => void;
  sidebarState?: SidebarState;
  sidebarPinned?: boolean;
  isMobile?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle, sidebarState, sidebarPinned = false, isMobile = false }) => {
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

  // Determinar título e ícone do botão toggle
  const getToggleInfo = () => {
    if (isMobile) {
      return {
        icon: sidebarState === 'open' ? ChevronLeft : Menu,
        title: sidebarState === 'open' ? 'Fechar menu' : 'Abrir menu'
      };
    }
    
    if (sidebarPinned) {
      return {
        icon: Lock,
        title: 'Menu fixado - Clique no ícone de pin na barra lateral para desfixar',
        className: 'text-primary'
      };
    }
    
    return {
      icon: sidebarState === 'open' ? ChevronLeft : Menu,
      title: sidebarState === 'open' ? 'Minimizar menu' : 'Expandir menu'
    };
  };

  const toggleInfo = getToggleInfo();
  const ToggleIcon = toggleInfo.icon;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6">
      {/* Toggle button - sempre visível */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onMenuToggle}
        className="flex-shrink-0"
        title={toggleInfo.title}
      >
        <ToggleIcon className={`h-5 w-5 ${toggleInfo.className || ''}`} />
      </Button>
      
      {/* Logo e título */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
          <span className="text-sm font-bold">LS</span>
        </div>
        <span className="text-lg font-semibold truncate">
          LocaServi
          <span className="hidden md:inline"> - Sistema de Gestão</span>
        </span>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                  {badge && (
                    <span className={`mt-1 inline-flex w-fit rounded-full px-2 py-0.5 text-xs ${badge.className}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};