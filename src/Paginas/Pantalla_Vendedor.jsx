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


/**
 * EJEMPLO DE "IA" (Generador de precio sugerido)
 * En un escenario real, se llamaría a un servicio externo o un modelo ML.
 * Aquí devolvemos un número aleatorio para demostrar la funcionalidad.
 */
const generarPrecioSugeridoIA = () => {
  // Precio aleatorio entre 10 y 100
  return (Math.random() * 90 + 10).toFixed(2);
};

const PantallaVendedor = () => {
  /* -------------------------------------------------------
   *                ESTADOS PRINCIPALES
   * ------------------------------------------------------- */
  const [currentVendor, setCurrentVendor] = useState(null); // Guardará el doc del vendedor
  const [residuos, setResiduos] = useState([]); // Lista de residuos del vendedor

  // Modals
  const [showPublicarModal, setShowPublicarModal] = useState(false);
  const [showResiduosModal, setShowResiduosModal] = useState(false);

  // Campos del formulario (Publicar/Editar)
  const [selectedResiduo, setSelectedResiduo] = useState(null); // null = crear nuevo
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [precioSugerido, setPrecioSugerido] = useState("");
  const [precioPublicar, setPrecioPublicar] = useState("");
  const [rfc, setRfc] = useState("");
  const [lugarOrigen, setLugarOrigen] = useState("");
  const [imagenBase64, setImagenBase64] = useState("");

  /* -------------------------------------------------------
   *          OBTENER EL DOC DEL VENDEDOR (EJEMPLO)
   * ------------------------------------------------------- */
  useEffect(() => {
    // Supongamos que buscamos al vendedor por su correo:
    const fetchVendor = async () => {
      try {
        const q = query(
          collection(db, "vendedores"),
          where("correo", "==", "israel@gmail.com")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          // Tomar el primer doc que coincida
          const docVendedor = snapshot.docs[0];
          setCurrentVendor(docVendedor.data());
        } else {
          console.warn("No se encontró el vendedor con ese correo.");
        }
      } catch (error) {
        console.error("Error al obtener vendedor:", error);
      }
    };
    fetchVendor();
  }, []);

  /* -------------------------------------------------------
   *    CARGAR RESIDUOS DEL VENDEDOR CUANDO TENGAMOS SU ID
   * ------------------------------------------------------- */
  useEffect(() => {
    if (!currentVendor?.id) return; // Esperamos hasta que tengamos el campo "id" del vendedor

    const fetchResiduos = async () => {
      try {
        const q = query(
          collection(db, "residuos"),
          where("vendedor", "==", currentVendor.id)
        );
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
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

  /* -------------------------------------------------------
   *                ABRIR/CERRAR MODALES
   * ------------------------------------------------------- */
  const openPublicarModal = () => {
    // Limpiamos campos (modo "crear")
    setSelectedResiduo(null);
    setTipo("");
    setDescripcion("");
    setCantidad("");
    setUnidad("kg");
    setPrecioSugerido("");
    setPrecioPublicar("");
    setRfc("");
    setLugarOrigen("");
    setImagenBase64("");
    setShowPublicarModal(true);
  };

  const openResiduosModal = () => {
    setShowResiduosModal(true);
  };

  const closePublicarModal = () => {
    setShowPublicarModal(false);
  };

  const closeResiduosModal = () => {
    setShowResiduosModal(false);
  };

  /* -------------------------------------------------------
   *      EDITAR RESIDUO (ABRE EL MISMO MODAL DE PUBLICAR)
   * ------------------------------------------------------- */
  const handleEditar = (residuo) => {
    setSelectedResiduo(residuo);
    setTipo(residuo.tipo || "");
    setDescripcion(residuo.descripcion || "");
    setCantidad(residuo.cantidad || "");
    setUnidad(residuo.unidad || "kg");
    setPrecioSugerido(residuo.precio_sugerido || "");
    setPrecioPublicar(residuo.precio_publicar || "");
    setRfc(residuo.rfc || "");
    setLugarOrigen(residuo.lugar_origen || "");
    setImagenBase64(residuo.imagen_base64 || "");
    setShowPublicarModal(true);
  };

  /* -------------------------------------------------------
   *                CONVERTIR IMAGEN A BASE64
   * ------------------------------------------------------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* -------------------------------------------------------
   *         GENERAR PRECIO SUGERIDO CON "IA" (Mock)
   * ------------------------------------------------------- */
  const handleGenerarPrecioIA = () => {
    const sugerido = generarPrecioSugeridoIA();
    setPrecioSugerido(sugerido);
  };

  /* -------------------------------------------------------
   *          GUARDAR (CREAR/EDITAR) RESIDUO EN FIRESTORE
   * ------------------------------------------------------- */
  const handleSaveResiduo = async (e) => {
    e.preventDefault();
    if (!currentVendor?.id) {
      alert("No se ha cargado correctamente el vendedor.");
      return;
    }

    // Objeto base para crear o actualizar
    const dataResiduo = {
      vendedor: currentVendor.id, // ID del vendedor
      tipo,
      descripcion,
      cantidad: parseFloat(cantidad) || 0,
      unidad,
      precio_sugerido: parseFloat(precioSugerido) || 0,
      precio_publicar: parseFloat(precioPublicar) || 0,
      rfc,
      lugar_origen: lugarOrigen,
      imagen_base64: imagenBase64,
      estado_publicacion: "pendiente",
      transaccion_activa: false,
    };

    try {
      if (selectedResiduo) {
        // EDITAR
        const docRef = doc(db, "residuos", selectedResiduo.id);
        await updateDoc(docRef, dataResiduo);
        alert("Residuo actualizado correctamente.");
      } else {
        // CREAR
        await addDoc(collection(db, "residuos"), {
          ...dataResiduo,
          fecha_publicacion: serverTimestamp(),
        });
        alert("Residuo publicado correctamente.");
      }
      // Refrescar lista
      const q = query(
        collection(db, "residuos"),
        where("vendedor", "==", currentVendor.id)
      );
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResiduos(lista);

      closePublicarModal();
    } catch (error) {
      console.error("Error al guardar residuo:", error);
      alert("Ocurrió un error al guardar el residuo.");
    }
  };

  /* -------------------------------------------------------
   *               DESACTIVAR RESIDUO
   * ------------------------------------------------------- */
  const handleDesactivar = async (residuoId) => {
    try {
      const docRef = doc(db, "residuos", residuoId);
      await updateDoc(docRef, {
        estado_publicacion: "inactivo",
      });
      alert("Residuo desactivado.");
      setResiduos((prev) =>
        prev.map((r) =>
          r.id === residuoId ? { ...r, estado_publicacion: "inactivo" } : r
        )
      );
    } catch (error) {
      console.error("Error al desactivar residuo:", error);
    }
  };

  /* -------------------------------------------------------
   *               ELIMINAR RESIDUO
   * ------------------------------------------------------- */
  const handleEliminar = async (residuoId) => {
    if (!window.confirm("¿Estás seguro de eliminar este residuo?")) return;
    try {
      await deleteDoc(doc(db, "residuos", residuoId));
      alert("Residuo eliminado.");
      setResiduos((prev) => prev.filter((r) => r.id !== residuoId));
    } catch (error) {
      console.error("Error al eliminar residuo:", error);
    }
  };

  /* -------------------------------------------------------
   *                 RENDER PRINCIPAL
   * ------------------------------------------------------- */
  return (
    <div className="vendor-dashboard">
      {/* HEADER */}
      <header className="vendor-header">
        <div className="header-left">
          <h2>GreenShare - Vendedor</h2>
        </div>
        <div className="header-right">
          {currentVendor ? (
            <span>Bienvenido: {currentVendor.nombre}</span>
          ) : (
            <span>Cargando vendedor...</span>
          )}
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <button onClick={openPublicarModal}>Publicar Residuo</button>
            </li>
            <li>
              <button onClick={openResiduosModal}>Mis Residuos</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL (EJEMPLO DE DASHBOARD) */}
      <main className="main-content">
        <h1>Panel de Vendedor</h1>
        <p>Aquí puedes gestionar tus residuos, ver estadísticas, etc.</p>

        {/* Tarjetas de estadísticas (demo) */}
        <div className="stats-cards">
          <div className="card">
            <h3>Total Residuos</h3>
            <p>{residuos.length}</p>
          </div>
          <div className="card">
            <h3>Residuos Activos</h3>
            <p>
              {residuos.filter((r) => r.estado_publicacion !== "inactivo").length}
            </p>
          </div>
          <div className="card">
            <h3>Residuos Inactivos</h3>
            <p>
              {residuos.filter((r) => r.estado_publicacion === "inactivo").length}
            </p>
          </div>
        </div>
      </main>

      {/* MODAL DE PUBLICAR / EDITAR RESIDUO */}
      {showPublicarModal && (
        <div className="modal-overlay" onClick={closePublicarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedResiduo ? "Editar Residuo" : "Publicar Residuo"}</h2>
            <form onSubmit={handleSaveResiduo} className="form-residuo">
              <label>Tipo de Residuo</label>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />

              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />

              <label>Cantidad</label>
              <input
                type="number"
                step="any"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />

              <label>Unidad</label>
              <select value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="lts">lts</option>
              </select>

              <label>RFC</label>
              <input
                type="text"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
              />

              <label>Lugar de Origen</label>
              <input
                type="text"
                value={lugarOrigen}
                onChange={(e) => setLugarOrigen(e.target.value)}
              />

              <label>Precio Sugerido (IA)</label>
              <div className="ai-price-container">
                <input
                  type="number"
                  step="any"
                  value={precioSugerido}
                  onChange={(e) => setPrecioSugerido(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleGenerarPrecioIA}
                  className="btn-ai"
                >
                  Generar IA
                </button>
              </div>

              <label>Precio a Publicar</label>
              <input
                type="number"
                step="any"
                value={precioPublicar}
                onChange={(e) => setPrecioPublicar(e.target.value)}
                required
              />

              <label>Imagen del Residuo</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imagenBase64 && (
                <div className="preview-container">
                  <p>Vista Previa:</p>
                  <img
                    src={imagenBase64}
                    alt="Vista previa"
                    className="img-preview"
                  />
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit" className="btn-submit">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={closePublicarModal}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE MIS RESIDUOS */}
      {showResiduosModal && (
        <div className="modal-overlay" onClick={closeResiduosModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Mis Residuos</h2>
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
                  {residuos.map((r) => (
                    <tr key={r.id}>
                      <td>{r.tipo}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.cantidad}</td>
                      <td>{r.unidad}</td>
                      <td>${r.precio_publicar}</td>
                      <td>{r.estado_publicacion}</td>
                      <td>
                        {r.imagen_base64 ? (
                          <img
                            src={r.imagen_base64}
                            alt="Residuo"
                            className="img-residuo-preview"
                          />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditar(r)}
                          className="btn-accion"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDesactivar(r.id)}
                          className="btn-accion"
                        >
                          Desactivar
                        </button>
                        <button
                          onClick={() => handleEliminar(r.id)}
                          className="btn-accion btn-delete"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="modal-buttons">
              <button
                type="button"
                onClick={closeResiduosModal}
                className="btn-cancel"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantallaVendedor;
