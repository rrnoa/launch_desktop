"use client";
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import '@/app/css/mobile-style.css'
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import getCroppedImg from '@/app/libs/cropImage';
import Scene3d from "@/app/components/Scene3d";
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import BuyPanel from '@/app/components/BuyPanel';
import { Brightness, Contrast, Moon, Sun, Tilt, Undo, UploadPreview, UploadSvgrepo } from '@/app/components/icons/SvgIcons';
import { Blocks } from  'react-loader-spinner';
import Export3d from '@/app/components/Export3d';
import OnboardingModal from '@/app/components/OnboardingModal'; 
import CustomTippyContent from '@/app/components/TippyContent';


export default function Mobile() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
	const [showTips, setShowTips] = useState(false);
	const [currentTip, setCurrentTip] = useState(1);
    const [viewportHeight, setViewportHeight] = useState(0);
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
    const [activeButton, setActiveButton] = useState(""); 
	const [rotation, setRotation] = useState(0);
	const [contrast, setContrast] = useState(100);
	const [brightness, setBrightness] = useState(100);
    const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
        pixelatedImage: "",
        colorDetails: []
	});	

    const [isLoading, setIsLoading] = useState(false);
    
    const cropperRef = useRef(null);
	const croppedAreaPixelsRef = useRef(null);
	const isSliderChangeRef = useRef(false);

	const [productImg, setProductImg] = useState();

    const sceneRef = useRef();
	const renderRef = useRef();

	const [exportGroupRef, setExportGroupRef] = useState();

	const btnSizeClick = useRef(false); ///para saber si se ha hehco click sobre alguno de los botones 1,2,3


    useEffect(() => {
        console.log('Useffect page crea la escena y el WebGLRenderer');

        if (typeof window !== 'undefined') {
            const handleResize = () => {
              setViewportHeight(window.innerHeight);
            };
      
            // Establece la altura inicial y agrega el listener
            handleResize();
            window.addEventListener('resize', handleResize);

            sceneRef.current = new THREE.Scene();
		    renderRef.current = new THREE.WebGLRenderer({ antialias: true});
            
            const onboardingShown = localStorage.getItem('onboardingShown');
            if (!onboardingShown) {
                setModalIsOpen(true);
            }
      
            // Limpiar el event listener al desmontar el componente
            return () => window.removeEventListener('resize', handleResize);
          }
      }, []);

    const handleExportGroupRef= (group)=>{
		setExportGroupRef(group);
	}

    /** cuando se sube una imagen */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true);
            // Dimensiones y calidad de compresión máximas
            const maxWidth = 800;
            const maxHeight = 800;
            const quality = 0.7; // Compresión al 70%

            // Llame a la función de redimensionamiento y compresión
            resizeAndCompressImage(file, maxWidth, maxHeight, quality, (compressedBlob) => {
                // Continúe con el procesamiento aquí
                const img = URL.createObjectURL(compressedBlob);
                setUploadedImage(img);
			    setIsLoading(false); // Finalizar el indicador de carga
                
                setCurrentStep(1);
                //reset para cuando se carga desde el preview
                setRotation(0);
                setContrast(100);
                setBrightness(100);		
                setWidth(24);
                setHeight(24);
                setCrop({ x: 0, y: 0});
                setZoom(1);

                //downloadResizedImage(compressedBlob);
            });
        }
    };

    const resetImgFilters = () => {
        setRotation(0);
		setContrast(100);
		setBrightness(100);		
    }

    // Actualiza el estado cuando el recorte se completa
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		croppedAreaPixelsRef.current = croppedAreaPixels;		
	};

    //Cuando se hace click sobre el boton Next y estamos en crop
    //para que no haga crop cuando se hace zoom
    const handleCropClick = async () => {
		if (!cropperRef.current || width==0 || height == 0) {
			return;
		}
        setIsLoading(true);       
		const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixelsRef.current);
        setIsLoading(false);
		// Suponiendo que getCroppedImg devuelve una URL de la imagen
        resetImgFilters();
		setPreviewImage(croppedImage);

        goToNextStep();
    }

    // se utiliza para cuando se termine de dibujar moverse al paso proximo
	const goToStep4 = () => {
		/* setCurrentStep(4);
		setCurrentTip(8); */
	};

    // Función para avanzar al siguiente paso
	const goToNextStep = () => {
		setCurrentStep(prevStep => prevStep + 1); 
	};
	
	  // Función para retroceder al paso anterior
	const goToPreviousStep = () => {        
		setCurrentStep(prevStep => prevStep - 1);
        console.log("currentStep", currentStep);        
	};

    // Estilos para aplicar brillo, contraste y rotación en tiempo real
	const imageStyle = {
		//filter: `brightness(${brightness}%) contrast(${contrast}%)`,		
		transition: 'filter 0.3s ease, transform 0.3s ease'
	};
    
    /**
	 * Cambia tamaño de bloques
	 */
	const handlerBlockSize = (size) =>{
		setBlockSize(size);
	}

    const handleWidth = (event) => {
		let { min, max, value } = event.target;		
		setWidth(value);
	};	
    // cuando pierde e foco
    const handleWidthAdjustment = (event) => {
        let { min, max, value } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setWidth(value);
        setBlockSize(value % 2 === 0 ? 2 : 1);
    }
	
	const handleHeight = (event) => {
		let { min, max, value } = event.target;
		setHeight(value);
	};

    // cuando pierde e foco
    const handleHeightAdjustment = (event) => {
        let { min, max, value } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setHeight(value);
        setBlockSize(value % 2 === 0 ? 2 : 1);
    }

    const handlerConfirmImage = async () => {
        setActiveButton("");
    }

    	/**
	 * Click sobre uno de los botones de edicion
	 */
	const editBtnHandler = (btn) => {
		setActiveButton(btn);	
	}	

    const handlePanelPreview = async () => {
        setIsLoading(true);
        const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixelsRef.current, rotation, brightness, contrast);
        // Suponiendo que getCroppedImg devuelve una URL de la imagen
        setPreviewImage(croppedImage);
        goToNextStep();
    }

  return (
    <div className='main-wrapper' style={{ width: '100vw', height: viewportHeight}}>
        <header className='mb-header'>
        <div className="mb-header-inner">
				<div className="header-inner-item-1">
					<a href="#"><img src={theme == 'dark'? "images/woodxel-white.png" :"images/woodxel-black.png"} alt=""/></a>					
				</div>				
			</div>	
        </header>

        <div className="mb-step-area">
            <div className='canvas-area'>
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
                {currentStep !== 0 && currentStep !== 3 && currentStep !== 4 && (
                    <div className="step-item2-inner11">
                        <div className='action_buttons btn-preview-upload'>
                           {/*  <img src="images/gallery-send-svgrepo.png"/>         */}
                              <UploadPreview/>                        
                        </div>
                                
                        <input type="file" onChange={handleImageChange} accept="image/*" title=''/>							
				    </div>
                )
                }                
                {currentStep === 0 && (
                    <>							
						<input type="file" onChange={handleImageChange} accept="image/*" title=""/>								
                         <div className="upload-description" >
                            <UploadSvgrepo/>                        
                            <h2>STEP 1: Upload your media</h2>
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
                    <img 
                        src={previewImage} 
                        alt="Preview" 
                        className='crop' 
                        style={{filter: `brightness(${brightness}%) contrast(${contrast}%)`, transition: 'filter 0.3s ease, transform 0.3s ease', transform: ` rotate(${rotation}deg)`}}
				    />
                )}
                {(currentStep == 3 || currentStep == 4) && (							
					<Scene3d
                        width={width*0.0254}
                        height={height*0.0254}
                        blockSize={blockSize*0.0254}
                        croppedImg = {previewImage}
                        onGroupRefChange={handleExportGroupRef}//cuando se cree el grupo en la escena 3d
                        theme={theme}
                        setPixelInfo = {setPixelInfo}
                        setProductImg = {setProductImg}
                        handleLoading={setIsLoading}
                        sceneRef = {sceneRef.current }
                        renderRef = {renderRef.current}
                        goToNextStep = {goToStep4}
                        btnSizeClick = {btnSizeClick.current}
						
					/>
				) }
            </div>            
        </div>
        <div className={`bottom-area ${isLoading || currentStep == 0 ? "step inactive" : ""}`}>
                {(currentStep === 0 || currentStep === 1) && (
                    <h2>STEP 2: Enter panel dimentions</h2>                    
                )}
                { currentStep === 2 && activeButton=="" && (
                    <h2>STEP 3: Edit your image</h2>
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
                    <h2>STEP 4: Select block size</h2>
                )}
                { currentStep == 4 && (
                <h2>STEP 5: Buying Options</h2>
                )}
                <div className={`step-actions-area ${isLoading ? "step inactive" : ""}`}>
                    {(currentStep === 0 || currentStep === 1) && (
                    <div>                        
                        <div className="form">							
                            <div className="inputs">
                            <label htmlFor="input_w">W</label>
                                <input id='input_w' className="input_w" type="number" min="24" max="300" value={width} 
                                onChange={handleWidth}
                                onFocus={(even)=>{even.target.select()}}
                                onBlur={handleWidthAdjustment}
                                />
                                <label htmlFor="input_h">H</label>                                
                                <input id='input_h' className="input_h" type="number" min="24" max="300" value={height} 
                                onChange={handleHeight}
                                onFocus={(even)=>{even.target.select()}}
                                onBlur={handleHeightAdjustment}                                
                                />
                                								
                            </div>                            
                                <div className='action_buttons' onClick={goToPreviousStep}>
                                    <Undo/>
                                </div>				
                        </div>
                    </div>
                    )}
                    { currentStep === 2 && activeButton=="" && (
                    <div>                        
                        <div className='wrapper_edit_buttons'>
                            <div className='buttons-list'>
                                <div
                                    className='action_buttons'
                                    onClick={() => editBtnHandler("contrast")}                                           
                                >
                                    <Contrast color='#344054'/>
                                </div>
                                <div className='action_buttons' onClick={() => editBtnHandler("brightness")} >
                                    <Brightness color='#344054'/>  
                                </div>                                
                                </div>							
                            <div className='action_buttons' onClick={ () => goToPreviousStep()}>
                                <Undo/>
                            </div>
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
                                    setRotation(parseInt(e.target.value));
                                }}
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
                            />
                        </div>
                    )}
                    { currentStep == 3 && (
                        <div>
                            <div className='wrapper_edit_buttons'>
                            <div className='buttons-list'>
                                <button className={`action_buttons ${blockSize == 1?"active":""}`} onClick={() => handlerBlockSize(1)}>1”
                                </button>
                                
                                <button className={`action_buttons ${blockSize == 2?"active":""} ${(width % 2 !== 0) || (height%2 !==0) ?"inactive":""}`} 
                                    onClick={() => handlerBlockSize(2)}>2”
                                </button>
                                
                                <button className={`action_buttons ${blockSize == 3?"active":""} ${(width % 3 !== 0) || (height%3 !==0) ?"inactive":""}`} 
                                    onClick={() => handlerBlockSize(3)}>3”
                                </button>
                            </div>
                                <button className='action_buttons' onClick={() => goToPreviousStep()}>
                                <Undo/>
                                </button>
                            </div>                            

                        </div>
                    )}
                    { currentStep == 4 && (
                        <div>
                            <BuyPanel
                            pixelatedImage = {pixelInfo.pixelatedImage}
                            colorsArray = {pixelInfo.colorsArray}
							colorDetails = {pixelInfo.colorDetails}
                            blockSize = {blockSize}
                            xBlocks = {Math.floor(width / blockSize)}
                            yBlocks = {Math.floor(height / blockSize)}
                            handleLoading = {setIsLoading}
						    productImg = {productImg}
                            mobile = {true}
                            />
                        </div>
                    )}

                </div>
                <div className='buttons-area'>
                    {currentStep === 2 && activeButton != "" && (
                        <button onClick={handlerConfirmImage}>Confirm</button>
                    )}
                    {currentStep == 2 && activeButton == "" && (
                        <button className={`step ${isLoading?"inactive":""}`} onClick={handlePanelPreview}>3D Panel preview</button>
                    )}
                    {currentStep == 3 && activeButton == "" && (
                        <button className={`step ${isLoading?"inactive":""}`} onClick={goToNextStep}>Buying options</button>
                    )}
                    {currentStep == 4 && (
                      <Export3d 
                      exportGroup={exportGroupRef}
                      handleLoading = {setIsLoading}
                      mobile={true}
                      />
                    )}
                    {(currentStep == 0 || currentStep == 1) && (                       
                        <button className={`step ${currentStep === 0 || width < 24 || width > 300 || height < 24 || height > 300 || isLoading?"inactive":""}`} 
                        onClick={handleCropClick}>Next</button>
                    )}
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
