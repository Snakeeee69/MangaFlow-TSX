import { novedades, populares } from '../data/mangaMock';
import type { CarritoItem } from '../data/carrito';
import { esMangaActivo, slugManga, type MangaCatalogo } from '../data/catalogo';
import { CarruselDestacados } from '../componentes/organismos/CarruselDestacados';
import { SeccionEditoriales } from '../componentes/organismos/SeccionEditoriales';
import { SeccionGrid } from '../componentes/organismos/SeccionGrid';

interface InicioProps {
  mangasCatalogo: MangaCatalogo[];
  listaDeseos: number[];
  alCambiarFavorito: (id: number) => void;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const Inicio = ({
  mangasCatalogo,
  listaDeseos,
  alCambiarFavorito,
  alAgregarAlCarrito,
}: InicioProps) => {
  const visiblesEnInicio = (titulo: string) => mangasCatalogo.some(manga => (
    esMangaActivo(manga) && slugManga(manga.titulo) === slugManga(titulo)
  ));

  return (
    <div className="min-vh-100">
      <main className="container py-4 py-lg-5">
        <CarruselDestacados mangas={mangasCatalogo} />
        <SeccionGrid 
          tituloSeccion="Novedades" 
          mangas={novedades.filter(manga => visiblesEnInicio(manga.titulo))} 
          catalogo={mangasCatalogo}
          listaDeseos={listaDeseos}
          alCambiarFavorito={alCambiarFavorito}
          esNovedad={true} 
          alAgregarAlCarrito={alAgregarAlCarrito}
        />
        
        <SeccionGrid 
          tituloSeccion="Más Populares" 
          mangas={populares.filter(manga => visiblesEnInicio(manga.titulo))} 
          catalogo={mangasCatalogo}
          listaDeseos={listaDeseos}
          alCambiarFavorito={alCambiarFavorito}
          esNovedad={false} 
          alAgregarAlCarrito={alAgregarAlCarrito}
        />
        <SeccionEditoriales />
      </main>
    </div>
  );
};
