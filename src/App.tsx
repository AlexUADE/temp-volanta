import React, { useState } from 'react';
import { ViewMode, Vehicle, Reservation, Transaction, ModerationItem } from './types';
import {
  INITIAL_VEHICLES,
  INITIAL_RESERVATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_MODERATION,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogView } from './components/CatalogView';
import { VehicleDetailView } from './components/VehicleDetailView';
import { CartView, CartBookingItem } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { BookingSuccessView } from './components/BookingSuccessView';
import { MyBookingsView } from './components/MyBookingsView';
import { BookingDetailView } from './components/BookingDetailView';
import { MyListingsView } from './components/MyListingsView';
import { EditListingView } from './components/EditListingView';
import { PublishCarView } from './components/PublishCarView';
import { FinancesView } from './components/FinancesView';
import { AdminModerationView } from './components/AdminModerationView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('catalog');
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(INITIAL_MODERATION);

  // Default active selections for instant screen fidelity
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(INITIAL_VEHICLES[0]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation>(INITIAL_RESERVATIONS[0]);

  // Initial cart populated with Corolla XEI so that 'cart' and 'checkout' match the screenshots
  const [cartItem, setCartItem] = useState<CartBookingItem | null>({
    vehicle: INITIAL_VEHICLES[0],
    startDate: '12 Nov',
    endDate: '16 Nov',
    startTime: '10:00 hs',
    endTime: '10:00 hs',
    days: 4,
    dailyRate: 75000,
    discountAmount: 30000,
    totalAmount: 270000,
  });

  const [userRole, setUserRole] = useState<'host' | 'guest' | 'admin'>('host');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Navigation handlers
  const handleSelectVehicleForDetail = (v: Vehicle) => {
    setSelectedVehicle(v);
    setCurrentView('vehicle-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (bookingDetails: CartBookingItem) => {
    setCartItem(bookingDetails);
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    if (!cartItem) return;
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = (paymentMethod: 'Mercado Pago' | 'Efectivo') => {
    if (!cartItem) return;

    const newReservation: Reservation = {
      id: `#VOL-${Math.floor(10000 + Math.random() * 90000)}`,
      vehicleId: cartItem.vehicle.id,
      vehicle: cartItem.vehicle,
      createdDate: 'Hoy',
      startDate: cartItem.startDate,
      endDate: cartItem.endDate,
      startTime: cartItem.startTime,
      endTime: cartItem.endTime,
      days: cartItem.days,
      dailyRate: cartItem.dailyRate,
      grossAmount: cartItem.dailyRate * cartItem.days,
      discountAmount: cartItem.discountAmount,
      totalAmount: cartItem.totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Mercado Pago' ? 'Aprobado' : 'En custodia',
      bookingStatus: 'Confirmada',
      mpTransactionId: `MP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      hostName: cartItem.vehicle.hostName,
      hostPhone: cartItem.vehicle.hostPhone,
      guestName: 'Mariano G.',
      guestPhone: '+54 11 3820-9944',
      pickupAddress: `${cartItem.vehicle.pickupPoint}, ${cartItem.vehicle.neighborhood}, CABA`,
      notes: cartItem.vehicle.pickupNotes,
    };

    setReservations((prev) => [newReservation, ...prev]);
    setSelectedReservation(newReservation);
    setCurrentView('booking-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReservationForDetail = (res: Reservation) => {
    setSelectedReservation(res);
    setCurrentView('booking-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, bookingStatus: 'Cancelada' } : r))
    );
    if (selectedReservation?.id === reservationId) {
      setSelectedReservation((prev) => ({ ...prev, bookingStatus: 'Cancelada' }));
    }
  };

  const handleEditVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    setCurrentView('edit-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveVehicle = (updated: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setSelectedVehicle(updated);
  };

  const handleToggleVehicleStatus = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            status: v.status === 'activa' ? 'pausada' : 'activa',
          };
        }
        return v;
      })
    );
  };

  const handleVehicleCreated = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
    setCurrentView('my-listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveModeration = (id: string) => {
    setModerationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'aprobada' } : item))
    );
  };

  const handleRejectModeration = (id: string) => {
    setModerationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'observada' } : item))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1B1C1A]">
      {/* Universal Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartItem ? 1 : 0}
        userRole={userRole}
        setUserRole={setUserRole}
        isAuthenticated={isAuthenticated}
        onOpenAuth={(mode) => setCurrentView(mode)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <CatalogView
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicleForDetail}
          />
        )}

        {currentView === 'vehicle-detail' && (
          <VehicleDetailView
            vehicle={selectedVehicle}
            onAddToCart={handleAddToCart}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cartItem={cartItem}
            onRemoveItem={() => setCartItem(null)}
            onProceedToCheckout={handleProceedToCheckout}
            onContinueBrowsing={() => setCurrentView('catalog')}
            onUpdateDays={(newDays) => {
              if (cartItem) {
                const gross = cartItem.dailyRate * newDays;
                const disc = newDays >= 3 ? Math.round((gross * cartItem.vehicle.weeklyDiscountPercent) / 100) : 0;
                setCartItem({
                  ...cartItem,
                  days: newDays,
                  discountAmount: disc,
                  totalAmount: gross - disc,
                });
              }
            }}
          />
        )}

        {currentView === 'checkout' && cartItem && (
          <CheckoutView
            bookingData={cartItem}
            onConfirmBooking={handleConfirmBooking}
            onBackToCart={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'booking-success' && selectedReservation && (
          <BookingSuccessView
            reservation={selectedReservation}
            onViewMyBookings={() => setCurrentView('my-bookings')}
            onExploreMore={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'my-bookings' && (
          <MyBookingsView
            reservations={reservations}
            onSelectReservation={handleSelectReservationForDetail}
            onReBook={(vehicleId) => {
              const car = vehicles.find((v) => v.id === vehicleId) || selectedVehicle;
              handleSelectVehicleForDetail(car);
            }}
          />
        )}

        {currentView === 'booking-detail' && selectedReservation && (
          <BookingDetailView
            reservation={selectedReservation}
            onBack={() => setCurrentView('my-bookings')}
            onCancelReservation={handleCancelReservation}
          />
        )}

        {currentView === 'my-listings' && (
          <MyListingsView
            vehicles={vehicles}
            onEditVehicle={handleEditVehicle}
            onPublishNew={() => setCurrentView('publish-car')}
            onToggleStatus={handleToggleVehicleStatus}
          />
        )}

        {currentView === 'edit-listing' && (
          <EditListingView
            vehicle={selectedVehicle}
            onBack={() => setCurrentView('my-listings')}
            onViewAsUser={handleSelectVehicleForDetail}
            onSaveVehicle={handleSaveVehicle}
            onViewReservationDetail={() => {
              setSelectedReservation(reservations[0]);
              setCurrentView('booking-detail');
            }}
          />
        )}

        {currentView === 'publish-car' && (
          <PublishCarView
            onVehicleCreated={handleVehicleCreated}
            onCancel={() => setCurrentView('my-listings')}
          />
        )}

        {currentView === 'finances' && (
          <FinancesView transactions={transactions} />
        )}

        {currentView === 'admin-fleet' && (
          <AdminModerationView
            items={moderationItems}
            onApproveItem={handleApproveModeration}
            onRejectItem={handleRejectModeration}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={(email) => {
              setIsAuthenticated(true);
              setCurrentView('catalog');
            }}
            onGoToRegister={() => setCurrentView('register')}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onRegisterSuccess={(name, email) => {
              setIsAuthenticated(true);
              setCurrentView('catalog');
            }}
            onGoToLogin={() => setCurrentView('login')}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
