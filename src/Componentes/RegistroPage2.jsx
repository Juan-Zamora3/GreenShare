// src/Componentes/RegistroPage2.jsx
import React from "react";

const RegistroPage2 = ({ razonSocial, setRazonSocial, nombreEmpresa, setNombreEmpresa, rfc, setRfc, carModelo, setCarModelo, carMarca, setCarMarca }) => {
  return (
    <>
      <label htmlFor="razonSocial">Razón Social</label>
      <input id="razonSocial" type="text" placeholder="Razón Social" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} required />

      <label htmlFor="nombreEmpresa">Nombre de la Empresa</label>
      <input id="nombreEmpresa" type="text" placeholder="Nombre de la Empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required />

      <label htmlFor="rfc">RFC</label>
      <input id="rfc" type="text" placeholder="RFC" value={rfc} onChange={(e) => setRfc(e.target.value)} required />

      <label htmlFor="carModelo">Modelo del Carro</label>
      <input id="carModelo" type="text" placeholder="Modelo del Carro" value={carModelo} onChange={(e) => setCarModelo(e.target.value)} required />

      <label htmlFor="carMarca">Marca del Carro</label>
      <input id="carMarca" type="text" placeholder="Marca del Carro" value={carMarca} onChange={(e) => setCarMarca(e.target.value)} required />
    </>
  );
};

export default RegistroPage2;
