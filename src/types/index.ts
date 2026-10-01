// Backend Enums
export type Role = 'USER' | 'ADMIN';

export type EstadoPublicacion = 'ACTIVA' | 'PAUSADA' | 'DESACTIVADA';

export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA' | 'CANCELADA' | 'FINALIZADA';

export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export type MetodoPago = 'MERCADO_PAGO' | 'EFECTIVO';

// User
export interface Usuario {
  idUsuario: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  role: Role;
}

// Vehicle Image
export interface ImagenVehiculo {
  idImagenVehiculo: string;
  idVehiculo: string;
  url: string;
  orden: number;
}

// Vehicle
export interface Vehiculo {
  idVehiculo: string;
  idUsuarioPropietario: string;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  cantidadAsientos: number;
  tipoVehiculo: string;
  imagenes: ImagenVehiculo[];
}

// Location
export interface Ubicacion {
  idUbicacion: string;
  direccion: string;
  ciudad: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  zona: string;
  latitud: number;
  longitud: number;
  placeId?: string;
}

// Listing / Publication
export interface Publicacion {
  idPublicacion: string;
  idVehiculo: string;
  idUbicacion: string;
  precioDia: number;
  descuentoPorcentaje: number; // 0 to 50
  descripcion: string;
  horaRetiroDevolucion: string; // Fixed time, e.g. "10:00"
  estado: EstadoPublicacion;
  vehiculo?: Vehiculo;
  ubicacion?: Ubicacion;
}

// Availability Range
export interface Disponibilidad {
  idDisponibilidad: string;
  idPublicacion: string;
  fechaInicio: string; // 'YYYY-MM-DD'
  fechaFin: string; // 'YYYY-MM-DD'
}

// Cart Item (max 1 publication per cart, 15 min duration)
export interface CarritoItem {
  idCarrito?: string;
  idPublicacion: string;
  fechaInicio: string; // 'YYYY-MM-DD'
  fechaFin: string; // 'YYYY-MM-DD'
  fechaAgregado: number; // timestamp ms
}

// Reservation
export interface Reserva {
  idReserva: string;
  idUsuario: string;
  idPublicacion: string;
  fechaInicio: string; // 'YYYY-MM-DD'
  fechaFin: string; // 'YYYY-MM-DD'
  estado: EstadoReserva;
  fechaCreacion: string; // 'YYYY-MM-DD'
  total: number;
  usuario?: Usuario;
  publicacion?: Publicacion;
  pago?: Pago;
}

// Payment
export interface Pago {
  idPago: string;
  idReserva: string;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  total: number;
  preferenceId?: string;
  fechaCreacion: string;
}
