"use client";
import IconButton from '@/app/components/IconButton';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import '@/app/css/style.css';
import Scene3d from "@/app/components/Scene3d";
import BuyPanel from '@/app/components/BuyPanel';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import debounce from 'lodash/debounce';
import Switch from "react-switch";
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import getCroppedImg from '@/app/libs/cropImage';
import GLTFExporterMeshGPUInstancingExtension from '@/app/libs/EXT_mesh_gpu_instancing_exporter.js';


export default function Main() {

	const [uploadedImage, setUploadedImage] = useState("");
	const [previewImage, setPreviewImage] = useState(null);

	const [currentStep, setCurrentStep] = useState(1);

	const [theme, setTheme] = useState('light'); // Valor predeterminado
	
	const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
		croppedImg: ""
	});

  // Definir tus filtros y las imágenes de muestra para cada uno  

	const [activeButton, setActiveButton] = useState("brightness"); 
	const [rotation, setRotation] = useState(0);
	const [contrast, setContrast] = useState(100);
	const [brightness, setBrightness] = useState(100);

	const [currentState, setCurrentState] = useState("upload");//upload,crop,view	
    
    /*Opciones del crop */
    const [width, setWidth] = useState(24);
    const [height, setHeight] = useState(24);
    const [crop, setCrop] = useState({ x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
	
	const hasFunctionRunRef = useRef(false);

	const [blockSize, setBlockSize] = useState(2);//1,2,3	
	
	const cropperRef = useRef(null);

	const croppedAreaPixelsRef = useRef(null);

	const isSliderChangeRef = useRef(false);

	// Función para cambiar el tema
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	// Efecto para actualizar el atributo data-theme
	useEffect(() => {
		console.log('data-theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);	

	// Función para avanzar al siguiente paso
	const goToNextStep = () => {
		setCurrentStep(prevStep => prevStep + 1);
	};
	
	  // Función para retroceder al paso anterior
	const goToPreviousStep = () => {
		setCurrentStep(prevStep => prevStep - 1);
		if(currentState === 'view') setCurrentState('crop');
	};	

	// Actualiza el estado cuando el recorte se completa
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		croppedAreaPixelsRef.current = croppedAreaPixels;
		if (!isSliderChangeRef.current) {//asegurance que cuandos e aha slider no se actualizae la iamgen
			updatePreviewImage();
		} 
	};
	

	const updatePreviewImage = async () => {
		if (!cropperRef.current) {
			return;
		  }
		  const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixelsRef.current, rotation, brightness, contrast);
		  // Suponiendo que getCroppedImg devuelve una URL de la imagen
		  setPreviewImage(croppedImage);
	  };

		// Manejador para cuando el usuario suelta el control deslizante
	const handleSliderChangeComplete = () => {
		isSliderChangeRef.current = false;
		updatePreviewImage();
	};

	// Estilos para aplicar brillo, contraste y rotación en tiempo real
	const imageStyle = {
		filter: `brightness(${brightness}%) contrast(${contrast}%)`,		
		transition: 'filter 0.3s ease, transform 0.3s ease'
	  };

    /** cuando se sube una imagen */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
		  const img = URL.createObjectURL(file);
          setUploadedImage(img);
		  setCurrentState("crop");
		  setCurrentStep(2);
			//reset para cuando se carga desde el preview
		  setActiveButton("brightness"); 
		  setRotation(0);
		  setContrast(100);
		  setBrightness(100);		
		  setWidth(24);
		  setHeight(24);
		  setCrop({ x: 0, y: 0});
		  setZoom(1);
        }
    };

	/**
	 * Cambio en las dimensiones
	 */
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

	//cuando se hace click sobre el candado
	const handleInputsLock = () => {		
		goToNextStep();
	};
	

	/**
	 * Cambia tamaño de bloques
	 */
	const handlerBlockSize = (size) =>{
		setBlockSize(size);
	}
	/**
	 * Click sobre uno de los botones de edicion
	 */
	const editBtnHandler = (btn) => {
		setActiveButton(btn);	
	}	

	//Cuando se preciona el boton de mostrar el 3d
	const handleView = () => {
		setCurrentState("view");
		goToNextStep();
	}

	const PreviewImg = () => {
		const imageSrc = previewImage || "images/default.jpeg";
		const isDefaultImage = (imageSrc === "images/default.jpeg");
	
		return (			
				<img 
					src={imageSrc} 
					alt="Preview" 
					className={isDefaultImage ? "default" : "crop"}
				/>
		);
	}
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
	const downloadJSON = (json, filename) => {
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
	
  return (
    <>
		<header className="header-area">
			<div className="header-item">
				<div className="header-item-inner">
					<a href="#"><img src={theme == 'dark'? "images/logo-black.png" :"images/logo-white.png"} alt=""/></a>					
				</div>
				<Tippy content={theme == 'dark'?"Change to light":"Change to dark"}>
				<div className="header-item-inner2">
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
				</Tippy>									
			</div>	
		</header>	

		<section className="step-area" >
			<div className="step-area-inner">
				<div className="step-item" >
					<div className="step-item-inner">
                        {currentState == "crop" && (
                            <Cropper
							ref={cropperRef}
                            image={uploadedImage}
							rotation={rotation}							
							onCropChange={setCrop}
      						onCropComplete={onCropComplete}                             crop={crop}
                            zoom={zoom}
							zoomSpeed={0.1}
                            aspect={width / height}
                            onZoomChange={(newZoom) => setZoom(newZoom)}
							style={{ containerStyle: { width: '100%', height: '100%' }, mediaStyle: imageStyle }}
                            />
                        )}
                        {currentState=="upload" && (
                            <>							
								<input type="file" onChange={handleImageChange} accept="image/*" title=""/>								
                                <div className="step-item-inner2" >
                                    <img src="images/upload-svgrepo.svg" alt=""/>
                                    <p style={{fontWeight: '700'}}>Step 1: Upload your media or drop it here</p>
                                </div>
                            </>                               
                            )
                        }
						{currentState == "view" && (							
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
				</div>
				<div className="step-item2">
					<div className={`step-item2-inner step-item2-inner10 ${currentStep === 1 ? "step inactive" : ""}`} style={{paddingBottom: '0px'}}>
						<Tippy content='Click or drop a new image'>
						<div className="step-item2-inner11" style={{backgroundColor: "grey"}}>
							<PreviewImg/>
							<button className='action_buttons btn-preview-upload'>
								<img className="upload-icon" src="images/gallery-send-svgrepo.svg" alt="Upload" style={{cursor: 'pointer'}}></img>
							</button>
							
							<input type="file" onChange={handleImageChange} accept="image/*" title=''/>							
						</div>
						</Tippy>
						
					</div>
					<div className={`step-item2-inner2 step-item2-inner10 ${currentStep === 1 || currentStep !== 2 ? "step inactive" : ""}`}>
						<h2>Step 2: Input panel size</h2>
						
						<div className="form">							
							<div className="inputs">
							<Tippy content='Input panel width'>
								<input id='input_w' className="input_w" type="number" min="24" max="300" value={width} 
								onChange={handleWidth}
								onFocus={(even)=>{even.target.select()}}
								/>
							</Tippy>				
								<label htmlFor="input_w">W</label>
							<Tippy content='Input panel height'>
								<input id='input_h' className="input_h" type="number" min="24" max="300" value={height} 
								onChange={handleHeight}
								onFocus={(even)=>{even.target.select()}}
								/>
							</Tippy>
								<label htmlFor="input_h">H</label>											
							</div>
							<Tippy content="Confirm">
								<button className='action_buttons' onClick={handleInputsLock}>
									<img className={`btn-icons ${currentStep == 2?"chake-icon":""}`} src={currentStep == 2?"images/lock-keyhole-unlocked-svgrepo.svg":"images/lock-keyhole-svgrepo.svg"} alt="Reset"/>
								</button>	
							</Tippy>		
														
						</div>
					</div>
					<div className={`step-item2-inner3 step-item2-inner10 ${currentStep === 1 || currentStep !== 3 ? "step inactive" : ""}`}>
						<h2>Step 3: Edit your image</h2>
						<div className='wrapper_edit_buttons'>
							<div className='buttons-list'>							
								<IconButton 
									isActive={activeButton == "rotate"?true:false} 
									onClick={() => editBtnHandler("rotate")} 
									icon="images/tilt.svg" 
									activeIcon="images/tilt-active.svg"
									name = 'Rotate'
								/>
								<IconButton 
										isActive={activeButton == "contrast"?true:false} 
										onClick={() => editBtnHandler("contrast")} 
										icon="images/contrast.svg" 
										activeIcon="images/contrast-active.svg" 
										name = 'Contrast'
								/>
								<IconButton 
										isActive={activeButton == "brightness"?true:false}
										onClick={() => editBtnHandler("brightness")} 
										icon="images/brightness.svg" 
										activeIcon="images/brightness-active.svg" 
										name = 'Brightness'
									/>			
							</div>
							<Tippy content="Back one step">
								<button className='action_buttons' onClick={ () => goToPreviousStep()}><img className='btn-icons' src="images/undo-left-round.svg" alt=""/></button>
							</Tippy>

						</div>
						
						<div className="step-item2-inner12">
							<div id="slider-range-min">	
									{
										activeButton === 'rotate' && (
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
											onMouseUp={handleSliderChangeComplete}

											/>
										)	
									}	{
										activeButton == 'contrast' && (
										<input
										type="range"
										className="range--brand"
										min="0"
										max="200"
										value={contrast}
										onChange={e => setContrast(parseInt(e.target.value))}
										onMouseUp={handleSliderChangeComplete}

										/>
										)
									}
									{
										activeButton == 'brightness' && (
										<input
										type="range"
										className="range--brand"
										min="0"
										max="200"
										value={brightness}
										onChange={e => setBrightness(parseInt(e.target.value))}
										onMouseUp={handleSliderChangeComplete}

										/>
										)
									}					
									
							</div>
						</div>
						<Tippy content='Show your 3D panel'>						
						<div style={{display: 'flex', justifyContent: 'right'}}>
							<a href="#" onClick={handleView}>3D Panel Preview</a>
						</div>
						</Tippy>
					</div>
					<div className={`step-item2-inner5 step-item2-inner10 ${currentStep === 1 || currentStep !== 4 ? "step inactive" : ""}`}>
						<h2>Step 4: Select block size</h2>
						<div className='wrapper_edit_buttons'>
							<div className='buttons-list'>
								<Tippy content="1” blocks">
									<button className={blockSize == 1?"active":""} onClick={() => handlerBlockSize(1)}>1”</button>
								</Tippy>
								<Tippy content={(width % 2 !== 0) || (height%2 !==0) ?"Width and height must be 2x multiples ":"2” blocks"}>
									<div>
										<button className={`${blockSize == 2?"active":""} ${(width % 2 !== 0) || (height%2 !==0) ?"inactive":""}`} onClick={() => handlerBlockSize(2)}>2”</button>
									</div>
								</Tippy>
								<Tippy content={(width % 3 !== 0) || (height%3 !==0) ?"Width and height must be 3x multiples ":"3” blocks"}>
									<div>
										<button className={`${blockSize == 3?"active":""} ${(width % 3 !== 0) || (height%3 !==0) ?"inactive":""}`} onClick={() => handlerBlockSize(3)}>3”</button>
									</div>
								</Tippy>
							</div>
							<Tippy content="Back one step">
								<button className='action_buttons' onClick={() => goToPreviousStep()}><img className='btn-icons' src="images/undo-left-round.svg" alt=""/></button>
							</Tippy>
						</div>
						
					</div>
					<div className={`step-item2-inner6 ${currentStep === 1 || currentStep !== 4 ? "step inactive" : ""}`}>
						<h2>Step 5: Buying options</h2>
						<BuyPanel
						pixelatedImage = {pixelInfo.pixelatedImage}
						colorsArray = {pixelInfo.colorsArray}
						blockSize = {blockSize}
						xBlocks = {Math.floor(width / blockSize)}
						yBlocks = {Math.floor(height / blockSize)}
						/>
						<Tippy content='Get your 3D file'>
							<a id="woodxel_panel_3d" href="#" >3D Model</a>
						</Tippy>
					</div>
				</div>
			</div>
		</section>		
    </>
  )
}
