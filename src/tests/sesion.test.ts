import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cargarPerfilUsuario,
  cargarSesion,
  esAdminSesion,
  esTrabajadorSesion,
  guardarSesion,
  puntosDeSesion,
  rolPorCorreo,
  type SesionUsuario,
} from '../data/sesion';

describe('sesion y roles', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reconoce al administrador ignorando espacios y mayúsculas', () => {
    expect(rolPorCorreo('  ADMIN@MANGAFLOW.CL ')).toBe('admin');
  });

  it('reconoce al personal con el dominio interno de trabajadores', () => {
    expect(rolPorCorreo('staff@mangaflow.com')).toBe('staff');
  });

  it('asigna el rol de usuario a correos normales', () => {
    expect(rolPorCorreo('lector@gmail.com')).toBe('user');
  });

  it('solo permite el panel de admin a una sesión de administrador autenticada', () => {
    expect(esAdminSesion({ email: 'admin@mangaflow.cl' })).toBe(true);
    expect(esAdminSesion({ email: 'staff@mangaflow.com' })).toBe(false);
    expect(esAdminSesion({ email: 'admin@mangaflow.cl', isGuest: true })).toBe(false);
  });

  it('solo permite el panel de personal a una sesión del dominio correspondiente', () => {
    expect(esTrabajadorSesion({ email: 'staff@mangaflow.com' })).toBe(true);
    expect(esTrabajadorSesion({ email: 'lector@gmail.com' })).toBe(false);
    expect(esTrabajadorSesion({ email: 'staff@mangaflow.com', isGuest: true })).toBe(false);
  });

  it('lee primero los puntos y usa el alias antiguo si hace falta', () => {
    expect(puntosDeSesion({ puntos: 120, points: 80 })).toBe(120);
    expect(puntosDeSesion({ points: 80 })).toBe(80);
  });

  it('normaliza saldos negativos o no numéricos a cero', () => {
    expect(puntosDeSesion({ puntos: -10 })).toBe(0);
    expect(puntosDeSesion({ points: Number.NaN })).toBe(0);
    expect(puntosDeSesion(null)).toBe(0);
  });

  it('guarda perfiles con correo en minúsculas y recupera sus datos', () => {
    const perfil: SesionUsuario = { email: 'Lector@GMAIL.COM', nombre: 'Lector', puntos: 250 };
    guardarSesion(perfil);

    expect(cargarPerfilUsuario(' lector@gmail.com ')).toMatchObject(perfil);
  });

  it('guarda alias de sesión y emite eventos de actualización', () => {
    const metricas = vi.fn();
    const pedidos = vi.fn();
    window.addEventListener('mangaflow:metricas-actualizadas', metricas);
    window.addEventListener('mangaflow:pedidos-actualizados', pedidos);

    guardarSesion({ email: 'lector@gmail.com', nombre: 'Lector' });

    expect(localStorage.getItem('mangaFlow_session')).not.toBeNull();
    expect(localStorage.getItem('activeUser')).not.toBeNull();
    expect(metricas).toHaveBeenCalledOnce();
    expect(pedidos).toHaveBeenCalledOnce();
    window.removeEventListener('mangaflow:metricas-actualizadas', metricas);
    window.removeEventListener('mangaflow:pedidos-actualizados', pedidos);
  });

  it('combina el perfil persistido con la sesión activa', () => {
    localStorage.setItem('mangaFlow_usuario_lector@gmail.com', JSON.stringify({
      email: 'lector@gmail.com',
      nombre: 'Nombre guardado',
      puntos: 400,
    }));
    localStorage.setItem('mangaFlow_session', JSON.stringify({
      email: 'lector@gmail.com',
      nombre: 'Nombre actual',
    }));

    expect(cargarSesion()).toMatchObject({
      email: 'lector@gmail.com',
      nombre: 'Nombre actual',
      puntos: 400,
    });
  });

  it('devuelve null si no hay una sesión guardada', () => {
    expect(cargarSesion()).toBeNull();
  });
});
