// src/Componentes/PaginationControl.jsx
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PaginationControl = ({ currentPage, totalPages, handleNext, handlePrev }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
      {currentPage > 1 && (
        <button style={{ marginRight: "10px" }} onClick={handlePrev}>
          <FaArrowLeft /> Anterior
        </button>
      )}
      <span>Página {currentPage} de {totalPages}</span>
      {currentPage < totalPages && (
        <button style={{ marginLeft: "10px" }} onClick={handleNext}>
          Siguiente <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default PaginationControl;
