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
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

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
    products,
    setProductStatus,
    orders,
    disputes,
    resolveDispute,
  } = useMarketplace();

  // Category creation modal/form
  const [newCatName, setNewCatName] = useState('');
  const [newSubcats, setNewSubcats] = useState('');

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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Tab: Dashboard & Finanzas */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Panel General &amp; Finanzas de la Plataforma
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Supervisión global de transacciones, comisiones y liquidaciones a vendedores.
              </p>
            </div>

            {/* Platform Fee Control */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
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

            <div className="overflow-x-auto">
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
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 ml-auto"
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
                </div>

                <div className="flex gap-2 pt-1">
                  {s.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setSellerStatus(s.id, 'approved')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
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
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspender por Incumplimiento
                    </button>
                  )}

                  {s.status === 'suspended' && (
                    <button
                      onClick={() => setSellerStatus(s.id, 'approved')}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                              onClick={() => updateStylistVerification(st.id, 'rejected', 'Documentación ilegible o no oficial')}
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

          {/* Categorías Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-rose-600" /> Categorías y Subcategorías Activas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Orden: {c.order}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.subcategories.map((sc, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                        {sc}
                      </span>
                    ))}
                  </div>
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

          {/* Product Moderation Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Moderación de Publicaciones de Productos</h3>
            </div>
            <div className="overflow-x-auto">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Operaciones, Órdenes &amp; Disputas</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Auditoría en tiempo real de pedidos de la plataforma y mediación de disputas o devoluciones.
              </p>
            </div>
          </div>

          {/* Disputas pendientes */}
          {disputes.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Casos de Disputa &amp; Devoluciones Reportadas
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
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => resolveDispute(disp.id, 'resuelta_reembolso', 'Reembolso autorizado con cargo al vendedor por defecto en el insumo.')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                        >
                          Aprobar Reembolso al Comprador
                        </button>
                        <button
                          onClick={() => resolveDispute(disp.id, 'resuelta_rechazada', 'Caso desestimado conforme a las políticas de garantía de la tienda.')}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
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
              <h3 className="font-bold text-slate-900 text-sm">Historial General de Órdenes</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map((ord) => (
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
                          {sub.items.length} productos • Subtotal ${sub.subtotal} + Envío ${sub.shippingCost}
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
