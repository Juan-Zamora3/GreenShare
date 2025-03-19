// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Paginas/LoginPage";
import Pantalla_Comprador from "./Paginas/Pantalla_Comprador";
import Pantalla_Vendedor from "./Paginas/Pantalla_Vendedor";
import Pantalla_Repartidor from "./Paginas/Pantalla_Repartidor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/comprador" element={<Pantalla_Comprador />} />
        <Route path="/vendedor" element={<Pantalla_Vendedor />} />
        <Route path="/repartidor" element={<Pantalla_Repartidor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;