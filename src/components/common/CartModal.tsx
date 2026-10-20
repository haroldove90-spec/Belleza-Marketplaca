import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Building,
  Store,
  CheckCircle,
  Truck,
  FileText,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShippingAddress } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    currentRole,
    savedAddresses,
    addAddress,
    checkoutOrder,
    platformCommissionRate,
    setActiveTab,
  } = useMarketplace();

  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta de Crédito / Débito' | 'Transferencia SPEI' | 'Efectivo en OXXO'>(
    'Tarjeta de Crédito / Débito'
  );

  // New address state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newColonia, setNewColonia] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFullName, setNewFullName] = useState('');

  // Invoice / Fiscal Data state
  const [needInvoice, setNeedInvoice] = useState(currentRole === 'stylist');
  const [rfc, setRfc] = useState(currentRole === 'stylist' ? 'MEAV890412H81' : '');
  const [razonSocial, setRazonSocial] = useState(currentRole === 'stylist' ? 'Valeria Mendoza Arreola' : '');
  const [cfdiUse, setCfdiUse] = useState('G03 - Gastos en general');

  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  if (!isOpen) return null;

  const isStylist = currentRole === 'stylist';

  // Group items by Seller to calculate multi-vendor split shipping
  const itemsBySeller: { [sellerId: string]: typeof cart } = {};
  cart.forEach((item) => {
    if (!itemsBySeller[item.product.sellerId]) {
      itemsBySeller[item.product.sellerId] = [];
    }
    itemsBySeller[item.product.sellerId].push(item);
  });

  const sellerGroups = Object.keys(itemsBySeller).map((sellerId) => {
    const sItems = itemsBySeller[sellerId];
    const sellerName = sItems[0].product.sellerName;
    const subtotal = sItems.reduce((acc, item) => {
      const v = item.product.variants.find((variant) => variant.id === item.variantId) || item.product.variants[0];
      const price = isStylist ? v.priceB2B : v.priceB2C;
      return acc + price * item.quantity;
    }, 0);
    const shipping = subtotal > 1800 ? 0 : 99;
    return {
      sellerId,
      sellerName,
      items: sItems,
      subtotal,
      shipping,
    };
  });

  const grandSubtotal = sellerGroups.reduce((acc, curr) => acc + curr.subtotal, 0);
  const grandShipping = sellerGroups.reduce((acc, curr) => acc + curr.shipping, 0);
  const grandTotal = grandSubtotal + grandShipping;

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newPostalCode || !newFullName) return;
    addAddress({
      fullName: newFullName,
      street: newStreet,
      colonia: newColonia || 'Centro',
      city: newCity || 'Ciudad de México',
      state: newState || 'CDMX',
      postalCode: newPostalCode,
      phone: newPhone || '55 0000 0000',
      isDefault: false,
    });
    setShowNewAddress(false);
  };

  const handleCompleteOrder = () => {
    const address = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0] || {
      id: 'addr-default',
      fullName: 'Cliente de Prueba',
      street: 'Av. Insurgentes Sur 1200',
      colonia: 'Del Valle',
      city: 'CDMX',
      state: 'CDMX',
      postalCode: '03100',
      phone: '55 1234 5678',
    };

    const billing = needInvoice && rfc ? { rfc, razonSocial: razonSocial || address.fullName, cfdiUse } : undefined;

    const ord = checkoutOrder(address, paymentMethod, billing);
    setCreatedOrderId(ord.id);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 text-lg">
              {step === 'cart' && 'Carrito de Compras'}
              {step === 'shipping' && 'Dirección de Entrega'}
              {step === 'payment' && 'Pasarela de Pago'}
              {step === 'success' && '¡Pedido Exitoso!'}
            </h2>
            {step !== 'success' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold">
                Multi-Vendedor
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-semibold">Tu carrito está vacío</p>
                  <p className="text-xs text-slate-400 mt-1">Explora nuestro catálogo para agregar productos profesionales.</p>
                  <button
                    onClick={onClose}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs shadow-md hover:bg-rose-700 transition"
                  >
                    Ir a Explorar
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Multi-Vendor grouped display */}
                  {sellerGroups.map((group) => (
                    <div key={group.sellerId} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-800">{group.sellerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Envío: {group.shipping === 0 ? <strong className="text-emerald-600 font-bold">¡GRATIS!</strong> : `$${group.shipping} MXN`}</span>
                        </div>
                      </div>

                      {/* Items from this seller */}
                      <div className="space-y-3">
                        {group.items.map((item) => {
                          const v = item.product.variants.find((vr) => vr.id === item.variantId) || item.product.variants[0];
                          const price = isStylist ? v.priceB2B : v.priceB2C;
                          return (
                            <div
                              key={`${item.product.id}-${item.variantId}`}
                              className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100"
                            >
                              <img
                                src={item.product.images[0]}
                                alt=""
                                className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.title}</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">Var: {v.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold text-rose-700">${price.toLocaleString('es-MX')} MXN</span>
                                  {isStylist && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                                      Pro B2B
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Quantity control */}
                              <div className="flex items-center border border-slate-200 rounded-lg">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.variantId, item.quantity - 1)}
                                  className="p-1 hover:bg-slate-100 text-slate-500 rounded-l-lg"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.variantId, item.quantity + 1)}
                                  className="p-1 hover:bg-slate-100 text-slate-500 rounded-r-lg"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() => removeFromCart(item.product.id, item.variantId)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'shipping' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Selecciona la dirección de envío:
              </h3>

              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                      selectedAddressId === addr.id
                        ? 'border-rose-600 bg-rose-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 pl-6">
                      {addr.street}, Col. {addr.colonia}, {addr.city}, {addr.state} C.P. {addr.postalCode}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 pl-6">Tel: {addr.phone}</p>
                  </div>
                ))}
              </div>

              {!showNewAddress ? (
                <button
                  onClick={() => setShowNewAddress(true)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:border-rose-400 hover:text-rose-600 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Agregar Nueva Dirección
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} className="p-4 rounded-2xl border border-slate-300 bg-slate-50 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-800">Nueva Dirección de Entrega</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre Completo / Salón"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="p-2 border rounded-lg col-span-2 bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Calle y Número"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="p-2 border rounded-lg col-span-2 bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Colonia"
                      value={newColonia}
                      onChange={(e) => setNewColonia(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Código Postal"
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Teléfono Celular"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                    >
                      Guardar Dirección
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Method Selector */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Método de Pago:
                </h3>
                <div className="space-y-2.5">
                  {[
                    {
                      id: 'Tarjeta de Crédito / Débito',
                      desc: 'Acreditación instantánea (Visa, Mastercard, Amex)',
                      icon: CreditCard,
                    },
                    {
                      id: 'Transferencia SPEI',
                      desc: 'Pago directo interbancario vía CLABE única',
                      icon: Building,
                    },
                    {
                      id: 'Efectivo en OXXO',
                      desc: 'Paga con código de barras en cualquier tienda OXXO',
                      icon: Store,
                    },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition cursor-pointer ${
                          paymentMethod === m.id
                            ? 'border-rose-600 bg-rose-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            paymentMethod === m.id ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900">{m.id}</p>
                          <p className="text-[11px] text-slate-500">{m.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Automatic Invoicing RFC */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-900">¿Requieres Factura Fiscal (CFDI 4.0)?</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={needInvoice}
                    onChange={(e) => setNeedInvoice(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </div>

                {needInvoice && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <input
                      type="text"
                      placeholder="RFC (ej. MEAV890412H81)"
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Razón Social o Nombre Fiscal"
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                      className="p-2 border rounded-lg bg-white"
                      required
                    />
                    <select
                      value={cfdiUse}
                      onChange={(e) => setCfdiUse(e.target.value)}
                      className="p-2 border rounded-lg bg-white col-span-2"
                    >
                      <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                      <option value="G01 - Adquisición de mercancías">G01 - Adquisición de mercancías</option>
                      <option value="P01 - Por definir">P01 - Por definir</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¡Compra Confirmada!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Tu orden <strong>#{createdOrderId}</strong> fue procesada y distribuida entre las tiendas correspondientes.
                Cada vendedor ya recibió la orden para su empaque y despacho.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-sm mx-auto text-left space-y-1">
                <div className="flex justify-between">
                  <span>Total Pagado:</span>
                  <strong className="text-slate-900">${grandTotal.toLocaleString('es-MX')} MXN</strong>
                </div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span>{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envíos divididos:</span>
                  <span>{sellerGroups.length} paquetes independientes</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('pedidos');
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Ver Estado de mis Pedidos
              </button>
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal de productos:</span>
                <span className="font-semibold text-slate-800">${grandSubtotal.toLocaleString('es-MX')} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Costos de envío ({sellerGroups.length} tienda{sellerGroups.length > 1 ? 's' : ''}):</span>
                <span className="font-semibold text-slate-800">${grandShipping} MXN</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-rose-600">${grandTotal.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>

            <div className="flex gap-3">
              {step !== 'cart' && (
                <button
                  onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
                >
                  Volver
                </button>
              )}

              {step === 'cart' && (
                <button
                  onClick={() => setStep('shipping')}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Continuar a Envío <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 'shipping' && (
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Continuar a Pago <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 'payment' && (
                <button
                  onClick={handleCompleteOrder}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Confirmar y Pagar ${grandTotal.toLocaleString('es-MX')} MXN
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
