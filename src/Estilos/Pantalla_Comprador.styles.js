// src/Estilos/Pantalla_Comprador.styles.js
import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
`;

export const NavBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const NavItem = styled.div`
  margin: 0 15px;
  cursor: pointer;
  font-weight: bold;
  border-bottom: ${(props) => (props.active ? "2px solid var(--light-green)" : "none")};
  &:hover {
    color: var(--tea-green);
  }
`;

export const Section = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const Logo = styled.img`
  height: 50px;
  margin-right: 20px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
`;

export const SearchButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background: var(--verdigris);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export const Card = styled.div`
  background: #fff;
  color: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

export const CardTitle = styled.h3`
  margin: 10px;
`;

export const CardPrice = styled.p`
  margin: 0 10px;
  font-weight: bold;
`;

export const CardLocation = styled.p`
  margin: 0 10px 10px;
  font-size: 0.9rem;
  color: #555;
`;

export const DetailButton = styled.button`
  margin: 10px;
  padding: 10px;
  background: var(--emerald);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => (props.primary ? "var(--lapis-lazuli)" : "var(--verdigris)")};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const BackButton = styled.button`
  padding: 10px 20px;
  background: var(--verdigris);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
