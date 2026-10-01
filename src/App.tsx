import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { CatalogView } from './views/CatalogView';
import { VehicleDetailView } from './views/VehicleDetailView';
import { MyVehiclesView } from './views/MyVehiclesView';
import { VehicleFormView } from './views/VehicleFormView';
import { PhotoManagementView } from './views/PhotoManagementView';
import { MyListingsView } from './views/MyListingsView';
import { ListingFormView } from './views/ListingFormView';
import { AvailabilityManagementView } from './views/AvailabilityManagementView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { MyBookingsView } from './views/MyBookingsView';
import { BookingDetailView } from './views/BookingDetailView';
import { AdminPaymentsView } from './views/AdminPaymentsView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';

// Auto scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f6] text-[#1b1c1a]">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Home & Catalog */}
          <Route path="/" element={<CatalogView />} />
          <Route path="/publicacion/:id" element={<VehicleDetailView />} />

          {/* Vehicles (separate from listings) */}
          <Route path="/mis-vehiculos" element={<MyVehiclesView />} />
          <Route path="/mis-vehiculos/nuevo" element={<VehicleFormView />} />
          <Route path="/mis-vehiculos/:id/editar" element={<VehicleFormView />} />
          <Route path="/mis-vehiculos/:id/fotos" element={<PhotoManagementView />} />

          {/* Listings */}
          <Route path="/mis-publicaciones" element={<MyListingsView />} />
          <Route path="/publicaciones/nueva" element={<ListingFormView />} />
          <Route path="/publicaciones/:id/editar" element={<ListingFormView />} />
          <Route
            path="/publicaciones/:id/disponibilidad"
            element={<AvailabilityManagementView />}
          />

          {/* Cart & Checkout */}
          <Route path="/carrito" element={<CartView />} />
          <Route path="/checkout" element={<CheckoutView />} />

          {/* Reservations */}
          <Route path="/mis-reservas" element={<MyBookingsView />} />
          <Route path="/reservas/:id" element={<BookingDetailView />} />

          {/* Admin Area */}
          <Route path="/admin" element={<AdminPaymentsView />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegisterView />} />

          {/* Fallback to home */}
          <Route path="*" element={<CatalogView />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
