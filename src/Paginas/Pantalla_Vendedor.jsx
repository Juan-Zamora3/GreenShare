import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./Pantalla_Vendedor.css";
import logo from "../assets/GreenShare.png";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";

// Función que simula la sugerencia de precio por IA
const generarPrecioSugeridoIA = () => (Math.random() * 90 + 10).toFixed(2);

const PantallaVendedor = () => {
  const [currentVendor, setCurrentVendor] = useState(null);
  const [residuos, setResiduos] = useState([]);
  // Panel activo: "dashboard", "publicar", "residuos", "ventas", "chats"
  const [activePanel, setActivePanel] = useState("dashboard");

  // Estados para la pantalla de Publicar Residuo
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [precioTentativo, setPrecioTentativo] = useState("");
  const [rfc, setRfc] = useState("");
  const [lugarOrigen, setLugarOrigen] = useState("");
  const [imagenBase64, setImagenBase64] = useState("");

  // Estado para transacciones (ventas) simuladas
  const [ventas, setVentas] = useState([
    { id: 1, comprador: "Cliente A", residuo: "Plástico PET", cantidad: "10 kg", fecha: "2025-03-18", estado: "En proceso" },
    { id: 2, comprador: "Cliente B", residuo: "Cartón", cantidad: "20 kg", fecha: "2025-03-17", estado: "Completado" },
    { id: 3, comprador: "Cliente C", residuo: "Aluminio", cantidad: "15 kg", fecha: "2025-03-16", estado: "Cancelado" },
    { id: 4, comprador: "Cliente D", residuo: "Vidrio", cantidad: "5 kg", fecha: "2025-03-15", estado: "En proceso" },
  ]);

  // Datos falsos para Top Residuos Vendidos y Ingresos Estimados
  const topResiduos = [
    { id: 1, residuo: "Plástico PET", ventas: 25 },
    { id: 2, residuo: "Cartón", ventas: 18 },
    { id: 3, residuo: "Aluminio", ventas: 12 },
  ];
  const ingresosEstimados = "$3,250";

  // Estado para colapsar el sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Estados para el chat (simulados)
  const initialFakeChats = [
    { id: 1, sender: "Tú", message: "Hola, ¿cómo estás? ¿Ya revisaste mi último pedido?" },
    { id: 2, sender: "Cliente", message: "¡Hola! Sí, lo revisé y está en camino." },
    { id: 3, sender: "Tú", message: "Perfecto, muchas gracias por la actualización." },
    { id: 4, sender: "Cliente", message: "De nada, cualquier duda me avisas." },
  ];
  const [activeChat, setActiveChat] = useState(initialFakeChats);

  // Datos para la gráfica de estadísticas (ejemplo con residuos y ventas)
  const data = [
    { name: "Total Residuos", value: residuos.length },
    { name: "Activos", value: residuos.filter(r => r.estado_publicacion !== "inactivo").length },
    { name: "Inactivos", value: residuos.filter(r => r.estado_publicacion === "inactivo").length },
    { name: "Ventas Recientes", value: ventas.length },
  ];

  // -----------------------------------------------------------------
  //  Fetch del vendedor (ejemplo: con un correo específico)
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const q = query(
          collection(db, "vendedores"),
          where("correo", "==", "israel@gmail.com")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docVendedor = snapshot.docs[0];
          setCurrentVendor({ id: docVendedor.id, ...docVendedor.data() });
          setRfc(docVendedor.data().rfc || "");
        } else {
          console.warn("No se encontró el vendedor con ese correo.");
        }
      } catch (error) {
        console.error("Error al obtener vendedor:", error);
      }
    };
    fetchVendor();
  }, []);

  // -----------------------------------------------------------------
  //  Fetch de residuos publicados por el vendedor
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!currentVendor?.id) return;
    const fetchResiduos = async () => {
      try {
        const q = query(
          collection(db, "residuos"),
          where("vendedor", "==", currentVendor.id)
        );
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResiduos(lista);
      } catch (error) {
        console.error("Error al cargar residuos:", error);
      }
    };
    fetchResiduos();
  }, [currentVendor]);

  // -----------------------------------------------------------------
  //  Función para colapsar o expandir el sidebar
  // -----------------------------------------------------------------
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Funciones para cambiar de panel
  const openPanel = () => setActivePanel("dashboard");
  const openPublicarResiduo = () => setActivePanel("publicar");
  const openResiduosList = () => setActivePanel("residuos");
  const openVentas = () => setActivePanel("ventas");
  const openChats = () => setActivePanel("chats");

  // -----------------------------------------------------------------
  //  Handler para publicar un residuo
  // -----------------------------------------------------------------
  const handlePublicarResiduo = async (e) => {
    e.preventDefault();
    if (!currentVendor?.id) return;
    try {
      await addDoc(collection(db, "residuos"), {
        vendedor: currentVendor.id,
        tipo,
        descripcion,
        cantidad,
        unidad,
        precio_publicar: precioTentativo,
        rfc,
        lugar_origen: lugarOrigen,
        imagen_base64: imagenBase64,
        estado_publicacion: "pendiente",
        fecha_publicacion: serverTimestamp(),
      });
      alert("Residuo publicado correctamente. Estado: pendiente.");
      // Reinicia los campos del formulario
      setTipo("");
      setDescripcion("");
      setCantidad("");
      setUnidad("kg");
      setPrecioTentativo("");
      setLugarOrigen("");
      setImagenBase64("");
      // Cambia a la lista de residuos para ver el resultado
      openResiduosList();
    } catch (error) {
      console.error("Error al publicar residuo:", error);
      alert("Error al publicar residuo.");
    }
  };

  // Funciones stub para editar, desactivar y eliminar residuos
  const handleEditar = (residuo) => {
    alert("Editar residuo: " + residuo.tipo);
  };

  const handleDesactivar = async (id) => {
    try {
      const residuoRef = doc(db, "residuos", id);
      await updateDoc(residuoRef, { estado_publicacion: "inactivo" });
      alert("Residuo desactivado.");
    } catch (error) {
      console.error("Error al desactivar residuo:", error);
      alert("Error al desactivar residuo.");
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, "residuos", id));
      alert("Residuo eliminado.");
    } catch (error) {
      console.error("Error al eliminar residuo:", error);
      alert("Error al eliminar residuo.");
    }
  };

  return (
    <div className="vendor-dashboard">
      <header className="vendor-header">
        <div className="header-left">
          <img src={logo} alt="GreenShare" className="header-logo" />
          <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
          <h2>Vendedor</h2>
        </div>
        <div className="header-right">
          {currentVendor ? (
            <span>Bienvenido: {currentVendor.nombre}</span>
          ) : (
            <span>Cargando vendedor...</span>
          )}
        </div>
      </header>

      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <nav>
          <ul>
            <li><button onClick={openPanel}>Dashboard</button></li>
            <li><button onClick={openPublicarResiduo}>Publicar Residuo</button></li>
            <li><button onClick={openResiduosList}>Mis Residuos</button></li>
            <li><button onClick={openVentas}>Transacciones</button></li>
            <li><button onClick={openChats}>Chats</button></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {/* PANEL DASHBOARD */}
        {activePanel === "dashboard" && (
          <div className="dashboard-panel panel">
            <h1>Dashboard del Vendedor</h1>
            <p>Revisa tus estadísticas, ingresos y accede a acciones rápidas.</p>
            <div className="stats-cards">
              <div className="card">
                <h3>Total Residuos</h3>
                <p>{residuos.length}</p>
              </div>
              <div className="card">
                <h3>Residuos Activos</h3>
                <p>{residuos.filter(r => r.estado_publicacion !== "inactivo").length}</p>
              </div>
              <div className="card">
                <h3>Residuos Inactivos</h3>
                <p>{residuos.filter(r => r.estado_publicacion === "inactivo").length}</p>
              </div>
            </div>
            <div className="quick-actions">
              <button className="action-button" onClick={openPublicarResiduo}>
                Publicar Residuo
              </button>
              <button className="action-button" onClick={openVentas}>
                Ver Transacciones
              </button>
            </div>
            <div className="chart-container">
              <h3>Estadísticas Generales</h3>
              <BarChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2E8B57" />
              </BarChart>
            </div>
            <div className="top-sold">
              <h3>Top Residuos Vendidos</h3>
              <ul>
                {topResiduos.map(item => (
                  <li key={item.id}>
                    <span>{item.residuo}</span>
                    <span>{item.ventas} ventas</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="recent-transactions">
              <h3>Transacciones Recientes</h3>
              <ul>
                {ventas.slice(0, 3).map(v => (
                  <li key={v.id}>
                    <span><strong>{v.comprador}</strong> compró <strong>{v.residuo}</strong> ({v.cantidad}) el {v.fecha} - <em>{v.estado}</em></span>
                  </li>
                ))}
              </ul>
              <div className="estimated-income">
                <h4>Ingresos Estimados</h4>
                <p>{ingresosEstimados}</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL PUBLICAR RESIDUO */}
        {activePanel === "publicar" && (
          <div className="publicar-panel panel">
            <h1>Publicar Residuo</h1>
            <form onSubmit={handlePublicarResiduo} className="publicar-form">
              <label>
                Tipo de Residuo:
                <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required />
              </label>
              <label>
                Descripción:
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
              </label>
              <label>
                Cantidad Disponible:
                <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
              </label>
              <label>
                Unidad:
                <select value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="ton">ton</option>
                </select>
              </label>
              <label className="precio-label">
                Precio Tentativo:
                <input type="number" value={precioTentativo} onChange={(e) => setPrecioTentativo(e.target.value)} required />
                <button type="button" className="suggest-button" onClick={() => setPrecioTentativo(generarPrecioSugeridoIA())}>
                  Sugerencia de IA
                </button>
              </label>
              <label>
                RFC:
                <input type="text" value={rfc} readOnly />
              </label>
              <label>
                Lugar de Origen:
                <input type="text" value={lugarOrigen} onChange={(e) => setLugarOrigen(e.target.value)} required />
              </label>
              <label>
                Imagen (URL o base64):
                <input type="text" value={imagenBase64} onChange={(e) => setImagenBase64(e.target.value)} />
              </label>
              <button type="submit" className="action-button">Publicar</button>
            </form>
          </div>
        )}

        {/* PANEL MIS RESIDUOS */}
        {activePanel === "residuos" && (
          <div className="residuos-list-container panel">
            <h2>Mis Residuos Publicados</h2>
            {residuos.length === 0 ? (
              <p>No has publicado ningún residuo todavía.</p>
            ) : (
              <table className="tabla-residuos">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {residuos.map(r => (
                    <tr key={r.id}>
                      <td>{r.tipo}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.cantidad}</td>
                      <td>{r.unidad}</td>
                      <td>${r.precio_publicar}</td>
                      <td>{r.estado_publicacion}</td>
                      <td>
                        {r.imagen_base64 ? (
                          <img src={r.imagen_base64} alt="Residuo" className="img-residuo-preview" />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEditar(r)} className="btn-accion">Editar</button>
                        <button onClick={() => handleDesactivar(r.id)} className="btn-accion">Desactivar</button>
                        <button onClick={() => handleEliminar(r.id)} className="btn-accion btn-delete">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PANEL TRANSACCIONES */}
        {activePanel === "ventas" && (
          <div className="ventas-panel panel">
            <h2>Transacciones (Ventas)</h2>
            {ventas.length === 0 ? (
              <p>No hay transacciones registradas.</p>
            ) : (
              <table className="tabla-ventas">
                <thead>
                  <tr>
                    <th>Comprador</th>
                    <th>Residuo</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map(v => (
                    <tr key={v.id}>
                      <td>{v.comprador}</td>
                      <td>{v.residuo}</td>
                      <td>{v.cantidad}</td>
                      <td>{v.fecha}</td>
                      <td>{v.estado}</td>
                      <td>
                        <button className="btn-accion" onClick={() => alert("Detalles del comprador")}>
                          Detalles
                        </button>
                        <button className="btn-accion" onClick={() => alert("Actualizar estado a Completado")}>
                          Completar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PANEL CHATS */}
        {activePanel === "chats" && (
          <div className="chat-layout panel">
            <h2>Chats</h2>
            <div className="chat-container">
              <div className="contact-list">
                <h2>Contactos</h2>
                <ul>
                  {[
                    { id: 1, name: "Ivsu" },
                    { id: 2, name: "Ivsu2" },
                    { id: 3, name: "Lau" },
                    { id: 4, name: "Cliente" },
                  ].map(contact => (
                    <li key={contact.id}>{contact.name}</li>
                  ))}
                </ul>
              </div>
              <div className="chat-window">
                {activeChat.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender === "Tú" ? "me" : "other"}`}>
                    <div className="bubble">
                      <strong>{msg.sender}: </strong>{msg.message}
                    </div>
                    <span className="timestamp">10:0{index} AM</span>
                  </div>
                ))}
                <div className="chat-input">
                  <input type="text" placeholder="Escribe un mensaje..." />
                  <button className="action-button">Enviar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PantallaVendedor;
