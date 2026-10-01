import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Usuario,
  Vehiculo,
  Ubicacion,
  Publicacion,
  Disponibilidad,
  CarritoItem,
  Reserva,
  Pago,
  MetodoPago,
  ImagenVehiculo,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_LOCATIONS,
  INITIAL_VEHICLES,
  INITIAL_PUBLICATIONS,
  INITIAL_AVAILABILITIES,
  INITIAL_RESERVATIONS,
  INITIAL_PAYMENTS,
} from '../data/mockData';
import { hoyString, sumarDias } from '../utils/pricing';

const CART_DURATION_SECONDS = 15 * 60; // 15 minutes

interface AppContextType {
  // Auth & Roles
  currentUser: Usuario | null;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  loginWithCredentials: (email: string) => boolean;
  registerUser: (data: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
  }) => void;
  logout: () => void;

  // Locations
  ubicaciones: Ubicacion[];

  // Vehicles
  vehiculos: Vehiculo[];
  getVehiculosPropios: () => Vehiculo[];
  getVehiculoPorId: (idVehiculo: string) => Vehiculo | undefined;
  agregarVehiculo: (
    data: Omit<Vehiculo, 'idVehiculo' | 'idUsuarioPropietario' | 'imagenes'> & {
      fotos?: string[];
    }
  ) => Vehiculo;
  actualizarVehiculo: (idVehiculo: string, data: Partial<Vehiculo>) => void;
  actualizarFotosVehiculo: (idVehiculo: string, fotos: ImagenVehiculo[]) => void;

  // Listings / Publications
  publicaciones: Publicacion[];
  getPublicacionCompleta: (idPublicacion: string) => Publicacion | undefined;
  getPublicacionesActivas: () => Publicacion[];
  getPublicacionesPropias: () => Publicacion[];
  getPublicacionVigenteDeVehiculo: (idVehiculo: string) => Publicacion | undefined;
  crearPublicacion: (
    data: Omit<Publicacion, 'idPublicacion' | 'estado' | 'vehiculo' | 'ubicacion'>
  ) => Publicacion;
  actualizarPublicacion: (
    idPublicacion: string,
    data: Partial<Omit<Publicacion, 'idPublicacion' | 'idVehiculo'>>
  ) => void;
  pausarPublicacion: (idPublicacion: string) => void;
  reactivarPublicacion: (idPublicacion: string) => void;
  desactivarPublicacion: (idPublicacion: string) => void;

  // Availability
  disponibilidades: Disponibilidad[];
  getDisponibilidadesPorPublicacion: (idPublicacion: string) => Disponibilidad[];
  agregarDisponibilidad: (
    idPublicacion: string,
    fechaInicio: string,
    fechaFin: string
  ) => Disponibilidad;
  actualizarDisponibilidad: (
    idDisponibilidad: string,
    fechaInicio: string,
    fechaFin: string
  ) => void;
  eliminarDisponibilidad: (idDisponibilidad: string) => void;

  // Cart
  carrito: CarritoItem | null;
  tiempoRestanteCarrito: number;
  carritoExpirado: boolean;
  agregarAlCarrito: (
    idPublicacion: string,
    fechaInicio: string,
    fechaFin: string
  ) => { ok: boolean; message?: string };
  modificarFechasCarrito: (fechaInicio: string, fechaFin: string) => void;
  vaciarCarrito: () => void;

  // Bookings & Payments
  reservas: Reserva[];
  pagos: Pago[];
  getReservasUsuario: () => Reserva[];
  getReservaPorId: (idReserva: string) => Reserva | undefined;
  getPagosEfectivoPendientes: () => { pago: Pago; reserva: Reserva }[];
  crearReservaDesdeCarrito: (
    metodoPago: MetodoPago
  ) => { reserva: Reserva; pago: Pago } | null;
  cancelarReserva: (idReserva: string) => { ok: boolean; message: string };
  aprobarPagoEfectivo: (idPago: string) => void;
  rechazarPagoEfectivo: (idPago: string) => void;
  simularResultadoMercadoPago: (
    idPago: string,
    resultado: 'APROBADO' | 'RECHAZADO'
  ) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo starts logged in as demo USER
  const [currentUser, setCurrentUser] = useState<Usuario | null>(DEMO_USERS[0]);

  // Master state
  const [ubicaciones] = useState<Ubicacion[]>(INITIAL_LOCATIONS);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(INITIAL_VEHICLES);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>(INITIAL_PUBLICATIONS);
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>(INITIAL_AVAILABILITIES);
  const [reservas, setReservas] = useState<Reserva[]>(INITIAL_RESERVATIONS);
  const [pagos, setPagos] = useState<Pago[]>(INITIAL_PAYMENTS);

  // Cart state: initial cart populated with pub-1 so that visiting cart works right away
  const [carrito, setCarrito] = useState<CarritoItem | null>(() => {
    const pub = INITIAL_PUBLICATIONS[0];
    const hoy = hoyString();
    return {
      idCarrito: 'cart-1',
      idPublicacion: pub.idPublicacion,
      fechaInicio: sumarDias(hoy, 3),
      fechaFin: sumarDias(hoy, 7),
      fechaAgregado: Date.now(),
    };
  });

  const [tiempoRestanteCarrito, setTiempoRestanteCarrito] = useState<number>(CART_DURATION_SECONDS);
  const [carritoExpirado, setCarritoExpirado] = useState(false);

  // Cart timer ticker (15 min)
  useEffect(() => {
    if (!carrito) {
      setTiempoRestanteCarrito(CART_DURATION_SECONDS);
      setCarritoExpirado(false);
      return;
    }

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - carrito.fechaAgregado) / 1000);
      const remaining = Math.max(0, CART_DURATION_SECONDS - elapsedSeconds);
      setTiempoRestanteCarrito(remaining);
      if (remaining === 0) {
        setCarritoExpirado(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [carrito]);

  // ----------------------------------------------------
  // AUTH
  // ----------------------------------------------------
  const loginAsUser = () => {
    setCurrentUser(DEMO_USERS[0]);
  };

  const loginAsAdmin = () => {
    setCurrentUser(DEMO_USERS[1]);
  };

  const loginWithCredentials = (email: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail.includes('admin')) {
      setCurrentUser(DEMO_USERS[1]);
      return true;
    }
    // Check if matches user-1 or create session
    setCurrentUser({
      ...DEMO_USERS[0],
      email: cleanEmail || DEMO_USERS[0].email,
    });
    return true;
  };

  const registerUser = (data: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
  }) => {
    const newUser: Usuario = {
      idUsuario: `user-${Date.now()}`,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      fechaNacimiento: data.fechaNacimiento,
      role: 'USER',
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // ----------------------------------------------------
  // VEHICLES
  // ----------------------------------------------------
  const getVehiculosPropios = (): Vehiculo[] => {
    if (!currentUser) return [];
    return vehiculos.filter((v) => v.idUsuarioPropietario === currentUser.idUsuario);
  };

  const getVehiculoPorId = (idVehiculo: string): Vehiculo | undefined => {
    return vehiculos.find((v) => v.idVehiculo === idVehiculo);
  };

  const agregarVehiculo = (
    data: Omit<Vehiculo, 'idVehiculo' | 'idUsuarioPropietario' | 'imagenes'> & {
      fotos?: string[];
    }
  ): Vehiculo => {
    const idVehiculo = `veh-${Date.now()}`;
    const fotos: ImagenVehiculo[] = (data.fotos && data.fotos.length > 0
      ? data.fotos
      : [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
        ]
    ).map((url, idx) => ({
      idImagenVehiculo: `img-${idVehiculo}-${idx + 1}`,
      idVehiculo,
      url,
      orden: idx + 1,
    }));

    const nuevo: Vehiculo = {
      idVehiculo,
      idUsuarioPropietario: currentUser?.idUsuario || 'user-1',
      patente: data.patente.toUpperCase().trim(),
      marca: data.marca.trim(),
      modelo: data.modelo.trim(),
      anio: Number(data.anio),
      color: data.color.trim(),
      cantidadAsientos: Number(data.cantidadAsientos),
      tipoVehiculo: data.tipoVehiculo,
      imagenes: fotos,
    };

    setVehiculos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const actualizarVehiculo = (idVehiculo: string, data: Partial<Vehiculo>) => {
    setVehiculos((prev) =>
      prev.map((v) => (v.idVehiculo === idVehiculo ? { ...v, ...data } : v))
    );
  };

  const actualizarFotosVehiculo = (idVehiculo: string, fotos: ImagenVehiculo[]) => {
    setVehiculos((prev) =>
      prev.map((v) =>
        v.idVehiculo === idVehiculo
          ? {
              ...v,
              imagenes: fotos.map((f, i) => ({ ...f, orden: i + 1 })),
            }
          : v
      )
    );
  };

  // ----------------------------------------------------
  // LISTINGS / PUBLICATIONS
  // ----------------------------------------------------
  const populatePublication = (pub: Publicacion): Publicacion => {
    const veh = vehiculos.find((v) => v.idVehiculo === pub.idVehiculo);
    const ubi = ubicaciones.find((u) => u.idUbicacion === pub.idUbicacion);
    return {
      ...pub,
      vehiculo: veh,
      ubicacion: ubi,
    };
  };

  const getPublicacionCompleta = (idPublicacion: string): Publicacion | undefined => {
    const pub = publicaciones.find((p) => p.idPublicacion === idPublicacion);
    if (!pub) return undefined;
    return populatePublication(pub);
  };

  const getPublicacionesActivas = (): Publicacion[] => {
    return publicaciones
      .filter((p) => p.estado === 'ACTIVA')
      .map(populatePublication);
  };

  const getPublicacionesPropias = (): Publicacion[] => {
    if (!currentUser) return [];
    return publicaciones
      .filter((p) => {
        const v = vehiculos.find((veh) => veh.idVehiculo === p.idVehiculo);
        return v?.idUsuarioPropietario === currentUser.idUsuario;
      })
      .map(populatePublication);
  };

  const getPublicacionVigenteDeVehiculo = (idVehiculo: string): Publicacion | undefined => {
    const pub = publicaciones.find(
      (p) => p.idVehiculo === idVehiculo && (p.estado === 'ACTIVA' || p.estado === 'PAUSADA')
    );
    return pub ? populatePublication(pub) : undefined;
  };

  const crearPublicacion = (
    data: Omit<Publicacion, 'idPublicacion' | 'estado' | 'vehiculo' | 'ubicacion'>
  ): Publicacion => {
    const nueva: Publicacion = {
      idPublicacion: `pub-${Date.now()}`,
      idVehiculo: data.idVehiculo,
      idUbicacion: data.idUbicacion,
      precioDia: Number(data.precioDia),
      descuentoPorcentaje: Number(data.descuentoPorcentaje || 0),
      descripcion: data.descripcion.trim(),
      horaRetiroDevolucion: data.horaRetiroDevolucion || '10:00',
      estado: 'ACTIVA',
    };

    setPublicaciones((prev) => [nueva, ...prev]);
    return populatePublication(nueva);
  };

  const actualizarPublicacion = (
    idPublicacion: string,
    data: Partial<Omit<Publicacion, 'idPublicacion' | 'idVehiculo'>>
  ) => {
    setPublicaciones((prev) =>
      prev.map((p) => (p.idPublicacion === idPublicacion ? { ...p, ...data } : p))
    );
  };

  const pausarPublicacion = (idPublicacion: string) => {
    setPublicaciones((prev) =>
      prev.map((p) =>
        p.idPublicacion === idPublicacion ? { ...p, estado: 'PAUSADA' } : p
      )
    );
  };

  const reactivarPublicacion = (idPublicacion: string) => {
    setPublicaciones((prev) =>
      prev.map((p) =>
        p.idPublicacion === idPublicacion ? { ...p, estado: 'ACTIVA' } : p
      )
    );
  };

  const desactivarPublicacion = (idPublicacion: string) => {
    setPublicaciones((prev) =>
      prev.map((p) =>
        p.idPublicacion === idPublicacion ? { ...p, estado: 'DESACTIVADA' } : p
      )
    );
  };

  // ----------------------------------------------------
  // AVAILABILITY
  // ----------------------------------------------------
  const getDisponibilidadesPorPublicacion = (idPublicacion: string): Disponibilidad[] => {
    return disponibilidades
      .filter((d) => d.idPublicacion === idPublicacion)
      .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
  };

  const agregarDisponibilidad = (
    idPublicacion: string,
    fechaInicio: string,
    fechaFin: string
  ): Disponibilidad => {
    const nuevo: Disponibilidad = {
      idDisponibilidad: `disp-${Date.now()}`,
      idPublicacion,
      fechaInicio,
      fechaFin,
    };
    setDisponibilidades((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const actualizarDisponibilidad = (
    idDisponibilidad: string,
    fechaInicio: string,
    fechaFin: string
  ) => {
    setDisponibilidades((prev) =>
      prev.map((d) =>
        d.idDisponibilidad === idDisponibilidad
          ? { ...d, fechaInicio, fechaFin }
          : d
      )
    );
  };

  const eliminarDisponibilidad = (idDisponibilidad: string) => {
    setDisponibilidades((prev) =>
      prev.filter((d) => d.idDisponibilidad !== idDisponibilidad)
    );
  };

  // ----------------------------------------------------
  // CART
  // ----------------------------------------------------
  const agregarAlCarrito = (
    idPublicacion: string,
    fechaInicio: string,
    fechaFin: string
  ): { ok: boolean; message?: string } => {
    if (carrito && carrito.idPublicacion !== idPublicacion) {
      return {
        ok: false,
        message:
          'Ya tienes otra publicación en tu carrito. Puedes vaciar el carrito actual para reservar esta.',
      };
    }

    setCarrito({
      idCarrito: `cart-${Date.now()}`,
      idPublicacion,
      fechaInicio,
      fechaFin,
      fechaAgregado: Date.now(),
    });
    setTiempoRestanteCarrito(CART_DURATION_SECONDS);
    setCarritoExpirado(false);
    return { ok: true };
  };

  const modificarFechasCarrito = (fechaInicio: string, fechaFin: string) => {
    if (!carrito) return;
    setCarrito({
      ...carrito,
      fechaInicio,
      fechaFin,
    });
  };

  const vaciarCarrito = () => {
    setCarrito(null);
    setTiempoRestanteCarrito(CART_DURATION_SECONDS);
    setCarritoExpirado(false);
  };

  // ----------------------------------------------------
  // BOOKINGS & PAYMENTS
  // ----------------------------------------------------
  const populateReserva = (res: Reserva): Reserva => {
    const pub = getPublicacionCompleta(res.idPublicacion);
    const usr = DEMO_USERS.find((u) => u.idUsuario === res.idUsuario);
    const pag = pagos.find((p) => p.idReserva === res.idReserva);
    return {
      ...res,
      publicacion: pub,
      usuario: usr,
      pago: pag,
    };
  };

  const getReservasUsuario = (): Reserva[] => {
    if (!currentUser) return [];
    return reservas
      .filter((r) => r.idUsuario === currentUser.idUsuario)
      .map(populateReserva)
      .sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
  };

  const getReservaPorId = (idReserva: string): Reserva | undefined => {
    const r = reservas.find((res) => res.idReserva === idReserva);
    return r ? populateReserva(r) : undefined;
  };

  const getPagosEfectivoPendientes = (): { pago: Pago; reserva: Reserva }[] => {
    return pagos
      .filter((p) => p.metodoPago === 'EFECTIVO' && p.estado === 'PENDIENTE')
      .map((p) => {
        const r = getReservaPorId(p.idReserva);
        return {
          pago: p,
          reserva: r!,
        };
      })
      .filter((item) => item.reserva !== undefined);
  };

  const crearReservaDesdeCarrito = (
    metodoPago: MetodoPago
  ): { reserva: Reserva; pago: Pago } | null => {
    if (!carrito || !currentUser) return null;
    const pub = getPublicacionCompleta(carrito.idPublicacion);
    if (!pub) return null;

    const inicio = new Date(`${carrito.fechaInicio}T00:00:00`);
    const fin = new Date(`${carrito.fechaFin}T00:00:00`);
    const dias = Math.max(1, Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));
    const desc = Math.min(50, Math.max(0, pub.descuentoPorcentaje || 0));
    const precioDiaFinal = Math.round(pub.precioDia * (1 - desc / 100));
    const total = precioDiaFinal * dias;

    const idReserva = `res-${Date.now()}`;
    const idPago = `pago-${Date.now()}`;

    const nuevaReserva: Reserva = {
      idReserva,
      idUsuario: currentUser.idUsuario,
      idPublicacion: pub.idPublicacion,
      fechaInicio: carrito.fechaInicio,
      fechaFin: carrito.fechaFin,
      estado: 'PENDIENTE',
      fechaCreacion: hoyString(),
      total,
    };

    const nuevoPago: Pago = {
      idPago,
      idReserva,
      metodoPago,
      estado: 'PENDIENTE',
      total,
      preferenceId:
        metodoPago === 'MERCADO_PAGO'
          ? `MP-PREF-${Math.floor(100000 + Math.random() * 900000)}`
          : undefined,
      fechaCreacion: hoyString(),
    };

    setReservas((prev) => [nuevaReserva, ...prev]);
    setPagos((prev) => [nuevoPago, ...prev]);

    // Empty cart upon confirmation
    vaciarCarrito();

    return {
      reserva: populateReserva(nuevaReserva),
      pago: nuevoPago,
    };
  };

  const cancelarReserva = (idReserva: string): { ok: boolean; message: string } => {
    const res = reservas.find((r) => r.idReserva === idReserva);
    if (!res) return { ok: false, message: 'Reserva no encontrada.' };

    const hoy = hoyString();
    if (res.fechaInicio <= hoy) {
      return {
        ok: false,
        message: 'No es posible cancelar una reserva cuya fecha de inicio es hoy o ya ha pasado.',
      };
    }

    if (res.estado !== 'PENDIENTE' && res.estado !== 'CONFIRMADA') {
      return {
        ok: false,
        message: `No se puede cancelar una reserva con estado ${res.estado}.`,
      };
    }

    setReservas((prev) =>
      prev.map((r) => (r.idReserva === idReserva ? { ...r, estado: 'CANCELADA' } : r))
    );

    return {
      ok: true,
      message: 'La reserva ha sido cancelada correctamente.',
    };
  };

  const aprobarPagoEfectivo = (idPago: string) => {
    const pago = pagos.find((p) => p.idPago === idPago);
    if (!pago) return;

    setPagos((prev) =>
      prev.map((p) => (p.idPago === idPago ? { ...p, estado: 'APROBADO' } : p))
    );

    setReservas((prev) =>
      prev.map((r) =>
        r.idReserva === pago.idReserva ? { ...r, estado: 'CONFIRMADA' } : r
      )
    );
  };

  const rechazarPagoEfectivo = (idPago: string) => {
    const pago = pagos.find((p) => p.idPago === idPago);
    if (!pago) return;

    setPagos((prev) =>
      prev.map((p) => (p.idPago === idPago ? { ...p, estado: 'RECHAZADO' } : p))
    );

    setReservas((prev) =>
      prev.map((r) =>
        r.idReserva === pago.idReserva ? { ...r, estado: 'RECHAZADA' } : r
      )
    );
  };

  const simularResultadoMercadoPago = (
    idPago: string,
    resultado: 'APROBADO' | 'RECHAZADO'
  ) => {
    const pago = pagos.find((p) => p.idPago === idPago);
    if (!pago) return;

    setPagos((prev) =>
      prev.map((p) => (p.idPago === idPago ? { ...p, estado: resultado } : p))
    );

    setReservas((prev) =>
      prev.map((r) =>
        r.idReserva === pago.idReserva
          ? { ...r, estado: resultado === 'APROBADO' ? 'CONFIRMADA' : 'RECHAZADA' }
          : r
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loginAsUser,
        loginAsAdmin,
        loginWithCredentials,
        registerUser,
        logout,
        ubicaciones,
        vehiculos,
        getVehiculosPropios,
        getVehiculoPorId,
        agregarVehiculo,
        actualizarVehiculo,
        actualizarFotosVehiculo,
        publicaciones,
        getPublicacionCompleta,
        getPublicacionesActivas,
        getPublicacionesPropias,
        getPublicacionVigenteDeVehiculo,
        crearPublicacion,
        actualizarPublicacion,
        pausarPublicacion,
        reactivarPublicacion,
        desactivarPublicacion,
        disponibilidades,
        getDisponibilidadesPorPublicacion,
        agregarDisponibilidad,
        actualizarDisponibilidad,
        eliminarDisponibilidad,
        carrito,
        tiempoRestanteCarrito,
        carritoExpirado,
        agregarAlCarrito,
        modificarFechasCarrito,
        vaciarCarrito,
        reservas,
        pagos,
        getReservasUsuario,
        getReservaPorId,
        getPagosEfectivoPendientes,
        crearReservaDesdeCarrito,
        cancelarReserva,
        aprobarPagoEfectivo,
        rechazarPagoEfectivo,
        simularResultadoMercadoPago,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
