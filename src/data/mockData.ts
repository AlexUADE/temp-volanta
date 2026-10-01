import {
  Usuario,
  Vehiculo,
  Ubicacion,
  Publicacion,
  Disponibilidad,
  Reserva,
  Pago,
} from '../types';
import { hoyString, sumarDias } from '../utils/pricing';

export const DEMO_USERS: Usuario[] = [
  {
    idUsuario: 'user-1',
    nombre: 'Mariano',
    apellido: 'González',
    email: 'mariano.gonzalez@volanta.com',
    telefono: '+54 11 4890-1234',
    fechaNacimiento: '1988-06-15',
    role: 'USER',
  },
  {
    idUsuario: 'admin-1',
    nombre: 'Administración',
    apellido: 'Volanta',
    email: 'admin@volanta.com',
    telefono: '+54 11 5555-0000',
    fechaNacimiento: '1985-01-01',
    role: 'ADMIN',
  },
];

export const INITIAL_LOCATIONS: Ubicacion[] = [
  {
    idUbicacion: 'loc-1',
    direccion: 'Av. Libertador 2450',
    ciudad: 'CABA',
    localidad: 'Palermo',
    provincia: 'Buenos Aires',
    codigoPostal: 'C1425AA',
    zona: 'Palermo Chico',
    latitud: -34.5823,
    longitud: -58.4035,
  },
  {
    idUbicacion: 'loc-2',
    direccion: 'Juncal 1320',
    ciudad: 'CABA',
    localidad: 'Recoleta',
    provincia: 'Buenos Aires',
    codigoPostal: 'C1062AB',
    zona: 'Recoleta',
    latitud: -34.5938,
    longitud: -58.3882,
  },
  {
    idUbicacion: 'loc-3',
    direccion: 'Cabildo 1890',
    ciudad: 'CABA',
    localidad: 'Belgrano',
    provincia: 'Buenos Aires',
    codigoPostal: 'C1428AA',
    zona: 'Belgrano R',
    latitud: -34.5621,
    longitud: -58.4563,
  },
  {
    idUbicacion: 'loc-4',
    direccion: 'Av. Colón 850',
    ciudad: 'Córdoba Capital',
    localidad: 'Centro',
    provincia: 'Córdoba',
    codigoPostal: 'X5000',
    zona: 'Barrio Centro',
    latitud: -31.4135,
    longitud: -64.181,
  },
  {
    idUbicacion: 'loc-5',
    direccion: 'Bv. Oroño 1150',
    ciudad: 'Rosario',
    localidad: 'Centro',
    provincia: 'Santa Fe',
    codigoPostal: 'S2000',
    zona: 'Paseo del Siglo',
    latitud: -32.9468,
    longitud: -60.6393,
  },
];

