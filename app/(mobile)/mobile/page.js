"use client";
import React, { useEffect, useRef, useState } from 'react'
import '@/app/css/mobile-style.css'
import Switch from "react-switch";
import 'tippy.js/dist/tippy.css'; // optional
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import getCroppedImg from '@/app/libs/cropImage';
import IconButton from '@/app/components/IconButton';
import Scene3d from "@/app/components/Scene3d";
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import GLTFExporterMeshGPUInstancingExtension from '@/app/libs/EXT_mesh_gpu_instancing_exporter.js';
import BuyPanel from '@/app/components/BuyPanel';



export default function Mobile() {
    const [theme, setTheme] = useState('light'); // Valor predeterminado
    /*Opciones del crop */
    const [width, setWidth] = useState(24);
    const [height, setHeight] = useState(24);
    const [crop, setCrop] = useState({ x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
	const [blockSize, setBlockSize] = useState(2);//1,2,3	
    const [currentStep, setCurrentStep] = useState(0);
	const [uploadedImage, setUploadedImage] = useState("");
	const [previewImage, setPreviewImage] = useState(null);
	const [currentState, setCurrentState] = useState("upload");//upload,crop,view
    const [activeButton, setActiveButton] = useState(""); 
	const [rotation, setRotation] = useState(0);
	const [contrast, setContrast] = useState(100);
	const [brightness, setBrightness] = useState(100);
    const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
		croppedImg: ""
	});
	
    
    const cropperRef = useRef(null);
	const croppedAreaPixelsRef = useRef(null);
	const isSliderChangeRef = useRef(false);

    // Efecto para actualizar el atributo data-theme
	useEffect(() => {
		console.log('data-theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

    /** cuando se sube una imagen */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
		  const img = URL.createObjectURL(file);
          setUploadedImage(img);
		  setCurrentState("crop");
		  setCurrentStep(1);
			//reset para cuando se carga desde el preview
		  setRotation(0);
		  setContrast(100);
		  setBrightness(100);		
		  setWidth(24);
		  setHeight(24);
		  setCrop({ x: 0, y: 0});
		  setZoom(1);
        }
    };

    // Actualiza el estado cuando el recorte se completa
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
        
		croppedAreaPixelsRef.current = croppedAreaPixels;
		if (!isSliderChangeRef.current) {//asegurance que cuando se hace slider no se actualizae la iamgen
            console.log("crop complete")
			updatePreviewImage();
		} 
	};

    // Función para avanzar al siguiente paso
	const goToNextStep = () => {
		setCurrentStep(prevStep => prevStep + 1);

	};
	
	  // Función para retroceder al paso anterior
	const goToPreviousStep = () => {
		setCurrentStep(prevStep => prevStep - 1);		
	};	
	

	const updatePreviewImage = async () => {
		if (!cropperRef.current) {
			return;
		  }
		  const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixelsRef.current, rotation, brightness, contrast);
		  // Suponiendo que getCroppedImg devuelve una URL de la imagen
		  setPreviewImage(croppedImage);
	  };

    	// Estilos para aplicar brillo, contraste y rotación en tiempo real
	const imageStyle = {
		filter: `brightness(${brightness}%) contrast(${contrast}%)`,		
		transition: 'filter 0.3s ease, transform 0.3s ease'
	};

    // Manejador para cuando el usuario suelta el control deslizante
	const handleSliderChangeComplete = () => {
        console.log("handleSliderChangeComplete");
		isSliderChangeRef.current = false;
		updatePreviewImage();
	};

    const handleExportScene = (scene) => {
		console.log(scene);
		const exporter = new GLTFExporter();
		exporter.register(writer => new GLTFExporterMeshGPUInstancingExtension(writer));
        exporter.parse(scene, (gltf) => {
			// gltf es un objeto JSON que representa tu escena
			const output = JSON.stringify(gltf, null, 2);
			downloadJSON(output, 'scene.gltf');
		});
    };

    // Función para cambiar el tema
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	}; 
    
    /**
	 * Cambia tamaño de bloques
	 */
	const handlerBlockSize = (size) =>{
		setBlockSize(size);
	}

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

    const handlerConfirmImage = () => {
        setActiveButton("");
    }

    	/**
	 * Click sobre uno de los botones de edicion
	 */
	const editBtnHandler = (btn) => {
		setActiveButton(btn);	
	}	

  return (
    <div className='main-wrapper'>
        {console.log(currentStep, activeButton,isSliderChangeRef.current)}
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
                    height={24} // Altura en píxeles
                    width={46}  // Ancho en píxeles
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
                        <img src="images/sun-2-svgrepo.svg" alt=""/>			
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
                        <img  src="images/moon-svgrepo.svg" alt=""/>				
						</div>					
					}

					/>
				</label>
				</div>
			</div>	
        </header>

        <section className="mb-step-area" >
            <div className='canvas-area'>
                {currentStep === 0 && (
                    <>							
						<input type="file" onChange={handleImageChange} accept="image/*" title=""/>								
                         <div className="upload-description" >
                            <img src="images/upload-svgrepo.svg" alt=""/>
                            <p>Step 1: Upload your media or drop it here</p>
                        </div>
                    </>                               
                    )
                }
                {currentStep === 1 && (
                    <Cropper
					ref={cropperRef}
                    image={uploadedImage}
					onCropChange={setCrop}
      				onCropComplete={onCropComplete}
                    rotation={rotation}			
                    crop={crop}
                    zoom={zoom}
					zoomSpeed={0.1}
                    aspect={width / height}
                    onZoomChange={(newZoom) => setZoom(newZoom)}
					style={{ containerStyle: { width: '100%', height: '100%', borderRadius:'8px' }, mediaStyle: imageStyle }}
                    />
                )}
                {currentStep === 2 && (
                    <div>
                    <img 
                        src={previewImage} 
                        alt="Preview" 
                        className='crop' 
                        style={{filter: `brightness(${brightness}%) contrast(${contrast}%)`, transition: 'filter 0.3s ease, transform 0.3s ease', transform: ` rotate(${rotation}deg)`}}
				    />
                    </div>
                )}
                {(currentStep == 3 || currentStep == 4) && (							
					<Scene3d
					width={width}
					height={height}
					blockSize={blockSize}
					croppedImg = {previewImage}
					onExport={handleExportScene}
					theme={theme}
					setPixelInfo = {setPixelInfo}
					/>
				) }
            </div>
            <div className='bottom-area'>
                {(currentStep === 0 || currentStep === 1) && (
                    <h2>Step 2: Input panel size</h2>                    
                )}
                { currentStep === 2 && activeButton=="" && (
                    <h2>Step 3: Edit your image</h2>
                )}
                { currentStep == 2 && activeButton == "rotate" && (
                    <h2>Rotate</h2>
                )}
                { currentStep == 2 && activeButton == "contrast" && (
                    <h2>Contrast</h2>
                )}
                { currentStep == 2 && activeButton == "brightness" && (
                    <h2>Brightness</h2>
                )}
                { currentStep == 3 && (
                    <h2>Step 4: Select block size</h2>
                )}
                { currentStep == 4 && (
                <h2>Step 5: Buying Options</h2>
                )}
                <div className='step-actions-area'>
                    {(currentStep === 0 || currentStep === 1) && (
                    <div className={`step ${currentStep === 0?"inactive":""}`}>                        
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
                                <button className='action_buttons' onClick={goToPreviousStep}>
                                    <img className="btn-icons" src="images/undo-left-round.svg" alt="Back"/>
                                </button>				
                        </div>
                        <span className='notifications' style={{ display: width < 24  || height <24 ?'inline':'none'}}>Ensure length and width are over 24.</span>
                    </div>
                    )}
                    { currentStep === 2 && activeButton=="" && (
                    <div>                        
                            <div className='wrapper_edit_buttons'>
                                <div className='buttons-list'>							
                                    <IconButton 
                                        isActive={false} 
                                        onClick={() => editBtnHandler("rotate")} 
                                        icon="images/tilt.svg" 
                                        activeIcon="images/tilt-active.svg"
                                        name = 'Rotate'
                                    />
                                    <IconButton 
                                            isActive={false} 
                                            onClick={() => editBtnHandler("contrast")} 
                                            icon="images/contrast.svg" 
                                            activeIcon="images/contrast-active.svg" 
                                            name = 'Contrast'
                                    />
                                    <IconButton 
                                            isActive={false}
                                            onClick={() => editBtnHandler("brightness")} 
                                            icon="images/brightness.svg" 
                                            activeIcon="images/brightness-active.svg" 
                                            name = 'Brightness'
                                        />			
                                </div>							
                                <button className='action_buttons' onClick={ () => goToPreviousStep()}><img className='btn-icons' src="images/undo-left-round.svg" alt=""/></button>							

                            </div>
                    </div>
                    )}
                    { currentStep == 2 && activeButton == "rotate" && (
                    <div>                        
                            <input
                                type="range"
                                className="range--brand"
                                min="-45"
                                max="45"
                                value={rotation}
                                onChange={(e) => {
                                    isSliderChangeRef.current = true;
                                    setRotation(parseInt(e.target.value));
                                }}
                                onTouchEnd={handleSliderChangeComplete}
                            />
                            </div>
                    )}
                    { currentStep == 2 && activeButton == "contrast" && (
                        <div>
                            <input
                                type="range"
                                className="range--brand"
                                min="0"
                                max="200"
                                value={contrast}
                                onChange={(e) => {
                                    setContrast(parseInt(e.target.value));
                                }}
                                onTouchEnd={handleSliderChangeComplete}
                            />
                            </div>
                    )}
                    { currentStep == 2 && activeButton == "brightness" && (
                        <div>
                        <input
                            type="range"
                            className="range--brand"
                            min="0"
                            max="200"
                            value={brightness}
                            onChange={e => setBrightness(parseInt(e.target.value))}
                            onTouchEnd={handleSliderChangeComplete}

                            />
                        </div>
                    )}
                    { currentStep == 3 && (
                        <div>
                            <div className='wrapper_edit_buttons'>
                            <div className='buttons-list'>
                                    <button className={blockSize == 1?"active":""} onClick={() => handlerBlockSize(1)}>1”</button>
                                    <div>
                                        <button className={`${blockSize == 2?"active":""} ${(width % 2 !== 0) || (height%2 !==0) ?"inactive":""}`} onClick={() => handlerBlockSize(2)}>2”</button>
                                    </div>
                                    <div>
                                        <button className={`${blockSize == 3?"active":""} ${(width % 3 !== 0) || (height%3 !==0) ?"inactive":""}`} onClick={() => handlerBlockSize(3)}>3”</button>
                                    </div>
                            </div>
                                <button className='action_buttons' onClick={() => goToPreviousStep()}><img className='btn-icons' src="images/undo-left-round.svg" alt=""/></button>
                            </div>
                            <span className='notifications' style={{ display: (width % 3 !== 0) || (width % 2 !== 0) || (width % 3 !== 0) || (width % 2 !== 0) || (height % 3 !== 0) || (height % 2 !== 0)?'inline':'none'}}>
                                Select dimensions x2 or x3 to enable all options
                                </span>

                        </div>
                    )}
                    { currentStep == 4 && (
                        <div>
                            <BuyPanel
                            pixelatedImage = {pixelInfo.pixelatedImage}
                            colorsArray = {pixelInfo.colorsArray}
                            blockSize = {blockSize}
                            xBlocks = {Math.floor(width / blockSize)}
                            yBlocks = {Math.floor(height / blockSize)}
                            />
                        </div>
                    )}

                </div>
                {currentStep == 4 && (<span style={{textAlign: 'center', fontSize:'0.8rem', fontWeight:'700'}}>Or</span>)}                
                <div className='buttons-area'>
                    {currentStep === 2 && activeButton != "" && (
                        <a href="#" onClick={handlerConfirmImage}>Confirm</a>
                    )}
                    {currentStep == 2 && activeButton == "" && (
                        <a href="#" onClick={goToNextStep}>3D Panel preview</a>
                    )}
                    {currentStep == 3 && activeButton == "" && (
                        <a href="#" onClick={goToNextStep}>Buying options</a>
                    )}

                    {currentStep == 4 && (
                        <a href="#" onClick={goToNextStep}>3D Model</a>
                    )}

                    {(currentStep == 0 || currentStep == 1) && (                       
                        <a href="#" className={`step ${currentStep === 0 || width < 24 || width < 24 || height < 24 || height < 24?"inactive":""}`} onClick={goToNextStep}>Next</a>
                    )}
                </div>
            </div>
        </section>
    </div>
  )
}
