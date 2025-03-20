import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../Estilos/GlobalStyles";
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

/* Datos ficticios de ejemplo */
const carpoolFicticio = [
  {
    id: "RUTA-001",
    origen: "Guadalajara",
    destino: "Puerto Peñasco",
    tipo: "Orgánico",
    fecha: "20/03/2025",
    tarifa: 500,
    descripcion:
      "Ruta especial para transportar residuos orgánicos desde Guadalajara hasta Puerto Peñasco.",
  },
  {
    id: "RUTA-002",
    origen: "Zapopan",
    destino: "Puerto Peñasco",
    tipo: "Electrónico",
    fecha: "22/03/2025",
    tarifa: 750,
    descripcion: "Transporte de residuos electrónicos con manejo especial.",
  },
];

const misRutasFicticio = [
  {
    id: "MIS-101",
    generador: "Vendedor001",
    participantes: ["Vendedor001", "CompradorXYZ"],
    estado: "pendiente",
  },
  {
    id: "MIS-102",
    generador: "Vendedor002",
    participantes: ["Vendedor002", "CompradorABC"],
    estado: "en ruta",
  },
];

const historialFicticio = [
  {
    id: "HIS-001",
    origen: "Tlaquepaque",
    destino: "Puerto Peñasco",
    tipo: "Plástico",
    fecha: "15/03/2025",
    calificacion: 4.5,
  },
  {
    id: "HIS-002",
    origen: "CDMX",
    destino: "Puerto Peñasco",
    tipo: "Metal",
    fecha: "10/03/2025",
    calificacion: null,
  },
];

