"use client";
import IconButton from '@/app/components/IconButton';
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import '@/app/css/tooltips-style.css';
import '@/app/css/style.css';
import Scene3d from "@/app/components/Scene3d";
import BuyPanel from '@/app/components/BuyPanel';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import getCroppedImg from '@/app/libs/cropImage';
import { Brightness, Contrast, Crop, Locked, Moon, Sun,Tilt,Undo,Unlocked, UploadPreview, UploadSvgrepo } from '@/app/components/icons/SvgIcons';
import Export3d from '@/app/components/Export3d';
import { Blocks } from 'react-loader-spinner';
import OnboardingModal from '@/app/components/OnboardingModal'; 
import CustomTippyContent from '@/app/components/TippyContent';


export default function Main() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [showTips, setShowTips] = useState(false);
	const [currentTip, setCurrentTip] = useState(1);
	const [uploadedImage, setUploadedImage] = useState("");
	const [previewImage, setPreviewImage] = useState(null);
	const imageReady = useRef();
	const beforeView = useRef();

	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const [theme, setTheme] = useState('light'); // Valor predeterminado
	
	const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
        pixelatedImage: "",
        colorDetails: []
	});	

	const [productImg, setProductImg] = useState();

  // Definir tus filtros y las imágenes de muestra para cada uno  

	const [activeButton, setActiveButton] = useState("crop"); 
	const [rotation, setRotation] = useState(0);
	const [contrast, setContrast] = useState(100);
	const [brightness, setBrightness] = useState(100);

	const [currentState, setCurrentState] = useState("upload");//upload,crop,view	
    
    /*Opciones del crop */
    const [width, setWidth] = useState(Number(0));
    const [height, setHeight] = useState(Number(0));
    const [crop, setCrop] = useState({ x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
	
	const [exportGroupRef, setExportGroupRef] = useState();

	const [blockSize, setBlockSize] = useState(1);//1,2,3	
	
	const cropperRef = useRef(null);

	const croppedAreaPixelsRef = useRef(null);

	const isSliderChangeRef = useRef(false);

	const sceneRef = useRef();
	const renderRef = useRef();
	const btnSizeClick = useRef(false); ///para saber si se ha hehco click sobre alguno de los botones 1,2,3

	// Efecto para actualizar el atributo data-theme
	useEffect(() => {		
		console.log('Useffect page crea la escena y el WebGLRenderer');

		sceneRef.current = new THREE.Scene();
		renderRef.current = new THREE.WebGLRenderer({ antialias: true});
		const onboardingShown = localStorage.getItem('onboardingShown');
		if (!onboardingShown) {
		  setModalIsOpen(true);
		} 

	},[]);

	const onCancel = () => {
		closeModal();
		setShowTips(false);
	}

	const onContinue = () => {
		closeModal();
		setShowTips(true);
	}
	
	const closeModal = () => {
		setModalIsOpen(false);
	};

	const onCloseTippy = () => {
		setShowTips(false);
	}

	const onNextTippy = () => {
		setCurrentTip( prevTip => prevTip + 1);		
	}

	const onBackTippy = () => {
		setCurrentTip(prevTip => prevTip - 1 );		
	}

	// Función para avanzar al siguiente paso
	const goToNextStep = () => {
		setCurrentStep(prevStep => prevStep + 1);
	};

	// se utiliza para cuando se termine de dibujar moverse al paso proximo
	const goToStep4 = () => {
		console.log("ve para el 4");
		setCurrentStep(4);
		setCurrentTip(9);
	};

	const resetImgFilters = () => {
        setRotation(0);
		setContrast(100);
		setBrightness(100);		
    }
	
	  // Función para retroceder al paso anterior
	const goToPreviousStep = () => {
		setCurrentStep(prevStep => prevStep - 1);
		if(currentState == "view") setCurrentState(beforeView.current);//lo manda para el estado que tenia antes de hacer el view
		if(currentStep == 3) { //si estoy en edición de imagen
			setPreviewImage(uploadedImage);
			resetImgFilters();
			setCurrentState('dimensions');
			setActiveButton("crop");
			setCrop({ x: 0, y: 0});
			setZoom(1);
		} 
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
		const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixelsRef.current, rotation);
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
			setIsLoading(true);
			// Dimensiones y calidad de compresión máximas
			const maxWidth = 1280;
			const maxHeight = 1280;
			const quality = 0.7; // Compresión al 70%

			// Llame a la función de redimensionamiento y compresión
			resizeAndCompressImage(file, maxWidth, maxHeight, quality, (compressedBlob) => {
				// Continúe con el procesamiento aquí
				const img = URL.createObjectURL(compressedBlob);
				setUploadedImage(img);
				setPreviewImage(img);
				setIsLoading(false); // Finalizar el indicador de carga
				setCurrentState("dimensions");
				setCurrentStep(2);
				setCurrentTip(2);
				// Reset para cuando se carga desde el preview
				setRotation(0);
				setContrast(100);
				setBrightness(100);     
				setWidth(Number(0));
				setHeight(Number(0));
				setCrop({ x: 0, y: 0});
				setZoom(1);
				setBlockSize(1);

				//downloadResizedImage(compressedBlob);
			});
		}
	};

	/**
	 * Cambio en las dimensiones
	 */
	const handleWidth = (event) => {
		console.log("cuando cambia");
		let { min, max, value } = event.target;		
		setWidth(Number(value));
	};
	
	const handleInputAdjustment = (event, input) => {
		let { min, max, value } = event.target;
		value = Math.max(Number(min), Math.min(Number(max), Number(value)));

		if(input == "width") {
			setWidth(value);
		} 
		else {
			setHeight(value);
		}
	}
	
	const handleHeight = (event) => {
		let { min, max, value } = event.target;
		setHeight(Number(value));
	};
	
	//cuando se hace click sobre el candado
	const handleInputsLock = () => {		
		setActiveButton("crop");
		setCurrentState("crop");
		setCurrentTip(6);
		goToNextStep();
	};	

	/**
	 * Cambia tamaño de bloques
	 */
	const handlerBlockSize = (size) =>{
		setIsLoading(true);
		if(showTips) { btnSizeClick.current = true};
		setBlockSize(size);		
	}
	/**
	 * Click sobre uno de los botones de edicion
	 */
	const editBtnHandler = (btn) => {
		setActiveButton(btn);
		if(btn !== "crop") {
			setCurrentState("imagen-edit");
		} else {
			setCurrentState("crop");
		}
	}	

	//Cuando se preciona el boton de mostrar el 3d
	const handleView = async () => {
		setIsLoading(true);
		imageReady.current = await getCroppedImg(uploadedImage, croppedAreaPixelsRef.current, rotation, brightness, contrast);
		beforeView.current = currentState; //almacena el estado antes de hacer el view
		setCurrentState("view");
	}

	const PreviewImg = () => {
		const imageSrc = previewImage || "images/default.jpeg";
		const isDefaultImage = (imageSrc === "images/default.jpeg");
	
		return (			
			<img
			style={imageStyle} 
			src={imageSrc} 
			alt="Preview" 
			className={isDefaultImage ? "default" : "crop"}
		/>
		);
	}	

	const handleExportGroupRef= (group)=>{
		setExportGroupRef(group);
	}
	
  return (
		<div className='app-container'>
			{console.log("estado:",currentState, "step:", currentStep, "tips:" , currentTip, "width-height", width, height)}
			<OnboardingModal isOpen={modalIsOpen} onCancel={onCancel} onContinue={onContinue} />
			<header className="header-area">
				<div className="header-item">
					<div className="header-item-inner">
						<a href="#"><img src={theme == 'light'? "images/woodxel-black.png" :"images/woodxel-white.png"} alt=""/></a>					
					</div>												
				</div>	
			</header>
			<div className="step-area" >
				<div className="step-area-inner">
					<div className="step-item" >
						<Tippy
							appendTo={() => document.body}
							visible={showTips && currentTip == 9 && currentStep == 4 && !isLoading}
							placement="right"
							maxWidth={250}
							offset={[0,-200]}
							interactive={true}
							content={<CustomTippyContent
								title={"Step 3/5"}
								message={"Interact with the 3D model by using the scroll wheel or clicking and dragging your mouse."}
								onCloseTippy={onCloseTippy}
								onBackTippy={()=> {onBackTippy(); goToPreviousStep()}}
								onNextTippy={onNextTippy}
							/>}
						>
						<div className="step-item-inner">
							{(
								<div className="spinner" style={{ backgroundColor: theme === 'light'?'#ffffff':'#121212', display: isLoading ? "flex" : "none" }}>
									<Blocks
									visible={true}
									height="80"
									width="80"
									ariaLabel="blocks-loading"
									wrapperStyle={{}}
									wrapperClass="blocks-wrapper"
									/>
								</div>
							)}
							{currentState == "dimensions" && (
								<img 
									src={uploadedImage} 
									alt="Preview" 
									style={{maxHeight: '100%'}}
								/>
							)}
							{currentState == "imagen-edit" && (
								<PreviewImg/>
							)}
							{(currentState == "crop") && (
								<Tippy
									interactive={true}
									content={
										<CustomTippyContent 										
										onCloseTippy={onCloseTippy} 
										title={"Step 3/5"}
										message={"Use zoom or drag to adjust the image within the selected dimensions."}
										onNextTippy={onNextTippy}
										onBackTippy={()=> {onBackTippy(); goToPreviousStep()}}
									/>} 
									visible={showTips && currentTip == 6} 
									placement="right" 
									maxWidth={250} 
									offset={[0,300]}
									appendTo={() => document.body}
									>
									<div>
										<Cropper
											ref={cropperRef}
											image={uploadedImage}
											rotation={rotation}
											onCropChange={setCrop}
											onCropComplete={onCropComplete}
											crop={crop}
											zoom={zoom}
											zoomSpeed={0.1}
											aspect={width / height}
											onZoomChange={(newZoom) => setZoom(newZoom)}
											style={{ containerStyle: { width: '100%', height: '100%', borderRadius:'8px' }, mediaStyle: imageStyle }}
										/>
									</div>									
								</Tippy>
							)}
							{currentState=="upload" && (
								<>							
									<input type="file" onChange={handleImageChange} accept="image/*" title=""/>
										<Tippy
										interactive={true}
										content={<CustomTippyContent 										
										onCloseTippy={onCloseTippy} 
										title={"Step 1/5"}
										message={"Upload your image to start the transformation process. Images with clear quality produce the best transformation results."}/>}
										visible={showTips && currentStep == 1} placement="top" maxWidth={250} offset={[0,25]}>
									
										<div className="step-item-inner2" >
											<UploadSvgrepo/>
											<p style={{fontWeight: '700'}}>STEP 1: Upload your media or drop it here</p>
										</div>
										</Tippy>
																
								</>                               
							)}
							{currentState == "view" && (
									<Scene3d 
										width={width * 0.0254}
										height={height * 0.0254}
										blockSize={blockSize * 0.0254}
										croppedImg = {imageReady.current}
										onGroupRefChange={handleExportGroupRef}//cuando se cree el grupo en la escena 3d
										theme={theme}
										setPixelInfo = {setPixelInfo}
										setProductImg = {setProductImg}
										handleLoading = {setIsLoading}
										sceneRef = {sceneRef.current }
										renderRef = {renderRef.current}
										goToNextStep = {goToStep4}
										btnSizeClick = {btnSizeClick.current}
									/>								
							)}                   
						</div>
						</Tippy>
					</div>
					<div className="step-item2">
						<div className='step-item2-inside'>
							<Tippy
							visible={showTips && currentTip == 2}
							placement="left"
							maxWidth={250}
							interactive={true}
							appendTo={() => document.body}
							content={<CustomTippyContent
								title={"Step 1/5"}
								message={"You can upload a new image at any time by clicking or dragging and dropping onto this area."}
								onCloseTippy={onCloseTippy} 

								onNextTippy={onNextTippy}
							/>}>
							<div className={`step-item2-inner step-item2-inner10 ${currentStep === 1 ? "step inactive" : ""}`} style={{paddingBottom: '0px'}}>
								<Tippy content='Click or drop a new image'>
								<div className={`step-item2-inner11 ${isLoading ? "step inactive" : ""}`}>
									<PreviewImg/>
									<button className='action_buttons btn-preview-upload'>
										<UploadPreview/>
										{/* <img className="upload-icon" src="images/gallery-send-svgrepo.svg" alt="Upload" style={{cursor: 'pointer'}}></img> */}
									</button>
									
									<input type="file" onChange={handleImageChange} accept="image/*" title=''/>							
								</div>
								</Tippy>							
							</div>
							</Tippy>
						
						<div className={`step-item2-inner2 step-item2-inner10 ${currentStep === 1 || currentStep !== 2 || (showTips && currentTip == 2)? "step inactive" : ""}`}>
							<h2>STEP 2: Panel dimensions in inches</h2>
							<div className="form">						

								<div className="inputs">									
										<label htmlFor="input_w">W</label>
										<Tippy
										visible={showTips && currentTip == 3}
										placement="bottom"
										appendTo={() => document.body}
										maxWidth={250}
										interactive={true}
										content={<CustomTippyContent
											title={"Step 2/5"}
											message={"Enter the width of your panel in inches. Minimum value 24 maximum value 300."}
											onCloseTippy={onCloseTippy}
											onNextTippy={onNextTippy}
											/>}
										>
										<div>
											<Tippy content='Input panel width (Min:24, Max:300)'>
												<input id='input_w' className="input_w" type="number" min="24" max="300" value={width} 
												onChange={handleWidth}
												onFocus={(even)=>{even.target.select()}}
												onBlur={(event) => {handleInputAdjustment(event, 'width')}}
												/>
											</Tippy>
										</div>
										</Tippy>
									<label htmlFor="input_h">H</label>
									<Tippy
										visible={showTips && currentTip == 4}
										placement="bottom"
										appendTo={() => document.body}
										maxWidth={250}
										interactive={true}
										content={<CustomTippyContent
											title={"Step 2/5"}
											message={"Enter the height of your panel in inches. Minimum value 24 maximum value 300."}
											onCloseTippy={onCloseTippy}
											onNextTippy={onNextTippy}
											/>}
										>
											
									<div>
										<Tippy content='Input panel height (Min:24, Max:300)'>											
											<input id='input_h' className="input_h" type="number" min="24" max="300" value={height} 
											onChange={handleHeight}
											onFocus={(even)=>{even.target.select()}}
											onBlur={(event) => {handleInputAdjustment(event, 'height')}}
											/>
										</Tippy>
									</div>
									</Tippy>
								</div>
							
								<Tippy content="Confirm">
									<div>
									<Tippy
									visible={showTips && currentTip == 5}
									placement="bottom"
									maxWidth={250}
									interactive={true}
									content={<CustomTippyContent
										title={"Step 2/5"}
										message={"Click the lock icon to confirm the dimensions you have entered."}
										onCloseTippy={onCloseTippy}
									/>}>
										<button className={`action_buttons step ${ width < 24 || width > 300 || height < 24 || height > 300 || isLoading?"inactive":""}`} onClick={handleInputsLock}>
											{currentStep == 2 ?  <Unlocked/> : <Locked/>}
										</button>
									</Tippy>	
									</div>
									
								</Tippy>		
															
							</div>
						</div>
						

						<div className={`step-item2-inner3 step-item2-inner10 ${currentStep === 1 || currentStep !== 3 || isLoading || (showTips && currentTip == 5)? "step inactive" : ""}`}>
							<h2>STEP 3: Edit your image</h2>
							<div className='wrapper_edit_buttons'>
							<Tippy
							visible={showTips && currentTip == 7}
							placement="left"
							maxWidth={250}
							interactive={true}
							appendTo={() => document.body}
							content={<CustomTippyContent
								title={"Step 3/5"}
								message={"Make fine adjustments to your image using these buttons and the slider below."}
								onCloseTippy={onCloseTippy}
								onNextTippy={onNextTippy}
								onBackTippy={() => {setCurrentTip(5); goToPreviousStep();}}
							/>}
							>
								<div className='buttons-list'>
									<IconButton 
											isActive={activeButton == "crop"?true:false} 
											onClick={() => editBtnHandler("crop")}										
											name = 'Crop'
									>
										<Crop color={activeButton == "crop"?'#ffffff':'#344054'}/>
									</IconButton>
									
									<IconButton 
											isActive={activeButton == "contrast"?true:false} 
											onClick={() => editBtnHandler("contrast")}										
											name = 'Contrast'
									>
										<Contrast color={activeButton == "contrast"?'#ffffff':'#344054'}/>
									</IconButton>
									<IconButton 
											isActive={activeButton == "brightness"?true:false}
											onClick={() => editBtnHandler("brightness")} 										
											name = 'Brightness'
									>
									<Brightness color={activeButton == "brightness"?'#ffffff':'#344054'}/>
									</IconButton>
									
								</div>
							</Tippy>

								<Tippy content="Back one step">
									<button className={`action_buttons ${ showTips ? "step inactive": ""}`} onClick={ () => goToPreviousStep()}>
										<Undo/>
									</button>
								</Tippy>

							</div>
							
							<div className="step-item2-inner12">
								<div id="slider-range-min">								
										{
											activeButton == 'crop' && (
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
										}	
										{
											activeButton == 'contrast' && (
											<input
											type="range"
											className="range--brand"
											min="0"
											max="200"
											value={contrast}
											onChange={e => setContrast(parseInt(e.target.value))}
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
											/>
											)
										}
										{ <div className="range-indicator center"></div> }																
										
								</div>
							</div>
							<Tippy content='Show your 3D panel'>						
							<div style={{display: 'flex', justifyContent: 'right'}}>
								<Tippy
								visible={showTips && currentTip == 8 && currentStep == 3 && !isLoading}
								placement="bottom"
								maxWidth={250}
								interactive={true}
								content={<CustomTippyContent
									title={"Step 3/5"}
									message={"Click this button to build the frame and preview your 3D model."}
									onCloseTippy={onCloseTippy}
									onBackTippy={onBackTippy}
								/>}
								>
									<button id="btn-preview" onClick={handleView}>3D Panel Preview</button>
								</Tippy>
							</div>
							</Tippy>
						</div>
						<div className={`step-item2-inner5 step-item2-inner10 ${currentStep == 1 || currentStep !== 4 || isLoading || (showTips && currentTip == 8) ? "step inactive" : ""}`}>
							<h2>STEP 4: Select block size in inches</h2>
							<div className='wrapper_edit_buttons'>
							<Tippy
								visible={showTips && currentTip == 10 && !isLoading && currentStep == 4}
								placement="left"
								maxWidth={250}
								interactive={true}
								appendTo={() => document.body}
								content={<CustomTippyContent
									title={"Step 4/5"}
									message={"Select one of these buttons to change the block size of each piece. Options are disabled if the panel dimensions are not a multiple of the block size."}
									onCloseTippy={onCloseTippy}
									onNextTippy={onNextTippy}
									onBackTippy={onBackTippy}
								/>}
								>
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
							</Tippy>
								<Tippy content="Back one step">
									<button className={`action_buttons ${ showTips ? "step inactive": ""}`} onClick={() => goToPreviousStep()}>
										<Undo/>
									</button>
								</Tippy>
							</div>
							
						</div>
						<Tippy
							visible={showTips && currentTip == 11 && currentStep == 4 }
							placement="left"
							maxWidth={250}
							interactive={true}
							content={<CustomTippyContent
								title={"Step 5/5"}
								message={"Place your order now. You can choose to purchase a physical wooden panel or a 3D model."}
								onCloseTippy={onCloseTippy} 
							/>}
							>
						<div className={`step-item2-inner6 ${currentStep !== 4 || isLoading || (showTips && currentTip != 10) ? "step inactive" : ""}`}>
							<h2>STEP 5: Buying options</h2>
							<BuyPanel
							pixelatedImage = {pixelInfo.pixelatedImage}
							colorsArray = {pixelInfo.colorsArray}
							colorDetails = {pixelInfo.colorDetails}
							blockSize = {blockSize}
							xBlocks = {Math.floor(width / blockSize)}
							yBlocks = {Math.floor(height / blockSize)}
							handleLoading = {setIsLoading}
							productImg = {productImg}
							/>
							<Export3d 
							exportGroup={exportGroupRef}
							handleLoading = {setIsLoading}
							/>
						</div>
						</Tippy>
					</div>
					</div>
				</div>
			</div>		
		</div>
  )
}

function resizeAndCompressImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compresión de la imagen
            canvas.toBlob(callback, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function downloadResizedImage(blob) {
    // Crear un enlace para la descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "resized-image.png"; // Nombre de archivo predeterminado, puede ajustar según sea necesario
    document.body.appendChild(link); // Agregar el enlace al documento
    link.click(); // Simular click para descargar
    document.body.removeChild(link); // Limpiar y remover el enlace del documento
}
