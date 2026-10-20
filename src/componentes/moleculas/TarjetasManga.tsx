import { type MangaItem } from '../../data/mangaMock';
import { BotonCarrito } from '../atomos/BotonCarritos';

interface TarjetaMangaProps {
  manga: MangaItem;
  esNovedad?: boolean;
  alAgregarAlCarrito: (id: number) => void;
}

export const TarjetaManga = ({ manga, esNovedad = false, alAgregarAlCarrito }: TarjetaMangaProps) => {
  const alturaImagen = esNovedad ? '220px' : '260px';

  return (
    <div className={`product-card h-100 d-flex flex-column justify-content-between ${esNovedad ? 'p-2' : 'p-3'}`}>
      <a href={`#/detalle-manga/${manga.id}`} className="product-link">
        <img 
          src={manga.imagen} 
          alt={manga.titulo} 
          className="product-cover rounded-3 mb-2"
          style={{ height: alturaImagen }}
        />
        <span className="product-demography">
          {manga.demografia}
        </span>
        <h3 className="product-title mb-1">{manga.titulo}</h3>
      </a>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className={`product-price ${esNovedad ? 'small' : 'fs-5'}`}>
          ${manga.precio.toLocaleString("es-CL")}
        </span>
        <BotonCarrito 
          esChico={esNovedad} 
          onClick={() => alAgregarAlCarrito(manga.id)} 
        />
      </div>
    </div>
  );
};
