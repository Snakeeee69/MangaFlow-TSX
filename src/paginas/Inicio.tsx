import { novedades, populares } from '../data/mangaMock';
import { CarruselDestacados } from '../componentes/organismos/CarruselDestacados';
import { SeccionEditoriales } from '../componentes/organismos/SeccionEditoriales';
import { SeccionGrid } from '../componentes/organismos/SeccionGrid';

interface InicioProps {
  alAgregarAlCarrito: (id: number) => void;
}

export const Inicio = ({ alAgregarAlCarrito }: InicioProps) => {
  return (
    <div className="min-vh-100">
      <main className="container py-4 py-lg-5">
        <CarruselDestacados />
        <SeccionGrid 
          tituloSeccion="Novedades" 
          mangas={novedades} 
          esNovedad={true} 
          alAgregarAlCarrito={alAgregarAlCarrito}
        />
        
        <SeccionGrid 
          tituloSeccion="Más Populares" 
          mangas={populares} 
          esNovedad={false} 
          alAgregarAlCarrito={alAgregarAlCarrito}
        />
        <SeccionEditoriales />
      </main>
    </div>
  );
};
