import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaBook,
  FaLifeRing,
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
 * Si el string base64 no existe o está vacío, retorna una imagen por defecto.
 */
function getImageSrc(base64String) {
  if (!base64String) {
    return "/ruta/a/imagen-por-defecto.png"; // Ajusta la ruta a tu imagen por defecto
  }
  if (base64String.includes("data:image")) {
    return base64String;
  }
  return `data:image/png;base64,${base64String}`;
}

const Pantalla_Comprador = () => {
  const navigate = useNavigate();

  // Estados de búsqueda/filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [rangoPrecio, setRangoPrecio] = useState(1000);
  const [cantidad, setCantidad] = useState("");

  // Estado para los residuos cargados
  const [residuos, setResiduos] = useState([]);

  // Menú lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal de detalle de residuo
  const [selectedResiduo, setSelectedResiduo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal genérico para botones (top bar y menú lateral)
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // -----------------------------------------------------------------
  //  CARGA DE RESIDUOS DESDE FIRESTORE
  // -----------------------------------------------------------------
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

  // -----------------------------------------------------------------
  //  FILTRADO DE RESIDUOS
  // -----------------------------------------------------------------
  const filteredResiduos = residuos.filter((item) => {
    const tipoLower = (item.tipo || "").toLowerCase();
    const descLower = (item.descripcion || "").toLowerCase();
    const ubiLower = (item.ubicacion || "").toLowerCase();
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
      matchSearch && matchTipo && matchUbicacion && matchPrecio && matchCantidad
    );
  });

  // -----------------------------------------------------------------
  //  MENÚ LATERAL
  // -----------------------------------------------------------------
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // -----------------------------------------------------------------
  //  MODAL DE DETALLE DE RESIDUO
  // -----------------------------------------------------------------
  const openModal = (residuo) => {
    setSelectedResiduo(residuo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResiduo(null);
    setIsModalOpen(false);
  };

  // -----------------------------------------------------------------
  //  FUNCIÓN DE "COMPRAR"
  // -----------------------------------------------------------------
  const handleComprar = async (residuo) => {
    const compradorId = "comprador_001"; // Ajusta según tu auth real

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

  // -----------------------------------------------------------------
  //  MODAL GENÉRICO PARA BOTONES DEL MENÚ Y TOP BAR
  // -----------------------------------------------------------------
  const openMenuModal = (type) => {
    setModalType(type);
    setMenuModalOpen(true);
    if (isMenuOpen) handleToggleMenu();
  };

  const closeMenuModal = () => {
    setModalType(null);
    setMenuModalOpen(false);
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
            <div
              className="option"
              onClick={() => openMenuModal("cuentaListas")}
            >
              <span>Hola, Inicia sesión</span>
              <strong>
                Cuenta y Listas <FaCaretDown />
              </strong>
            </div>
            <div
              className="option"
              onClick={() => openMenuModal("devoluciones")}
            >
              <span>Devoluciones</span>
              <strong>y Pedidos</strong>
            </div>
            <div className="cart" onClick={() => openMenuModal("carrito")}>
              <FaShoppingCart size={20} />
              <strong>Carrito</strong>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mainContent">
          {/* Barra de filtros */}
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
            {/* Ejemplo de publicidad */}
            <div className="residuoCard">
              <img
                src="https://kalischacero.com/wp-content/uploads/2018/05/Alambre-Recocido-2-300x300.jpg"
                alt="Publicidad Pagada"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Oferta Especial</h4>
                <p className="residuoDescription">
                  ¡Aprovecha esta oferta por tiempo limitado! Solo por hoy, alambre
                  con un 20% de descuento.
                </p>
                <p className="residuoLocation">Guadalajara, México</p>
                <div className="publicidadTag">
                  <span>Publicidad Pagada</span>
                </div>
              </div>
            </div>

            {filteredResiduos.length > 0 ? (
              filteredResiduos.map((residuo) => {
                const imageSrc = getImageSrc(residuo.imagen_base64);
                return (
                  <div className="residuoCard" key={residuo.id}>
                    <img
                      src={imageSrc}
                      alt={residuo.tipo}
                      className="residuoImage"
                    />
                    <div className="residuoInfo">
                      <h4 className="residuoTitle">{residuo.tipo}</h4>
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

            {/* Tarjeta 1 */}
            <div className="residuoCard">
              <img
                src="https://contenedoresdereciclaje.com/wp-content/uploads/2024/07/Reciclaje-de-Carton.webp"
                alt="Residuo 1"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Cartón Reciclado</h4>
                <p className="residuoDescription">Cartón limpio y listo para reciclar.</p>
                <p className="residuoLocation">Ciudad de México</p>
                <p className="residuoPrice">$50/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="residuoCard">
              <img
                src="https://d100mj7v0l85u5.cloudfront.net/s3fs-public/styles/webp/public/botellas-de-plastico-GR.jpg.webp?itok=1fm9scSI"
                alt="Residuo 2"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Botellas de Plástico</h4>
                <p className="residuoDescription">Botellas PET limpias y compactadas.</p>
                <p className="residuoLocation">Guadalajara</p>
                <p className="residuoPrice">$20/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="residuoCard">
              <img
                src="https://cdn.cloudbf.com/thumb/format/mini_xsize/upfile/128/images/48/20180803174504327.jpg.webp"
                alt="Residuo 3"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Vidrio Transparente</h4>
                <p className="residuoDescription">Vidrio listo para fundición.</p>
                <p className="residuoLocation">Monterrey</p>
                <p className="residuoPrice">$30/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 4 */}
            <div className="residuoCard">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLipkGA67nrhQh99hBCTSLlMoF89PquJUSiQ&s"
                alt="Residuo 4"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Chatarra Metálica</h4>
                <p className="residuoDescription">Metales varios para reciclaje.</p>
                <p className="residuoLocation">Puebla</p>
                <p className="residuoPrice">$15/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 5 */}
            <div className="residuoCard">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZVJcudM9HLJGfitTgYpPl7xUysOFgo9uFg&s"
                alt="Residuo 5"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Papel de Oficina</h4>
                <p className="residuoDescription">Papel blanco para reciclaje.</p>
                <p className="residuoLocation">Querétaro</p>
                <p className="residuoPrice">$10/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 6 */}
            <div className="residuoCard">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnnJrys1cxaR-gUQrcE2ziiEq3bzd85ibhHQ&s"
                alt="Residuo 6"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Aluminio Usado</h4>
                <p className="residuoDescription">Latas de aluminio compactadas.</p>
                <p className="residuoLocation">Tijuana</p>
                <p className="residuoPrice">$25/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 7 */}
            <div className="residuoCard">
              <img
                src="https://i.etsystatic.com/21980481/r/il/40d1b1/5414700301/il_570xN.5414700301_63qo.jpg"
                alt="Residuo 7"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Madera Recuperada</h4>
                <p className="residuoDescription">Madera en buen estado para reutilización.</p>
                <p className="residuoLocation">Cancún</p>
                <p className="residuoPrice">$40/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 8 */}
            <div className="residuoCard">
              <img
                src="https://www.wastetrade.com/wp-content/uploads/2023/02/Mixed-Plastic.jpg"
                alt="Residuo 8"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Plástico Mixto</h4>
                <p className="residuoDescription">Plásticos varios para reciclaje.</p>
                <p className="residuoLocation">Mérida</p>
                <p className="residuoPrice">$18/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 9 */}
            <div className="residuoCard">
              <img
                src="https://thefoodtech.com/wp-content/uploads/2020/12/presenta-tetra-pak-plataforma-digital-envasando-ideas.jpg"
                alt="Residuo 9"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Tetra Pak</h4>
                <p className="residuoDescription">Envases de Tetra Pak limpios.</p>
                <p className="residuoLocation">León</p>
                <p className="residuoPrice">$12/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 10 */}
            <div className="residuoCard">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXRbfkbNOumnKkMim71s8zTJOqg1P4Pm5BTw&s"
                alt="Residuo 10"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Cobre Recuperado</h4>
                <p className="residuoDescription">Cables de cobre para reciclaje.</p>
                <p className="residuoLocation">Veracruz</p>
                <p className="residuoPrice">$100/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 11 */}
            <div className="residuoCard">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-dKUWqUb697XNb4AGBUJ8O64KOXLTpjv48w&s"
                alt="Residuo 11"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Textiles Usados</h4>
                <p className="residuoDescription">Ropa y telas para reciclaje.</p>
                <p className="residuoLocation">Toluca</p>
                <p className="residuoPrice">$5/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

            {/* Tarjeta 12 */}
            <div className="residuoCard">
              <img
                src="https://aseca.com/wp-content/uploads/desechar-las-pilas.jpeg"
                alt="Residuo 12"
                className="residuoImage"
              />
              <div className="residuoInfo">
                <h4 className="residuoTitle">Pilas Usadas</h4>
                <p className="residuoDescription">Pilas alcalinas y recargables.</p>
                <p className="residuoLocation">Morelia</p>
                <p className="residuoPrice">$8/kg</p>
                <button className="residuoButton">Ver Detalle</button>
              </div>
            </div>

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
          <div className="menuItem" onClick={() => openMenuModal("historial")}>
            <FaHistory size={20} />
            <span>Historial</span>
          </div>
          <div className="menuItem" onClick={() => openMenuModal("chat")}>
            <FaComments size={20} />
            <span>Chat Cliente</span>
          </div>
          <div className="menuItem" onClick={() => openMenuModal("empleos")}>
            <FaBriefcase size={20} />
            <span>Empleos</span>
          </div>
          <div className="menuItem" onClick={() => openMenuModal("comunidad")}>
            <FaUsers size={20} />
            <span>Comunidad</span>
          </div>
          <div className="menuItem" onClick={() => openMenuModal("info")}>
            <FaInfoCircle size={20} />
            <span>Información</span>
          </div>
          <div
            className="menuItem"
            onClick={() => {
              handleToggleMenu();
              navigate("/capacitacion");
            }}
          >
            <FaBook size={20} />
            <span>Capacitación</span>
          </div>
          <div
            className="menuItem"
            onClick={() => {
              handleToggleMenu();
              navigate("/soporte");
            }}
          >
            <FaLifeRing size={20} />
            <span>Soporte</span>
          </div>
        </div>

        {/* MODAL DE DETALLE DE RESIDUO */}
        {isModalOpen && selectedResiduo && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent detailModal" onClick={(e) => e.stopPropagation()}>
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
                  <strong>Ubicación:</strong>{" "}
                  {selectedResiduo.ubicacion || "Ubicación desconocida"}
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

        {/* MODAL GENÉRICO PARA BOTONES DEL MENÚ Y TOP BAR */}
        {menuModalOpen && (
          <div className="modalOverlay" onClick={closeMenuModal}>
            <div className="modalContent genericModal" onClick={(e) => e.stopPropagation()}>
              <span className="closeButton" onClick={closeMenuModal}>
                &times;
              </span>
              {modalType === "historial" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?history"
                    alt="Historial"
                    className="modalHeaderImage"
                  />
                  <h2>Historial de Compras</h2>
                </div>
              )}
              {modalType === "chat" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?chat"
                    alt="Chat"
                    className="modalHeaderImage"
                  />
                  <h2>Chat Cliente</h2>
                </div>
              )}
              {modalType === "empleos" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?jobs"
                    alt="Empleos"
                    className="modalHeaderImage"
                  />
                  <h2>Empleos Disponibles</h2>
                </div>
              )}
              {modalType === "comunidad" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?community"
                    alt="Comunidad"
                    className="modalHeaderImage"
                  />
                  <h2>Comunidad GreenShare</h2>
                </div>
              )}
              {modalType === "info" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?company"
                    alt="Información"
                    className="modalHeaderImage"
                  />
                  <h2>Información General</h2>
                </div>
              )}
              {modalType === "cuentaListas" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?profile"
                    alt="Cuenta"
                    className="modalHeaderImage"
                  />
                  <h2>Cuenta y Listas</h2>
                </div>
              )}
              {modalType === "devoluciones" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?returns"
                    alt="Devoluciones"
                    className="modalHeaderImage"
                  />
                  <h2>Devoluciones y Pedidos</h2>
                </div>
              )}
              {modalType === "carrito" && (
                <div className="modalHeader">
                  <img
                    src="https://source.unsplash.com/featured/?shoppingcart"
                    alt="Carrito"
                    className="modalHeaderImage"
                  />
                  <h2>Carrito de Compras</h2>
                </div>
              )}

              <div className="modalBody">
                {modalType === "historial" && (
                  <>
                    <p>
                      Aquí se mostraría un historial detallado de tus compras.
                      Revisa fechas, productos y precios en un diseño claro y
                      ordenado.
                    </p>
                    <ul>
                      <li>Compra #001: Plástico PET - $100</li>
                      <li>Compra #002: Cartón - $50</li>
                      <li>Compra #003: Aluminio - $75</li>
                    </ul>
                  </>
                )}
                {modalType === "chat" && (
                  <>
                    <p>
                      Bienvenido al chat en vivo. Interactúa con nuestro equipo de
                      soporte o con vendedores para resolver tus dudas en tiempo
                      real.
                    </p>
                    <p>
                      <strong>Ejemplo:</strong> “Hola, ¿tienen disponibilidad de
                      cartón reciclado?”
                    </p>
                  </>
                )}
                {modalType === "empleos" && (
                  <>
                    <p>
                      GreenShare busca talento para crecer. Estas son algunas
                      ofertas actuales:
                    </p>
                    <ul>
                      <li>Analista de Logística</li>
                      <li>Especialista en Ventas B2B</li>
                      <li>Diseñador UX/UI</li>
                      <li>Repartidor con licencia comercial</li>
                    </ul>
                    <p>
                      Envía tu CV a <strong>empleos@greenshare.com</strong>
                    </p>
                  </>
                )}
                {modalType === "comunidad" && (
                  <>
                    <p>
                      Únete a nuestra comunidad para compartir consejos de
                      reciclaje, organizar eventos y conocer a otros usuarios
                      comprometidos con el medio ambiente.
                    </p>
                    <ul>
                      <li>Foro de discusión</li>
                      <li>Grupo en redes sociales</li>
                      <li>Eventos locales</li>
                    </ul>
                  </>
                )}
                {modalType === "info" && (
                  <>
                    <p>
                      GreenShare es la plataforma líder para la compra y venta de
                      residuos reciclables. Conoce nuestra misión y visión para
                      construir un mundo más sostenible.
                    </p>
                    <p>
                      <strong>Misión:</strong> Facilitar el intercambio de
                      residuos valorizables.
                    </p>
                    <p>
                      <strong>Visión:</strong> Ser la red de colaboración
                      principal para el manejo responsable de residuos.
                    </p>
                  </>
                )}
                {modalType === "cuentaListas" && (
                  <>
                    <p>
                      Gestiona tu cuenta, actualiza tus datos personales y crea
                      listas de productos que te interesen. Organiza tu
                      información de forma sencilla.
                    </p>
                    <ul>
                      <li>Actualizar perfil</li>
                      <li>Configurar métodos de pago</li>
                      <li>Listas de deseos</li>
                    </ul>
                  </>
                )}
                {modalType === "devoluciones" && (
                  <>
                    <p>
                      Si tienes inconvenientes con algún producto, revisa el estado
                      de tus pedidos y solicita devoluciones de manera rápida y
                      sencilla.
                    </p>
                    <ul>
                      <li>#1203 - PET Transparente - Entregado</li>
                      <li>#1204 - Cartón Mixto - En camino</li>
                      <li>#1205 - Chatarra Metálica - Pendiente</li>
                    </ul>
                  </>
                )}
                {modalType === "carrito" && (
                  <>
                    <p>
                      Revisa los productos que has agregado a tu carrito y el
                      total estimado para tu compra. Confirma tu pedido cuando
                      estés listo.
                    </p>
                    <ul>
                      <li>Botellas de Plástico (5 kg) - $100</li>
                      <li>Cartón Reciclado (10 kg) - $500</li>
                    </ul>
                    <p>
                      <em>Total estimado:</em> $600
                    </p>
                  </>
                )}
              </div>
              <div className="modalFooter">
                <button className="modalCloseButton" onClick={closeMenuModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pantalla_Comprador;
