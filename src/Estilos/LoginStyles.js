// src/Estilos/LoginStyles.js
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  width: 900px;
  background-color: #fff;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const LeftSide = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    order: 2;
    padding: 20px;
  }
`;

export const RightSide = styled.div`
  flex: 1;
  background-color:rgb(255, 255, 255); /* Ejemplo de color lapis-lazuli */
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow: hidden; /* Para evitar que la imagen se desborde */

  @media (max-width: 768px) {
    order: 1;
    padding: 120px;

    img {
      width: 100%; /* La imagen ocupará todo el ancho del contenedor */
      height: auto; /* Mantiene la relación de aspecto */
      object-fit: cover; /* Asegura que la imagen cubra todo el espacio manteniendo su relación de aspecto */
    }
  }

  img {
    width: 100%; /* La imagen ocupará todo el ancho del contenedor */
    height: 100%; /* La imagen ocupará todo el alto del contenedor */
    object-fit: cover; /* Asegura que la imagen cubra todo el espacio manteniendo su relación de aspecto */
    border-radius: 8px; /* Opcional: si quieres bordes redondeados */
  }
`;

export const Title = styled.h1`
  margin-bottom: 10px;
  font-size: 24px;
`;

export const Subtitle = styled.p`
  margin-bottom: 30px;
  font-size: 16px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    font-weight: bold;
  }

  input[type="email"],
  input[type="password"],
  input[type="text"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #2e86c1;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #1f618d;
  }
`;

export const SecondaryButton = styled.button`
  background: none;
  color: #2e86c1;
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  input[type="checkbox"] {
    margin-right: 5px;
  }

  a {
    color: #2e86c1;
    text-decoration: none;
    font-size: 0.9rem;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RoleSelect = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
