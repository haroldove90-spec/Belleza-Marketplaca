import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { RoleSelector } from './components/roles/RoleSelector';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomBar } from './components/common/BottomBar';
import { AdminView } from './components/roles/AdminView';
import { SellerView } from './components/roles/SellerView';
import { StylistView } from './components/roles/StylistView';
import { CustomerView } from './components/roles/CustomerView';
import { CartModal } from './components/common/CartModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

const MainLayout: React.FC = () => {
  const { currentRole } = useMarketplace();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // If no role is selected, render the clean role entry grid (2 cols mobile / 4 cols desktop)
  if (!currentRole) {
    return (
      <>
        <OfflineIndicator />
        <RoleSelector />
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col antialiased">
      <OfflineIndicator />

      {/* Unified Institutional Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Workspace Area: Desktop Sidebar + Fluid Content */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 w-full overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6">
          {currentRole === 'superadmin' && <AdminView />}
          {currentRole === 'seller' && <SellerView />}
          {currentRole === 'stylist' && <StylistView />}
          {currentRole === 'customer' && <CustomerView onOpenCart={() => setIsCartOpen(true)} />}
        </main>
      </div>

      {/* Fixed Mobile & Tablet Bottom Navigation Bar */}
      <BottomBar />

      {/* Multi-Vendor Cart & Checkout Drawer/Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainLayout />
    </MarketplaceProvider>
  );
}
