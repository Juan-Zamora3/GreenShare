// src/Componentes/LoginForm.jsx
import React, { useState } from "react";
import {
  Form,
  ButtonContainer,
  Button,
  SecondaryButton,
  RememberMeContainer,
} from "../Estilos/LoginStyles";
import PaginationControl from "./PaginationControl";
import RegistroPage1 from "./RegistroPage1";
import RegistroPage2 from "./RegistroPage2";
import RegistroPage3 from "./RegistroPage3";

const totalPages = 3;

const LoginForm = ({
  isRegister,
  toggleMode,
  handleRegister,
  handleLogin,
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Form onSubmit={isRegister ? handleRegister : handleLogin}>
      {isRegister && currentPage === 1 && <RegistroPage1 {...props} />}
      {isRegister && currentPage === 2 && <RegistroPage2 {...props} />}
      {isRegister && currentPage === 3 && <RegistroPage3 {...props} />}

      {!isRegister && (
        <>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            placeholder="correo@example.com"
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
            required
          />
        </>
      )}

      {isRegister && (
        <RememberMeContainer>
          <div>
            <input
              type="checkbox"
              id="remember"
              checked={props.remember}
              onChange={(e) => props.setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Recuérdame</label>
          </div>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </RememberMeContainer>
      )}

      {isRegister && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      )}

      <ButtonContainer>
        <Button type="submit">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </Button>
        <SecondaryButton type="button" onClick={toggleMode}>
          {isRegister ? "Ya tengo una cuenta" : "Crear una cuenta nueva"}
        </SecondaryButton>
      </ButtonContainer>
    </Form>
  );
};

export default LoginForm;
