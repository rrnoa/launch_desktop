import React, { useState } from 'react';
import Modal from 'react-modal';

// Estilos personalizados para el modal
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '0px solid #18181b',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    maxWidth: '300px',
    maxHeight: '80vh', // Controla la altura máxima del modal
    backgroundColor: 'rgb(24,24,27)'
  },
};

// Asegúrate de configurar el elemento raíz del modal correctamente
Modal.setAppElement('body'); // Ajusta según tu necesidad

const OnboardingModal = ({ isOpen, onCancel, onContinue }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleCancelClick = () => {
    onCancel();
  };

  const handleContinueClick = () => {
    onContinue();
  };

  const onDontShow = (e) => {
    setDontShowAgain(e.target.checked)
    if (e.target.checked) {
      localStorage.setItem('onboardingShown', 'no');
    }      
  }


  return (
    <Modal isOpen={isOpen} style={customStyles}>
      <h2 style={{ color: '#ECEDEE', fontSize: '22px' }}>For a better user experience use the desktop version.</h2>      
      <p style={{ color: '#E7E8E9', fontSize: '16px', marginTop: '10px' }}>
        We&apos;d love to show you around - it&apos;ll be fast, promise.
      </p>      
      <div style={{ marginTop: '20px' }}>
        <label style={{ color: '#666', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => onDontShow(e)}
            style={{ marginRight: '5px' }}
          />
          Do not show this message again.
        </label>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button
          onClick={() => handleCancelClick()}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            //background: 'gray',
            color: '#f57200',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: 'rgb(24,24,27)'
          }}
        >
          No thanks
        </button>
        <button
          onClick={() => handleContinueClick()}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: 'rgb(24,24,27)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show me the highlights
        </button>
      </div>
    </Modal>
  );
};

export default OnboardingModal;
