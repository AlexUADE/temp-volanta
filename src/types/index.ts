export type ViewMode =
  | 'catalog'
  | 'vehicle-detail'
  | 'cart'
  | 'checkout'
  | 'booking-success'
  | 'my-bookings'
  | 'booking-detail'
  | 'my-listings'
  | 'edit-listing'
  | 'publish-car'
  | 'finances'
  | 'admin-fleet'
  | 'login'
  | 'register';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'Sedán' | 'Hatchback' | 'SUV' | 'Camioneta';
  plate: string;
  color: string;
  seats: number;
  doors: number;
  transmission: 'Automática' | 'Manual';
  transmissionDetail?: string;
  fuel: 'Nafta' | 'Diésel' | 'Híbrido' | 'Eléctrico';
  mileage: number;
  neighborhood: string;
  city: string;
  pickupPoint: string;
  pickupNotes?: string;
  pricePerDay: number;
  originalPricePerDay?: number;
  discountBadge?: string;
  minDays: number;
  weeklyDiscountPercent: number;
  instantBooking: boolean;
  images: string[];
  description: string;
  hostName: string;
  hostPhone: string;
  hostRating: number;
  hostTrips: number;
  hostVerified: boolean;
  status: 'activa' | 'pausada' | 'en_revision';
  activeBookingsCount?: number;
  nextBookingDate?: string;
  pauseReason?: string;
}

export interface Reservation {
  id: string; // e.g. #VOL-84920
  vehicleId: string;
  vehicle: Vehicle;
  createdDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  days: number;
  dailyRate: number;
  grossAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'Mercado Pago' | 'Efectivo';
  paymentStatus: 'Aprobado' | 'En custodia' | 'Liquidado';
  bookingStatus: 'Confirmada' | 'Finalizada' | 'Cancelada';
  mpTransactionId: string;
  hostName: string;
  hostPhone: string;
  guestName: string;
  guestPhone: string;
  pickupAddress: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  reservationCode: string;
  vehicleName: string;
  vehicleSubtitle?: string;
  guestName: string;
  isGuestVerified: boolean;
  isFrequentGuest?: boolean;
  locationTag?: string;
  grossAmount: number;
  feeAmount: number;
  feeDetail: string;
  netAmount: number;
  status: 'Acreditado' | 'En custodia' | 'Liquidado';
  mpRef: string;
}

export interface ModerationItem {
  id: string;
  code: string; // #PUB-2025-0891
  brand: string;
  model: string;
  year: number;
  plate: string;
  requestedPrice: number;
  hostName: string;
  hostTaxId: string; // CUIT
  hostType: string;
  hostBadge?: string;
  timeAgo: string;
  photoUrl: string;
  priorityBadge?: string;
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'observada';
  cedula: { status: 'ok' | 'warning' | 'pending'; label: string };
  vtv: { status: 'ok' | 'warning' | 'pending'; label: string };
  insurance: { status: 'ok' | 'warning' | 'pending'; label: string };
  assignedAuditor?: string;
  waitingEndorsement?: boolean;
}
