import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../Estilos/GlobalStyles";

const faqData = [
  {
    question: "¿Cómo puedo contactar soporte?",
    answer:
      "Puedes utilizar el formulario de contacto o iniciar un chat en vivo para comunicarte con nuestro equipo.",
  },
  {
    question: "¿Cuál es el horario de atención?",
    answer:
      "Nuestro horario de atención es de lunes a viernes de 9am a 6pm, hora local.",
  },
  {
    question: "¿Cómo puedo recuperar mi contraseña?",
    answer:
      "Utiliza la opción de recuperación de contraseña en la página de inicio de sesión.",
  },
  // Puedes agregar más preguntas según sea necesario.
];

const Pantalla_soporte = () => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [searchFaq, setSearchFaq] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío del mensaje a soporte (por ejemplo, vía correo o sistema de tickets)
    alert(`Mensaje enviado!\nNombre: ${nombre}\nMensaje: ${mensaje}`);
    setNombre("");
    setMensaje("");
  };

  const filteredFaq = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header>
          <Title>Pantalla de Soporte / Contacto</Title>
          <Subtitle>
            Resuelve tus dudas o reporta un problema
          </Subtitle>
        </Header>
        <MainContent>
          <Section>
            <SectionTitle>Formulario de Contacto</SectionTitle>
            <Form onSubmit={handleSubmit}>
              <Label>
                Nombre:
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Label>
              <Label>
                Mensaje:
                <TextArea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                />
              </Label>
              <Button type="submit">Enviar Mensaje</Button>
            </Form>
          </Section>
          <Section>
            <SectionTitle>Preguntas Frecuentes (FAQ)</SectionTitle>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Buscar preguntas..."
                value={searchFaq}
                onChange={(e) => setSearchFaq(e.target.value)}
              />
            </SearchContainer>
            <FaqList>
              {filteredFaq.length === 0 ? (
                <Message>No se encontraron preguntas.</Message>
              ) : (
                filteredFaq.map((item, index) => (
                  <FaqItem key={index}>
                    <Question>{item.question}</Question>
                    <Answer>{item.answer}</Answer>
                  </FaqItem>
                ))
              )}
            </FaqList>
          </Section>
          <Section>
            <SectionTitle>Chat en Vivo</SectionTitle>
            <ChatContainer>
              <Message>
                Chat en vivo en desarrollo. Pronto podrás comunicarte con nuestro
                soporte en tiempo real.
              </Message>
            </ChatContainer>
          </Section>
        </MainContent>
      </Container>
    </>
  );
};

export default Pantalla_soporte;

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Label = styled.label`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #22577a;
`;

const Input = styled.input`
  padding: 8px 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 8px 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 100px;
`;

const Button = styled.button`
  background-color: #38a3a5;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #57cc99;
  }
`;

const SearchContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 8px 10px;
  width: 80%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const FaqItem = styled.div`
  background: #fff;
  width: 100%;
  max-width: 600px;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Question = styled.h3`
  color: #22577a;
  margin-bottom: 10px;
`;

const Answer = styled.p`
  color: #555;
  font-size: 0.9rem;
`;

const ChatContainer = styled.div`
  background: #fff;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Message = styled.p`
  text-align: center;
  color: #22577a;
`;
