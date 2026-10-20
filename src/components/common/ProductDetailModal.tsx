import React, { useState } from 'react';
import { X, Star, ShieldAlert, Sparkles, Check, ShoppingCart, Lock } from 'lucide-react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

interface Props {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const { currentRole, currentStylistVerified, addToCart, reviews } = useMarketplace();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const isStylist = currentRole === 'stylist';
  const canBuyPro = !product.isSalonExclusive || (isStylist && currentStylistVerified);
  const activePrice = isStylist ? selectedVariant.priceB2B : selectedVariant.priceB2C;
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    if (!canBuyPro) return;
    addToCart(product, selectedVariant.id, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 backdrop-blur-xs shadow-xs transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Images */}
            <div>
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === img ? 'border-rose-600 ring-2 ring-rose-200' : 'border-slate-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info, Price, Variants */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {product.brand}
                  </span>
                  {product.isSalonExclusive ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-300">
                      <Sparkles className="w-3 h-3" /> Solo Salón Pro
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Venta General
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {product.title}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span className="text-xs font-bold ml-1 text-slate-800">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviewCount} reseñas)</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">{product.sellerName}</span>
                </div>

                {/* Price block */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ${activePrice.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-500">MXN</span>
                    </span>

                    {/* Show wholesale discount comparison for Stylist or teaser for customer */}
                    {isStylist ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Precio Pro Mayorista (Ahorro ${(selectedVariant.priceB2C - selectedVariant.priceB2B).toLocaleString('es-MX')})
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 line-through">
                        Ref: ${selectedVariant.priceB2C}
                      </span>
                    )}
                  </div>

                  {!isStylist && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">
                      ¿Eres estilista con salón? Inicia sesión como Estilista para acceder al precio mayoreo de ${selectedVariant.priceB2B} MXN.
                    </p>
                  )}
                </div>

                {/* Variants Selection */}
                {product.variants.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Seleccionar Variante / Tamaño / Tono:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-2.5 rounded-xl border text-left transition text-xs font-semibold ${
                            selectedVariantId === v.id
                              ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="truncate">{v.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5 flex justify-between">
                            <span>SKU: {v.sku}</span>
                            <span className={v.stock <= 5 ? 'text-amber-600 font-bold' : ''}>
                              {v.stock > 0 ? `${v.stock} disp.` : 'Agotado'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock || 99, q + 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    +
                  </button>
                </div>

                {product.isSalonExclusive && (!isStylist || !currentStylistVerified) ? (
                  <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 text-slate-500 font-semibold text-xs border border-slate-200">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Requiere Cédula de Estilista Aprobada
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={selectedVariant.stock <= 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95 disabled:bg-slate-300"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {selectedVariant.stock <= 0 ? 'Agotado' : 'Agregar al Carrito'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Technical Tabs / Sections */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Ficha Técnica &amp; Modo de Empleo
            </h3>

            {/* Description */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">Descripción:</p>
              {product.description}
            </div>

            {/* How to use */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Modo de Uso Profesional:
              </p>
              {product.howToUse}
            </div>

            {/* Warnings */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Advertencias y Precauciones:
              </p>
              {product.warnings}
            </div>

            {/* Ingredients */}
            <div className="p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
              <p className="font-bold text-slate-800 mb-1">Ingredientes Activos (Fórmula INCI):</p>
              <p className="font-mono text-[11px] leading-relaxed text-slate-500">{product.ingredients}</p>
            </div>

            {/* Verified Reviews */}
            <div className="pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Reseñas de Profesionales y Clientes ({productReviews.length})
              </h4>
              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aún no hay reseñas para este producto.</p>
              ) : (
                <div className="space-y-3">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{rev.userName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${idx < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
