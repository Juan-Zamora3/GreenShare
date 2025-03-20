// src/Paginas/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Importamos nuestros componentes separados
import BrandingSide from "../Componentes/BrandingSide";
import LoginForm from "../Componentes/LoginForm";

// Importar estilos
import {
  Container,
  Card,
  LeftSide,
} from "../Estilos/LoginStyles";

import { db } from "../firebaseConfig";

const LoginPage = () => {
  // Estados generales
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("comprador");
  const [remember, setRemember] = useState(false);

  // Campos generales
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

  // Alterna entre modo registro y modo login
  const toggleMode = () => {
    setIsRegister(!isRegister);
  };

  // Convierte la imagen seleccionada a base64
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
   * Registro de usuario (sin Firebase Auth).
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      let collectionName = "";
      if (role === "comprador") {
        collectionName = "compradores";
      } else if (role === "vendedor") {
        collectionName = "vendedores";
      } else if (role === "repartidor") {
        collectionName = "repartidores";
      }

      let docData = {
        id: `${role}_${Date.now()}`,
        correo: email,
        password, // Guardar en texto plano no es seguro, solo demo
        nombre,
        telefono,
        pais,
        estado,
        ciudad,
        fecha_creacion: serverTimestamp(),
      };

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
   * Login de usuario (sin Firebase Auth).
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1) Buscar en compradores
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

      // 2) Buscar en vendedores
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

      // 3) Buscar en repartidores
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

      // Si llega hasta aquí, no se encontró
      alert("Usuario no encontrado o credenciales inválidas.");
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <Container>
      <Card>
        {/* Sección de branding (derecha) */}
        <BrandingSide />

        {/* Sección de formulario (izquierda) */}
        <LeftSide>
          <LoginForm
            isRegister={isRegister}
            toggleMode={toggleMode}
            role={role}
            setRole={setRole}
            remember={remember}
            setRemember={setRemember}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            nombre={nombre}
            setNombre={setNombre}
            telefono={telefono}
            setTelefono={setTelefono}
            pais={pais}
            setPais={setPais}
            estado={estado}
            setEstado={setEstado}
            ciudad={ciudad}
            setCiudad={setCiudad}
            razonSocial={razonSocial}
            setRazonSocial={setRazonSocial}
            nombreEmpresa={nombreEmpresa}
            setNombreEmpresa={setNombreEmpresa}
            rfc={rfc}
            setRfc={setRfc}
            carModelo={carModelo}
            setCarModelo={setCarModelo}
            carMarca={carMarca}
            setCarMarca={setCarMarca}
            carAnio={carAnio}
            setCarAnio={setCarAnio}
            carNumeroSerie={carNumeroSerie}
            setCarNumeroSerie={setCarNumeroSerie}
            carPlaca={carPlaca}
            setCarPlaca={setCarPlaca}
            handleCarFotoChange={handleCarFotoChange}
            handleRegister={handleRegister}
            handleLogin={handleLogin}
          />
        </LeftSide>
      </Card>
    </Container>
  );
};

export default LoginPage;
