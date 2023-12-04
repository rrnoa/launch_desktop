"use client";
import React, { useState } from 'react'
import '@/app/css/mobile-style.css'
import Switch from "react-switch";
import 'tippy.js/dist/tippy.css'; // optional

export default function Mobile() {
    const [theme, setTheme] = useState('light'); // Valor predeterminado
    /*Opciones del crop */
    const [width, setWidth] = useState(24);
    const [height, setHeight] = useState(24);
    const [crop, setCrop] = useState({ x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
	const [blockSize, setBlockSize] = useState(2);//1,2,3	
    const [currentStep, setCurrentStep] = useState(1);


    // Función para cambiar el tema
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

    //cuando se hace click sobre el candado
	const handleInputsLock = () => {		
		goToNextStep();
	};

    // Función para avanzar al siguiente paso
	const goToNextStep = () => {
		setCurrentStep(prevStep => prevStep + 1);
	};

    const handleWidth = (event) => {
		let { min, max, value } = event.target;		
		//value = Math.max(Number(min), Math.min(Number(max), Number(value)));
		setWidth(value);
		setBlockSize(value %2 == 0 ? 2 : 1);
	};	
	
	const handleHeight = (event) => {
		let { min, max, value } = event.target;
		//value = Math.max(Number(min), Math.min(Number(max), Number(value)));
		setHeight(value);
		setBlockSize(value %2 == 0 ? 2 : 1);
	};	

  return (
    <div className='main-wrapper'>
        <header className='mb-header'>
        <div className="mb-header-inner">
				<div className="header-inner-item-1">
					<a href="#"><img src={theme == 'dark'? "images/woodxel-white.png" :"images/woodxel-black.png"} alt=""/></a>					
				</div>
				<div className="header-inner-item-2">
				<label>					
					<Switch 
					onChange={toggleTheme} 
					checked={theme == 'dark'?true:false}					
					onColor={'#121212'}
					uncheckedIcon = {						
						<div
							style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							fontSize: 20,
							padding: '7px'
							}}
						>						
						</div>
						
					}
					checkedIcon = {
						<div
							style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							fontSize: 20,
							padding: '7px'
							}}
						>						
						</div>					
					}

					/>
				</label>
				</div>
			</div>	
        </header>

        <section className="mb-step-area" >
            <div className='canvas-area'>

            </div>
            <div className='step-actions-area'>
            <h2>Step 2: Input panel size</h2>
            <div className="form">							
							<div className="inputs">
								<input id='input_w' className="input_w" type="number" min="24" max="300" value={width} 
								onChange={handleWidth}
								onFocus={(even)=>{even.target.select()}}
								/>
								<label htmlFor="input_w">W</label>
								<input id='input_h' className="input_h" type="number" min="24" max="300" value={height} 
								onChange={handleHeight}
								onFocus={(even)=>{even.target.select()}}
								/>
								<label htmlFor="input_h">H</label>											
							</div>
								<button className='action_buttons' onClick={handleInputsLock}>
									<img className={`btn-icons ${currentStep == 2?"chake-icon":""}`} src={currentStep == 2?"images/lock-keyhole-unlocked-svgrepo.svg":"images/lock-keyhole-svgrepo.svg"} alt="Reset"/>
								</button>	
														
						</div>

            </div>
            <div className='buttons-area'>
                <a href="#" >Next</a>
            </div>
        </section>
    </div>
  )
}
