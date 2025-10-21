import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Wrench,
  MessageSquare,
  UserCog,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "user_comum"] },
  { name: "Clientes", href: "/clientes", icon: Users, roles: ["admin", "user_comum"] },
  { name: "Categorias", href: "/categorias", icon: Package, roles: ["admin", "user_comum"] },
  { name: "Serviços", href: "/servicos", icon: Wrench, roles: ["admin", "user_comum"] },
  { name: "Leads", href: "/leads", icon: MessageSquare, roles: ["admin", "user_comum"] },
  { name: "Usuários", href: "/usuarios", icon: UserCog, roles: ["admin"] },
  { name: "Configurações", href: "/configuracoes", icon: Settings, roles: ["admin", "user_comum"] }
];

export const Sidebar = () => {
  const { userRole } = useAuth();

  const visibleNavigation = navigation.filter(item => 
    item.roles.includes(userRole || "nenhum")
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold text-sidebar-foreground">Navegação</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-xs text-primary">
            CRM conectado ao Supabase
          </p>
        </div>
      </div>
    </aside>
  );
};