const Pantalla_Repartidor = () => {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estados que simulan datos (en un caso real vendrían de Firestore)
  const [carpool, setCarpool] = useState(carpoolFicticio);
  const [misRutas, setMisRutas] = useState(misRutasFicticio);
  const [historial, setHistorial] = useState(historialFicticio);

  // Modal de detalle para una ruta
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRoute(null);
    setIsModalOpen(false);
  };

  // Simula la acción de unirse a una ruta
  const unirseARuta = (route) => {
    alert(`Te has unido a la ruta ${route.id}: ${route.origen} → ${route.destino}`);
    closeModal();
  };

  // Cambiar estado de una ruta en misRutas (simulado)
  const cambiarEstadoRuta = (id, nuevoEstado) => {
    const nuevasRutas = misRutas.map((r) =>
      r.id === id ? { ...r, estado: nuevoEstado } : r
    );
    setMisRutas(nuevasRutas);
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header>
          <HeaderTop>
            <Logo src={logo} alt="GreenShare Logo" />
            <Title>Dashboard del Repartidor</Title>
          </HeaderTop>
          <TabsBar>
            <Tab active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </Tab>
            <Tab active={activeTab === "carpool"} onClick={() => setActiveTab("carpool")}>
              Rutas Disponibles
            </Tab>
            <Tab active={activeTab === "misrutas"} onClick={() => setActiveTab("misrutas")}>
              Mis Rutas
            </Tab>
            <Tab active={activeTab === "historial"} onClick={() => setActiveTab("historial")}>
              Historial
            </Tab>
          </TabsBar>
        </Header>
        <MainContent>
          {activeTab === "dashboard" && (
            <DashboardSection>
              <SectionTitle>Entregas Activas</SectionTitle>
              <ListContainer>
                {misRutas.filter((r) => r.estado === "pendiente" || r.estado === "en ruta")
                  .length === 0 ? (
                  <Message>No tienes entregas activas.</Message>
                ) : (
                  misRutas
                    .filter((r) => r.estado === "pendiente" || r.estado === "en ruta")
                    .map((route) => (
                      <Card key={route.id}>
                        <CardTitle>ID: {route.id}</CardTitle>
                        <CardText>
                          <strong>Generador:</strong> {route.generador}
                        </CardText>
                        <CardText>
                          <strong>Participantes:</strong>{" "}
                          {Array.isArray(route.participantes)
                            ? route.participantes.join(", ")
                            : "N/A"}
                        </CardText>
                        <CardText>
                          <strong>Estado:</strong> {route.estado}
                        </CardText>
                      </Card>
                    ))
                )}
              </ListContainer>
              <SectionTitle>Mapa de Ubicaciones</SectionTitle>
              <MapContainer>
                <iframe
                  title="Mapa de Puerto Peñasco"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.6477397905367!2d-109.9092228!3d31.4218298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86c5c45f1e60c1a5%3A0x6d8e2d4b6d71af0a!2sPuerto%20Pe%C3%B1asco%2C%20Sonora%2C%20M%C3%A9xico!5e0!3m2!1ses-419!2sus!4v1616550123456!5m2!1ses-419!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </MapContainer>
            </DashboardSection>
          )}

          {activeTab === "carpool" && (
            <Section>
              <SectionTitle>Rutas Disponibles (Carpool)</SectionTitle>
              <ListContainer>
                {carpool.length === 0 ? (
                  <Message>No hay rutas disponibles.</Message>
                ) : (
                  carpool.map((route) => (
                    <Card key={route.id}>
                      <CardTitle>{route.id}</CardTitle>
                      <CardText>
                        <strong>Origen:</strong> {route.origen}
                      </CardText>
                      <CardText>
                        <strong>Destino:</strong> {route.destino}
                      </CardText>
                      <CardText>
                        <strong>Tipo:</strong> {route.tipo}
                      </CardText>
                      <CardText>
                        <strong>Fecha/Hora:</strong> {route.fecha}
                      </CardText>
                      <CardText>
                        <strong>Tarifa:</strong> ${route.tarifa}
                      </CardText>
                      <CardButton onClick={() => openModal(route)}>
                        Ver Detalle
                      </CardButton>
                    </Card>
                  ))
                )}
              </ListContainer>
            </Section>
          )}

          {activeTab === "misrutas" && (
            <Section>
              <SectionTitle>Mis Rutas / Entregas Activas</SectionTitle>
              {misRutas.length === 0 ? (
                <Message>No tienes rutas asignadas.</Message>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>ID Ruta</Th>
                      <Th>Generador</Th>
                      <Th>Participantes</Th>
                      <Th>Estado</Th>
                      <Th>Acciones</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {misRutas.map((route) => (
                      <tr key={route.id}>
                        <Td>{route.id}</Td>
                        <Td>{route.generador}</Td>
                        <Td>
                          {Array.isArray(route.participantes)
                            ? route.participantes.join(", ")
                            : "N/A"}
                        </Td>
                        <Td>{route.estado}</Td>
                        <Td>
                          {route.estado !== "en ruta" &&
                            route.estado !== "completado" && (
                              <ButtonSmall
                                onClick={() =>
                                  cambiarEstadoRuta(route.id, "en ruta")
                                }
                              >
                                Iniciar
                              </ButtonSmall>
                            )}
                          {route.estado !== "completado" && (
                            <ButtonSmall
                              onClick={() =>
                                cambiarEstadoRuta(route.id, "completado")
                              }
                            >
                              Completar
                            </ButtonSmall>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          )}

          {activeTab === "historial" && (
            <Section>
              <SectionTitle>Historial de Entregas</SectionTitle>
              {historial.length === 0 ? (
                <Message>No hay entregas registradas.</Message>
              ) : (
                <ListContainer>
                  {historial.map((h) => (
                    <Card key={h.id}>
                      <CardTitle>{h.id}</CardTitle>
                      <CardText>
                        <strong>Origen:</strong> {h.origen}
                      </CardText>
                      <CardText>
                        <strong>Destino:</strong> {h.destino}
                      </CardText>
                      <CardText>
                        <strong>Tipo:</strong> {h.tipo}
                      </CardText>
                      <CardText>
                        <strong>Fecha:</strong> {h.fecha}
                      </CardText>
                      <CardText>
                        <strong>Calificación:</strong>{" "}
                        {h.calificacion || "Sin calificación"}
                      </CardText>
                    </Card>
                  ))}
                </ListContainer>
              )}
            </Section>
          )}
        </MainContent>
      </Container>

      {/* Modal de Detalle */}
      {isModalOpen && selectedRoute && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseModal onClick={closeModal}>&times;</CloseModal>
            <ModalTitle>{selectedRoute.id}</ModalTitle>
            <ModalText>
              <strong>Origen:</strong> {selectedRoute.origen}
            </ModalText>
            <ModalText>
              <strong>Destino:</strong> {selectedRoute.destino}
            </ModalText>
            <ModalText>
              <strong>Fecha:</strong> {selectedRoute.fecha}
            </ModalText>
            <ModalText>
              <strong>Tipo:</strong> {selectedRoute.tipo}
            </ModalText>
            <ModalText>
              <strong>Tarifa:</strong> ${selectedRoute.tarifa}
            </ModalText>
            <ModalDescription>{selectedRoute.descripcion}</ModalDescription>
            <ModalButtons>
              <ActionButton onClick={() => unirseARuta(selectedRoute)}>
                Unirme a la Ruta
              </ActionButton>
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Pantalla_Repartidor;

/* =========================
   Styled Components
============================== */
const Container = styled.div`
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: #22577a;
  color: #fff;
  padding: 10px 20px;
  text-align: center;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const TabsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  background-color: #38a3a5;
  padding: 10px;
`;

const Tab = styled.button`
  background-color: ${(props) => (props.active ? "#57cc99" : "#22577a")};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #57cc99;
  }
`;

const MainContent = styled.div`
  padding: 20px;
`;

const DashboardSection = styled.div`
  margin-bottom: 40px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #22577a;
  margin-bottom: 20px;
  text-align: center;
`;

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 250px;
`;

const CardTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #22577a;
`;

const CardText = styled.p`
  margin-bottom: 5px;
  font-size: 0.9rem;
  strong {
    color: #38a3a5;
  }
`;

const CardButton = styled.button`
  background-color: #22577a;
  color: #fff;
  border: none;
  padding: 8px 12px;
  margin-top: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #38a3a5;
  }
`;

const MapContainer = styled.div`
  margin-top: 20px;
  height: 300px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #22577a;
  text-align: center;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #22577a;
  color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
`;

const ButtonSmall = styled.button`
  background-color: #38a3a5;
  color: #fff;
  border: none;
  padding: 6px 10px;
  margin: 2px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #57cc99;
  }
`;

/* Modal Styles */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s forwards;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  color: #333;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  position: relative;
  padding: 20px;
  animation: slideUp 0.3s forwards;
`;

const CloseModal = styled.span`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.8rem;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 10px;
  color: #22577a;
`;

const ModalText = styled.p`
  margin-bottom: 5px;
  font-size: 0.9rem;
  strong {
    color: #38a3a5;
  }
`;

const ModalDescription = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #555;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background-color: #22577a;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #38a3a5;
  }
`;
