import React, { useState } from 'react';
import { useFrogs } from '../context/FrogsContext';

export default function HiddenFrog({ frog }) {
  const { isFrogFound, findFrog } = useFrogs();
  const [clicked, setClicked] = useState(false);

  if (!frog) return null;

  const found = isFrogFound(frog.id);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!found) {
      setClicked(true);
      findFrog(frog);
      setTimeout(() => setClicked(false), 500);
    }
  };

  return (
    <div
      className={`hidden-frog-container ${found ? 'found' : ''} ${clicked ? 'popping' : ''}`}
      style={{
        top: frog.style.top,
        left: frog.style.left,
        fontSize: `${frog.size || 24}px`
      }}
      onClick={handleClick}
      title={found ? '¡Rana encontrada!' : '¿Qué es esto que se asoma por acá? 🐸'}
      role="button"
      tabIndex={0}
      aria-label="Rana escondida"
    >
      <span className="frog-emoji">
        {found ? '🐸' : '🐸'}
      </span>
    </div>
  );
}
