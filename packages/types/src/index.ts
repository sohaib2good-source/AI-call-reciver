export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// User & Auth
export interface User {
  id: string;
  firebaseUid?: string;
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'OWNER' | 'MANAGER' | 'RECEPTIONIST' | 'KITCHEN' | 'CASHIER' | 'DELIVERY' | 'VIEWER';
  isActive: boolean;
  loginAttempts: number;
  lockedUntil?: string;
  tenantId: string;
  preferences?: UserPreference;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  isRevoked: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  action: string;
  subject: string;
  role: 'OWNER' | 'MANAGER' | 'RECEPTIONIST' | 'KITCHEN' | 'CASHIER' | 'DELIVERY' | 'VIEWER';
  createdAt: string;
}

export interface RestaurantPreference {
  id: string;
  tenantId: string;
  taxEnabled: boolean;
  serviceChargeEnabled: boolean;
  reservationEnabled: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  dineInEnabled: boolean;
}

export interface UserPreference {
  id: string;
  userId: string;
  language: string;
  theme: string;
  notificationsEnabled: boolean;
}

export interface Invitation {
  id: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'RECEPTIONIST' | 'KITCHEN' | 'CASHIER' | 'DELIVERY' | 'VIEWER';
  token: string;
  expiresAt: string;
  tenantId: string;
  createdAt: string;
}

// Restaurant Profile
export interface TenantProfile {
  id: string;
  name: string;
  businessName?: string;
  legalName?: string;
  brandName?: string;
  description?: string;
  cuisineType?: string;
  logo?: string;
  coverImage?: string;
  phoneNumbers: string[];
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  taxSettings?: any;
  serviceCharge?: number;
  vatNumber?: string;
  registrationNumber?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Business Hours
export type HoursType = 'NORMAL' | 'HOLIDAY' | 'TEMPORARY_CLOSURE' | 'KITCHEN' | 'DELIVERY' | 'RESERVATION' | 'SPECIAL_EVENT';

export interface BusinessHours {
  id: string;
  type: HoursType;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
}

// Tables & Areas
export type AreaType = 'INDOOR' | 'OUTDOOR' | 'VIP' | 'TERRACE' | 'BAR' | 'PRIVATE_ROOM';
export type TableShape = 'RECTANGLE' | 'SQUARE' | 'ROUND' | 'OVAL';
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export interface RestaurantArea {
  id: string;
  name: string;
  type: AreaType;
  description?: string;
  tables?: Table[];
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  minGuests?: number;
  maxGuests?: number;
  shape?: TableShape;
  status: TableStatus;
  maintenanceMode?: boolean;
  reservationPriority?: number;
  xPos?: number;
  yPos?: number;
  width?: number;
  height?: number;
  areaId: string;
}

// Settings
export interface DeliverySettings {
  deliveryRadiusKm?: number;
  deliveryZones?: any;
  deliveryFees?: any;
  minimumOrder?: number;
  preparationTimeMins: number;
  estimatedDeliveryMins: number;
}

export interface PickupSettings {
  preparationTimeMins: number;
  pickupInstructions?: string;
  pickupAvailability: boolean;
}

export interface AiPickupDelay {
  rings: number;
  seconds: number;
  mode: 'IMMEDIATE' | 'DELAYED';
  strategy: 'IMMEDIATE_PICKUP' | 'QUICK_PICKUP' | 'STAFF_FIRST' | 'STAFF_PRIORITY' | 'MAX_DELAY';
  description: string;
}

export interface AiAutoAnsweringConfig {
  enabled: boolean;
  pickupDelay: AiPickupDelay;
  operatingHoursOnly?: boolean;
}

export interface AiAgentTelephonyConfig {
  ai_agent_status: 'ACTIVE' | 'DISABLED';
  auto_answering: {
    enabled: boolean;
    pickup_delay: {
      rings: number;
      seconds: number;
      mode: 'IMMEDIATE' | 'DELAYED';
      strategy: string;
      description: string;
    };
    operating_hours_only: boolean;
  };
  voice_persona: {
    voice_id: string;
    tone: string;
    languages: string[];
    greeting: string;
  };
  active_skills: string[];
  escalation: {
    transfer_on_failure: boolean;
    max_unrecognized_intents: number;
    transfer_phone_number: string;
  };
}

export interface AiSettings {
  autoAnswering?: AiAutoAnsweringConfig;
  greeting?: string;
  voicePersonality?: string;
  supportedLanguages: string[];
  businessRules?: any;
  transferRules?: any;
  fallbackRules?: any;
  upsellingEnabled: boolean;
}

// Menu Management
export type ItemStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';

export interface Menu {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  image?: string;
  icon?: string;
  status: ItemStatus;
  seoSlug?: string;
  menuId: string;
  parentId?: string;
  subCategories?: Category[];
}

export interface MenuItem {
  id: string;
  name: string;
  shortDesc?: string;
  longDesc?: string;
  sku?: string;
  barcode?: string;
  image?: string;
  galleryImages: string[];
  videoUrl?: string;
  price: number;
  costPrice?: number;
  calories?: number;
  ingredients: string[];
  nutrition?: any;
  prepTimeMins?: number;
  kitchenStation?: string;
  printerGroup?: string;
  taxCategory?: string;
  status: ItemStatus;
  
