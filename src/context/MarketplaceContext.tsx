import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Product,
  SellerProfile,
  StylistVerification,
  SalonDirectoryItem,
  Category,
  Order,
  SubOrder,
  OrderItem,
  ShippingAddress,
  Dispute,
  ProductReview,
  OrderStatus,
} from '../types';

interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
}

interface MarketplaceContextType {
  // Current session
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Platform Config
  platformCommissionRate: number;
  setPlatformCommissionRate: (rate: number) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setProductStatus: (id: string, status: Product['status']) => void;
  addCategory: (name: string, subcategories: string[]) => void;
  updateCategories: (categories: Category[]) => void;

  // Sellers
  sellers: SellerProfile[];
  updateSeller: (sellerId: string, updates: Partial<SellerProfile>) => void;
  setSellerStatus: (sellerId: string, status: 'approved' | 'pending' | 'suspended') => void;
  disburseSellerFunds: (sellerId: string) => void;

  // Stylists
  stylists: StylistVerification[];
  updateStylistVerification: (id: string, status: 'verified' | 'pending' | 'rejected', notes?: string) => void;
  submitStylistApplication: (app: Omit<StylistVerification, 'id' | 'status' | 'submittedAt'>) => void;
  currentStylistVerified: boolean;
  salonsDirectory: SalonDirectoryItem[];
  addSalontoDirectory: (salon: Omit<SalonDirectoryItem, 'id' | 'rating'>) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  savedAddresses: ShippingAddress[];
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  checkoutOrder: (
    address: ShippingAddress,
    paymentMethod: 'Tarjeta de Crédito / Débito' | 'Transferencia SPEI' | 'Efectivo en OXXO',
    billingData?: { rfc: string; razonSocial: string; cfdiUse: string }
  ) => Order;

  // Orders & Fulfillment
  orders: Order[];
  updateSubOrderStatus: (
    orderId: string,
    subOrderId: string,
    status: OrderStatus,
    carrier?: string,
    trackingNumber?: string
  ) => void;
  confirmOrderReceived: (orderId: string, subOrderId: string) => void;

  // Disputes & Support
  disputes: Dispute[];
  createDispute: (orderId: string, subOrderId: string, reason: string) => void;
  resolveDispute: (disputeId: string, resolution: 'resuelta_reembolso' | 'resuelta_rechazada', note: string) => void;

  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;

