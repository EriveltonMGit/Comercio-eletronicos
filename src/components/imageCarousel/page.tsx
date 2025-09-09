/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";

interface CarrosselProps {
  imagens: string[];
}

const CarrosselMercadoLivre: React.FC<CarrosselProps> = ({ imagens }) => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const avancar = React.useCallback(() => {
    setIndiceAtual((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
  }, [imagens.length]);

  const retroceder = React.useCallback(() => {
    setIndiceAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  }, [imagens.length]);

  const irParaImagem = (indice: number) => {
    setIndiceAtual(indice);
  };

  // Auto-play (opcional)
  useEffect(() => {
    const intervalo = setInterval(avancar, 5000);
    return () => clearInterval(intervalo);
  }, [avancar]);

  return (
    <>
      <div
        className="relative w-full max-w-full mx-auto overflow-hidden rounded "
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        
        <div
          className="flex transition-transform duration-500 ease-in-out h-auto "
          style={{ transform: `translateX(-${indiceAtual * 100}%)` }}
        >
          {imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Imagem ${index + 1}`}
              className="min-w-full object-contain bg-gray-100"
            />
          ))}
        </div>

        {isHovering && (
          <button
            onClick={retroceder}
            aria-label="Imagem anterior"
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white text-black border-none w-13 h-16 cursor-pointer flex items-center justify-center z-10 rounded-tr-[50%] rounded-br-[50%] shadow"
          >
            &lt;
          </button>
        )}

        {isHovering && (
          <button
            onClick={avancar}
            aria-label="Próxima imagem"
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white text-black  border-none w-13 h-16 cursor-pointer flex items-center justify-center z-10  rounded-tl-[50%] rounded-bl-[50%] shadow"
          >
            &gt;
          </button>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {imagens.map((_, index) => (
            <button
              key={index}
              onClick={() => irParaImagem(index)}
              aria-label={`Ir para imagem ${index + 1}`}
              className={`w-2 h-2 mb-[10vh] z-40 rounded-full cursor-pointer transition-colors duration-300 ${index === indiceAtual
                  ? "bg-blue-500"
                  : "bg-white/50 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
        <div className="cloud-gradient-top w-full h-[20vh]  absolute bottom-0"></div>
      </div>
    </>
  );
};

export default CarrosselMercadoLivre;
