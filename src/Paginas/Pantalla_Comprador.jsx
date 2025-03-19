import React, { useState } from "react";
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

const Pantalla_Comprador = () => {
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [rangoPrecio, setRangoPrecio] = useState(50);
  const [cantidad, setCantidad] = useState("");

  // Datos de ejemplo
  const residuos = [
    {
      id: 1,
      title: "Residuo Plástico",
      price: "$10",
      location: "Guadalajara",
      image: "https://via.placeholder.com/300x200?text=Plastico",
      description: "Plástico PET en buenas condiciones, ideal para reciclaje.",
    },
    {
      id: 2,
      title: "Residuo Orgánico",
      price: "$8",
      location: "Zapopan",
      image: "https://via.placeholder.com/300x200?text=Organico",
      description: "Residuos orgánicos aptos para composta y fertilizantes.",
    },
    {
      id: 3,
      title: "Residuo Metálico",
      price: "$15",
      location: "Tlaquepaque",
      image: "https://via.placeholder.com/300x200?text=Metal",
      description: "Chatarra metálica variada, lista para fundición o reciclaje.",
    },
  ];

  // Filtrado básico
  const filteredResiduos = residuos.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estado para mostrar/ocultar el menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados para el modal de detalle
  const [selectedResiduo, setSelectedResiduo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abrir/cerrar menú lateral
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Abrir modal
  const openModal = (residuo) => {
    setSelectedResiduo(residuo);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setSelectedResiduo(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <GlobalStyles />

      <div className="container-comprador">
        {/* Barra Superior */}
        <div className="topBar">
          <div className="logoContainer">
            {/* Único botón para abrir/cerrar el menú */}
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
            <a href="#" className="locationLink">
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
              <option value="plastico">Plástico</option>
              <option value="organico">Orgánico</option>
              <option value="metal">Metálico</option>
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
              <label>Tipo de residuo</label>
              <select
                value={tipoResiduo}
                onChange={(e) => setTipoResiduo(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="plastico">Plástico</option>
                <option value="organico">Orgánico</option>
                <option value="metal">Metálico</option>
              </select>
            </div>
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
              <label>Rango de precios</label>
              <input
                type="range"
                min="0"
                max="100"
                value={rangoPrecio}
                onChange={(e) => setRangoPrecio(e.target.value)}
              />
            </div>
            <div className="filterItem">
              <label>Cantidad</label>
              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
          </div>

          <div className="catalogSection">
            {filteredResiduos.length > 0 ? (
              filteredResiduos.map((residuo) => (
                <div className="residuoCard" key={residuo.id}>
                  <img
                    src={residuo.image}
                    alt={residuo.title}
                    className="residuoImage"
                  />
                  <div className="residuoInfo">
                    <h4 className="residuoTitle">{residuo.title}</h4>
                    <p className="residuoPrice">{residuo.price}</p>
                    <p className="residuoLocation">{residuo.location}</p>
                    <button
                      className="residuoButton"
                      onClick={() => openModal(residuo)}
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="noResults">No hay resultados para tu búsqueda.</div>
            )}
          </div>
        </div>

        {/* Menú Lateral Izquierdo (con degradado) */}
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
                src={selectedResiduo.image}
                alt={selectedResiduo.title}
                className="modalImage"
              />
              <div className="modalInfo">
                <h2>{selectedResiduo.title}</h2>
                <p>{selectedResiduo.description}</p>
                <p>
                  <strong>Precio: </strong>
                  {selectedResiduo.price}
                </p>
                <p>
                  <strong>Ubicación: </strong>
                  {selectedResiduo.location}
                </p>
                <div className="modalButtons">
                  <button
                    className="actionButton"
                    onClick={() => alert("Iniciando compra...")}
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
