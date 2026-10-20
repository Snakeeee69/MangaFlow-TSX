import { Link } from 'react-router-dom';

interface AccesoRequeridoProps {
  titulo: string;
  descripcion: string;
}

export const AccesoRequerido = ({ titulo, descripcion }: AccesoRequeridoProps) => (
  <main className="container access-required-page d-flex align-items-center justify-content-center text-center py-5">
    <section className="access-required-card card-panel p-4 p-md-5">
      <i className="fa-solid fa-lock access-required-icon mb-3" aria-hidden="true" />
      <h1 className="text-white fw-bold fs-3 mb-2">{titulo}</h1>
      <p className="text-secondary mb-4">{descripcion}</p>
      <Link className="btn-magenta d-inline-block" to="/login">
        <i className="fa-solid fa-right-to-bracket me-2" aria-hidden="true" />
        Iniciar sesión
      </Link>
      <p className="text-secondary small mt-3 mb-0">
        También puedes continuar como invitado, pero esta sección seguirá bloqueada.
      </p>
    </section>
  </main>
);
