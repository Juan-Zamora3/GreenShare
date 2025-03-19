import React, { useState } from "react";
import "./Modal.css";

const ModalPublicar = ({ cerrarModal }) => {
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Publicar Nuevo Residuo</h2>
        <label>Tipo de Residuo:</label>
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} />

        <label>Cantidad (kg, ton, etc.):</label>
        <input type="text" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />

        <label>Precio Tentativo:</label>
        <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} />

        <div className="modal-actions">
          <button className="btn-guardar">Publicar</button>
          <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalPublicar;
