import React, { useState, useEffect } from "react";
import GlobalStyles from "../Estilos/GlobalStyles";
import "./Pantalla_Comprador.css";
import logo from "../assets/GreenShare.png";
import {
  FaBars,
  FaMapMarkerAlt,
  FaCaretDown,
  FaSearch,
  FaShoppingCart,
  FaHistory,
  FaComments,
  FaBriefcase,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";

// Firestore
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Verifica si la cadena base64 ya contiene "data:image"
 * Si no lo contiene, se le agrega el prefijo "data:image/png;base64,"
 */
function getImageSrc(base64String) {
  if (!base64String) {
    // Retorna una imagen por defecto si no existe nada en Firestore
    return "/ruta/a/imagen-por-defecto.png";
  }
  if (base64String.includes("data:image")) {
    return base64String;
  }
  return `data:image/png;base64,${base64String}`;
}

const Pantalla_Comprador = () => {
  // Estados de búsqueda/filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [rangoPrecio, setRangoPrecio] = useState(50);
  const [cantidad, setCantidad] = useState("");

  // Estado para los residuos cargados
  const [residuos, setResiduos] = useState([]);

  // Menú lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal de detalle
  const [selectedResiduo, setSelectedResiduo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* -----------------------------------------------------------------
   *  CARGA LOS DOCUMENTOS DE LA COLECCIÓN "residuos" DESDE FIRESTORE
   * ----------------------------------------------------------------- */
  useEffect(() => {
    const fetchResiduos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "residuos"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResiduos(data);
      } catch (error) {
        console.error("Error al cargar residuos:", error);
      }
    };
    fetchResiduos();
  }, []);

  /* -----------------------------------------------------------------
   *  FILTRADO LOCAL (FRONTEND) DE LOS RESIDUOS
   * ----------------------------------------------------------------- */
  const filteredResiduos = residuos.filter((item) => {
    const tipoLower = item.tipo?.toLowerCase() || "";
    const descLower = item.descripcion?.toLowerCase() || "";
    const ubiLower = item.ubicacion?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    const precio = parseFloat(item.precio_publicar) || 0;
    const rangoMax = parseFloat(rangoPrecio) || 0;
    const cant = parseFloat(item.cantidad) || 0;
    const cantMin = parseFloat(cantidad) || 0;

    const matchSearch =
      searchTerm === "" ||
      tipoLower.includes(searchLower) ||
      descLower.includes(searchLower);

    const matchTipo =
      tipoResiduo === "" || tipoLower === tipoResiduo.toLowerCase();

    const matchUbicacion =
      ubicacion === "" || ubiLower === ubicacion.toLowerCase();

    const matchPrecio = precio <= rangoMax;
    const matchCantidad = cantidad === "" || cant >= cantMin;

    return (
      matchSearch &&
      matchTipo &&
      matchUbicacion &&
      matchPrecio &&
      matchCantidad
    );
  });

  /* -----------------------------------------------------------------
   *  MENÚ LATERAL: ABRIR / CERRAR
   * ----------------------------------------------------------------- */
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /* -----------------------------------------------------------------
   *  MODAL DE DETALLE: ABRIR / CERRAR
   * ----------------------------------------------------------------- */
  const openModal = (residuo) => {
    setSelectedResiduo(residuo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResiduo(null);
    setIsModalOpen(false);
  };

  /* -----------------------------------------------------------------
   *  FUNCIÓN DE "COMPRAR": CREA DOCUMENTO EN "compras"
   * ----------------------------------------------------------------- */
  const handleComprar = async (residuo) => {
    // Reemplaza con el ID real del comprador según tu lógica de autenticación
    const compradorId = "comprador_001";

    try {
      await addDoc(collection(db, "compras"), {
        residuoId: residuo.id,
        tipo: residuo.tipo,
        descripcion: residuo.descripcion,
        precio: residuo.precio_publicar,
        lugar_origen: residuo.lugar_origen || "Desconocido",
        cantidad_comprada: 1,
        compradorId,
        fecha_compra: serverTimestamp(),
        estado: "en proceso",
      });

      alert("Compra registrada correctamente.");
      closeModal();
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      alert("Ocurrió un error al registrar la compra.");
    }
  };

  return (
    <>
      <GlobalStyles />

      <div className="container-comprador">
        {/* Barra Superior */}
        <div className="topBar">
          <div className="logoContainer">
            <div className="menuIcon" onClick={handleToggleMenu}>
              <FaBars />
            </div>
            <img src={logo} alt="GreenShare" className="logo" />
          </div>

          <div className="locationContainer">
            <FaMapMarkerAlt />
            <div>
              <span>Entregando a C.P. 392310</span>
            </div>
            <a href="#!" className="locationLink">
              Actualizar ubicación
            </a>
          </div>

          <div className="searchBar">
            <select
              className="searchSelect"
              value={tipoResiduo}
              onChange={(e) => setTipoResiduo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pesquero">Pesquero</option>
              <option value="agrícola">Agrícola</option>
              <option value="ganadero">Ganadero</option>
              <option value="construcción">Construcción</option>
              <option value="manufactura">Manufactura</option>
            </select>

            <input
              className="searchInput"
              type="text"
              placeholder="Buscar residuos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="searchButton">
              <FaSearch />
            </button>
          </div>

          <div className="userOptions">
            <div className="option">
              <span>Hola, Inicia sesión</span>
              <strong>
                Cuenta y Listas <FaCaretDown />
              </strong>
            </div>
            <div className="option">
              <span>Devoluciones</span>
              <strong>y Pedidos</strong>
            </div>
            <div className="cart">
              <FaShoppingCart size={20} />
              <strong>Carrito</strong>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mainContent">
          <div className="filtersBar">
            <div className="filterItem">
              <label>Ubicación</label>
              <select
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="Guadalajara">Guadalajara</option>
                <option value="Zapopan">Zapopan</option>
                <option value="Tlaquepaque">Tlaquepaque</option>
                {/* Agrega más ubicaciones según tu DB */}
              </select>
            </div>
            <div className="filterItem">
              <label>Rango de precios (hasta)</label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={rangoPrecio}
                onChange={(e) => setRangoPrecio(e.target.value)}
              />
              <span>${rangoPrecio}</span>
            </div>
            <div className="filterItem">
              <label>Cantidad mínima</label>
              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
          </div>

          {/* Catálogo de residuos */}
          <div className="catalogSection">
            {filteredResiduos.length > 0 ? (
              filteredResiduos.map((residuo) => {
                const imageSrc = getImageSrc(residuo.imagen_base64);
                return (
                  <div className="residuoCard" key={residuo.id}>
                    {/* Imagen arriba */}
                    <div className="residuoImageContainer">
                      <img
                        src={imageSrc}
                        alt={residuo.tipo}
                        className="residuoImage"
                      />
                    </div>
                    {/* Info abajo */}
                    <div className="residuoInfo">
                      <h4 className="residuoTitle">{residuo.tipo}</h4>
                      <p className="residuoDesc">{residuo.descripcion}</p>
                      <p className="residuoPrice">
                        ${residuo.precio_publicar || 0}
                      </p>
                      <p className="residuoLocation">
                        {residuo.ubicacion || "Ubicación desconocida"}
                      </p>
                      <button
                        className="residuoButton"
                        onClick={() => openModal(residuo)}
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="noResults">
                No hay resultados para tu búsqueda.
              </div>
            )}
          </div>
        </div>

        {/* Menú Lateral Izquierdo */}
        <div className={`leftSideMenu ${isMenuOpen ? "open" : ""}`}>
          <div className="menuHeader">
            <h3 className="menuTitle">GreenShare Menu</h3>
            <button className="closeSideBtn" onClick={handleToggleMenu}>
              Cerrar
            </button>
          </div>
          <div className="menuItem">
            <FaHistory size={20} />
            <span>Historial</span>
          </div>
          <div className="menuItem">
            <FaComments size={20} />
            <span>Chat Cliente</span>
          </div>
          <div className="menuItem">
            <FaBriefcase size={20} />
            <span>Empleos</span>
          </div>
          <div className="menuItem">
            <FaUsers size={20} />
            <span>Comunidad</span>
          </div>
          <div className="menuItem">
            <FaInfoCircle size={20} />
            <span>Información</span>
          </div>
        </div>

        {/* Modal de Detalle */}
        {isModalOpen && selectedResiduo && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <span className="closeButton" onClick={closeModal}>
                &times;
              </span>
              <img
                src={getImageSrc(selectedResiduo.imagen_base64)}
                alt={selectedResiduo.tipo}
                className="modalImage"
              />
              <div className="modalInfo">
                <h2>{selectedResiduo.tipo}</h2>
                <p>{selectedResiduo.descripcion}</p>
                <p>
                  <strong>Precio:</strong> ${selectedResiduo.precio_publicar}
                </p>
                <p>
                  <strong>Ubicación:</strong> {selectedResiduo.ubicacion}
                </p>
                <p>
                  <strong>Cantidad:</strong> {selectedResiduo.cantidad}
                </p>
                <div className="modalButtons">
                  <button
                    className="actionButton"
                    onClick={() => handleComprar(selectedResiduo)}
                  >
                    Comprar
                  </button>
                  <button
                    className="actionButton"
                    onClick={() => alert("Contactar Vendedor...")}
                  >
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pantalla_Comprador;
