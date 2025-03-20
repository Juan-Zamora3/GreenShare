import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../Estilos/GlobalStyles";

/* Datos de cursos según rol */
const coursesData = {
  comprador: [
    {
      id: "C001",
      title: "Consejos de compra responsable",
      description:
        "Aprende a elegir productos de manera responsable y sostenible.",
    },
    {
      id: "C002",
      title: "Tipos de residuos y su manejo",
      description:
        "Conoce los diferentes tipos de residuos y cómo gestionarlos adecuadamente.",
    },
  ],
  vendedor: [
    {
      id: "C003",
      title: "Manejo de residuos para vendedores",
      description:
        "Técnicas para el manejo seguro y eficiente de residuos en ventas.",
    },
    {
      id: "C004",
      title: "Optimización de ventas en el sector de residuos",
      description:
        "Estrategias para mejorar tus ventas en el sector de reciclaje y residuos.",
    },
  ],
  repartidor: [
    {
      id: "C005",
      title: "Seguridad al transportar residuos",
      description:
        "Consejos y normas de seguridad para el transporte de residuos.",
    },
    {
      id: "C006",
      title: "Rutas eficientes para repartidores",
      description: "Optimiza tus rutas y reduce tiempos en entregas.",
    },
  ],
};

const Pantalla_Capacitacion = () => {
  // Simular rol del usuario (puede venir de props o de un contexto de autenticación)
  const [userRole, setUserRole] = useState("comprador"); // "comprador", "vendedor" o "repartidor"

  // Obtener cursos según el rol
  const courses = coursesData[userRole] || [];

  // Estado para simular cursos completados
  const [completedCourses, setCompletedCourses] = useState([]);

  const completeCourse = (courseId) => {
    if (!completedCourses.includes(courseId)) {
      setCompletedCourses([...completedCourses, courseId]);
      alert(`Curso ${courseId} completado! Se te otorgará un badge.`);
    }
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header>
          <Title>Portal de Capacitación</Title>
          <Subtitle>
            {userRole === "comprador" &&
              "Consejos de compra responsable y tipos de residuos."}
            {userRole === "vendedor" &&
              "Manejo de residuos y optimización de ventas."}
            {userRole === "repartidor" &&
              "Seguridad al transportar y rutas eficientes."}
          </Subtitle>
          <RoleSelector>
            <label>Selecciona tu rol: </label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
              <option value="repartidor">Repartidor</option>
            </select>
          </RoleSelector>
        </Header>
        <MainContent>
          <Section>
            <SectionTitle>Cursos y Tutoriales</SectionTitle>
            <ListContainer>
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardTitle>{course.title}</CardTitle>
                  <CardText>{course.description}</CardText>
                  <Button onClick={() => completeCourse(course.id)}>
                    {completedCourses.includes(course.id)
                      ? "Completado"
                      : "Finalizar Curso"}
                  </Button>
                </Card>
              ))}
            </ListContainer>
          </Section>
          <Section>
            <SectionTitle>Evaluaciones</SectionTitle>
            <Message>
              Aquí puedes realizar cuestionarios para evaluar lo aprendido.
            </Message>
            <Button>Ir a Evaluaciones</Button>
          </Section>
          <Section>
            <SectionTitle>Certificados y Badges</SectionTitle>
            <ListContainer>
              {completedCourses.length === 0 ? (
                <Message>No has completado ningún curso.</Message>
              ) : (
                completedCourses.map((courseId) => (
                  <BadgeCard key={courseId}>
                    <BadgeTitle>Badge de {courseId}</BadgeTitle>
                    <BadgeText>
                      Obtenido por completar el curso {courseId}
                    </BadgeText>
                  </BadgeCard>
                ))
              )}
            </ListContainer>
          </Section>
        </MainContent>
      </Container>
    </>
  );
};

export default Pantalla_Capacitacion;

/* Styled Components */
const Container = styled.div`
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  background-color: #22577a;
  color: #fff;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
  margin-top: 10px;
`;

const RoleSelector = styled.div`
  margin-top: 15px;
  label {
    margin-right: 10px;
  }
  select {
    padding: 5px 10px;
    border-radius: 4px;
    border: none;
  }
`;

const MainContent = styled.div`
  margin-top: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #22577a;
  text-align: center;
  margin-bottom: 20px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  width: 250px;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  color: #22577a;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 15px;
`;

const Button = styled.button`
  background-color: #38a3a5;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #57cc99;
  }
`;

const Message = styled.p`
  text-align: center;
  color: #22577a;
`;

const BadgeCard = styled.div`
  background: #fff;
  width: 200px;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const BadgeTitle = styled.h3`
  font-size: 1.1rem;
  color: #22577a;
  margin-bottom: 5px;
`;

const BadgeText = styled.p`
  font-size: 0.8rem;
  color: #555;
`;
