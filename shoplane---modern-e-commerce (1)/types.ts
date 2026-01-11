
export interface Product {
  id: string; // Firestore document ID
  name: string;
  description: string;
  originalPrice: number;
  salePrice?: number; // Optional sale price
  imageUrls: string[]; // Multiple images
  category: string;
  isOnSale: boolean; // Flag for sale badge
  productUrl?: string; // Admin-only source URL
}

export interface CartItem extends Product {
  quantity: number;
  price: number; // The price at which the item was added to the cart
}

export interface Banner {
  id: string; // Firestore document ID
  title: string;
  imageUrl: string;
  link: string;
}

export interface PromoBannerData {
    id: string; // Firestore document ID
    enabled: boolean;
    title:string;
    category: string;
    imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface User {
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  registeredAt: string;
  status: 'active' | 'blocked';
  avatarId: number;
  consecutiveCancellations: number;
  blockExpiresAt: string | null;
  blockLevel: number;
  shippingDetails: ShippingDetails | null;
  wishlist: string[]; // Array of product IDs
  isAdmin?: boolean; // Flag to identify admin users
  coins: number; // Reward points
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string; // Firestore document ID
  userId: string; // User's UID
  userName:string;
  items: CartItem[];
  total: number;
  coinsUsed: number; // Discount from coins
  orderDate: any; // Can be Timestamp from Firebase
  paymentMethod: 'COD' | 'Card' | 'Online' | 'Balance';
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'payment-pending';
  shippingDetails: ShippingDetails;
  estimatedDeliveryDate?: string;
  utrId?: string;
  cancellationReason?: string;
}

export interface AppSettings {
  appName: string;
  termsContent: string;
  privacyContent: string;
  customerSupportLink: string;
  authScreenImageUrl: string;
  paymentQRCodeUrl: string;
  referralMessageTemplate: string;
}
