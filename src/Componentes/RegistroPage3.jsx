// src/Componentes/RegistroPage3.jsx
import React from "react";

const RegistroPage3 = ({ carAnio, setCarAnio, carNumeroSerie, setCarNumeroSerie, carPlaca, setCarPlaca, carFoto, handleCarFotoChange }) => {
  return (
    <>
      <label htmlFor="carAnio">Año</label>
      <input id="carAnio" type="number" placeholder="Año" value={carAnio} onChange={(e) => setCarAnio(e.target.value)} required />

      <label htmlFor="carNumeroSerie">Número de Serie</label>
      <input id="carNumeroSerie" type="text" placeholder="Número de Serie" value={carNumeroSerie} onChange={(e) => setCarNumeroSerie(e.target.value)} required />

      <label htmlFor="carPlaca">Placa</label>
      <input id="carPlaca" type="text" placeholder="Placa" value={carPlaca} onChange={(e) => setCarPlaca(e.target.value)} required />

      <label htmlFor="carFoto">Foto del Carro</label>
      <input id="carFoto" type="file" accept="image/*" onChange={handleCarFotoChange} required />
    </>
  );
};

export default RegistroPage3;