export const INITIAL_VEHICLES: Vehiculo[] = [
  // Vehicles owned by user-1 (Mariano González)
  {
    idVehiculo: 'veh-1',
    idUsuarioPropietario: 'user-1',
    patente: 'AF 342 KL',
    marca: 'Toyota',
    modelo: 'Corolla XEI 2.0',
    anio: 2023,
    color: 'Gris Plata',
    cantidadAsientos: 5,
    tipoVehiculo: 'Sedán',
    imagenes: [
      {
        idImagenVehiculo: 'img-1-1',
        idVehiculo: 'veh-1',
        url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200&auto=format&fit=crop',
        orden: 1,
      },
      {
        idImagenVehiculo: 'img-1-2',
        idVehiculo: 'veh-1',
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
        orden: 2,
      },
      {
        idImagenVehiculo: 'img-1-3',
        idVehiculo: 'veh-1',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
        orden: 3,
      },
    ],
  },
  {
    idVehiculo: 'veh-2',
    idUsuarioPropietario: 'user-1',
    patente: 'AE 890 OP',
    marca: 'Volkswagen',
    modelo: 'Taos Highline',
    anio: 2022,
    color: 'Blanco Puro',
    cantidadAsientos: 5,
    tipoVehiculo: 'SUV',
    imagenes: [
      {
        idImagenVehiculo: 'img-2-1',
        idVehiculo: 'veh-2',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        orden: 1,
      },
      {
        idImagenVehiculo: 'img-2-2',
        idVehiculo: 'veh-2',
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
        orden: 2,
      },
    ],
  },
  {
    idVehiculo: 'veh-3',
    idUsuarioPropietario: 'user-1',
    patente: 'AG 112 ZZ',
    marca: 'Peugeot',
    modelo: '208 Allure',
    anio: 2024,
    color: 'Azul Quasar',
    cantidadAsientos: 5,
    tipoVehiculo: 'Hatchback',
    imagenes: [
      {
        idImagenVehiculo: 'img-3-1',
        idVehiculo: 'veh-3',
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop',
        orden: 1,
      },
    ],
  },

  // Vehicles owned by other users
  {
    idVehiculo: 'veh-4',
    idUsuarioPropietario: 'user-2',
    patente: 'AD 672 TY',
    marca: 'Ford',
    modelo: 'Ranger Limited 4x4',
    anio: 2023,
    color: 'Gris Mercurio',
    cantidadAsientos: 5,
    tipoVehiculo: 'Pickup',
    imagenes: [
      {
        idImagenVehiculo: 'img-4-1',
        idVehiculo: 'veh-4',
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
        orden: 1,
      },
    ],
  },
  {
    idVehiculo: 'veh-5',
    idUsuarioPropietario: 'user-3',
    patente: 'AC 450 MN',
    marca: 'Jeep',
    modelo: 'Renegade Longitude',
    anio: 2021,
    color: 'Negro Carbón',
    cantidadAsientos: 5,
    tipoVehiculo: 'SUV',
    imagenes: [
      {
        idImagenVehiculo: 'img-5-1',
        idVehiculo: 'veh-5',
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
        orden: 1,
      },
    ],
  },
  {
    idVehiculo: 'veh-6',
    idUsuarioPropietario: 'user-4',
    patente: 'AF 781 QW',
    marca: 'Chevrolet',
    modelo: 'Cruze LTZ',
    anio: 2023,
    color: 'Bordeaux',
    cantidadAsientos: 5,
    tipoVehiculo: 'Sedán',
    imagenes: [
      {
        idImagenVehiculo: 'img-6-1',
        idVehiculo: 'veh-6',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
        orden: 1,
      },
    ],
  },
];

const hoy = hoyString();

export const INITIAL_PUBLICATIONS: Publicacion[] = [
  // Publication for veh-1 (Mariano's Corolla) - ACTIVA
  {
    idPublicacion: 'pub-1',
    idVehiculo: 'veh-1',
    idUbicacion: 'loc-1',
    precioDia: 75000,
    descuentoPorcentaje: 10,
    descripcion:
      'Vehículo sedán en óptimas condiciones mecánicas y de limpieza. Ideal para viajes ejecutivos o escapadas familiares de fin de semana.',
    horaRetiroDevolucion: '10:00',
    estado: 'ACTIVA',
  },
  // Publication for veh-2 (Mariano's Taos) - PAUSADA
  {
    idPublicacion: 'pub-2',
    idVehiculo: 'veh-2',
    idUbicacion: 'loc-2',
    precioDia: 98000,
    descuentoPorcentaje: 15,
    descripcion:
      'SUV espaciosa y confortable. Cuenta con baúl amplio y excelente andar en ruta y autopista.',
    horaRetiroDevolucion: '11:00',
    estado: 'PAUSADA',
  },
  // Publication for veh-4 (Ranger) - ACTIVA
  {
    idPublicacion: 'pub-4',
    idVehiculo: 'veh-4',
    idUbicacion: 'loc-3',
    precioDia: 120000,
    descuentoPorcentaje: 5,
    descripcion:
      'Pickup doble cabina con tracción 4x4. Gran capacidad de carga y confort de marcha para trayectos largos.',
    horaRetiroDevolucion: '09:00',
    estado: 'ACTIVA',
  },
  // Publication for veh-5 (Renegade) - ACTIVA
  {
    idPublicacion: 'pub-5',
    idVehiculo: 'veh-5',
    idUbicacion: 'loc-4',
    precioDia: 82000,
    descuentoPorcentaje: 0,
    descripcion:
      'Vehículo ágil para ciudad y cómodo para autopista. Consumo eficiente y excelente maniobrabilidad.',
    horaRetiroDevolucion: '10:30',
    estado: 'ACTIVA',
  },
  // Publication for veh-6 (Cruze) - ACTIVA
  {
    idPublicacion: 'pub-6',
    idVehiculo: 'veh-6',
    idUbicacion: 'loc-5',
    precioDia: 70000,
    descuentoPorcentaje: 8,
    descripcion:
      'Sedán con motor turbo eficiente. Muy espacioso y equipado para viajes por ruta.',
    horaRetiroDevolucion: '10:00',
    estado: 'ACTIVA',
  },
  // Historical deactivated publication for veh-1 - DESACTIVADA
  {
    idPublicacion: 'pub-old-1',
    idVehiculo: 'veh-1',
    idUbicacion: 'loc-1',
    precioDia: 62000,
    descuentoPorcentaje: 0,
    descripcion:
      'Publicación histórica anterior correspondiente a temporada 2023.',
    horaRetiroDevolucion: '10:00',
    estado: 'DESACTIVADA',
  },
];