  // UI Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'marketplace_belleza_v1_data';

const initialCategories: Category[] = [
  {
    id: 'cat-tintes',
    name: 'Tintes y Coloración',
    iconName: 'Sparkles',
    order: 1,
    subcategories: ['Tintes Permanentes', 'Oxidantes y Reveladores', 'Decolorantes Pro', 'Matizadores y Toner'],
  },
  {
    id: 'cat-capilar',
    name: 'Cuidado Capilar',
    iconName: 'ShieldCheck',
    order: 2,
    subcategories: ['Tratamientos Plex / Bond', 'Shampoos Sin Sulfatos', 'Mascarillas Nutritivas', 'Ampolletas'],
  },
  {
    id: 'cat-termicas',
    name: 'Herramientas Térmicas',
    iconName: 'Flame',
    order: 3,
    subcategories: ['Planchas de Titanio', 'Secadoras Profesionales', 'Tenazas y Rizadores', 'Cepillos Térmicos'],
  },
  {
    id: 'cat-quimicos',
    name: 'Tratamientos Químicos Salón',
    iconName: 'FlaskConical',
    order: 4,
    subcategories: ['Alaciados Japoneses', 'Keratinas Brasileñas', 'Permanentes y Neutralizantes', 'Plex Concentrado'],
  },
  {
    id: 'cat-skincare',
    name: 'Skincare y Spa',
    iconName: 'HeartHandshake',
    order: 5,
    subcategories: ['Serums de Vitamina C', 'Ácido Hialurónico', 'Exfoliantes Químicos', 'Cremas Reparadoras'],
  },
];

const initialSellers: SellerProfile[] = [
  {
    id: 'seller-1',
    storeName: 'Distribuidora Capilar Pro',
    legalName: 'Capilar Profesional de México S.A. de C.V.',
    rfc: 'CPM180415KZ2',
    email: 'ventas@capilarpro.mx',
    phone: '+52 55 4123 8890',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop',
    shippingPolicy: 'Envíos el mismo día hábil en compras antes de las 14:00 hrs vía DHL Express. Empaque térmico sellado.',
    returnPolicy: 'Garantía directa de 30 días en herramientas eléctricas. Cosméticos cerrados en empaque original.',
    bankAccount: {
      bankName: 'BBVA México',
      clabe: '012180001982736451',
      accountHolder: 'Capilar Profesional de México S.A.',
    },
    status: 'approved',
    rating: 4.9,
    accumulatedBalance: 14850,
    totalSales: 98400,
  },
  {
    id: 'seller-2',
    storeName: 'Luxe Salon Supplies',
    legalName: 'Distribuciones de Belleza y Estilismo del Norte',
    rfc: 'DBE200210TR9',
    email: 'contacto@luxesalon.com',
    phone: '+52 81 8329 4400',
    logo: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&h=400&fit=crop',
    shippingPolicy: 'Envíos asegurados por FedEx a toda la República. Envío gratis en órdenes mayores a $1,800 MXN.',
    returnPolicy: 'Cambios sin costo por defecto de fábrica en los primeros 15 días naturales.',
    bankAccount: {
      bankName: 'Santander',
      clabe: '014180002873619283',
      accountHolder: 'Distribuciones de Belleza del Norte',
    },
    status: 'approved',
    rating: 4.8,
    accumulatedBalance: 8320,
    totalSales: 45200,
  },
  {
    id: 'seller-3',
    storeName: 'Vanguardia Cosmética Mayorista',
    legalName: 'Innovaciones Cosméticas y Estilo S. de R.L.',
    rfc: 'ICE230801PX3',
    email: 'info@vanguardiacosmetica.com',
    phone: '+52 33 3612 0987',
    logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1583001809873-a128495da465?w=1200&h=400&fit=crop',
    shippingPolicy: 'Envío express por Estafeta en 24-48 horas. Surtido de cajas selladas con precinto.',
    returnPolicy: 'Devoluciones admitidas sólo con reporte fotográfico en las primeras 48h de recepción.',
    bankAccount: {
      bankName: 'Banorte',
      clabe: '072180003948572019',
      accountHolder: 'Innovaciones Cosméticas y Estilo',
    },
    status: 'pending',
    rating: 4.6,
    accumulatedBalance: 0,
    totalSales: 0,
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Decolorante en Polvo Blonde Precision 9 Tonos Anti-Yellow',
    brand: 'Luxe Salon Supplies',
    category: 'Tintes y Coloración',
    subcategory: 'Decolorantes Pro',
    description: 'Polvo decolorante extra rápido con tecnología de micropigmentos violetas anti-amarillo. Aclara hasta 9 tonos protegiendo los puentes de disulfuro del cabello.',
    howToUse: 'Mezclar en proporción 1:1.5 o 1:2 con oxidante de 20 o 30 volúmenes en bowl no metálico. Dejar actuar de 25 a 45 minutos revisando elasticidad cada 10 min.',
    warnings: 'Uso exclusivo profesional. No aplicar en cueros cabelludos irritados o con escoriaciones. Usar guantes desechables obligatorios.',
    ingredients: 'Potassium Persulfate, Sodium Silicate, Ammonium Persulfate, Paraffinum Liquidum, Hydrolyzed Keratin, Argania Spinosa Kernel Oil.',
    hairOrSkinType: 'Teñido/Decolorado',
    isSalonExclusive: true, // Restricted to stylists
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=700&h=700&fit=crop',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=700&fit=crop',
    ],
    sellerId: 'seller-2',
    sellerName: 'Luxe Salon Supplies',
    status: 'active',
    minStockAlert: 10,
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-03-12',
    variants: [
      { id: 'var-1-1', name: 'Bote 500g', sku: 'DEC-BLOND-500', stock: 45, priceB2C: 580, priceB2B: 360 },
      { id: 'var-1-2', name: 'Cubeta Salón 1000g', sku: 'DEC-BLOND-1000', stock: 24, priceB2C: 980, priceB2B: 640 },
    ],
  },
  {
    id: 'prod-2',
    title: 'Tinte Profesional en Crema Majirel High-Performance',
    brand: 'Distribuidora Capilar Pro',
    category: 'Tintes y Coloración',
    subcategory: 'Tintes Permanentes',
    description: 'Coloración permanente con Ioneno G e Incell. Cobertura del 100% de canas con reflejos luminosos de ultra fijación y brillo espejo.',
    howToUse: 'Mezcla 1 tubo de 50 ml con 75 ml de oxidante de 20 volúmenes. Tiempo de pose: 35 minutos exactos a temperatura ambiente.',
    warnings: 'Realizar prueba de alergia cutánea 48 horas antes de cada aplicación. Evitar contacto con ojos.',
    ingredients: 'Aqua, Cetearyl Alcohol, Ammonium Hydroxide, Oleth-30, Hexadimethrine Chloride, Parfum, Resorcinol.',
    hairOrSkinType: 'Todo tipo',
    isSalonExclusive: false,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&h=700&fit=crop',
    ],
    sellerId: 'seller-1',
    sellerName: 'Distribuidora Capilar Pro',
    status: 'active',
    minStockAlert: 20,
    rating: 4.8,
    reviewCount: 52,
    createdAt: '2026-02-28',
    variants: [
      { id: 'var-2-1', name: 'Tono 8.1 Rubio Cenizo Claro', sku: 'TIN-81-60ML', stock: 60, priceB2C: 185, priceB2B: 115 },
      { id: 'var-2-2', name: 'Tono 7.0 Rubio Medio Natural', sku: 'TIN-70-60ML', stock: 42, priceB2C: 185, priceB2B: 115 },
      { id: 'var-2-3', name: 'Tono 6.34 Castaño Claro Dorado', sku: 'TIN-634-60ML', stock: 5, priceB2C: 185, priceB2B: 115 },
    ],
  },
  {
    id: 'prod-3',
    title: 'Tratamiento Molecular Reparador Bond Rebuilder No.3',
    brand: 'Distribuidora Capilar Pro',
    category: 'Cuidado Capilar',
    subcategory: 'Tratamientos Plex / Bond',
    description: 'El reparador de enlaces capilares más elogiado en salones. Restaura la fibra capilar desde el interior tras procesos químicos severos.',
    howToUse: 'Humedecer el cabello secado con toalla, aplicar de raíz a puntas. Dejar actuar mínimo 15 minutos antes de lavar con shampoo.',
    warnings: 'No ingerir. Mantener en lugar fresco y fuera de la radiación solar directa.',
    ingredients: 'Water (Aqua), Bis-Aminopropyl Diglycol Dimaleate, Propylene Glycol, Cetearyl Alcohol, Behentrimonium Methosulfate, Phenoxyethanol.',
    hairOrSkinType: 'Seco/Dañado',
    isSalonExclusive: false,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=700&h=700&fit=crop',
    ],
    sellerId: 'seller-1',
    sellerName: 'Distribuidora Capilar Pro',
    status: 'active',
    minStockAlert: 15,
    rating: 4.95,
    reviewCount: 112,
    createdAt: '2026-03-01',
    variants: [
      { id: 'var-3-1', name: 'Envase 100 ml (Retail)', sku: 'BOND-100ML', stock: 35, priceB2C: 690, priceB2B: 490 },
      { id: 'var-3-2', name: 'Envase 250 ml (Cabina Pro)', sku: 'BOND-250ML', stock: 18, priceB2C: 1290, priceB2B: 890 },
    ],
  },
  {
    id: 'prod-4',
    title: 'Plancha Profesional Nano Titanium 1¼" Digital 450°F',
    brand: 'Luxe Salon Supplies',
    category: 'Herramientas Térmicas',
    subcategory: 'Planchas de Titanio',
    description: 'Placas de nano titanio ultralisas que transmiten calor infrarrojo uniforme al instante. Carcasa de Ryton resistente a altísimas temperaturas.',
    howToUse: 'Encender y regular temperatura según tipo de fibra capilar (300°F para decolorados, 450°F para sellado de keratinas y alaciados).',
    warnings: 'Peligro de quemaduras. Mantener alejado del agua y de niños.',
    ingredients: 'Cuerpo termoplástico Ryton, placas aleación Titanio Grado Aeroespacial, cable giratorio 360° de 2.75m.',
    hairOrSkinType: 'Todo tipo',
    isSalonExclusive: false,
    images: [
      'https://images.unsplash.com/photo-1522337094346-290f26e121f0?w=700&h=700&fit=crop',
    ],
    sellerId: 'seller-2',
    sellerName: 'Luxe Salon Supplies',
    status: 'active',
    minStockAlert: 8,
    rating: 4.9,
    reviewCount: 76,
    createdAt: '2026-01-18',
    variants: [
      { id: 'var-4-1', name: 'Placas 1¼" Azul Clásico', sku: 'PLN-TIT-125', stock: 14, priceB2C: 2450, priceB2B: 1850 },
      { id: 'var-4-2', name: 'Placas 1½" Edición Rose Gold', sku: 'PLN-TIT-RG', stock: 6, priceB2C: 2690, priceB2B: 1990 },
    ],
  },
  {
    id: 'prod-5',
    title: 'Kit Keratina Brasileña Alaciado Orgánico Sin Formol 1000ml',
    brand: 'Vanguardia Cosmética Mayorista',
    category: 'Tratamientos Químicos Salón',
    subcategory: 'Keratinas Brasileñas',
    description: 'Sistema de alineamiento térmico con ácido glioxílico, aminoácidos de seda y aceite de macadamia. Cero humos tóxicos.',
    howToUse: 'Lavar con shampoo clarificante, secar al 90%, aplicar mecha por mecha, reposar 40 min, secar a brushing y sellar con plancha a 450°F de 12 a 15 veces por mechón.',
    warnings: 'Restringido a profesionales con capacitación técnica en alisados químicos.',
    ingredients: 'Glyoxyloyl Carbocysteine, Glyoxyloyl Keratin Amino Acids, Hydrolyzed Silk, Macadamia Ternifolia Seed Oil, Cetearyl Alcohol.',
    hairOrSkinType: 'Rizado/Ondulado',
    isSalonExclusive: true, // Restricted to stylists
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&h=700&fit=crop',
    ],
    sellerId: 'seller-3',
    sellerName: 'Vanguardia Cosmética Mayorista',
    status: 'active',
    minStockAlert: 5,
    rating: 4.75,
    reviewCount: 29,
    createdAt: '2026-03-05',
    variants: [
      { id: 'var-5-1', name: 'Kit 2 Pasos 1000ml (Clarificante + Activo)', sku: 'KER-ORG-1000', stock: 8, priceB2C: 2190, priceB2B: 1450 },
    ],
  },
  {
    id: 'prod-6',
    title: 'Serum Facial Antioxidante Vitamina C 15% + Ácido Ferúlico',
    brand: 'Distribuidora Capilar Pro',
    category: 'Skincare y Spa',
    subcategory: 'Serums de Vitamina C',
    description: 'Potente elixir iluminador y anti-edad que neutraliza radicales libres, unifica el tono de la piel y estimula colágeno.',
    howToUse: 'Aplicar 4 a 5 gotas por la mañana sobre rostro limpio y cuello. Continuar con crema hidratante y protector solar.',
    warnings: 'Uso tópico únicamente. En caso de piel sensible introducir paulatinamente en días alternos.',
    ingredients: 'Ascorbic Acid 15%, Ferulic Acid 0.5%, Tocopherol (Vitamina E), Hyaluronic Acid, Propanediol, Aqua.',
    hairOrSkinType: 'Sensible',
    isSalonExclusive: false,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&h=700&fit=crop',
    ],
    sellerId: 'seller-1',
    sellerName: 'Distribuidora Capilar Pro',
    status: 'active',
    minStockAlert: 12,
    rating: 4.88,
    reviewCount: 44,
    createdAt: '2026-02-14',
    variants: [
      { id: 'var-6-1', name: 'Frasco Gotero 30ml', sku: 'SKN-VITC-30', stock: 25, priceB2C: 495, priceB2B: 330 },
    ],
  },
];

