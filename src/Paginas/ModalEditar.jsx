import React, { useState } from "react";
import "./Modal.css";

const ModalEditar = ({ residuo, cerrarModal }) => {
  const [cantidad, setCantidad] = useState(residuo.cantidad);
  const [precio, setPrecio] = useState(residuo.precio);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Residuo</h2>
        <label>Cantidad:</label>
        <input type="text" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />

        <label>Precio:</label>
        <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} />

        <div className="modal-actions">
          <button className="btn-guardar">Guardar Cambios</button>
          <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditar;
