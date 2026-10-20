export type UserRole = 'superadmin' | 'seller' | 'stylist' | 'customer';

export type ProductStatus = 'active' | 'pending_approval' | 'draft' | 'rejected';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "8.1 Rubio Cenizo Claro", "1000 ml", "30 Vol"
  sku: string;
  stock: number;
  priceB2C: number;
  priceB2B: number; // Wholesale / Stylist price
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  howToUse: string;
  warnings: string;
  ingredients: string;
  hairOrSkinType: 'Todo tipo' | 'Teñido/Decolorado' | 'Seco/Dañado' | 'Graso' | 'Rizado/Ondulado' | 'Sensible';
  isSalonExclusive: boolean; // Restricted to verified stylists
  images: string[];
  sellerId: string;
  sellerName: string;
  status: ProductStatus;
  variants: ProductVariant[];
  minStockAlert: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  storeName: string;
  legalName: string;
  rfc: string;
  email: string;
  phone: string;
  logo: string;
  banner: string;
  shippingPolicy: string;
  returnPolicy: string;
  bankAccount: {
    bankName: string;
    clabe: string;
    accountHolder: string;
  };
  status: 'approved' | 'pending' | 'suspended';
  rating: number;
  accumulatedBalance: number;
  totalSales: number;
}

export interface StylistVerification {
  id: string;
  stylistId: string;
  fullName: string;
  salonName: string;
  licenseNumber: string;
  documentType: 'Cédula Profesional' | 'Diploma Técnico' | 'Certificación Estilismo' | 'Constancia de Especialidad';
  documentUrl: string;
  rfc: string;
  status: 'verified' | 'pending' | 'rejected';
  submittedAt: string;
  notes?: string;
  location: string;
  phone: string;
}

export interface SalonDirectoryItem {
  id: string;
  salonName: string;
  stylistName: string;
  specialty: string;
  address: string;
  zone: string;
  phone: string;
  whatsapp: string;
  rating: number;
  isVerifiedPro: boolean;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  order: number;
  subcategories: string[];
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sellerId: string;
  sellerName: string;
  image: string;
  isProPrice: boolean;
}

export type OrderStatus = 'En preparación' | 'Empacado' | 'Enviado' | 'Entregado' | 'Cancelado' | 'En disputa';

export interface SubOrder {
  subOrderId: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  platformFee: number;
  sellerNet: number;
  status: OrderStatus;
  carrier?: string;
  trackingNumber?: string;
  trackingHistory?: { date: string; status: string; note: string }[];
  payoutStatus: 'pending' | 'disbursed';
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerRole: 'customer' | 'stylist';
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: ShippingAddress;
  paymentMethod: 'Tarjeta de Crédito / Débito' | 'Transferencia SPEI' | 'Efectivo en OXXO';
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
  subOrders: SubOrder[];
  totalAmount: number;
  billingData?: {
    rfc: string;
    razonSocial: string;
    cfdiUse: string;
  };
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  street: string;
  colonia: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  references?: string;
  isDefault?: boolean;
}

export interface Dispute {
  id: string;
  orderId: string;
  subOrderId: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: 'abierta' | 'resuelta_reembolso' | 'resuelta_rechazada';
  createdAt: string;
  resolutionNote?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userRole: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  verifiedPurchase: boolean;
}
