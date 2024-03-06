const SettingsTip = ({ setShowSettings, setBrightness, setContrast, brightness, contrast}) => {
  return (
    <div className="settings-tip" style={{ padding: '0px 10px 10px 10px'}}>
      <div style={{display: 'flex', justifyContent: 'end', marginBottom: '8px'}}>
        <button onClick={()=>setShowSettings(false)}>x</button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>Brightness</span>
        <span>{brightness - 100}</span>
      </div>
      <input
			type="range"
			min="0"
			max="200"
			value={brightness}
      onChange={e => setBrightness(parseInt(e.target.value))}
			/>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>Contrast</span>
        <span>{contrast - 100}</span>
      </div>
      <input
			type="range"
			min="0"
			max="200"
			value={contrast}
      onChange={e => setContrast(parseInt(e.target.value))}
			/>
    </div>
  );
  }; 

export default SettingsTip;