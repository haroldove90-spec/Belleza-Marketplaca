import React from 'react';
import { LogOut, ShieldCheck, Store, Scissors, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  onOpenCart?: () => void;
}

export const Header: React.FC<Props> = ({ onOpenCart }) => {
  const { currentRole, setCurrentRole, cart } = useMarketplace();

  const getRoleDetails = () => {
    switch (currentRole) {
      case 'superadmin':
        return {
          title: 'Superadmin',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
      case 'seller':
        return {
          title: 'Vendedor Pro',
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: <Store className="w-3.5 h-3.5" />,
        };
      case 'stylist':
        return {
          title: 'Estilista B2B',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <Scissors className="w-3.5 h-3.5" />,
        };
      case 'customer':
      default:
        return {
          title: 'Cliente B2C',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <ShoppingBag className="w-3.5 h-3.5" />,
        };
    }
  };

  const roleInfo = getRoleDetails();
  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="w-full px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: System Logo */}
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" showSubtitle={false} />
        </div>

        {/* Right: Active Role, Install Button, Cart (if applicable), Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Active Role Identifier */}
          <div
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold border ${roleInfo.badgeClass}`}
            title={`Sesión activa: ${roleInfo.title}`}
          >
            {roleInfo.icon}
            <span className="hidden sm:inline">{roleInfo.title}</span>
          </div>

          {/* Quick PWA Install */}
          <PWAInstallButton variant="subtle" />

          {/* Cart Icon for Customer & Stylist */}
          {(currentRole === 'customer' || currentRole === 'stylist') && onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition active:scale-95"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* Logout / Switch Role Button */}
          <button
            onClick={() => setCurrentRole(null)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition active:scale-95"
            title="Cerrar sesión / Cambiar de rol"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 hover:text-rose-600" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
