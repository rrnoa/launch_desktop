import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optionalcon los estilos necesarios

const IconButton = ({ icon, activeIcon, onClick, isActive, name, children }) => {
  //const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // Llama a la función onClick pasada como prop si existe
    if (onClick) {
      onClick();
    }
    //setIsActive(!isActive);
  };

  return (
<Tippy content={name}>

    <button className={`icon-btn ${isActive ? 'active' : ''}`} onClick={handleClick}>
      {children}
    </button>
      
</Tippy>
  );
};

export default IconButton;
