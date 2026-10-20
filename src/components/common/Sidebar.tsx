import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  FolderTree,
  PackageSearch,
  Package,
  Truck,
  TrendingUp,
  Store,
  Sparkles,
  FileCheck,
  ShoppingBag,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Scissors,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Sidebar: React.FC = () => {
  const { currentRole, setCurrentRole, activeTab, setActiveTab } = useMarketplace();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!currentRole) return null;

  const getNavItems = () => {
    switch (currentRole) {
      case 'superadmin':
        return [
          { id: 'dashboard', label: 'Panel & Finanzas', icon: LayoutDashboard },
          { id: 'cuentas', label: 'Gestión de Vendedores', icon: Users },
          { id: 'estilistas', label: 'Validación de Cédulas', icon: CheckCircle2 },
          { id: 'catalogo', label: 'Catálogo & Moderación', icon: FolderTree },
          { id: 'ordenes', label: 'Órdenes & Disputas', icon: PackageSearch },
        ];
      case 'seller':
        return [
          { id: 'productos', label: 'Gestión de Productos', icon: Package },
          { id: 'pedidos', label: 'Gestión de Pedidos', icon: Truck },
          { id: 'metricas', label: 'Ventas & Liquidaciones', icon: TrendingUp },
          { id: 'tienda', label: 'Perfil de Tienda', icon: Store },
        ];
      case 'stylist':
        return [
          { id: 'catalogo', label: 'Catálogo Mayoreo Pro', icon: Sparkles },
          { id: 'credencial', label: 'Cédula & Beneficio Pro', icon: FileCheck },
          { id: 'pedidos', label: 'Mis Pedidos & Rastreo', icon: ShoppingBag },
          { id: 'directorio', label: 'Directorio Salones', icon: MapPin },
        ];
      case 'customer':
      default:
        return [
          { id: 'catalogo', label: 'Explorar Catálogo', icon: Sparkles },
          { id: 'pedidos', label: 'Mis Compras & Rastreo', icon: ShoppingBag },
          { id: 'directorio', label: 'Directorio Salones', icon: MapPin },
          { id: 'cuenta', label: 'Perfil & Direcciones', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'superadmin':
        return { label: 'Superadmin', icon: ShieldCheck, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'seller':
        return { label: 'Vendedor', icon: Store, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'stylist':
        return { label: 'Estilista Pro', icon: Scissors, color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'customer':
      default:
        return { label: 'Cliente', icon: ShoppingBag, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      } shrink-0`}
    >
      {/* Role Profile summary */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200">
            <RoleIcon className="w-5 h-5 text-rose-600" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">Espacio de Trabajo</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title={isCollapsed ? 'Expandir panel' : 'Colapsar panel'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation list */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-rose-600 stroke-[2.5]' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom Session Exit */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => setCurrentRole(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Cerrar sesión / Cambiar de rol"
        >
          <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-600 shrink-0" />
          {!isCollapsed && <span>Cambiar de Rol</span>}
        </button>
      </div>
    </aside>
  );
};