const initialStylists: StylistVerification[] = [
  {
    id: 'stylist-v-1',
    stylistId: 'user-stylist-1',
    fullName: 'Valeria Mendoza Arreola',
    salonName: 'Valeria Studio & Color Bar',
    licenseNumber: 'CED-TEC-8849201',
    documentType: 'Cédula Profesional',
    documentUrl: 'https://example.com/docs/cedula_valeria.pdf',
    rfc: 'MEAV890412H81',
    status: 'verified',
    submittedAt: '2026-03-01',
    notes: 'Documentación técnica en colorimetría avalada por la Asociación Mexicana de Estilismo.',
    location: 'Col. Condesa, Ciudad de México',
    phone: '+52 55 5289 1102',
  },
  {
    id: 'stylist-v-2',
    stylistId: 'user-stylist-2',
    fullName: 'Rodrigo Casillas Gómez',
    salonName: 'Casillas Barber & Balayage',
    licenseNumber: 'CERT-HAIR-449102',
    documentType: 'Certificación Estilismo',
    documentUrl: 'https://example.com/docs/diploma_rodrigo.pdf',
    rfc: 'CAGR9211059A4',
    status: 'pending',
    submittedAt: '2026-04-10',
    notes: 'Pendiente de cotejo de constancia técnica oficial.',
    location: 'San Pedro Garza García, N.L.',
    phone: '+52 81 1209 8834',
  },
];