  isFeatured: boolean;
  isPopular: boolean;
  isRecommended: boolean;
  isSeasonal: boolean;
  isNewItem: boolean;
  
  spicyLevel: number;
  isHalal: boolean;
  isKosher: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isOrganic: boolean;
  isSugarFree: boolean;
  isDairyFree: boolean;
  isAgeRestricted: boolean;

  categoryId: string;
}

export interface ItemVariant {
  id: string;
  name: string;
  price: number;
  calories?: number;
  prepTimeMins?: number;
  isAvailable: boolean;
  itemId: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  isRequired: boolean;
  modifiers?: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  modifierGroupId: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
}

export interface Combo {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
}

// CRM Management
export interface Customer {
  id: string;
  customerId?: string;
  firstName: string;
  lastName?: string;
  primaryPhone: string;
  email?: string;
  tags: string[];
  isVip: boolean;
  totalOrders: number;
  lifetimeValue: number;
  tenantId: string;
}

export interface CustomerTimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: any;
  createdAt: Date | string;
  customerId: string;
}

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface CustomerLoyalty {
  id: string;
  points: number;
  membershipLevel: LoyaltyTier;
  customerId: string;
}

export interface AiCustomerContextResponse {
  customer: {
    firstName: string;
    isVip: boolean;
    loyaltyTier: string;
  };
  preferences: {
    favoriteItems: string[];
    favoriteDrinks: string[];
  };
  dietary: {
    isVegan: boolean;
    allergies: string[];
  };
  recentInteractions: {
    lastOrderDate?: string;
    lastComplaint?: string;
  };
}

// Reservation & Table Management

export type ReservationStatus = 'INQUIRY' | 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'LATE_ARRIVAL' | 'WALK_IN';

export interface Reservation {
  id: string;
  reservationNumber: string;
  reservationDate: Date | string;
  reservationTime: string;
  guests: number;
  status: ReservationStatus;
  occasion?: string;
  tableId?: string;
  customerId: string;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  tableIds?: string[];
}

export type WaitlistStatus = 'WAITING' | 'NOTIFIED' | 'SEATED' | 'CANCELLED' | 'NO_SHOW';

export interface WaitlistEntry {
  id: string;
  guests: number;
  quotedTimeMins: number;
  status: WaitlistStatus;
  joinedAt: Date | string;
  customerId: string;
}

// Order Management & Kitchen (KDS)
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'PICKUP' | 'AI_PHONE' | 'QR_ORDER' | 'WEBSITE';
export type OrderStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'KITCHEN_ACCEPTED' | 'PREPARING' | 'COOKING' | 'PACKED' | 'READY' | 'DRIVER_ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
export type KitchenItemStatus = 'PENDING' | 'PREPARING' | 'COOKING' | 'READY' | 'CANCELLED';

export interface OrderItemModifier {
  id?: string;
  modifierName: string;
  price: number;
}

export interface OrderItemVariant {
  id?: string;
  variantName: string;
  price: number;
}

