import React from 'react';
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
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const BottomBar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useMarketplace();

  if (!currentRole) return null;

  const getNavItems = () => {
    switch (currentRole) {
      case 'superadmin':
        return [
          { id: 'dashboard', label: 'Finanzas', icon: LayoutDashboard },
          { id: 'cuentas', label: 'Tiendas', icon: Users },
          { id: 'estilistas', label: 'Cédulas', icon: CheckCircle2 },
          { id: 'catalogo', label: 'Catálogo', icon: FolderTree },
          { id: 'ordenes', label: 'Órdenes', icon: PackageSearch },
        ];
      case 'seller':
        return [
          { id: 'productos', label: 'Productos', icon: Package },
          { id: 'pedidos', label: 'Pedidos', icon: Truck },
          { id: 'metricas', label: 'Métricas', icon: TrendingUp },
          { id: 'tienda', label: 'Mi Tienda', icon: Store },
        ];
      case 'stylist':
        return [
          { id: 'catalogo', label: 'Catálogo Pro', icon: Sparkles },
          { id: 'credencial', label: 'Cédula Pro', icon: FileCheck },
          { id: 'pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
          { id: 'directorio', label: 'Salones', icon: MapPin },
        ];
      case 'customer':
      default:
        return [
          { id: 'catalogo', label: 'Explorar', icon: Sparkles },
          { id: 'pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
          { id: 'directorio', label: 'Salones', icon: MapPin },
          { id: 'cuenta', label: 'Perfil', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 truncate max-w-[68px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
