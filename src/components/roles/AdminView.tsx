import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FolderTree,
  PackageSearch,
  Percent,
  Plus,
  Shield,
  Send,
  Eye,
  Check,
  Ban,
  Clock,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
  X,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StylistVerification, OrderStatus } from '../../types';

export const AdminView: React.FC = () => {
  const {
    activeTab,
    platformCommissionRate,
    setPlatformCommissionRate,
    sellers,
    setSellerStatus,
    disburseSellerFunds,
    stylists,
    updateStylistVerification,
    categories,
    addCategory,
    updateCategories,
    products,
    setProductStatus,
    orders,
    disputes,
    resolveDispute,
  } = useMarketplace();

  // Category creation modal/form
  const [newCatName, setNewCatName] = useState('');
  const [newSubcats, setNewSubcats] = useState('');

  // Stylist Credential Viewer Modal
  const [inspectingStylist, setInspectingStylist] = useState<StylistVerification | null>(null);

  // Orders status filter
  const [ordersFilter, setOrdersFilter] = useState<string>('todas');

  // Financial calculations
  const totalGMV = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalFeesEarned = orders.reduce(
    (acc, ord) => acc + ord.subOrders.reduce((subAcc, s) => subAcc + s.platformFee, 0),
    0
  );
  const totalPendingDisbursement = sellers.reduce((acc, s) => acc + s.accumulatedBalance, 0);

  const pendingSellersCount = sellers.filter((s) => s.status === 'pending').length;
  const pendingStylistsCount = stylists.filter((s) => s.status === 'pending').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'abierta').length;

  // Move Category Up / Down
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;
    // update order numbers
    newCats.forEach((c, idx) => {
      c.order = idx + 1;
    });
    updateCategories(newCats);
  };

  const removeCategory = (id: string) => {
    updateCategories(categories.filter((c) => c.id !== id));
  };

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    if (ordersFilter === 'todas') return true;
    if (ordersFilter === 'disputas') {
      return disputes.some((d) => d.orderId === ord.id);
    }
    return ord.subOrders.some((s) => s.status.toLowerCase() === ordersFilter.toLowerCase());
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 lg:pb-10">
      {/* Tab: Dashboard & Finanzas */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Panel General &amp; Finanzas de la Plataforma
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Supervisión global de transacciones, comisiones y dispersión de fondos a tiendas.
              </p>
            </div>

            {/* Platform Fee Control */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs self-start sm:self-auto">
              <Percent className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-slate-700">Comisión Marketplace:</span>
              <input
                type="number"
                min="1"
                max="50"
                value={platformCommissionRate}
                onChange={(e) => setPlatformCommissionRate(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg text-center"
              />
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">GMV (Volumen Bruto)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900">
                ${totalGMV.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{orders.length} pedidos totales procesados</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Comisiones Retenidas</span>
                <Percent className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-rose-600">
                ${totalFeesEarned.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Margen fee ({platformCommissionRate}%)</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Saldos por Liquidar</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-700">
                ${totalPendingDisbursement.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Acumulado en cuentas de tiendas</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Alertas Operativas</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-slate-900">
                {pendingSellersCount + pendingStylistsCount + openDisputesCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {pendingSellersCount} tiendas • {pendingStylistsCount} cédulas • {openDisputesCount} disputas
              </p>
            </div>
          </div>

          {/* Dispersión de Pagos a Vendedores */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Dispersión de Pagos &amp; Liquidaciones a Vendedores
                </h3>
                <p className="text-xs text-slate-500">
                  Transferencias bancarias a CLABE una vez que el comprador confirma recepción.
                </p>
              </div>
            </div>

            {/* Mobile Card View (< md) */}
            <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
              {sellers.map((s) => (
                <div key={s.id} className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{s.storeName}</h4>
                      <p className="text-[11px] text-slate-500">{s.legalName} • RFC: {s.rfc}</p>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      ${s.accumulatedBalance.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <p>Banco: <strong>{s.bankAccount.bankName}</strong></p>
                    <p className="font-mono text-slate-500">CLABE: {s.bankAccount.clabe}</p>
                    <p>Ventas acumuladas: ${s.totalSales.toLocaleString('es-MX')} MXN</p>
                  </div>
                  <div className="pt-2">
                    {s.accumulatedBalance > 0 ? (
                      <button
                        onClick={() => disburseSellerFunds(s.id)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> Dispersar ${s.accumulatedBalance.toLocaleString('es-MX')} MXN
                      </button>
                    ) : (
                      <span className="block text-center text-slate-400 font-medium py-1">Sin saldo pendiente</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Tienda / Razón Social</th>
                    <th className="p-3.5">Banco &amp; CLABE</th>
                    <th className="p-3.5">Ventas Acumuladas</th>
                    <th className="p-3.5">Saldo por Dispersar</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{s.storeName}</div>
                        <div className="text-[11px] text-slate-400">{s.legalName} • RFC: {s.rfc}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{s.bankAccount.bankName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{s.bankAccount.clabe}</div>
                      </td>
                      <td className="p-3.5 font-semibold">${s.totalSales.toLocaleString('es-MX')} MXN</td>
                      <td className="p-3.5 font-bold text-emerald-700">
                        ${s.accumulatedBalance.toLocaleString('es-MX')} MXN
                      </td>
                      <td className="p-3.5 text-right">
                        {s.accumulatedBalance > 0 ? (
                          <button
                            onClick={() => disburseSellerFunds(s.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 ml-auto active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" /> Dispersar Fondos
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">Al corriente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Gestión de Cuentas & Vendedores */}
      {activeTab === 'cuentas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Aprobación &amp; Control de Vendedores</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Auditoría fiscal, revisión de políticas de envío y bloqueo por incumplimiento de términos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellers.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={s.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{s.storeName}</h3>
                      <p className="text-[11px] text-slate-400">{s.legalName}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      s.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {s.status === 'approved' ? 'Aprobado' : s.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p><strong>RFC:</strong> {s.rfc}</p>
                  <p><strong>Email:</strong> {s.email}</p>
                  <p><strong>Tel:</strong> {s.phone}</p>
                  <p className="truncate"><strong>Envíos:</strong> {s.shippingPolicy}</p>
                  <p className="truncate"><strong>Garantía:</strong> {s.returnPolicy}</p>
                </div>

                <div className="flex gap-2 pt-1">
                  {s.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setSellerStatus(s.id, 'approved')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Aprobar Tienda
                      </button>
                      <button
                        onClick={() => setSellerStatus(s.id, 'suspended')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {s.status === 'approved' && (
                    <button
                      onClick={() => setSellerStatus(s.id, 'suspended')}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspender por Incumplimiento
                    </button>
                  )}

                  {s.status === 'suspended' && (
                    <button
                      onClick={() => setSellerStatus(s.id, 'approved')}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" /> Reactivar Tienda
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Validación de Cédulas & Estilistas */}
      {activeTab === 'estilistas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Validación de Credenciales Pro</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Verificación de cédula profesional y diplomas para habilitar catálogo y precios B2B exclusivos de salón.
              </p>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {stylists.map((st) => (
              <div key={st.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 text-xs shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{st.fullName}</h3>
                    <p className="text-slate-500">{st.salonName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      st.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : st.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {st.status === 'verified' ? 'Verificado' : st.status === 'pending' ? 'En Revisión' : 'Rechazado'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <p><strong>Cédula:</strong> <span className="font-mono">{st.licenseNumber}</span></p>
                  <p><strong>Tipo:</strong> {st.documentType}</p>
                  <p><strong>RFC:</strong> <span className="font-mono">{st.rfc}</span></p>
                  <p><strong>Ubicación:</strong> {st.location}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setInspectingStylist(st)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" /> Ver Documento
                  </button>
                  {st.status !== 'verified' && (
                    <button
                      onClick={() => updateStylistVerification(st.id, 'verified')}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                    >
                      Aprobar
                    </button>
                  )}
                  {st.status !== 'rejected' && (
                    <button
                      onClick={() => updateStylistVerification(st.id, 'rejected', 'Documentación no oficial')}
                      className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold rounded-xl transition"
                    >
                      Rechazar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Estilista / Salón</th>
                    <th className="p-3.5">Cédula / Documento</th>
                    <th className="p-3.5">RFC &amp; Ubicación</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {stylists.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{st.fullName}</div>
                        <div className="text-[11px] text-slate-500">{st.salonName}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-slate-800">{st.licenseNumber}</span>
                        <div className="text-[11px] text-slate-400">{st.documentType}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{st.rfc}</div>
                        <div className="text-[11px] text-slate-400">{st.location}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            st.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.status === 'verified' ? 'Verificado Pro' : st.status === 'pending' ? 'En Revisión' : 'Rechazado'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectingStylist(st)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                            title="Inspeccionar Documento"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {st.status !== 'verified' && (
                            <button
                              onClick={() => updateStylistVerification(st.id, 'verified')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                            >
                              Aprobar Cédula
                            </button>
                          )}
                          {st.status !== 'rejected' && (
                            <button
                              onClick={() => updateStylistVerification(st.id, 'rejected', 'Documentación no oficial')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition"
                            >
                              Rechazar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Catálogo & Moderación Global */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Control de Categorías &amp; Moderación</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Organización de la taxonomía del marketplace y aprobación de publicaciones de vendedores.
              </p>
            </div>
          </div>

          {/* Categorías Management with Reordering */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-rose-600" /> Categorías y Subcategorías Activas ({categories.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((c, index) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                      <span className="font-bold text-xs text-slate-900">{c.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveCategory(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                          title="Subir orden"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveCategory(index, 'down')}
                          disabled={index === categories.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                          title="Bajar orden"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeCategory(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.subcategories.map((sc, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block pt-1">Posición: #{c.order}</span>
                </div>
              ))}
            </div>

            {/* Form to add category */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCatName) return;
                const subs = newSubcats.split(',').map((s) => s.trim()).filter(Boolean);
                addCategory(newCatName, subs.length > 0 ? subs : ['General']);
                setNewCatName('');
                setNewSubcats('');
              }}
              className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Nueva Categoría (ej. Uñas & Manicura)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 p-2 rounded-lg border text-xs bg-white"
                required
              />
              <input
                type="text"
                placeholder="Subcategorías (separadas por coma)"
                value={newSubcats}
                onChange={(e) => setNewSubcats(e.target.value)}
                className="flex-1 p-2 rounded-lg border text-xs bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Categoría
              </button>
            </form>
          </div>

          {/* Product Moderation Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Moderación de Publicaciones de Productos ({products.length})</h3>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
              {products.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{p.title}</h4>
                      <p className="text-[11px] text-slate-500">{p.sellerName} • {p.category}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status === 'active' ? 'Publicado' : 'Revisión'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>B2C: ${p.variants[0]?.priceB2C} | Pro: ${p.variants[0]?.priceB2B}</span>
                    {p.isSalonExclusive ? (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 rounded">Solo Pro</span>
                    ) : (
                      <span className="text-[10px] text-slate-500">General</span>
                    )}
                  </div>
                  <div className="pt-1">
                    {p.status !== 'active' ? (
                      <button
                        onClick={() => setProductStatus(p.id, 'active')}
                        className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                      >
                        Aprobar y Publicar
                      </button>
                    ) : (
                      <button
                        onClick={() => setProductStatus(p.id, 'draft')}
                        className="w-full py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Pausar Producto
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3.5">Producto &amp; Tienda</th>
                    <th className="p-3.5">Categoría</th>
                    <th className="p-3.5">Precio B2C / B2B</th>
                    <th className="p-3.5">Restricción</th>
                    <th className="p-3.5">Estatus</th>
                    <th className="p-3.5 text-right">Moderación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 truncate max-w-xs">{p.title}</div>
                        <div className="text-[11px] text-slate-400">{p.sellerName}</div>
                      </td>
                      <td className="p-3.5">{p.category}</td>
                      <td className="p-3.5">
                        <div>${p.variants[0]?.priceB2C} B2C</div>
                        <div className="text-emerald-700 font-bold">${p.variants[0]?.priceB2B} Pro</div>
                      </td>
                      <td className="p-3.5">
                        {p.isSalonExclusive ? (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                            Exclusivo Pro
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                            General
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status === 'active' ? 'Publicado' : 'Revisión'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {p.status !== 'active' ? (
                          <button
                            onClick={() => setProductStatus(p.id, 'active')}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-xs"
                          >
                            Aprobar
                          </button>
                        ) : (
                          <button
                            onClick={() => setProductStatus(p.id, 'draft')}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 text-xs"
                          >
                            Pausar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Órdenes Globales & Disputas */}
      {activeTab === 'ordenes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Operaciones, Órdenes &amp; Disputas</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Auditoría en tiempo real de pedidos de la plataforma y mediación de disputas o devoluciones.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'en preparación', label: 'Preparación' },
                { id: 'empacado', label: 'Empacado' },
                { id: 'enviado', label: 'Enviado' },
                { id: 'entregado', label: 'Entregado' },
                { id: 'disputas', label: `Disputas (${openDisputesCount})` },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setOrdersFilter(btn.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    ordersFilter === btn.id
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Disputas pendientes */}
          {disputes.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Casos de Disputa &amp; Devoluciones Reportadas ({disputes.length})
              </h3>

              <div className="space-y-3">
                {disputes.map((disp) => (
                  <div key={disp.id} className="bg-white p-4 rounded-xl border border-amber-200 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{disp.buyerName}</span> contra{' '}
                        <span className="font-bold text-indigo-700">{disp.sellerName}</span>
                        <p className="text-[11px] text-slate-400">Orden: {disp.orderId} • {disp.createdAt}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          disp.status === 'abierta' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {disp.status}
                      </span>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{disp.reason}"
                    </p>

                    {disp.status === 'abierta' && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => resolveDispute(disp.id, 'resuelta_reembolso', 'Reembolso autorizado con cargo al vendedor por defecto en el insumo.')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition active:scale-95"
                        >
                          Aprobar Reembolso al Comprador
                        </button>
                        <button
                          onClick={() => resolveDispute(disp.id, 'resuelta_rechazada', 'Caso desestimado conforme a las políticas de garantía de la tienda.')}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition"
                        >
                          Desestimar Disputa
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Orders Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Historial General de Órdenes ({filteredOrders.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No hay órdenes que coincidan con el filtro seleccionado.
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div key={ord.id} className="p-4 sm:p-5 hover:bg-slate-50/50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">#{ord.id}</span>
                        <span className="text-slate-400 ml-2">{ord.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          ${ord.totalAmount.toLocaleString('es-MX')} MXN
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {ord.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                      <div><strong>Comprador:</strong> {ord.buyerName} ({ord.buyerRole})</div>
                      <div><strong>Pago:</strong> {ord.paymentMethod}</div>
                      <div><strong>Destino:</strong> {ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                    </div>

                    {/* Suborders breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      {ord.subOrders.map((sub) => (
                        <div key={sub.subOrderId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex justify-between font-bold">
                            <span>{sub.sellerName}</span>
                            <span className="text-rose-600">{sub.status}</span>
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {sub.items.length} productos • Subtotal ${sub.subtotal} + Envío ${sub.shippingCost} • Net Vendedor: ${sub.sellerNet}
                          </div>
                          {sub.trackingNumber && (
                            <div className="text-[11px] font-mono text-indigo-700">
                              {sub.carrier}: {sub.trackingNumber}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stylist Credential Inspection Modal */}
      {inspectingStylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">Comprobante Oficial de Estilista Pro</h3>
              </div>
              <button
                onClick={() => setInspectingStylist(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stylist Credential Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Nombre del Profesional:</span>
                <strong className="text-slate-900">{inspectingStylist.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Salón / Estudio:</span>
                <strong className="text-slate-900">{inspectingStylist.salonName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cédula Técnica / Registro:</span>
                <span className="font-mono font-bold text-rose-700">{inspectingStylist.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tipo de Documento:</span>
                <span>{inspectingStylist.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RFC Fiscal:</span>
                <span className="font-mono">{inspectingStylist.rfc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ubicación Registrada:</span>
                <span>{inspectingStylist.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono:</span>
                <span>{inspectingStylist.phone}</span>
              </div>
            </div>

            {/* Simulated Digital Certificate Preview */}
            <div className="p-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/40 text-center space-y-1.5">
              <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
              <p className="font-bold text-slate-800">Certificación Oficial en Colorimetría y Estilismo</p>
              <p className="text-[11px] text-slate-500">
                Documento verificado digitalmente ante la Asociación Técnica de Estilismo y Belleza.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  updateStylistVerification(inspectingStylist.id, 'verified');
                  setInspectingStylist(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Aprobar y Habilitar Catálogo Pro
              </button>
              <button
                onClick={() => {
                  updateStylistVerification(inspectingStylist.id, 'rejected', 'Documentación no cumple con los requisitos oficiales.');
                  setInspectingStylist(null);
                }}
                className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold rounded-xl transition"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
