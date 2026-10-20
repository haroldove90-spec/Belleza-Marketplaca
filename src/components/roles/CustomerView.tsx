import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  ShoppingBag,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  Camera,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Product, ProductReview } from '../../types';
import { ProductDetailModal } from '../common/ProductDetailModal';

interface Props {
  onOpenCart: () => void;
}

export const CustomerView: React.FC<Props> = ({ onOpenCart }) => {
  const {
    activeTab,
    products,
    categories,
    addToCart,
    orders,
    confirmOrderReceived,
    createDispute,
    addReview,
    salonsDirectory,
    savedAddresses,
  } = useMarketplace();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedHairType, setSelectedHairType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  // Selected product for technical sheet modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Review modal state
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Dispute modal state
  const [disputeModalData, setDisputeModalData] = useState<{ orderId: string; subOrderId: string } | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Customer's orders
  const myOrders = orders.filter((o) => o.buyerRole === 'customer' || o.buyerId === 'user-cust-1');

  // Unique brands list
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return list;
  }, [products]);

  // Filtered products (excluding salon-exclusive unless verified pro, or showing with preview)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (selectedHairType !== 'all' && p.hairOrSkinType !== selectedHairType) return false;
      const basePrice = p.variants[0]?.priceB2C || 0;
      if (basePrice > maxPrice) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, selectedHairType, maxPrice, searchQuery]);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalProduct || !reviewComment) return;
    addReview({
      productId: reviewModalProduct.id,
      userId: 'user-cust-1',
      userName: 'Carolina H. (Compradora)',
      userRole: 'customer',
      rating: reviewRating,
      comment: reviewComment,
      verifiedPurchase: true,
    });
    setReviewModalProduct(null);
    setReviewComment('');
  };

  const handleSendDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeModalData || !disputeReason) return;
    createDispute(disputeModalData.orderId, disputeModalData.subOrderId, disputeReason);
    setDisputeModalData(null);
    setDisputeReason('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 lg:pb-10">
      {/* Tab: Explorar Catálogo */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-block">
                Marketplace Oficial de Belleza
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Cosmética &amp; Cuidado Capilar de Alta Gama
              </h1>
              <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                Envíos garantizados directo de distribuidoras oficiales. Descubre fórmulas profesionales recomendadas por estilistas.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tintes, mascarillas plex, planchas de titanio, serums..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="all">Todas las Marcas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {/* Hair/Skin Type Filter */}
              <select
                value={selectedHairType}
                onChange={(e) => setSelectedHairType(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="all">Tipo de Cabello / Piel</option>
                <option value="Todo tipo">Todo tipo</option>
                <option value="Teñido/Decolorado">Teñido / Decolorado</option>
                <option value="Seco/Dañado">Seco / Dañado</option>
                <option value="Graso">Graso</option>
                <option value="Rizado/Ondulado">Rizado / Ondulado</option>
                <option value="Sensible">Sensible</option>
              </select>

              {/* Max Price slider */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 text-[11px]">Máx:</span>
                <span className="font-bold text-slate-800">${maxPrice}</span>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 accent-rose-600"
                />
              </div>

              {(selectedCategory !== 'all' || selectedBrand !== 'all' || selectedHairType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSelectedHairType('all');
                    setSearchQuery('');
                    setMaxPrice(3000);
                  }}
                  className="text-rose-600 hover:underline font-bold text-xs ml-auto"
                >
                  Restablecer filtros
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                Catálogo de Productos ({filteredProducts.length})
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-700 font-bold">No se encontraron productos con esos filtros</p>
                <p className="text-xs text-slate-400 mt-1">Prueba seleccionando otra categoría o ampliando el rango de precio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((p) => {
                  const defaultVariant = p.variants[0];
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image */}
                        <div
                          onClick={() => setSelectedProduct(p)}
                          className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                              {p.hairOrSkinType}
                            </span>
                          </div>
                          {p.isSalonExclusive && (
                            <div className="absolute bottom-2 left-2 right-2 bg-rose-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg text-center">
                              Uso Salón Pro
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-3 sm:p-4 space-y-1.5">
                          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block truncate">
                            {p.brand}
                          </span>
                          <h3
                            onClick={() => setSelectedProduct(p)}
                            className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 cursor-pointer hover:text-rose-600 transition"
                          >
                            {p.title}
                          </h3>

                          <div className="flex items-center gap-1 text-[11px] text-amber-500 pt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                            <span className="font-bold text-slate-800">{p.rating}</span>
                            <span className="text-slate-400 text-[10px]">({p.reviewCount})</span>
                          </div>

                          <div className="pt-2 flex items-baseline justify-between">
                            <div className="text-sm sm:text-base font-extrabold text-slate-900">
                              ${defaultVariant?.priceB2C} <span className="text-[10px] font-normal text-slate-400">MXN</span>
                            </div>
                            <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                              {p.sellerName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-3 sm:p-4 pt-0">
                        {p.isSalonExclusive ? (
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                          >
                            Ficha Técnica
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(p, defaultVariant.id, 1)}
                            className="w-full py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Mis Compras & Seguimiento */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Historial de Compras &amp; Rastreo de Guías</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sigue el camino de tus paquetes en tiempo real, confirma la recepción y califica tus productos.
            </p>
          </div>

          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">No tienes compras registradas</p>
                <p className="text-xs text-slate-400 mt-1">Explora nuestro catálogo para realizar tu primer pedido.</p>
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

                  {/* Suborders per seller */}
                  <div className="space-y-4">
                    {ord.subOrders.map((sub) => (
                      <div key={sub.subOrderId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">Tienda: {sub.sellerName}</span>
                          <span
                            className={`font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px] ${
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

                        {/* Tracking details */}
                        {sub.trackingNumber && (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between font-bold text-indigo-700">
                              <span>Transportista: {sub.carrier}</span>
                              <span className="font-mono">Guía: {sub.trackingNumber}</span>
                            </div>

                            {/* Tracking milestone steps */}
                            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="text-emerald-600 font-bold">1. Preparado ✓</span>
                              <span className={sub.status !== 'En preparación' ? 'text-emerald-600 font-bold' : ''}>
                                2. Empacado ✓
                              </span>
                              <span className={sub.status === 'Enviado' || sub.status === 'Entregado' ? 'text-blue-600 font-bold' : ''}>
                                3. En Tránsito {sub.status === 'Enviado' ? '🚚' : '✓'}
                              </span>
                              <span className={sub.status === 'Entregado' ? 'text-emerald-700 font-bold' : ''}>
                                4. Entregado
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Items in suborder */}
                        <div className="space-y-2 text-xs">
                          {sub.items.map((it, idx) => {
                            const originalProd = products.find((p) => p.id === it.productId);
                            return (
                              <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                  <div>
                                    <span className="font-semibold text-slate-900 block">{it.productTitle}</span>
                                    <span className="text-[10px] text-slate-400">Var: {it.variantName} • Cant: {it.quantity}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800">${it.totalPrice} MXN</span>
                                  {sub.status === 'Entregado' && originalProd && (
                                    <button
                                      onClick={() => setReviewModalProduct(originalProd)}
                                      className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg font-bold text-[11px] border border-amber-200 transition"
                                    >
                                      Calificar
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                          <button
                            onClick={() => setDisputeModalData({ orderId: ord.id, subOrderId: sub.subOrderId })}
                            className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1 font-medium"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Reportar Problema / Devolución
                          </button>

                          {sub.status === 'Enviado' && (
                            <button
                              onClick={() => confirmOrderReceived(ord.id, sub.subOrderId)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                            >
                              Ya Recibí mi Paquete (Confirmar Entrega)
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Directorio de Salones para Clientes */}
      {activeTab === 'directorio' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Salones &amp; Estilistas Recomendados</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Encuentra profesionales acreditados por Marketplace Belleza para realizar tus servicios capilares con productos premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salonsDirectory.map((salon) => (
              <div key={salon.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                <div className="h-44 w-full relative">
                  <img src={salon.image} alt="" className="w-full h-full object-cover" />
                  {salon.isVerifiedPro && (
                    <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle className="w-3 h-3" /> Certificado Pro
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
                  <p className="text-[11px] text-slate-400">Atendido por: {salon.stylistName}</p>

                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <a
                      href={`https://wa.me/${salon.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-4 h-4" /> Agendar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Cuenta & Direcciones */}
      {activeTab === 'cuenta' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mi Perfil &amp; Direcciones</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Gestiona tus domicilios de entrega para compras rápidas con un solo toque.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Direcciones de Entrega Guardadas</h3>
              <div className="space-y-2.5">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">{addr.fullName}</span>
                      {addr.isDefault && <span className="text-rose-600">Predeterminada</span>}
                    </div>
                    <p className="text-slate-600">{addr.street}, Col. {addr.colonia}, {addr.city}, C.P. {addr.postalCode}</p>
                    <p className="text-slate-400">Tel: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Garantías del Comprador</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Protección al Comprador:</strong> El vendedor solo recibe sus fondos cuando tú confirmas que recibiste el paquete conforme.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Productos 100% Originales:</strong> Distribuidores verificados y autorizados por marcas líderes mundiales.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Embalaje Seguro:</strong> Cosméticos y herramientas eléctricas viajan con precinto de seguridad sellado.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Technical Sheet Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* Review Modal */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-slate-900 text-base">Calificar Producto Recibido</h3>
            <p className="text-slate-600">{reviewModalProduct.title}</p>

            <form onSubmit={handlePostReview} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Calificación en Estrellas:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${s <= reviewRating ? 'fill-amber-400 stroke-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Comentario o Reseña:</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="¿Qué tal te pareció el resultado, textura y efectividad del producto?"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700"
                >
                  Publicar Calificación
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModalProduct(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Reportar Problema con el Envío
            </h3>
            <p className="text-slate-500">
              Nuestro equipo de soporte revisará la solicitud y retendrá la liquidación a la tienda hasta su resolución.
            </p>

            <form onSubmit={handleSendDispute} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo del reporte:</label>
                <textarea
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe si el producto llegó roto, equivocado o con el sello violado..."
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700"
                >
                  Enviar Reporte
                </button>
                <button
                  type="button"
                  onClick={() => setDisputeModalData(null)}
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
  );
};
