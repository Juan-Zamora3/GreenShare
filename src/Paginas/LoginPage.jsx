// src/Paginas/LoginPage.jsx
import React, { useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../firebaseConfig";

// Importar estilos de Login
import {
  Container,
  Card,
  LeftSide,
  RightSide,
  Title,
  Subtitle,
  Form,
  ButtonContainer,
  Button,
  SecondaryButton,
  RememberMeContainer,
  RoleSelect,
} from "../Estilos/LoginStyles";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("comprador"); // Rol por defecto
  const [remember, setRemember] = useState(false);

  // Campos generales para todos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");

  // Campos específicos para Vendedor
  const [razonSocial, setRazonSocial] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [rfc, setRfc] = useState("");

  // Campos específicos para Repartidor
  const [carModelo, setCarModelo] = useState("");
  const [carMarca, setCarMarca] = useState("");
  const [carAnio, setCarAnio] = useState("");
  const [carNumeroSerie, setCarNumeroSerie] = useState("");
  const [carPlaca, setCarPlaca] = useState("");
  const [carFoto, setCarFoto] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegister(!isRegister);
  };

  // Función para convertir la imagen seleccionada en un URL base64
  const handleCarFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCarFoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Registro de usuario sin Firebase Auth.
   * Se crea un documento en la colección correspondiente
   * según el rol, validando los campos.
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación: que la contraseña y confirmar contraseña coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Determinar la colección a usar según el rol
      let collectionName = "";
      if (role === "comprador") {
        collectionName = "compradores";
      } else if (role === "vendedor") {
        collectionName = "vendedores";
      } else if (role === "repartidor") {
        collectionName = "repartidores";
      }

      // Construir el objeto con los campos generales
      let docData = {
        id: `${role}_${Date.now()}`,
        correo: email,
        password: password, // Guardar en texto plano NO es seguro para producción
        nombre,
        telefono,
        pais,
        estado,
        ciudad,
        fecha_creacion: serverTimestamp(),
      };

      // Agregar campos específicos según el rol
      if (role === "comprador") {
        docData.historial_compras = [];
        docData.favoritos = [];
      } else if (role === "vendedor") {
        docData.razon_social = razonSocial;
        docData.nombre_empresa = nombreEmpresa;
        docData.rfc = rfc;
        docData.historial_ventas = [];
        docData.reputacion = {
          calificacion_promedio: 0,
          comentarios: [],
        };
      } else if (role === "repartidor") {
        docData.car_modelo = carModelo;
        docData.car_marca = carMarca;
        docData.car_anio = carAnio;
        docData.car_numero_serie = carNumeroSerie;
        docData.car_placa = carPlaca;
        docData.car_foto = carFoto;
        docData.historial_entregas = [];
        docData.rutas_disponibles = [];
        docData.reputacion = {
          calificacion_promedio: 0,
          comentarios: [],
        };
      }

      // Crear el documento en Firestore
      await addDoc(collection(db, collectionName), docData);

      alert("Registro exitoso. Redirigiendo a tu pantalla...");
      if (role === "comprador") {
        navigate("/comprador");
      } else if (role === "vendedor") {
        navigate("/vendedor");
      } else {
        navigate("/repartidor");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error al registrar: " + error.message);
    }
  };

  /**
   * Login de usuario sin Firebase Auth.
   * Se busca en cada colección un documento que coincida
   * con el correo y la contraseña.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let q = query(
        collection(db, "compradores"),
        where("correo", "==", email),
        where("password", "==", password)
      );
      let snap = await getDocs(q);
      if (!snap.empty) {
        alert("Login exitoso (Comprador). Redirigiendo...");
        navigate("/comprador");
        return;
      }
      q = query(
        collection(db, "vendedores"),
        where("correo", "==", email),
        where("password", "==", password)
      );
      snap = await getDocs(q);
      if (!snap.empty) {
        alert("Login exitoso (Vendedor). Redirigiendo...");
        navigate("/vendedor");
        return;
      }
      q = query(
        collection(db, "repartidores"),
        where("correo", "==", email),
        where("password", "==", password)
      );
      snap = await getDocs(q);
      if (!snap.empty) {
        alert("Login exitoso (Repartidor). Redirigiendo...");
        navigate("/repartidor");
        return;
      }
      alert("Usuario no encontrado o credenciales inválidas.");
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <Container>
      <Card>
        {/* Lado derecho: branding/imagen */}
        <RightSide>
          <Title>GreenShare</Title>
          <Subtitle>
            Soluciones sostenibles <br /> para compra y transporte de residuos
          </Subtitle>
        </RightSide>
        {/* Lado izquierdo: formulario */}
        <LeftSide>
          <Title>{isRegister ? "Registrarse" : "Iniciar Sesión"}</Title>
          <Form onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && (
              <>
                {/* Campos generales de registro */}
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
                <label htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="text"
                  placeholder="+52..."
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
                <label htmlFor="pais">País</label>
                <input
                  id="pais"
                  type="text"
                  placeholder="Ej: México"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                />
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  type="text"
                  placeholder="Ej: Jalisco"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                />
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  placeholder="Ej: Guadalajara"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                />
              </>
            )}
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="correo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isRegister && (
              <>
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}
            {isRegister && (
              <>
                <label htmlFor="role">Registrarse como:</label>
                <RoleSelect
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="comprador">Comprador</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="repartidor">Repartidor</option>
                </RoleSelect>
              </>
            )}
            {/* Campos específicos para Vendedor */}
            {isRegister && role === "vendedor" && (
              <>
                <label htmlFor="razonSocial">Razón Social</label>
                <input
                  id="razonSocial"
                  type="text"
                  placeholder="Razón Social"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  required
                />
                <label htmlFor="nombreEmpresa">Nombre de la Empresa</label>
                <input
                  id="nombreEmpresa"
                  type="text"
                  placeholder="Nombre de la Empresa"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  required
                />
                <label htmlFor="rfc">RFC</label>
                <input
                  id="rfc"
                  type="text"
                  placeholder="RFC"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value)}
                  required
                />
              </>
            )}
            {/* Campos específicos para Repartidor */}
            {isRegister && role === "repartidor" && (
              <>
                <label htmlFor="carModelo">Modelo del Carro</label>
                <input
                  id="carModelo"
                  type="text"
                  placeholder="Modelo del Carro"
                  value={carModelo}
                  onChange={(e) => setCarModelo(e.target.value)}
                  required
                />
                <label htmlFor="carMarca">Marca del Carro</label>
                <input
                  id="carMarca"
                  type="text"
                  placeholder="Marca del Carro"
                  value={carMarca}
                  onChange={(e) => setCarMarca(e.target.value)}
                  required
                />
                <label htmlFor="carAnio">Año</label>
                <input
                  id="carAnio"
                  type="number"
                  placeholder="Año"
                  value={carAnio}
                  onChange={(e) => setCarAnio(e.target.value)}
                  required
                />
                <label htmlFor="carNumeroSerie">Número de Serie</label>
                <input
                  id="carNumeroSerie"
                  type="text"
                  placeholder="Número de Serie"
                  value={carNumeroSerie}
                  onChange={(e) => setCarNumeroSerie(e.target.value)}
                  required
                />
                <label htmlFor="carPlaca">Placa</label>
                <input
                  id="carPlaca"
                  type="text"
                  placeholder="Placa"
                  value={carPlaca}
                  onChange={(e) => setCarPlaca(e.target.value)}
                  required
                />
                <label htmlFor="carFoto">Foto del Carro</label>
                <input
                  id="carFoto"
                  type="file"
                  accept="image/*"
                  onChange={handleCarFotoChange}
                  required
                />
              </>
            )}
            <RememberMeContainer>
              <div>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">Recuérdame</label>
              </div>
              <a href="#">¿Olvidaste tu contraseña?</a>
            </RememberMeContainer>
            <ButtonContainer>
              <Button type="submit">
                {isRegister ? "Registrarse" : "Iniciar Sesión"}
              </Button>
              <SecondaryButton type="button" onClick={toggleMode}>
                {isRegister ? "Ya tengo una cuenta" : "Crear una cuenta nueva"}
              </SecondaryButton>
            </ButtonContainer>
          </Form>
        </LeftSide>
      </Card>
    </Container>
  );
};

export default LoginPage;