export interface OrderItem {
  id: string;
  itemName: string;
  basePrice: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  kitchenStatus: KitchenItemStatus;
  menuItemId?: string;
  kitchenStationId?: string;
  modifiers: OrderItemModifier[];
  variants: OrderItemVariant[];
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  deliveryFee: number;
  serviceCharge: number;
  packagingFee: number;
  tip: number;
  grandTotal: number;
  isPaid: boolean;
  paymentMethod?: string;
  estimatedPrepTimeMins: number;
  requestedTime?: Date | string;
  tableId?: string;
  deliveryAddress?: string;
  notes?: string;
  items: OrderItem[];
  customerId?: string;
  tenantId: string;
  createdAt: Date | string;
}

export interface PriceCalculationRequest {
  items: {
    menuItemId: string;
    quantity: number;
    variantId?: string;
    modifierIds?: string[];
  }[];
  orderType: OrderType;
  discountCode?: string;
}

// AI Receptionist Core
export type ConversationStatus = 'ACTIVE' | 'COMPLETED' | 'ESCALATED' | 'FAILED';
export type ConversationRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ConversationLog {
  id: string;
  role: ConversationRole;
  content: string;
  toolCallId?: string;
  toolName?: string;
  toolArgs?: any;
  latencyMs: number;
  tokens: number;
  createdAt: Date | string;
}

export interface ConversationSession {
  id: string;
  sessionId: string;
  channel: string;
  status: ConversationStatus;
  language: string;
  summary?: string;
  outcome?: string;
  durationMs: number;
  totalTokens: number;
  hallucinations: number;
  errors: number;
  customerId?: string;
  tenantId: string;
  logs: ConversationLog[];
  createdAt: Date | string;
}

export interface ToolCallRequest {
  name: string;
  arguments: any;
}

export interface AiSettingsDto {
  systemPrompt?: string;
  greeting?: string;
  voicePersonality?: string;
  tone?: string;
  supportedLanguages: string[];
  businessRules?: any;
  transferRules?: any;
  fallbackRules?: any;
  escalationRules?: any;
  upsellingEnabled: boolean;
  upsellRules?: any;
  enabledTools: string[];
}

// Voice Communication Platform
export type VoiceProvider = 'TWILIO' | 'VAPI' | 'RETELL' | 'SIP';
export type PhoneStatus = 'ACTIVE' | 'INACTIVE' | 'PORTING' | 'RELEASED';
export type CallDirection = 'INBOUND' | 'OUTBOUND';
export type CallStatus = 'QUEUED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'BUSY' | 'FAILED' | 'NO_ANSWER' | 'CANCELED' | 'TRANSFERRED';

export interface PhoneNumber {
  id: string;
  number: string;
  provider: VoiceProvider;
  capabilities: string[];
  status: PhoneStatus;
  friendlyName?: string;
  tenantId: string;
}

export interface VoiceSettings {
  id: string;
  fallbackNumber?: string;
  managerNumber?: string;
  kitchenNumber?: string;
  voicemailEnabled: boolean;
  recordCalls: boolean;
  tenantId: string;
}

export interface CallRecord {
  id: string;
  callSid: string;
  direction: CallDirection;
  status: CallStatus;
  fromNumber: string;
  toNumber: string;
  durationSeconds: number;
  recordingUrl?: string;
  transcriptUrl?: string;
  sessionId?: string;
  tenantId: string;
  createdAt: Date | string;
}

// SaaS Billing & Administration
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'PAST_DUE' | 'CANCELED';
export type SubscriptionPlan = 'FREE_TRIAL' | 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE' | 'CUSTOM';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';
export type UsageMetric = 'AI_MINUTES' | 'AI_TOKENS' | 'SMS_SEGMENTS' | 'PHONE_CALLS' | 'ORDERS' | 'RESERVATIONS';
export type InvoiceStatus = 'DRAFT' | 'OPEN' | 'PAID' | 'UNCOLLECTIBLE' | 'VOID';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  tenantId: string;
}

export interface UsageRecord {
  id: string;
  metric: UsageMetric;
  quantity: number;
  date: Date | string;
  tenantId: string;
}

export interface Invoice {
  id: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  invoicePdfUrl?: string;
  paidAt?: Date | string;
  tenantId: string;
  createdAt: Date | string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description?: string;
  tenantId: string;
}