const initialSalons: SalonDirectoryItem[] = [
  {
    id: 'salon-1',
    salonName: 'Valeria Studio & Color Bar',
    stylistName: 'Valeria Mendoza',
    specialty: 'Balayage, Corrección de Color & Rubios Fríos',
    address: 'Av. Mazatlán 142, Col. Condesa',
    zone: 'Ciudad de México',
    phone: '+52 55 5289 1102',
    whatsapp: '+52 55 5289 1102',
    rating: 4.9,
    isVerifiedPro: true,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
  },
  {
    id: 'salon-2',
    salonName: 'L’Atelier Capilar Polanco',
    stylistName: 'Mariana Duarte',
    specialty: 'Tratamientos Moleculares, Alaciados & Keratinas',
    address: 'Campos Elíseos 204, Polanco',
    zone: 'Ciudad de México',
    phone: '+52 55 8920 3311',
    whatsapp: '+52 55 8920 3311',
    rating: 5.0,
    isVerifiedPro: true,
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop',
  },
  {
    id: 'salon-3',
    salonName: 'Master Colorists Guadalajara',
    stylistName: 'Héctor De la Rosa',
    specialty: 'Diseño de Mechas, Colorimetría Creativa & Corte',
    address: 'Av. Chapultepec Sur 380, Col. Americana',
    zone: 'Guadalajara, Jal.',
    phone: '+52 33 2290 1488',
    whatsapp: '+52 33 2290 1488',
    rating: 4.8,
    isVerifiedPro: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
  },
];

