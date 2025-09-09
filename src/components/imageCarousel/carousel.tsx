/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";

interface CarrosselProps {
  imagens: string[];
}

const CarrosselMercadoLivre: React.FC<CarrosselProps> = ({ imagens }) => {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const avancar = React.useCallback(() => {
    setIndiceAtual((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  }, [imagens.length]);

  const retroceder = React.useCallback(() => {
    setIndiceAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  }, [imagens.length]);

  const irParaImagem = (indice: number) => {
    setIndiceAtual(indice);
  };

  useEffect(() => {
    const intervalo = setInterval(avancar, 5000);
    return () => clearInterval(intervalo);
  }, [avancar]);

  return (
    <>
      <div className="relative w-full max-w-full mx-auto overflow-hidden rounded">
        <div
          className="flex transition-transform duration-500 ease-in-out 
             h-[27vh] sm:h-[40vh] md:h-[65vh] lg:h-[75vh]"
          style={{ transform: `translateX(-${indiceAtual * 100}%)` }}
        >
          {imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Imagem ${index + 1}`}
              className="min-w-full h-full object-cover bg-gray-100"
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <button
          onClick={retroceder}
          aria-label="Imagem anterior"
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/70 text-black border-none w-10 h-10 md:w-14 md:h-16 cursor-pointer flex items-center justify-center z-20 rounded-tr-[50%] rounded-br-[50%] shadow-md transition-opacity duration-300 opacity-100"
        >
          &lt;
        </button>

        <button
          onClick={avancar}
          aria-label="Próxima imagem"
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/70 text-black border-none w-10 h-10 md:w-14 md:h-16 cursor-pointer flex items-center justify-center z-20 rounded-tl-[50%] rounded-bl-[50%] shadow-md transition-opacity duration-300 opacity-100"
        >
          &gt;
        </button>

        {/* Indicadores de bolinhas */}
        <div className="absolute left-0 right-0 flex justify-center gap-2
                bottom-12 sm:bottom-10 md:bottom-8 lg:bottom-6 xl:bottom-4 mb-16 z-10">
          {imagens.map((_, index) => (
            <button
              key={index}
              onClick={() => irParaImagem(index)}
              aria-label={`Ir para imagem ${index + 1}`}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${index === indiceAtual ? "bg-green-600" : "bg-white/50 hover:bg-white/70"
                }`}
            />
          ))}
        </div>


        <div className="cloud-gradient-top w-full h-[20vh]  absolute bottom-0 z-10"></div>
      </div>
    </>
  );
};

export default CarrosselMercadoLivre;