"use client";
import IconButton from '@/app/components/IconButton';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import '@/app/css/style.css';
import Scene3d from "@/app/components/Scene3d";
import BuyPanel from '@/app/components/BuyPanel';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Switch from "react-switch";
import getCroppedImg from '@/app/libs/cropImage';
import { Brightness, Contrast, Locked, Moon, Sun,Tilt,Undo,Unlocked, UploadPreview, UploadSvgrepo } from '@/app/components/icons/SvgIcons';
import Export3d from '@/app/components/Export3d';
import { Blocks } from 'react-loader-spinner';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function Main() {

	const [uploadedImage, setUploadedImage] = useState("");
	const [previewImage, setPreviewImage] = useState(null);

	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const [theme, setTheme] = useState('light'); // Valor predeterminado
	
	const [pixelInfo, setPixelInfo] = useState({ // informacion de la imagen pixelada
		colorsArray: [],
		croppedImg: ""
	});

	const [productImg, setProductImg] = useState();

  // Definir tus filtros y las imágenes de muestra para cada uno  

	const [activeButton, setActiveButton] = useState("rotate"); 
	const [rotation, setRotation] = useState(0);
	const [contrast, setContrast] = useState(100);
	const [brightness, setBrightness] = useState(100);

	const [currentState, setCurrentState] = useState("upload");//upload,crop,view	
    
    /*Opciones del crop */
    const [width, setWidth] = useState(24);
    const [height, setHeight] = useState(24);
    const [crop, setCrop] = useState({ x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
	
	const [exportGroupRef, setExportGroupRef] = useState();

	const [blockSize, setBlockSize] = useState(2);//1,2,3	
	
	const cropperRef = useRef(null);

	const croppedAreaPixelsRef = useRef(null);

	const isSliderChangeRef = useRef(false);
	const meshes = useRef([]);//contiene las mallas de los bloques
	const svgShape = useRef();//contiene la silueta del hombre

	const manager = new THREE.LoadingManager();
	manager.onStart = function (url, itemsLoaded, itemsTotal) {
		setIsLoading(true);
		console.log('Comenzó la carga:', url, itemsLoaded, 'de', itemsTotal);
	};

	manager.onLoad = function () {		
		//setIsLoading(false); // Establece la carga como falsa cuando todo esté cargado 
		console.log('se cargaron todos');
		setIsLoading(false);
	};

	manager.onProgress = function (url, itemsLoaded, itemsTotal) {
		console.log('Cargando archivo: ' + url + '.\nCargados ' + itemsLoaded + ' de ' + itemsTotal + ' archivos.');
	};

	manager.onError = function (url) {
		console.log('Hubo un error al cargar ' + url);
	};

	// Función para cambiar el tema
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	// Efecto para actualizar el atributo data-theme
	useEffect(() => {
		console.log('Useeffect primero');
		const loaderSvg = new SVGLoader(manager);
		//cargar la geometría
		const loaderGltf = new GLTFLoader(manager);	
		//const models = ['bloque_optimizado.glb', 'bloque_optimizado.glb', 'bloque_optimizado.glb', 'bloque_optimizado.glb'];
		const models = ['v5_1.glb', 'v5_2.glb', 'v5_3.glb', 'v5_4.glb'];
					
		function loadCubos(url) {
			return new Promise((resolve, reject) => {
				loaderGltf.load(url, (gltf) => resolve(gltf), undefined, reject);
			});
		}

		const loadPromises = models.map(model => loadCubos(model));

		loadPromises.push( 
			new Promise((resolve, reject) => {
				loaderSvg.load('human_frontal_silhouette_by_ikaros_ainasoja.svg', (data) => {
					const paths = data.paths;
					for (let i = 0; i < paths.length; i++) {
						const path = paths[i];
					
						const material = new THREE.MeshBasicMaterial({
							color: new THREE.Color(0xdee2e6),
							side: THREE.DoubleSide,
							depthWrite: false
						});
					
						const shapes = path.toShapes(true);
					
						for (let j = 0; j < shapes.length; j++) {
							const shape = shapes[j];
							const geometry = new THREE.ShapeGeometry(shape);
							const mesh = new THREE.Mesh(geometry, material);
							mesh.scale.set(0.0032, -0.0032, 0.0032);
							mesh.name = "Man Shape";
							resolve(mesh);
						}
					}		
				}, undefined, reject);
			})
		);
		
		// Cargar todos los modelos

		Promise.all(loadPromises)
		.then((loadedModels) => {
			// Realiza cualquier otra operación que necesites después de cargar los modelos
			const mesh1 = loadedModels[0].scene.children[0];						
			const mesh2 = loadedModels[1].scene.children[0];						
			const mesh3 = loadedModels[2].scene.children[0];						
			const mesh4 = loadedModels[3].scene.children[0];
			meshes.current = [mesh1, mesh2, mesh3, mesh4];
			svgShape.current = loadedModels[4];
			console.log(meshes.current);
			console.log(svgShape.current);
			//crear snapshoot of the screen
		})
		.catch((err) => {
			alert("Some objects fail to load");
		});

	}, [])

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
		  setActiveButton("rotate"); 
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

	const handleExportGroupRef= (group)=>{
		setExportGroupRef(group);
	}
	
  return (
    <div className='app-container'>
		{console.log("re-render en page.js")}
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
                        {currentState == "crop" && (
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
                        )}
                        {currentState=="upload" && (
                            <>							
								<input type="file" onChange={handleImageChange} accept="image/*" title=""/>								
                                <div className="step-item-inner2" >
                                    <UploadSvgrepo/>
                                    <p style={{fontWeight: '700'}}>STEP 1: Upload your media or drop it here</p>
                                </div>
                            </>                               
                        )}
						{currentState == "view" && (							
							<Scene3d 
							width={width * 0.0254}
							height={height * 0.0254}
							blockSize={blockSize * 0.0254}
							croppedImg = {previewImage}
							onGroupRefChange={handleExportGroupRef}//cuando se cree el grupo en la escena 3d
							theme={theme}
							setPixelInfo = {setPixelInfo}
							setProductImg = {setProductImg}
							meshes = {meshes.current}
							svgShape = {svgShape.current}
							handleLoading = {setIsLoading}
							/>
						)}                   
					</div>
				</div>
				<div className="step-item2">
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
					<div className={`step-item2-inner2 step-item2-inner10 ${currentStep === 1 || currentStep !== 2 ? "step inactive" : ""}`}>
						<h2>STEP 2: Input panel size</h2>
						
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
									{currentStep == 2 ?  <Unlocked/> : <Locked/>}
								</button>	
							</Tippy>		
														
						</div>
					</div>
					<div className={`step-item2-inner3 step-item2-inner10 ${currentStep === 1 || currentStep !== 3 ? "step inactive" : ""}`}>
						<h2>STEP 3: Edit your image</h2>
						<div className='wrapper_edit_buttons'>
							<div className='buttons-list'>							
								<IconButton 
									isActive={activeButton == "rotate"?true:false} 
									onClick={() => editBtnHandler("rotate")}
									name = 'Rotate'
								>
									<Tilt color={activeButton == "rotate"?'#ffffff':'#344054'}></Tilt>
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
							<Tippy content="Back one step">
								<button className='action_buttons' onClick={ () => goToPreviousStep()}>
									<Undo/>
								</button>
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
					<div className={`step-item2-inner5 step-item2-inner10 ${currentStep === 1 || currentStep !== 4 || isLoading ? "step inactive" : ""}`}>
						<h2>STEP 4: Select block size</h2>
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
								<button className='action_buttons' onClick={() => goToPreviousStep()}>
									<Undo/>
								</button>
							</Tippy>
						</div>
						
					</div>
					<div className={`step-item2-inner6 ${currentStep === 1 || currentStep !== 4 || isLoading ? "step inactive" : ""}`}>
						<h2>STEP 5: Buying options</h2>
						<BuyPanel
						pixelatedImage = {pixelInfo.pixelatedImage}
						colorsArray = {pixelInfo.colorsArray}
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
				</div>
			</div>
		</div>		
    </div>
  )
}