const initialAddresses: ShippingAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Carolina Herrera Méndez',
    street: 'Calle Durango 215, Depto 402',
    colonia: 'Roma Norte',
    city: 'Cuauhtémoc',
    state: 'Ciudad de México',
    postalCode: '06700',
    phone: '55 1290 4820',
    references: 'Edificio color terracota frente al parque, timbre 402.',
    isDefault: true,
  },
];

const initialOrders: Order[] = [
  {
    id: 'ORD-9842',
    buyerId: 'user-cust-1',
    buyerName: 'Carolina Herrera Méndez',
    buyerRole: 'customer',
    buyerEmail: 'carolina.herrera@correo.com',
    buyerPhone: '55 1290 4820',
    shippingAddress: initialAddresses[0],
    paymentMethod: 'Tarjeta de Crédito / Débito',
    paymentStatus: 'paid',
    createdAt: '2026-04-18 11:30',
    totalAmount: 1474,
    subOrders: [
      {
        subOrderId: 'SUB-9842-1',
        sellerId: 'seller-1',
        sellerName: 'Distribuidora Capilar Pro',
        items: [
          {
            productId: 'prod-3',
            productTitle: 'Tratamiento Molecular Reparador Bond Rebuilder No.3',
            variantId: 'var-3-1',
            variantName: 'Envase 100 ml (Retail)',
            quantity: 1,
            unitPrice: 690,
            totalPrice: 690,
            sellerId: 'seller-1',
            sellerName: 'Distribuidora Capilar Pro',
            image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&h=300&fit=crop',
            isProPrice: false,
          },
          {
            productId: 'prod-2',
            productTitle: 'Tinte Profesional en Crema Majirel High-Performance',
            variantId: 'var-2-1',
            variantName: 'Tono 8.1 Rubio Cenizo Claro',
            quantity: 2,
            unitPrice: 185,
            totalPrice: 370,
            sellerId: 'seller-1',
            sellerName: 'Distribuidora Capilar Pro',
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop',
            isProPrice: false,
          },
        ],
        subtotal: 1060,
        shippingCost: 99,
        total: 1159,
        platformFee: 127.2,
        sellerNet: 932.8,
        status: 'Enviado',
        carrier: 'DHL Express',
        trackingNumber: 'DHL-MX-883920198',
        trackingHistory: [
          { date: '2026-04-18 14:00', status: 'En preparación', note: 'Orden recibida en bodega y embalada.' },
          { date: '2026-04-18 17:30', status: 'Empacado', note: 'Guía electrónica generada y adherida.' },
          { date: '2026-04-19 09:15', status: 'Enviado', note: 'Recolectado por mensajero DHL en ruta.' },
        ],
        payoutStatus: 'pending',
      },
    ],
  },
  {
    id: 'ORD-9830',
    buyerId: 'user-stylist-1',
    buyerName: 'Valeria Mendoza (Valeria Studio)',
    buyerRole: 'stylist',
    buyerEmail: 'valeria@colorbar.mx',
    buyerPhone: '55 5289 1102',
    shippingAddress: {
      id: 'addr-salon',
      fullName: 'Valeria Mendoza (Recepción Salón)',
      street: 'Av. Mazatlán 142',
      colonia: 'Condesa',
      city: 'Cuauhtémoc',
      state: 'Ciudad de México',
      postalCode: '06140',
      phone: '55 5289 1102',
      references: 'Planta baja, fachada cristal blanco.',
      isDefault: true,
    },
    paymentMethod: 'Transferencia SPEI',
    paymentStatus: 'paid',
    createdAt: '2026-04-15 09:20',
    totalAmount: 2049,
    billingData: {
      rfc: 'MEAV890412H81',
      razonSocial: 'Valeria Mendoza Arreola',
      cfdiUse: 'G03 - Gastos en general',
    },
    subOrders: [
      {
        subOrderId: 'SUB-9830-1',
        sellerId: 'seller-2',
        sellerName: 'Luxe Salon Supplies',
        items: [
          {
            productId: 'prod-1',
            productTitle: 'Decolorante en Polvo Blonde Precision 9 Tonos Anti-Yellow',
            variantId: 'var-1-2',
            variantName: 'Cubeta Salón 1000g',
            quantity: 3,
            unitPrice: 640, // Pro Wholesale Price!
            totalPrice: 1920,
            sellerId: 'seller-2',
            sellerName: 'Luxe Salon Supplies',
            image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=300&fit=crop',
            isProPrice: true,
          },
        ],
        subtotal: 1920,
        shippingCost: 129,
        total: 2049,
        platformFee: 230.4,
        sellerNet: 1689.6,
        status: 'Entregado',
        carrier: 'FedEx Priority',
        trackingNumber: 'FDX-7749102839',
        trackingHistory: [
          { date: '2026-04-15 10:00', status: 'En preparación', note: 'Bodega preparó 3 cubetas selladas.' },
          { date: '2026-04-15 16:00', status: 'Enviado', note: 'Paquete en tránsito matriz Monterrey.' },
          { date: '2026-04-17 11:20', status: 'Entregado', note: 'Entregado en recepción del salón.' },
        ],
        payoutStatus: 'disbursed',
      },
    ],
  },
];

