// src/Componentes/RegistroPage1.jsx
import React from "react";

const RegistroPage1 = ({ nombre, setNombre, telefono, setTelefono, pais, setPais, estado, setEstado, ciudad, setCiudad }) => {
  return (
    <>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <label htmlFor="telefono">Teléfono</label>
      <input id="telefono" type="text" placeholder="+52..." value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

      <label htmlFor="pais">País</label>
      <input id="pais" type="text" placeholder="Ej: México" value={pais} onChange={(e) => setPais(e.target.value)} required />

      <label htmlFor="estado">Estado</label>
      <input id="estado" type="text" placeholder="Ej: Jalisco" value={estado} onChange={(e) => setEstado(e.target.value)} required />

      <label htmlFor="ciudad">Ciudad</label>
      <input id="ciudad" type="text" placeholder="Ej: Guadalajara" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
    </>
  );
};

export default RegistroPage1;
