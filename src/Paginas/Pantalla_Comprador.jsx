// src/Paginas/Pantalla_Comprador.jsx
import React from "react";
import styled from "styled-components";

const Pantalla_Comprador = () => {
  return (
    <Container>
      <h1>Pantalla de Comprador</h1>
      <p>Aquí podrás ver y comprar residuos disponibles.</p>
      <p>Puedes gestionar tus métodos de pago, historial de compras, etc.</p>
      {/* ... más contenido según tu lógica */}
    </Container>
  );
};

export default Pantalla_Comprador;

const Container = styled.div`
  padding: 20px;
`;
