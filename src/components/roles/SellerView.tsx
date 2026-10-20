import React, { useState } from 'react';
import {
  Package,
  Plus,
  Truck,
  TrendingUp,
  Store,
  DollarSign,
  AlertTriangle,
  Edit,
  Trash2,
  CheckCircle,
  ExternalLink,
  Save,
  Tag,
  Boxes,
  Send,
  Printer,
  X,
  Barcode,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Product, ProductVariant, OrderStatus } from '../../types';

export const SellerView: React.FC = () => {
  const {
    activeTab,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    sellers,
    updateSeller,
    orders,
    updateSubOrderStatus,
    showToast,
  } = useMarketplace();

  // Pick seller-1 as the primary logged-in seller demo
  const currentSeller = sellers[0] || sellers[0];

  // Orders status filter
  const [orderFilter, setOrderFilter] = useState<string>('todos');

  // Seller's specific orders
  const sellerSubOrders: {
    orderId: string;
    subOrder: any;
    buyerName: string;
    buyerPhone: string;
    shippingAddress: any;
    createdAt: string;
  }[] = [];

  orders.forEach((ord) => {
    ord.subOrders.forEach((sub) => {
      if (sub.sellerId === currentSeller.id) {
        sellerSubOrders.push({
          orderId: ord.id,
          subOrder: sub,
          buyerName: ord.buyerName,
          buyerPhone: ord.buyerPhone,
          shippingAddress: ord.shippingAddress,
          createdAt: ord.createdAt,
        });
      }
    });
  });

  // Filtered suborders
  const filteredSubOrders = sellerSubOrders.filter((item) => {
    if (orderFilter === 'todos') return true;
    if (orderFilter === 'preparacion') return item.subOrder.status === 'En preparación';
    if (orderFilter === 'empacado') return item.subOrder.status === 'Empacado';
    if (orderFilter === 'enviado') return item.subOrder.status === 'Enviado';
    if (orderFilter === 'entregado') return item.subOrder.status === 'Entregado';
    return true;
  });

  // Modal / Form state for Add/Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState(currentSeller.storeName);
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Tintes y Coloración');
  const [formSubcategory, setFormSubcategory] = useState(categories[0]?.subcategories[0] || 'Tintes Permanentes');
  const [formDescription, setFormDescription] = useState('');
  const [formHowToUse, setFormHowToUse] = useState('');
  const [formWarnings, setFormWarnings] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formHairOrSkinType, setFormHairOrSkinType] = useState<Product['hairOrSkinType']>('Todo tipo');
  const [formIsSalonExclusive, setFormIsSalonExclusive] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formMinStockAlert, setFormMinStockAlert] = useState(10);

  // Variants state for the product form
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([
    { id: 'v1', name: 'Estándar / 250ml', sku: 'SKU-001', stock: 50, priceB2C: 350, priceB2B: 240 },
  ]);

  // Tracking update modal state
  const [trackingModal, setTrackingModal] = useState<{
    orderId: string;
    subOrderId: string;
    carrier: string;
    trackingNumber: string;
  } | null>(null);

  // Shipping Label / Packing Slip preview modal state
  const [labelModalData, setLabelModalData] = useState<any | null>(null);

  // Store profile form state
  const [storeName, setStoreName] = useState(currentSeller.storeName);
  const [legalName, setLegalName] = useState(currentSeller.legalName);
  const [rfc, setRfc] = useState(currentSeller.rfc);
  const [shippingPolicy, setShippingPolicy] = useState(currentSeller.shippingPolicy);
  const [returnPolicy, setReturnPolicy] = useState(currentSeller.returnPolicy);
  const [bankName, setBankName] = useState(currentSeller.bankAccount.bankName);
  const [clabe, setClabe] = useState(currentSeller.bankAccount.clabe);
  const [accountHolder, setAccountHolder] = useState(currentSeller.bankAccount.accountHolder);

  const openNewProductModal = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormBrand(currentSeller.storeName);
    setFormCategory(categories[0]?.name || 'Tintes y Coloración');
    setFormSubcategory(categories[0]?.subcategories[0] || 'Tintes Permanentes');
    setFormDescription('');
    setFormHowToUse('');
    setFormWarnings('');
    setFormIngredients('');
    setFormHairOrSkinType('Todo tipo');
    setFormIsSalonExclusive(false);
    setFormImageUrl('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&h=700&fit=crop');
    setFormMinStockAlert(10);
    setFormVariants([
      { id: `v-${Date.now()}-1`, name: 'Presentación 250ml', sku: `SKU-${Math.floor(100 + Math.random() * 900)}`, stock: 30, priceB2C: 450, priceB2B: 310 },
    ]);
    setShowProductModal(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormTitle(p.title);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormDescription(p.description);
    setFormHowToUse(p.howToUse);
    setFormWarnings(p.warnings);
    setFormIngredients(p.ingredients);
    setFormHairOrSkinType(p.hairOrSkinType);
    setFormIsSalonExclusive(p.isSalonExclusive);
    setFormImageUrl(p.images[0] || '');
    setFormMinStockAlert(p.minStockAlert);
    setFormVariants(p.variants);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: formTitle,
        brand: formBrand,
        category: formCategory,
        subcategory: formSubcategory,
        description: formDescription,
        howToUse: formHowToUse,
        warnings: formWarnings,
        ingredients: formIngredients,
        hairOrSkinType: formHairOrSkinType,
        isSalonExclusive: formIsSalonExclusive,
        images: [formImageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&h=700&fit=crop'],
        minStockAlert: formMinStockAlert,
        variants: formVariants,
      });
    } else {
      addProduct({
        title: formTitle,
        brand: formBrand,
        category: formCategory,
        subcategory: formSubcategory,
        description: formDescription,
        howToUse: formHowToUse,
        warnings: formWarnings,
        ingredients: formIngredients,
        hairOrSkinType: formHairOrSkinType,
        isSalonExclusive: formIsSalonExclusive,
        images: [formImageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&h=700&fit=crop'],
        minStockAlert: formMinStockAlert,
        sellerId: currentSeller.id,
        sellerName: currentSeller.storeName,
        status: 'active',
        variants: formVariants,
      });
    }
    setShowProductModal(false);
  };

  // Quick Stock adjuster
  const adjustStock = (productId: string, variantId: string, amount: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const updatedVariants = prod.variants.map((v) => {
      if (v.id === variantId) {
        return { ...v, stock: Math.max(0, v.stock + amount) };
      }
      return v;
    });
    updateProduct(productId, { variants: updatedVariants });
    showToast(`Stock actualizado para variante (${amount > 0 ? `+${amount}` : amount}).`);
  };

  const handleSaveStoreProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeller(currentSeller.id, {
      storeName,
      legalName,
      rfc,
      shippingPolicy,
      returnPolicy,
      bankAccount: {
        bankName,
        clabe,
        accountHolder,
      },
    });
  };

  // Add / remove variant helpers
  const addVariantRow = () => {
    setFormVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        name: 'Nueva Variante',
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        stock: 20,
        priceB2C: 250,
        priceB2B: 180,
      },
    ]);
  };

  const updateVariantRow = (id: string, field: keyof ProductVariant, val: any) => {
    setFormVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  const removeVariantRow = (id: string) => {
    if (formVariants.length <= 1) return;
    setFormVariants((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 lg:pb-10">
      {/* Tab: Gestión de Productos */}
      {activeTab === 'productos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Mis Productos &amp; Catálogo Vendedor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Administra inventario, variantes de tonos/tamaños y segmentación de precios B2C y B2B Estilista.
              </p>
            </div>

            <button
              onClick={openNewProductModal}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Publicar Nuevo Producto
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
              const isLowStock = totalStock <= p.minStockAlert;
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {p.isSalonExclusive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900 text-white shadow-xs">
                            Exclusivo Pro
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                            General
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs ${
                            isLowStock ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {isLowStock ? `Stock Bajo (${totalStock})` : `${totalStock} en stock`}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                        {p.category} • {p.subcategory}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {p.title}
                      </h3>

                      {/* Pricing segmentation display */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Público (B2C):</span>
                          <strong className="text-slate-900">${p.variants[0]?.priceB2C} MXN</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-700 block text-[10px] font-bold">Estilista (B2B):</span>
                          <strong className="text-emerald-700">${p.variants[0]?.priceB2B} MXN</strong>
                        </div>
                      </div>

                      {/* Quick stock controls */}
                      <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-slate-600 uppercase block">Ajuste Rápido de Stock:</span>
                        {p.variants.map((v) => (
                          <div key={v.id} className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[120px] font-medium">{v.name}:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold font-mono w-7 text-center">{v.stock}</span>
                              <button
                                onClick={() => adjustStock(p.id, v.id, -5)}
                                className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-xs"
                                title="Reducir 5 unidades"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => adjustStock(p.id, v.id, 10)}
                                className="w-5 h-5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs"
                                title="Agregar 10 unidades"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditProductModal(p)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" /> Editar Producto
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Gestión de Pedidos & Envíos */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Gestión de Pedidos &amp; Despacho
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Notificaciones de órdenes recibidas, cambio de estatus de empaque y generación de guías transportistas.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'preparacion', label: 'Por Empacar' },
                { id: 'empacado', label: 'Empacados' },
                { id: 'enviado', label: 'En Tránsito' },
                { id: 'entregado', label: 'Entregados' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setOrderFilter(btn.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    orderFilter === btn.id
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredSubOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">No hay pedidos con este filtro</p>
                <p className="text-xs text-slate-400 mt-1">Los nuevos pedidos de compradores aparecerán aquí en tiempo real.</p>
              </div>
            ) : (
              filteredSubOrders.map(({ orderId, subOrder, buyerName, buyerPhone, shippingAddress, createdAt }) => (
                <div key={subOrder.subOrderId} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm">#{subOrder.subOrderId}</span>
                      <span className="text-slate-400 ml-2">(Orden Madre: #{orderId}) • {createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-2.5 py-1 rounded-full uppercase text-[11px] ${
                          subOrder.status === 'Entregado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : subOrder.status === 'Enviado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {subOrder.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Buyer & Destination */}
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold block">Destinatario:</span>
                      <p className="font-bold text-slate-900">{buyerName}</p>
                      <p className="text-slate-600">{shippingAddress.street}, {shippingAddress.city}, C.P. {shippingAddress.postalCode}</p>
                      <p className="text-slate-400">Tel: {buyerPhone}</p>
                    </div>

                    {/* Financial summary for this suborder */}
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold block">Liquidación neta estimada:</span>
                      <div className="text-base font-bold text-slate-900">
                        ${subOrder.sellerNet} <span className="text-xs font-normal text-slate-500">MXN</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Subtotal: ${subOrder.subtotal} + Envío: ${subOrder.shippingCost}</p>
                      <p className="text-[11px] text-rose-600 font-semibold">Fee plataforma: -${subOrder.platformFee}</p>
                    </div>

                    {/* Carrier & Tracking */}
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold block">Transportista &amp; Guía:</span>
                      {subOrder.trackingNumber ? (
                        <div className="font-mono text-indigo-700 font-bold">
                          {subOrder.carrier}: {subOrder.trackingNumber}
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium">Guía aún no generada</span>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase">Productos a despachar:</span>
                    {subOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">
                          {item.quantity}x {item.productTitle} ({item.variantName})
                        </span>
                        <span className="font-bold text-slate-700">${item.totalPrice} MXN</span>
                      </div>
                    ))}
                  </div>

                  {/* Operational workflow action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setLabelModalData({ orderId, subOrder, buyerName, buyerPhone, shippingAddress, createdAt })}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" /> Ver Remisión &amp; Etiqueta
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {subOrder.status === 'En preparación' && (
                        <button
                          onClick={() => updateSubOrderStatus(orderId, subOrder.subOrderId, 'Empacado')}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
                        >
                          Marcar como "Empacado"
                        </button>
                      )}

                      {subOrder.status === 'Empacado' && (
                        <button
                          onClick={() =>
                            setTrackingModal({
                              orderId,
                              subOrderId: subOrder.subOrderId,
                              carrier: 'DHL Express',
                              trackingNumber: `DHL-MX-${Math.floor(100000000 + Math.random() * 900000000)}`,
                            })
                          }
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" /> Asignar Guía &amp; Enviar
                        </button>
                      )}

                      {subOrder.status === 'Enviado' && (
                        <span className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-blue-600" /> En tránsito. Esperando confirmación del cliente.
                        </span>
                      )}

                      {subOrder.status === 'Entregado' && (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Entrega confirmada y saldo listo.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Métricas & Liquidaciones */}
      {activeTab === 'metricas' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ventas, Saldo &amp; Liquidaciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Resumen de ingresos, saldo acumulado y corte financiero para dispersión interbancaria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Saldo Disponible para Corte</span>
              <div className="text-2xl font-black text-emerald-700 mt-2">
                ${currentSeller.accumulatedBalance.toLocaleString('es-MX')} MXN
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Listo para dispersión a CLABE</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Ventas Totales Brutas</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ${currentSeller.totalSales.toLocaleString('es-MX')} MXN
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Acumulado histórico</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Cuenta Bancaria Registrada</span>
              <div className="text-sm font-bold text-slate-900 mt-2">
                {currentSeller.bankAccount.bankName}
              </div>
              <p className="font-mono text-xs text-slate-500 mt-0.5">{currentSeller.bankAccount.clabe}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Cuenta Verificada</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Perfil de Tienda */}
      {activeTab === 'tienda' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Perfil Público de Tienda &amp; Datos Fiscales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configura cómo ven los compradores y salones tu tienda oficial en Marketplace Belleza.
            </p>
          </div>

          <form onSubmit={handleSaveStoreProfile} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial de la Tienda:</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Razón Social Fiscal:</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">RFC de la Empresa:</label>
                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banco Receptor:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">CLABE Interbancaria (18 dígitos para liquidación):</label>
                <input
                  type="text"
                  value={clabe}
                  onChange={(e) => setClabe(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Políticas de Envío y Despacho:</label>
                <textarea
                  rows={2}
                  value={shippingPolicy}
                  onChange={(e) => setShippingPolicy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Políticas de Garantía y Devolución:</label>
                <textarea
                  rows={2}
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4" /> Guardar Información de Tienda
            </button>
          </form>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                {editingProductId ? 'Editar Publicación de Producto' : 'Dar de Alta Nuevo Producto'}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Título del Producto:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ej. Tinte en Crema Profesional 60ml"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      setFormCategory(e.target.value);
                      const cat = categories.find((c) => c.name === e.target.value);
                      if (cat && cat.subcategories.length > 0) {
                        setFormSubcategory(cat.subcategories[0]);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategoría:</label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">URL de Imagen del Producto:</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Cabello / Piel:</label>
                  <select
                    value={formHairOrSkinType}
                    onChange={(e) => setFormHairOrSkinType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Todo tipo">Todo tipo</option>
                    <option value="Teñido/Decolorado">Teñido/Decolorado</option>
                    <option value="Seco/Dañado">Seco/Dañado</option>
                    <option value="Graso">Graso</option>
                    <option value="Rizado/Ondulado">Rizado/Ondulado</option>
                    <option value="Sensible">Sensible</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alerta de Stock Mínimo:</label>
                  <input
                    type="number"
                    min="1"
                    value={formMinStockAlert}
                    onChange={(e) => setFormMinStockAlert(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="sm:col-span-2 bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-900 block">¿Exclusivo para Salón / Estilistas?</span>
                    <span className="text-[11px] text-slate-500">
                      Ocultará la compra a clientes generales; solo estilistas con cédula verificada podrán adquirirlo.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsSalonExclusive}
                    onChange={(e) => setFormIsSalonExclusive(e.target.checked)}
                    className="w-5 h-5 text-rose-600 rounded"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Descripción Detallada:</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    placeholder="Beneficios, textura, acabado..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Modo de Uso Profesional:</label>
                  <textarea
                    rows={2}
                    value={formHowToUse}
                    onChange={(e) => setFormHowToUse(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    placeholder="Tiempos de pose, proporción de mezcla..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Advertencias y Precauciones:</label>
                  <textarea
                    rows={2}
                    value={formWarnings}
                    onChange={(e) => setFormWarnings(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    placeholder="Prueba de parche, evitar ojos..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Ingredientes Activos (INCI):</label>
                  <input
                    type="text"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    placeholder="Keratin, Argania Spinosa, Aqua..."
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-rose-600" /> Manejo de Variantes &amp; Segmentación B2C / B2B Pro
                  </h3>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg text-xs"
                  >
                    + Agregar Variante
                  </button>
                </div>

                <div className="space-y-2">
                  {formVariants.map((v) => (
                    <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-5 gap-2 items-center">
                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-400 font-bold block">Nombre / Tono / Tamaño:</label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => updateVariantRow(v.id, 'name', e.target.value)}
                          placeholder="Ej. Tono 8.1 / 1000ml"
                          className="w-full p-1.5 border rounded-lg bg-white text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block">Stock:</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariantRow(v.id, 'stock', Number(e.target.value))}
                          className="w-full p-1.5 border rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block">Público B2C:</label>
                        <input
                          type="number"
                          value={v.priceB2C}
                          onChange={(e) => updateVariantRow(v.id, 'priceB2C', Number(e.target.value))}
                          className="w-full p-1.5 border rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div className="relative">
                        <label className="text-[10px] text-emerald-700 font-bold block">Pro B2B:</label>
                        <input
                          type="number"
                          value={v.priceB2B}
                          onChange={(e) => updateVariantRow(v.id, 'priceB2B', Number(e.target.value))}
                          className="w-full p-1.5 border rounded-lg bg-white text-xs font-bold text-emerald-800"
                        />
                        {formVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantRow(v.id)}
                            className="absolute -top-1 -right-1 text-slate-400 hover:text-rose-600"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
                >
                  {editingProductId ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Carrier & Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Asignar Guía de Paquetería</h3>
            <p className="text-xs text-slate-500">
              Ingresa la transportista y número de guía para despachar la sub-orden #{trackingModal.subOrderId}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Empresa Transportista:</label>
                <select
                  value={trackingModal.carrier}
                  onChange={(e) => setTrackingModal({ ...trackingModal, carrier: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="DHL Express">DHL Express</option>
                  <option value="FedEx Priority">FedEx Priority</option>
                  <option value="Estafeta Terrestre">Estafeta Terrestre</option>
                  <option value="Paquetexpress">Paquetexpress</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Número de Guía:</label>
                <input
                  type="text"
                  value={trackingModal.trackingNumber}
                  onChange={(e) => setTrackingModal({ ...trackingModal, trackingNumber: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  updateSubOrderStatus(
                    trackingModal.orderId,
                    trackingModal.subOrderId,
                    'Enviado',
                    trackingModal.carrier,
                    trackingModal.trackingNumber
                  );
                  setTrackingModal(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 active:scale-95"
              >
                Confirmar Envío
              </button>
              <button
                onClick={() => setTrackingModal(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Label / Packing Slip Modal */}
      {labelModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Guía de Paquetería &amp; Packing Slip</h3>
              </div>
              <button
                onClick={() => setLabelModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Label voucher design */}
            <div className="border-2 border-slate-800 p-4 rounded-xl bg-slate-50 space-y-3 font-mono">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-sm tracking-wider">
                  {labelModalData.subOrder.carrier || 'DHL EXPRESS'}
                </span>
                <span className="text-[11px] font-bold">NACIONAL DÍA SIGUIENTE</span>
              </div>

              <div>
                <p className="text-[10px] text-slate-500">REMITENTE:</p>
                <p className="font-bold text-slate-900">{currentSeller.storeName}</p>
                <p className="text-[11px] text-slate-600">{currentSeller.legalName}</p>
              </div>

              <div className="border-t pt-2">
                <p className="text-[10px] text-slate-500">DESTINATARIO:</p>
                <p className="font-bold text-slate-900">{labelModalData.buyerName}</p>
                <p className="text-[11px] text-slate-700">
                  {labelModalData.shippingAddress.street}, {labelModalData.shippingAddress.colonia}
                </p>
                <p className="text-[11px] text-slate-700">
                  {labelModalData.shippingAddress.city}, {labelModalData.shippingAddress.state} C.P. {labelModalData.shippingAddress.postalCode}
                </p>
                <p className="text-[10px] text-slate-500">Tel: {labelModalData.buyerPhone}</p>
              </div>

              {/* Barcode visual */}
              <div className="border-t pt-3 text-center">
                <div className="h-10 w-full flex items-center justify-center bg-white border border-slate-300 rounded tracking-widest text-slate-900 font-bold text-sm">
                  ||||| | |||| || |||||| | ||||| |||
                </div>
                <p className="text-[11px] font-bold mt-1">
                  GUÍA: {labelModalData.subOrder.trackingNumber || 'GENERACIÓN PENDIENTE'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95"
              >
                <Printer className="w-4 h-4" /> Imprimir Etiqueta
              </button>
              <button
                onClick={() => setLabelModalData(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
