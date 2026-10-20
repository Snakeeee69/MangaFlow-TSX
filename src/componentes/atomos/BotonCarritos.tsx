interface BotonCarritoProps {
  onClick: () => void;
  esChico?: boolean;
}

export const BotonCarrito = ({ onClick, esChico = false }: BotonCarritoProps) => {
  return (
    <button 
      className={`btn-add-cart ${esChico ? '' : 'px-3 py-2'}`}
      onClick={onClick}
      type="button"
      aria-label="Agregar manga al carrito"
    >
      <i className={`fa-solid fa-cart-plus ${!esChico && 'me-1'}`}></i>
      {!esChico && ' Agregar'}
    </button>
  );
};
