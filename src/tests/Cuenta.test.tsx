import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Cuenta } from '../paginas/Cuenta';
import { mangasCatalogo } from '../data/catalogo';

afterEach(cleanup);

describe('Mi cuenta', () => {
  it('permite quitar una obra de deseos y notifica el perfil actualizado', () => {
    const alActualizarSesion = vi.fn();
    const manga = mangasCatalogo[0];
    const sesion = { email: 'lector@gmail.com', wishlist: [manga.id] };
    render(
      <MemoryRouter>
        <Cuenta sesion={sesion} mangas={mangasCatalogo} alActualizarSesion={alActualizarSesion} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(alActualizarSesion).toHaveBeenCalledWith(expect.objectContaining({ wishlist: [] }));
  });
});