const initialReviews: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-stylist-1',
    userName: 'Valeria Mendoza (Colorista Pro)',
    userRole: 'stylist',
    rating: 5,
    comment: 'Excelente poder de aclaración sin sobrecalentar el cabello. Lo utilizo para técnicas de balayage al aire libre y en papel aluminio. Cero tonos naranjas indeseados.',
    date: '2026-04-02',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    userId: 'user-cust-1',
    userName: 'Carolina H.',
    userRole: 'customer',
    rating: 5,
    comment: 'Me salvó el cabello después de una decoloración fallida. Quedó sedoso, brillante y con elasticidad desde la primera puesta.',
    date: '2026-03-25',
    verifiedPurchase: true,
  },
];

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_role`);
    return (saved as UserRole) || null;
  });

  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_fee`);
    return saved ? JSON.parse(saved) : 12; // 12% default platform commission
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [sellers, setSellers] = useState<SellerProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sellers`);
    return saved ? JSON.parse(saved) : initialSellers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [stylists, setStylists] = useState<StylistVerification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_stylists`);
    return saved ? JSON.parse(saved) : initialStylists;
  });

  const [salonsDirectory, setSalonsDirectory] = useState<SalonDirectoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_salons`);
    return saved ? JSON.parse(saved) : initialSalons;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_addresses`);
    return saved ? JSON.parse(saved) : initialAddresses;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_disputes`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'disp-1',
            orderId: 'ORD-9801',
            subOrderId: 'SUB-9801-1',
            buyerName: 'Estilista Roberto Solís',
            sellerName: 'Vanguardia Cosmética Mayorista',
            reason: 'Tubo de tinte llegó con abolladura y tapa rota con fuga parcial de producto.',
            status: 'abierta',
            createdAt: '2026-04-14 16:30',
          },
        ];
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem(`${STORAGE_KEY}_role`, currentRole);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_role`);
    }
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_fee`, JSON.stringify(platformCommissionRate));
  }, [platformCommissionRate]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sellers`, JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stylists`, JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_salons`, JSON.stringify(salonsDirectory));
  }, [salonsDirectory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_addresses`, JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_disputes`, JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  // Stylist validation check
  const currentStylistVerified = stylists.some((s) => s.status === 'verified');

  // Product actions
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Producto "${product.title}" creado con éxito y enviado a catálogo.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Producto actualizado correctamente.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto eliminado del catálogo.');
  };

  const setProductStatus = (id: string, status: Product['status']) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    showToast(`Estado de producto actualizado a: ${status}`);
  };

  const addCategory = (name: string, subcategories: string[]) => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      id,
      name,
      iconName: 'Tag',
      order: categories.length + 1,
      subcategories,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Categoría "${name}" agregada exitosamente.`);
  };

  const updateCategories = (newCats: Category[]) => {
    setCategories(newCats);
  };

  // Seller management
  const updateSeller = (sellerId: string, updates: Partial<SellerProfile>) => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, ...updates } : s)));
    showToast('Datos de la tienda guardados correctamente.');
  };

  const setSellerStatus = (sellerId: string, status: 'approved' | 'pending' | 'suspended') => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, status } : s)));
    showToast(`Vendedor actualizado a estatus: ${status}`);
  };

  const disburseSellerFunds = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => {
        if (s.id === sellerId) {
          const disbursed = s.accumulatedBalance;
          showToast(`Dispersión de $${disbursed.toLocaleString('es-MX')} MXN enviada a CLABE ${s.bankAccount.clabe}`);
          return { ...s, accumulatedBalance: 0 };
        }
        return s;
      })
    );
  };

  // Stylist validation
  const updateStylistVerification = (id: string, status: 'verified' | 'pending' | 'rejected', notes?: string) => {
    setStylists((prev) =>
      prev.map((st) => (st.id === id ? { ...st, status, notes: notes || st.notes } : st))
    );
    showToast(`Verificación de estilista: ${status === 'verified' ? 'Aprobada' : status}`);
  };

  const submitStylistApplication = (app: Omit<StylistVerification, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: StylistVerification = {
      ...app,
      id: `stylist-v-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setStylists((prev) => [newApp, ...prev]);
    showToast('¡Documentación enviada! El Superadministrador validará tu cédula en breve.');
  };

  const addSalontoDirectory = (salon: Omit<SalonDirectoryItem, 'id' | 'rating'>) => {
    const newSalon: SalonDirectoryItem = {
      ...salon,
      id: `salon-${Date.now()}`,
      rating: 5.0,
    };
    setSalonsDirectory((prev) => [newSalon, ...prev]);
    showToast('Salón registrado en el Directorio Profesional.');
  };

  // Cart operations
  const addToCart = (product: Product, variantId: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variantId === variantId
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, variantId, quantity }];
      }
    });
    showToast(`Agregado al carrito: ${product.title}`);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.variantId === variantId)));
    showToast('Producto retirado del carrito.');
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const addAddress = (address: Omit<ShippingAddress, 'id'>) => {
    const newAddr: ShippingAddress = { ...address, id: `addr-${Date.now()}` };
    setSavedAddresses((prev) => [...prev, newAddr]);
    showToast('Dirección de entrega guardada.');
  };

  // Checkout and Split Order by Vendor (End-to-End Core Flow)
  const checkoutOrder = (
    address: ShippingAddress,
    paymentMethod: 'Tarjeta de Crédito / Débito' | 'Transferencia SPEI' | 'Efectivo en OXXO',
    billingData?: { rfc: string; razonSocial: string; cfdiUse: string }
  ): Order => {
    const isStylistBuyer = currentRole === 'stylist';

    // Group items by Seller ID
    const itemsBySeller: { [sellerId: string]: OrderItem[] } = {};

    cart.forEach((item) => {
      const variant = item.product.variants.find((v) => v.id === item.variantId) || item.product.variants[0];
      const unitPrice = isStylistBuyer ? variant.priceB2B : variant.priceB2C;
      const orderItem: OrderItem = {
        productId: item.product.id,
        productTitle: item.product.title,
        variantId: variant.id,
        variantName: variant.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        image: item.product.images[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop',
        isProPrice: isStylistBuyer,
      };

      if (!itemsBySeller[item.product.sellerId]) {
        itemsBySeller[item.product.sellerId] = [];
      }
      itemsBySeller[item.product.sellerId].push(orderItem);
    });

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const subOrders: SubOrder[] = Object.keys(itemsBySeller).map((sellerId, idx) => {
      const sItems = itemsBySeller[sellerId];
      const seller = sellers.find((s) => s.id === sellerId);
      const subtotal = sItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
      const shippingCost = subtotal > 1800 ? 0 : 99; // Free shipping threshold or standard
      const total = subtotal + shippingCost;
      const platformFee = Number(((subtotal * platformCommissionRate) / 100).toFixed(2));
      const sellerNet = Number((total - platformFee).toFixed(2));

      return {
        subOrderId: `SUB-${orderId.substring(4)}-${idx + 1}`,
        sellerId,
        sellerName: seller?.storeName || sItems[0].sellerName,
        items: sItems,
        subtotal,
        shippingCost,
        total,
        platformFee,
        sellerNet,
        status: 'En preparación',
        carrier: 'DHL Express',
        trackingHistory: [
          {
            date: nowStr,
            status: 'En preparación',
            note: 'Orden generada y confirmada. El vendedor está alistando los insumos.',
          },
        ],
        payoutStatus: 'pending',
      };
    });

    const totalAmount = subOrders.reduce((acc, curr) => acc + curr.total, 0);

    const newOrder: Order = {
      id: orderId,
      buyerId: isStylistBuyer ? 'user-stylist-1' : 'user-cust-1',
      buyerName: isStylistBuyer ? 'Valeria Mendoza (Valeria Studio)' : 'Carolina Herrera Méndez',
      buyerRole: isStylistBuyer ? 'stylist' : 'customer',
      buyerEmail: isStylistBuyer ? 'valeria@colorbar.mx' : 'carolina.herrera@correo.com',
      buyerPhone: address.phone || '55 1290 4820',
      shippingAddress: address,
      paymentMethod,
      paymentStatus: 'paid',
      createdAt: nowStr,
      subOrders,
      totalAmount,
      billingData,
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = cart.find((ci) => ci.product.id === prod.id);
        if (!itemInCart) return prod;

        const updatedVariants = prod.variants.map((v) => {
          if (v.id === itemInCart.variantId) {
            return { ...v, stock: Math.max(0, v.stock - itemInCart.quantity) };
          }
          return v;
        });

        return { ...prod, variants: updatedVariants };
      })
    );

    // Add order to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    clearCart();
    showToast(`¡Pedido #${newOrder.id} creado con éxito! Se dividió en ${subOrders.length} envíos por tienda.`);

    return newOrder;
  };

  // Vendor updates status (En preparación -> Empacado -> Enviado con Guía)
  const updateSubOrderStatus = (
    orderId: string,
    subOrderId: string,
    status: OrderStatus,
    carrier?: string,
    trackingNumber?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedSubs = ord.subOrders.map((sub) => {
          if (sub.subOrderId !== subOrderId) return sub;

          const history = sub.trackingHistory ? [...sub.trackingHistory] : [];
          history.push({
            date: nowStr,
            status,
            note: trackingNumber
              ? `Guía asignada: ${carrier || 'Transportista'} #${trackingNumber}`
              : `Estatus actualizado a: ${status}`,
          });

          return {
            ...sub,
            status,
            carrier: carrier || sub.carrier,
            trackingNumber: trackingNumber || sub.trackingNumber,
            trackingHistory: history,
          };
        });

        return { ...ord, subOrders: updatedSubs };
      })
    );

    showToast(`Sub-orden ${subOrderId} actualizada a "${status}"`);
  };

  // Buyer confirms reception -> Triggers vendor payout release!
  const confirmOrderReceived = (orderId: string, subOrderId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let releasedAmount = 0;
    let targetSellerId = '';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedSubs = ord.subOrders.map((sub) => {
          if (sub.subOrderId !== subOrderId) return sub;

          releasedAmount = sub.sellerNet;
          targetSellerId = sub.sellerId;

          const history = sub.trackingHistory ? [...sub.trackingHistory] : [];
          history.push({
            date: nowStr,
            status: 'Entregado',
            note: 'Comprador confirmó recepción conforme. Fondos netos liberados al vendedor.',
          });

          return {
            ...sub,
            status: 'Entregado' as OrderStatus,
            trackingHistory: history,
          };
        });

        return { ...ord, subOrders: updatedSubs };
      })
    );

    // Credit seller's accumulated balance
    if (targetSellerId && releasedAmount > 0) {
      setSellers((prev) =>
        prev.map((s) => {
          if (s.id === targetSellerId) {
            return {
              ...s,
              accumulatedBalance: s.accumulatedBalance + releasedAmount,
              totalSales: s.totalSales + releasedAmount,
            };
          }
          return s;
        })
      );
    }

    showToast(`¡Entrega confirmada! Se liberó $${releasedAmount.toLocaleString('es-MX')} MXN para el vendedor.`);
  };

  // Disputes
  const createDispute = (orderId: string, subOrderId: string, reason: string) => {
    const newDisp: Dispute = {
      id: `disp-${Date.now()}`,
      orderId,
      subOrderId,
      buyerName: currentRole === 'stylist' ? 'Valeria Mendoza (Estilista)' : 'Carolina Herrera',
      sellerName: 'Vendedor Responsable',
      reason,
      status: 'abierta',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setDisputes((prev) => [newDisp, ...prev]);
    showToast('Disputa reportada. Soporte de Marketplace Belleza mediará en el caso.');
  };

  const resolveDispute = (
    disputeId: string,
    resolution: 'resuelta_reembolso' | 'resuelta_rechazada',
    note: string
  ) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: resolution, resolutionNote: note } : d))
    );
    showToast(`Disputa resuelta como: ${resolution === 'resuelta_reembolso' ? 'Reembolso Aprobado' : 'Rechazada'}`);
  };

  // Reviews
  const addReview = (review: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === review.productId) {
          const prodReviews = [...reviews.filter((r) => r.productId === p.id), newRev];
          const avg = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: prodReviews.length,
          };
        }
        return p;
      })
    );

    showToast('¡Gracias por tu reseña y calificación!');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        platformCommissionRate,
        setPlatformCommissionRate,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        setProductStatus,
        addCategory,
        updateCategories,
        sellers,
        updateSeller,
        setSellerStatus,
        disburseSellerFunds,
        stylists,
        updateStylistVerification,
        submitStylistApplication,
        currentStylistVerified,
        salonsDirectory,
        addSalontoDirectory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        savedAddresses,
        addAddress,
        checkoutOrder,
        orders,
        updateSubOrderStatus,
        confirmOrderReceived,
        disputes,
        createDispute,
        resolveDispute,
        reviews,
        addReview,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="flex-1">{toastMessage}</span>
        </div>
      )}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
