import React, { useState, useMemo } from 'react';
import {
  Scissors,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  FileCheck,
  Building,
  Upload,
  Lock,
  Star,
  Truck,
  ExternalLink,
  MapPin,
  Phone,
  MessageCircle,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Product, ProductVariant } from '../../types';
import { ProductDetailModal } from '../common/ProductDetailModal';

interface Props {
  onOpenCart?: () => void;
}

export const StylistView: React.FC<Props> = ({ onOpenCart }) => {
  const {
    activeTab,
    products,
    categories,
    stylists,
    currentStylistVerified,
    submitStylistApplication,
    orders,
    confirmOrderReceived,
    salonsDirectory,
    addSalontoDirectory,
    addToCart,
    cart,
  } = useMarketplace();

  // Find verification profile
  const stylistProfile = stylists.find((s) => s.stylistId === 'user-stylist-1') || stylists[0];

  // Stylist orders
  const myOrders = orders.filter((o) => o.buyerRole === 'stylist' || o.buyerId === 'user-stylist-1');

  // Selected product for technical sheet modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search & category filter for pro catalog
  const [proSearchQuery, setProSearchQuery] = useState('');
  const [proCategoryFilter, setProCategoryFilter] = useState('all');
  const [onlyExclusives, setOnlyExclusives] = useState(false);

  // Verification Form state
  const [fullName, setFullName] = useState(stylistProfile?.fullName || '');
  const [salonName, setSalonName] = useState(stylistProfile?.salonName || '');
  const [licenseNumber, setLicenseNumber] = useState(stylistProfile?.licenseNumber || '');
  const [documentType, setDocumentType] = useState<any>('Cédula Profesional');
  const [rfc, setRfc] = useState(stylistProfile?.rfc || '');
  const [location, setLocation] = useState(stylistProfile?.location || '');
  const [phone, setPhone] = useState(stylistProfile?.phone || '');

  // Add salon to directory state
  const [showAddSalon, setShowAddSalon] = useState(false);
  const [salonDirName, setSalonDirName] = useState('');
  const [salonSpecialty, setSalonSpecialty] = useState('');
  const [salonAddress, setSalonAddress] = useState('');
  const [salonZone, setSalonZone] = useState('');
  const [salonWhatsapp, setSalonWhatsapp] = useState('');
  const [salonImage, setSalonImage] = useState('');

  // Cart quantity
  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Filtered pro products
  const filteredProProducts = useMemo(() => {
    return products.filter((p) => {
      if (onlyExclusives && !p.isSalonExclusive) return false;
      if (proCategoryFilter !== 'all' && p.category !== proCategoryFilter) return false;
      if (proSearchQuery.trim()) {
        const q = proSearchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSubcat = p.subcategory.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesSubcat) return false;
      }
      return true;
    });
  }, [products, proCategoryFilter, onlyExclusives, proSearchQuery]);

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    submitStylistApplication({
      stylistId: 'user-stylist-1',
      fullName,
      salonName,
      licenseNumber,
      documentType,
      documentUrl: 'https://example.com/docs/comprobante_estilista.pdf',
      rfc,
      location,
      phone,
    });
  };

  const handleRegisterSalon = (e: React.FormEvent) => {
    e.preventDefault();
    addSalontoDirectory({
      salonName: salonDirName,
      stylistName: fullName || 'Estilista Certificado',
      specialty: salonSpecialty || 'Colorimetría & Balayage',
      address: salonAddress,
      zone: salonZone || 'Ciudad de México',
      phone: phone || '55 0000 0000',
      whatsapp: salonWhatsapp || '55 0000 0000',
      isVerifiedPro: true,
      image: salonImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
    });
    setShowAddSalon(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-28 lg:pb-10 relative">
      {/* Top Pro Banner / Status */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-slate-950" /> Portal B2B Estilista
              </span>
              {currentStylistVerified ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Cédula Verificada • Precios Mayoreo Activos
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> En Proceso de Validación
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Bienvenida, {stylistProfile?.fullName || 'Profesional de la Belleza'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/80">
              Acceso a tarifas mayoristas de cabina, químicos de uso restringido y facturación con RFC.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-xs space-y-1 self-start md:self-auto">
            <span className="text-rose-200 block text-[11px]">Salón Vinculado:</span>
            <strong className="text-white text-sm block">{stylistProfile?.salonName || 'Salón de Belleza Pro'}</strong>
            <span className="text-emerald-300 font-bold">Ahorro promedio Pro: ~35% sobre PVP</span>
          </div>
        </div>
      </div>

      {/* Tab: Catálogo Pro & Químicos Exclusivos */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Catálogo Pro &amp; Insumos de Cabina</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Precios de mayoreo activados automáticamente. Químicos restringidos señalizados con insignia Pro.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar insumos pro (Decolorante, Keratina, Majirel, Plex)..."
                value={proSearchQuery}
                onChange={(e) => setProSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-xl bg-slate-50 focus:bg-white text-xs outline-none"
              />
            </div>

            <select
              value={proCategoryFilter}
              onChange={(e) => setProCategoryFilter(e.target.value)}
              className="p-2 border rounded-xl bg-white font-medium text-slate-700"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={() => setOnlyExclusives(!onlyExclusives)}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                onlyExclusives
                  ? 'bg-rose-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Solo Insumos Restringidos Pro
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProProducts.map((p) => {
              const defaultVariant = p.variants[0];
              const saving = defaultVariant ? defaultVariant.priceB2C - defaultVariant.priceB2B : 0;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {p.isSalonExclusive ? (
                        <div className="absolute top-2.5 left-2.5 bg-rose-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3 text-amber-300" /> Exclusivo Salón Pro
                        </div>
                      ) : (
                        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          Multiuso
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                        Ahorras ${saving} MXN
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                        {p.brand} • {p.category}
                      </div>

                      <h3
                        onClick={() => setSelectedProduct(p)}
                        className="font-bold text-slate-900 text-sm leading-snug cursor-pointer hover:text-rose-600 line-clamp-2 transition"
                      >
                        {p.title}
                      </h3>

                      {/* Pricing block highlighting Stylist Pro discount */}
                      <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Precio Mayorista Pro:</span>
                          <span className="text-xl font-black text-rose-700">
                            ${defaultVariant?.priceB2B} <span className="text-xs font-normal text-slate-500">MXN</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 line-through block">PVP: ${defaultVariant?.priceB2C}</span>
                          <span className="text-[10px] font-bold text-emerald-700">Tarifa B2B</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition active:scale-95"
                    >
                      Ver Ficha Técnica
                    </button>
                    <button
                      onClick={() => addToCart(p, defaultVariant.id, 1)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Registro Pro & Cédula */}
      {activeTab === 'credencial' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Acreditación Técnica &amp; Datos Fiscales</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Mantén tus credenciales vigentes para disfrutar de precios preferenciales y compras de químicos controlados.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Estado de Verificación</h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estatus:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full uppercase text-[10px] ${
                      currentStylistVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentStylistVerified ? 'Verificado Activo' : 'En Revisión'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cédula:</span>
                  <span className="font-mono font-bold text-slate-800">{stylistProfile?.licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Documento:</span>
                  <span className="font-semibold text-slate-800">{stylistProfile?.documentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">RFC Fiscal:</span>
                  <span className="font-mono text-slate-800">{stylistProfile?.rfc}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">Beneficios desbloqueados:</p>
                <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Compra de decolorantes 9 niveles
                </p>
                <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Descuento mayoreo hasta 40%
                </p>
                <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Facturación con deducción fiscal
                </p>
              </div>
            </div>

            {/* Application / Update Form */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Actualizar Información Profesional o Comprobante
              </h3>

              <form onSubmit={handleSubmitVerification} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Profesional:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre Comercial del Salón / Estudio:</label>
                    <input
                      type="text"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Número de Cédula o Registro Técnico:</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="CED-TEC-..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo de Comprobante:</label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Cédula Profesional">Cédula Profesional</option>
                      <option value="Diploma Técnico">Diploma Técnico</option>
                      <option value="Certificación Estilismo">Certificación Estilismo</option>
                      <option value="Constancia de Especialidad">Constancia de Especialidad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">RFC con Homoclave (para facturación automática):</label>
                    <input
                      type="text"
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Ubicación / Dirección del Salón:</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Calle, Colonia, Ciudad"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-rose-600" />
                    <div>
                      <span className="font-bold text-slate-800 block">Comprobante Digitalizado (PDF/JPG)</span>
                      <span className="text-[11px] text-slate-500">cedula_valeria_mendoza_titulacion.pdf</span>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2.5 py-1 rounded-lg">
                    Cargado
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                >
                  Enviar para Validación de Superadministrador
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Mis Pedidos & Rastreo */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mis Compras &amp; Envíos Pro</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Rastrea el tránsito de tus insumos de salón y confirma la recepción para liberar garantías.
            </p>
          </div>

          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">No tienes pedidos registrados</p>
                <p className="text-xs text-slate-400 mt-1">Visita el Catálogo Pro para surtir los insumos de tu salón.</p>
              </div>
            ) : (
              myOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">#{ord.id}</span>
                      <span className="text-slate-400 ml-2">{ord.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">${ord.totalAmount.toLocaleString('es-MX')} MXN</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {ord.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Facturación Fiscal */}
                  {ord.billingData && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-600" />
                        <span>Facturado a: <strong>{ord.billingData.razonSocial}</strong> ({ord.billingData.rfc})</span>
                      </div>
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                        CFDI Emitido
                      </span>
                    </div>
                  )}

                  {/* Suborders */}
                  <div className="space-y-3">
                    {ord.subOrders.map((sub) => (
                      <div key={sub.subOrderId} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{sub.sellerName}</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full uppercase text-[10px] ${
                              sub.status === 'Entregado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'Enviado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        {sub.trackingNumber && (
                          <div className="text-xs font-mono text-indigo-700 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                            <span>{sub.carrier}: <strong>{sub.trackingNumber}</strong></span>
                            <span className="text-[10px] text-slate-500 font-sans">En ruta de entrega</span>
                          </div>
                        )}

                        <div className="space-y-1.5 text-xs text-slate-600">
                          {sub.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.quantity}x {it.productTitle}</span>
                              <span className="font-bold text-rose-700">${it.totalPrice} MXN</span>
                            </div>
                          ))}
                        </div>

                        {/* Confirmation trigger */}
                        {sub.status === 'Enviado' && (
                          <div className="pt-2 border-t border-slate-200 flex justify-end">
                            <button
                              onClick={() => confirmOrderReceived(ord.id, sub.subOrderId)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
                            >
                              Confirmar Recepción de Insumos
                            </button>
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
      )}

      {/* Tab: Directorio de Salones */}
      {activeTab === 'directorio' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Directorio de Salones Recomendados</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Aparece en el buscador de salones y estilistas para que clientes de tu zona agenden citas directamente.
              </p>
            </div>

            <button
              onClick={() => setShowAddSalon(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition active:scale-95 self-start sm:self-auto"
            >
              + Registrar Mi Salón en Directorio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salonsDirectory.map((salon) => (
              <div key={salon.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                <div className="h-40 w-full relative">
                  <img src={salon.image} alt="" className="w-full h-full object-cover" />
                  {salon.isVerifiedPro && (
                    <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle className="w-3 h-3" /> Salón Verificado Pro
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" /> {salon.rating}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">{salon.salonName}</h3>
                  <p className="text-xs text-rose-600 font-semibold">{salon.specialty}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {salon.address}, {salon.zone}
                  </p>
                  <div className="flex gap-2 pt-2 border-t border-slate-100 text-xs">
                    <a
                      href={`https://wa.me/${salon.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Citas
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to add salon */}
          {showAddSalon && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
                <h3 className="font-bold text-slate-900 text-base">Registrar Salón en Directorio</h3>
                <form onSubmit={handleRegisterSalon} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre del Salón"
                    value={salonDirName}
                    onChange={(e) => setSalonDirName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Especialidad (ej. Balayage, Alaciados)"
                    value={salonSpecialty}
                    onChange={(e) => setSalonSpecialty(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Dirección Física"
                    value={salonAddress}
                    onChange={(e) => setSalonAddress(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Zona o Ciudad (ej. Polanco, CDMX)"
                    value={salonZone}
                    onChange={(e) => setSalonZone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Número de WhatsApp para Citas"
                    value={salonWhatsapp}
                    onChange={(e) => setSalonWhatsapp(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <input
                    type="url"
                    placeholder="URL de Foto de Fachada / Interior"
                    value={salonImage}
                    onChange={(e) => setSalonImage(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95"
                    >
                      Publicar Salón
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSalon(false)}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Sticky Cart Button for Stylist */}
      {totalCartCount > 0 && onOpenCart && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-40 lg:hidden animate-bounce">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl hover:scale-105 active:scale-95 transition"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span>Carrito Pro ({totalCartCount})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};
