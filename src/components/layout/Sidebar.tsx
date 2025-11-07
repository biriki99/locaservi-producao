import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Wrench,
  MessageSquare,
  FileBarChart,
  UserCog,
  Settings,
  AlertCircle,
  Pin,
  PinOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "user_comum"] },
  { name: "Clientes", href: "/clientes", icon: Users, roles: ["admin", "user_comum"] },
  { name: "Categorias", href: "/categorias", icon: Package, roles: ["admin"] },
  { name: "Serviços", href: "/servicos", icon: Wrench, roles: ["admin", "user_comum"] },
  { name: "Alertas", href: "/alertas", icon: AlertCircle, roles: ["admin", "user_comum"], hasBadge: true },
  { name: "Leads", href: "/leads", icon: MessageSquare, roles: ["admin", "user_comum"] },
  { name: "Relatórios", href: "/relatorios", icon: FileBarChart, roles: ["admin", "user_comum"] },
  { name: "Usuários", href: "/usuarios", icon: UserCog, roles: ["admin"] },
  { name: "Configurações", href: "/configuracoes", icon: Settings, roles: ["admin", "user_comum"] }
];

type SidebarState = 'open' | 'mini' | 'closed';

interface SidebarProps {
  state: SidebarState;
  onClose?: () => void;
  isMobile: boolean;
  isPinned?: boolean;
  onPinToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onClose, isMobile, isPinned = false, onPinToggle }) => {
  const { userRole } = useAuth();
  const { servicos } = useData();

  // Calcular serviços atrasados
  const servicosAtrasados = servicos.filter(s => {
    if (s.status !== 'pendente') return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fim = new Date(s.data_fim);
    fim.setHours(0, 0, 0, 0);
    return fim < hoje;
  }).length;

  const visibleNavigation = navigation.filter(item => 
    item.roles.includes(userRole || "nenhum")
  );

  const showText = state === 'open';
  const sidebarWidth = state === 'open' ? 'w-64' : state === 'mini' ? 'w-16' : 'w-0';

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out overflow-hidden shadow-lg",
        sidebarWidth,
        isMobile && state === 'closed' && '-translate-x-full',
        isMobile ? 'z-40' : 'z-10'
      )}
    >
      {/* Header - apenas visível quando está aberta */}
      {state === 'open' && (
        <div className="flex h-16 items-center border-b px-4 flex-shrink-0 justify-between bg-sidebar">
          <span className="text-lg font-semibold text-sidebar-foreground truncate">Navegação</span>
          
          {/* Botão de pin - apenas em desktop */}
          {!isMobile && onPinToggle && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPinToggle}
                    className={cn(
                      "h-9 w-9 flex-shrink-0 transition-all hover:bg-sidebar-accent",
                      isPinned && "bg-primary/10"
                    )}
                  >
                    {isPinned ? (
                      <Pin className="h-4 w-4 fill-current text-primary" />
                    ) : (
                      <PinOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">
                    {isPinned ? "Desfixar menu (permite minimizar)" : "Fixar menu (sempre visível)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      
      {/* Espaçador + botão de pin quando está mini */}
      {state === 'mini' && (
        <div className="h-16 flex-shrink-0 flex items-center justify-center border-b bg-sidebar">
          {!isMobile && onPinToggle && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPinToggle}
                    className={cn(
                      "h-9 w-9 transition-all hover:bg-sidebar-accent",
                      isPinned && "bg-primary/10"
                    )}
                  >
                    {isPinned ? (
                      <Pin className="h-4 w-4 fill-current text-primary" />
                    ) : (
                      <PinOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-sm">
                    {isPinned ? "Desfixar menu (permite minimizar)" : "Fixar menu (sempre visível)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto no-scrollbar">
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          const showBadge = item.hasBadge && servicosAtrasados > 0;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              title={!showText ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all min-h-[44px] touch-target",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !showText && "justify-center"
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {showText && (
                <>
                  <span className="flex-1 truncate">{item.name}</span>
                  {showBadge && (
                    <Badge variant="destructive" className="ml-auto">
                      {servicosAtrasados}
                    </Badge>
                  )}
                </>
              )}
              {!showText && showBadge && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {servicosAtrasados}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer - apenas quando aberta */}
      {state === 'open' && (
        <div className="border-t p-4 flex-shrink-0 bg-sidebar">
          <div className="rounded-lg bg-primary/10 p-3 transition-all hover:bg-primary/15">
            <p className="text-xs text-primary font-medium">
              CRM conectado ao Supabase
            </p>
            {!isMobile && (
              <p className="text-xs text-muted-foreground mt-1">
                {isPinned ? "Menu fixado" : "Clique no pin para fixar"}
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
