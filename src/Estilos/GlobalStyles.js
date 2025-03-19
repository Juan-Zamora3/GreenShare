// src/Estilos/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    /* Paleta de colores */
    --lapis-lazuli: #22577a;
    --verdigris: #38a3a5;
    --emerald: #57cc99;
    --light-green: #80ed99;
    --tea-green: #c7f9cc;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(
      135deg,
      var(--lapis-lazuli),
      var(--verdigris),
      var(--emerald),
      var(--light-green),
      var(--tea-green)
    );
    background-size: 300% 300%;
    animation: gradientBG 15s ease infinite;
  }

  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export default GlobalStyles;
