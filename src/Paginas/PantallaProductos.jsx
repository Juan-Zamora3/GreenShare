// src/Paginas/PantallaProductos.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Ajusta la ruta si tu archivo firebaseConfig está en otro lugar
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import "./PantallaProductos.css"; // Opcional: estilos separados

const PantallaProductos = () => {
  // Lista de productos en la BD
  const [listaProductos, setListaProductos] = useState([]);

  // Controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Campos del formulario para crear un producto
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // Cargar la colección al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos_disponibles"));
        const docsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setListaProductos(docsData);
      } catch (error) {
        console.error("Error al leer productos:", error);
      }
    };
    fetchProductos();
  }, []);

  // Abrir el modal y limpiar campos
  const handleOpenModal = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("");
    setUbicacion("");
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Manejo del submit en el formulario del modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoProducto = {
        nombre,
        descripcion,
        precio: parseFloat(precio), // Convertimos a número (opcional)
        categoria,
        ubicacion,
        fecha_publicacion: serverTimestamp()
      };

      await addDoc(collection(db, "productos_disponibles"), nuevoProducto);

      alert("Producto agregado exitosamente.");

      // Recargar lista de productos
      const querySnapshot = await getDocs(collection(db, "productos_disponibles"));
      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setListaProductos(docsData);

      // Cerrar modal
      handleCloseModal();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Ocurrió un error al agregar el producto.");
    }
  };

  return (
    <div className="contenedor-productos">
      <h1>Productos Disponibles</h1>

      {/* Botón para abrir modal */}
      <button className="btn-nuevo" onClick={handleOpenModal}>
        Nuevo Producto
      </button>

      {/* Lista de productos */}
      {listaProductos.length === 0 ? (
        <p>No hay productos publicados todavía.</p>
      ) : (
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {listaProductos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.descripcion}</td>
                <td>${prod.precio}</td>
                <td>{prod.categoria}</td>
                <td>{prod.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL para crear producto */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Publicar Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="form-producto">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <label>Descripción:</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />

              <label>Precio:</label>
              <input
                type="number"
                step="any"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />

              <label>Categoría:</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />

              <label>Ubicación:</label>
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
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

export default PantallaProductos;
