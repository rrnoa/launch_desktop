const CustomTippyContent = ({ onNextTippy, onBackTippy, onCloseTippy, title, message }) => {
    return (
      <div style={{ padding: '10px', maxWidth: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={onCloseTippy} style={{ float: 'right', color: 'white', backgroundColor: '#333333' }}>&times;</button>
          <h4 style={{ margin: '0' }}>{title}</h4>
        </div>
        <p>{message}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {onBackTippy 
            ? <button onClick={onBackTippy} style={{ color: 'white', backgroundColor: '#333333' }}>← Back</button>
            : <div style={{ width: '80px' }}></div> // Asumiendo que los botones tienen un ancho fijo de 80px
          }
          
          {onNextTippy 
            ? <button onClick={onNextTippy} style={{ color: 'white', backgroundColor: '#333333' }}>Next →</button>
            : <div style={{ width: '80px' }}></div> // Asumiendo que los botones tienen un ancho fijo de 80px
          }
        </div>
      </div>
    );
  };

export default CustomTippyContent;