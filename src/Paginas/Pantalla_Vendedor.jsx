// src/Pantalla_Vendedor.jsx
import React, { useState, useEffect } from "react";
import "./Pantalla_Vendedor.css";
import { FaBars } from "react-icons/fa";
import greenShareLogo from "../assets/GreenShare.png";

// Firebase
import { db } from "../firebaseConfig"; // Ajusta la ruta si es necesario
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

const Pantalla_Vendedor = () => {
  // Estado para sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado para la lista de residuos
  const [residuos, setResiduos] = useState([]);

  // Estado para mostrar/ocultar modal
  const [showModal, setShowModal] = useState(false);

  // Campos del formulario
  const [vendedor, setVendedor] = useState("vendedor_001");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [precioSugerido, setPrecioSugerido] = useState("");
  const [precioPublicar, setPrecioPublicar] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // Para subir imágenes desde la PC: guardamos el FileList convertido en array
  const [images, setImages] = useState([]);

  // Cargar datos de la colección “residuos” al montar
  useEffect(() => {
    const fetchResiduos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "residuos"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setResiduos(lista);
      } catch (error) {
        console.error("Error al leer residuos:", error);
      }
    };
    fetchResiduos();
  }, []);

  // Abrir modal y limpiar formulario
  const handleOpenModal = () => {
    setVendedor("vendedor_001");
    setTipo("");
    setDescripcion("");
    setCantidad("");
    setUnidad("kg");
    setPrecioSugerido("");
    setPrecioPublicar("");
    setUbicacion("");
    setImages([]); // Limpia archivos
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Detectar archivos seleccionados
  const handleFileChange = (e) => {
    // Convertir FileList a array
    setImages([...e.target.files]);
  };

  // Manejar submit: subir archivos a Storage y guardar en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) Subir cada archivo a Firebase Storage y obtener sus URLs
      const storage = getStorage();
      const uploadedURLs = [];
      for (const file of images) {
        const storageRef = ref(storage, `residuos/${file.name}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedURLs.push(downloadURL);
      }

      // 2) Crear el objeto con la info del residuo
      const nuevoResiduo = {
        vendedor,
        tipo,
        descripcion,
        cantidad,
        unidad,
        precio_sugerido: parseFloat(precioSugerido) || 0,
        precio_publicar: parseFloat(precioPublicar) || 0,
        ubicacion,
        imagenes: uploadedURLs, // array de URLs
        fecha_publicacion: serverTimestamp(),
        estado_publicacion: "pendiente",
        transaccion_activa: false
      };

      // 3) Guardar en la colección “residuos”
      await addDoc(collection(db, "residuos"), nuevoResiduo);

      alert("Residuo publicado correctamente.");

      // 4) Refrescar la lista de residuos
      const snapshot = await getDocs(collection(db, "residuos"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setResiduos(lista);

      // Cerrar modal
      handleCloseModal();
    } catch (error) {
      console.error("Error publicando residuo:", error);
      alert("Error al publicar residuo.");
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="vendor-dashboard">
      {/* HEADER */}
      <header className="vendor-header">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <img src={greenShareLogo} alt="GreenShare Logo" className="logo" />
          <div className="location">
            <span>Delivering to Mexico City</span>
            <button>Update location</button>
          </div>
        </div>
        <div className="search-bar">
          <select>
            <option value="all">All</option>
            <option value="residuos">Residuos</option>
          </select>
          <input type="text" placeholder="Search..." />
          <button className="search-btn">Buscar</button>
        </div>
        <div className="header-right">
          <div className="account">
            <span>Hello, Sign in</span>
            <strong>Account &amp; Lists</strong>
          </div>
          <div className="returns">
            <span>Returns &amp; Orders</span>
          </div>
          <div className="cart">Cart</div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-btn">Historial</button>
        <button className="sidebar-btn">Chat</button>
        <button className="sidebar-btn">Community</button>
        <button className="sidebar-btn">Ventas</button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <h1>Panel de Vendedor</h1>
        <p>Aquí puedes gestionar tus residuos en venta, ver estadísticas, etc.</p>

        <button className="btn-nuevo" onClick={handleOpenModal}>
          Publicar Nuevo Residuo
        </button>

        {/* LISTA DE RESIDUOS */}
        <h2>Mis Residuos</h2>
        {residuos.length === 0 ? (
          <p>No hay residuos publicados todavía.</p>
        ) : (
          <table className="tabla-residuos">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Publicar</th>
                <th>Ubicación</th>
                <th>Imágenes</th>
              </tr>
            </thead>
            <tbody>
              {residuos.map((r) => (
                <tr key={r.id}>
                  <td>{r.tipo}</td>
                  <td>{r.descripcion}</td>
                  <td>
                    {r.cantidad} {r.unidad}
                  </td>
                  <td>${r.precio_publicar}</td>
                  <td>{r.ubicacion}</td>
                  <td>
                    {r.imagenes && r.imagenes.length > 0 ? (
                      r.imagenes.map((imgUrl, idx) => (
                        <div key={idx}>
                          <a href={imgUrl} target="_blank" rel="noreferrer">
                            Ver Imagen
                          </a>
                        </div>
                      ))
                    ) : (
                      <span>Sin imágenes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* MODAL para publicar nuevo residuo */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Publicar Nuevo Residuo</h2>
            <form onSubmit={handleSubmit} className="form-residuo">
              <label>Vendedor (ID o nombre):</label>
              <input
                type="text"
                value={vendedor}
                onChange={(e) => setVendedor(e.target.value)}
              />

              <label>Tipo de residuo:</label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />

              <label>Descripción:</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />

              <label>Cantidad:</label>
              <input
                type="text"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />

              <label>Unidad:</label>
              <select value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="lts">lts</option>
              </select>

              <label>Precio Sugerido:</label>
              <input
                type="number"
                step="any"
                value={precioSugerido}
                onChange={(e) => setPrecioSugerido(e.target.value)}
              />

              <label>Precio a Publicar:</label>
              <input
                type="number"
                step="any"
                value={precioPublicar}
                onChange={(e) => setPrecioPublicar(e.target.value)}
              />

              <label>Ubicación:</label>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              />

              {/* INPUT para seleccionar archivos desde la PC */}
              <label>Imágenes (subir desde PC):</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />

              <div className="btns-modal">
                <button type="submit" className="btn-guardar">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-cerrar"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pantalla_Vendedor;
