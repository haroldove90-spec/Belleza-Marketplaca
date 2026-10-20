import React from 'react';
import { ShieldCheck, Store, Scissors, ShoppingBag } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { UserRole } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface RoleCardConfig {
  role: UserRole;
  title: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderHover: string;
  badgeColor: string;
}

export const RoleSelector: React.FC = () => {
  const { setCurrentRole, setActiveTab } = useMarketplace();

  const roleCards: RoleCardConfig[] = [
    {
      role: 'superadmin',
      title: 'Superadministrador',
      icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 group-hover:scale-110 transition-transform duration-300" />,
      bgGradient: 'from-amber-50 to-orange-50/60',
      borderHover: 'group-hover:border-amber-400 group-hover:shadow-amber-100',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      role: 'seller',
      title: 'Vendedor / Proveedor',
      icon: <Store className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />,
      bgGradient: 'from-indigo-50 to-blue-50/60',
      borderHover: 'group-hover:border-indigo-400 group-hover:shadow-indigo-100',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      role: 'stylist',
      title: 'Estilista Profesional',
      icon: <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 group-hover:scale-110 transition-transform duration-300" />,
      bgGradient: 'from-rose-50 to-pink-50/60',
      borderHover: 'group-hover:border-rose-400 group-hover:shadow-rose-100',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      role: 'customer',
      title: 'Cliente Final',
      icon: <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />,
      bgGradient: 'from-emerald-50 to-teal-50/60',
      borderHover: 'group-hover:border-emerald-400 group-hover:shadow-emerald-100',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'superadmin') setActiveTab('dashboard');
    else if (role === 'seller') setActiveTab('productos');
    else if (role === 'stylist') setActiveTab('catalogo');
    else setActiveTab('catalogo');
  };

  return (
    <main className="min-h-[100dvh] w-full flex flex-col justify-between p-3.5 sm:p-6 md:p-10 bg-gradient-to-b from-slate-50 via-white to-rose-50/30">
      {/* Top Bar with Brand Logo and PWA Install Button */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <BrandLogo size="md" />
        <PWAInstallButton variant="primary" />
      </div>

      {/* Center 2-column mobile / 4-column desktop clean role cards */}
      <div className="w-full max-w-6xl mx-auto my-auto py-4 sm:py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {roleCards.map((c) => (
            <button
              key={c.role}
              onClick={() => handleSelectRole(c.role)}
              className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 bg-gradient-to-b ${c.bgGradient} shadow-xs hover:shadow-xl ${c.borderHover} transition-all duration-300 active:scale-95 text-center cursor-pointer min-h-[130px] sm:min-h-[180px]`}
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-3 sm:mb-4 border border-slate-100 group-hover:shadow-md transition">
                {c.icon}
              </div>
              <span className="text-xs sm:text-sm md:text-base font-bold text-slate-900 group-hover:text-rose-600 transition leading-snug">
                {c.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer subtle brand mark */}
      <div className="w-full max-w-6xl mx-auto text-center text-xs text-slate-400 py-2 sm:py-3">
        Marketplace Belleza • Plataforma Integral Multirrol &copy; 2026
      </div>
    </main>
  );
};
