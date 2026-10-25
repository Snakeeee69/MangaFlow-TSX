import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Contacto } from '../paginas/Contacto';

afterEach(cleanup);

describe('Contacto', () => {
  it('incluye los enlaces al mapa y a las recompensas', () => {
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>,
    );

    const enlaceMapa = screen.getByRole('link', { name: /Ver ubicación en el mapa/ });
    expect(enlaceMapa.getAttribute('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Eurocentro%2C+Ahumada+85%2C+Santiago%2C+Chile',
    );
    expect(enlaceMapa.getAttribute('target')).toBe('_blank');
    expect(enlaceMapa.getAttribute('rel')).toBe('noreferrer');
    expect(screen.getByRole('link', { name: /Ver recompensas/ }).getAttribute('href')).toBe('/puntos');
  });
});
