import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { TermsPage } from './TermsPage';

import { CloseSvg } from '@/app/components/icons/SvgIcons';
// Asegúrate de configurar el elemento app para el modal, como se mostró anteriormente

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '76%',
      maxWidth: '422px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#fff',
      maxHeight: '80%'
    },
  };
  
  // Estilos para el formulario
  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Espacio entre campos del formulario
  };
  
  // Estilos para los inputs
  const inputStyles = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    width: '100%'
  };
  
  // Estilos para los botones
  const buttonStyles = {
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    color: '#ffffff',
    marginTop: '10px',
    backgroundColor: '#ec6628',
    borderColor: '#ec6628',
    width: '100%',
    fontWeight: 600,
    fontSize: '1rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: 1.5
  };

  const formGroup = {
    marginBottom: '1rem'
  }

  const fieldSetStyle = {
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0,
  }

  const customControlStyle = {
    position: 'relative',
    display: 'block',
    minHeight: '1.5rem',
    fontSize: '0.8rem',
    lineHeight: '1.5'
  }

  const labelStyle = {
    verticalAlign: 'top'
  }

  const linkStyle = {
    color: '#ec6628',
    textDecoration: 'none',
    backgroundColor: 'transparent',
  }

Modal.setAppElement('body'); // Ajusta según tu necesidad

function LeadModal({ modalIsOpen, closeModal, setCurrentStep, compressModel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [sending, setSending] = useState(false);

  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar datos del almacenamiento local si existen
    const savedFormData = localStorage.getItem('leadData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  function validateForm() {
    let formIsValid = true;
    let errors = {};    

    // Nombre: máximo 50 caracteres
    if (formData.name.length > 50) {
      errors.name = "The name cannot be more than 50 characters.";
      formIsValid = false;
    }

    // Email: formato de email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "The email format is not valid.";
      formIsValid = false;
    }

    // Empresa: máximo 50 caracteres
    if (formData.company.length > 50) {
      errors.company = "The company cannot be more than 50 characters.";
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    if (!validateForm()) {
        return;
      }
    
    localStorage.setItem('leadData', JSON.stringify(formData));
    enviarFormulario(formData, compressModel);
  }

  function enviarFormulario(datos, compressModel) {

    const formData = new FormData();
  
    for (const key in datos) {
      if (datos.hasOwnProperty(key)) {
          formData.append(key, datos[key]);
      }
    }  
    fetch('https://lignumcd.com/wp-json/pixel-it/send-lead/', {
    //fetch('https://lignumcd.local/wp-json/pixel-it/send-lead/', {
      method: 'POST',     
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        // Si el servidor responde, pero con un código de estado HTTP que indica un error (como 404 o 500),
        // lanzamos un error que será capturado por el bloque .catch()
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      else {
        compressModel();
        setSending('false');
        closeModal();
        setCurrentStep(1);
      }
      return response.json();
    })
    .catch((error) => {
      alert('Connection error. Restart the application.');
      console.error('Error:', error);
    });
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      style={customStyles}
    >
      {terms && 
      <>
        <TermsPage></TermsPage>
        <button onClick={()=> setTerms(false)} style={buttonStyles}>I have read the Terms and Conditions</button>
      </>
     

      }

      {!terms && 
      <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h2>Get your FREE 3D model</h2>
      <button disabled={sending} onClick={()=>{closeModal(), setSending(false)}} style={{backgroundColor:'#ffffff', width:'35px', height:'35px', position:'absolute', top: 0, right:0}}><CloseSvg/></button>
      </div>
   
      <p style={{padding: '25px 0'}}>After submitting this form, your 3D model will download automatically. Please make sure your browser settings allow downloads if prompted. Enjoy your model!</p>
      
      <form onSubmit={handleSubmit}>
        <div style={formGroup}>          
          <input
            disabled={sending}
            className='lead-text-input'
            type="text"
            name="name"
            required="required"
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Name'
            style={inputStyles}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>
        <div style={formGroup}>          
          <input
            disabled={sending}
            className='lead-text-input'
            type="email"
            name="email"
            required="required"
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Email'
            style={inputStyles}
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>
        <div style={formGroup}>
          <input
            disabled={sending}
            className='lead-text-input'
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder='Company'
            style={inputStyles}
          />
          {errors.company && <div style={{ color: 'red' }}>{errors.company}</div>}
        </div>
        <div data-sexy-input="checkbox">
          <fieldset style={{...fieldSetStyle,...formGroup}}>
            <div style={customControlStyle}>
              <input disabled={sending} required="required" aria-required="true" type="checkbox" value="1" name="user[consent_terms]" id="user_consent_terms"/>
              <label style={labelStyle}>I have read and consent to the <a style={linkStyle} onClick={(e)=> {e.preventDefault(); setTerms(true)}}>Terms of Use</a> <abbr title="required">*</abbr>
              </label>
            </div>
          </fieldset>         
        </div>

        <div>
          <button disabled={sending} type="submit" style={buttonStyles}>{`${sending? 'Sending...': 'Download Now'}`}</button>
        </div>
      </form>
      </div>
      }
    </Modal>
  );
}



export default LeadModal;