export const INITIAL_AVAILABILITIES: Disponibilidad[] = [
  // Availabilities for pub-1
  {
    idDisponibilidad: 'disp-1',
    idPublicacion: 'pub-1',
    fechaInicio: hoy,
    fechaFin: sumarDias(hoy, 20),
  },
  {
    idDisponibilidad: 'disp-2',
    idPublicacion: 'pub-1',
    fechaInicio: sumarDias(hoy, 25),
    fechaFin: sumarDias(hoy, 45),
  },
  // Availabilities for pub-2
  {
    idDisponibilidad: 'disp-3',
    idPublicacion: 'pub-2',
    fechaInicio: sumarDias(hoy, 5),
    fechaFin: sumarDias(hoy, 30),
  },
  // Availabilities for pub-4
  {
    idDisponibilidad: 'disp-4',
    idPublicacion: 'pub-4',
    fechaInicio: hoy,
    fechaFin: sumarDias(hoy, 35),
  },
  // Availabilities for pub-5
  {
    idDisponibilidad: 'disp-5',
    idPublicacion: 'pub-5',
    fechaInicio: hoy,
    fechaFin: sumarDias(hoy, 28),
  },
  // Availabilities for pub-6
  {
    idDisponibilidad: 'disp-6',
    idPublicacion: 'pub-6',
    fechaInicio: hoy,
    fechaFin: sumarDias(hoy, 40),
  },
];

export const INITIAL_PAYMENTS: Pago[] = [
  {
    idPago: 'pago-101',
    idReserva: 'res-101',
    metodoPago: 'MERCADO_PAGO',
    estado: 'APROBADO',
    total: 228000,
    preferenceId: 'MP-PREF-908123',
    fechaCreacion: sumarDias(hoy, -10),
  },
  {
    idPago: 'pago-102',
    idReserva: 'res-102',
    metodoPago: 'EFECTIVO',
    estado: 'PENDIENTE',
    total: 164000,
    fechaCreacion: sumarDias(hoy, -1),
  },
  {
    idPago: 'pago-103',
    idReserva: 'res-103',
    metodoPago: 'EFECTIVO',
    estado: 'PENDIENTE',
    total: 342000,
    fechaCreacion: hoy,
  },
];

export const INITIAL_RESERVATIONS: Reserva[] = [
  {
    idReserva: 'res-101',
    idUsuario: 'user-1',
    idPublicacion: 'pub-4',
    fechaInicio: sumarDias(hoy, 10),
    fechaFin: sumarDias(hoy, 12),
    estado: 'CONFIRMADA',
    fechaCreacion: sumarDias(hoy, -10),
    total: 228000,
  },
  {
    idReserva: 'res-102',
    idUsuario: 'user-1',
    idPublicacion: 'pub-5',
    fechaInicio: sumarDias(hoy, 15),
    fechaFin: sumarDias(hoy, 17),
    estado: 'PENDIENTE',
    fechaCreacion: sumarDias(hoy, -1),
    total: 164000,
  },
  {
    idReserva: 'res-103',
    idUsuario: 'user-2',
    idPublicacion: 'pub-1',
    fechaInicio: sumarDias(hoy, 14),
    fechaFin: sumarDias(hoy, 19),
    estado: 'PENDIENTE',
    fechaCreacion: hoy,
    total: 342000,
  },
];
