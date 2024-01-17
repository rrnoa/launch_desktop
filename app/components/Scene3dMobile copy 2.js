import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import pixelateImg from '@/app/libs/pixelate';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import DirectionalLightControl from '../libs/3d/controls/DirectionalLightControl';
import RectLightControl from '../libs/3d/controls/RectLightControl';
import AmbientLightControl from '../libs/3d/controls/AmbientLightControl';
import MaterialControl from '../libs/3d/controls/MaterialControl';
import RendererControl from '../libs/3d/controls/RendererControl';
import { Blocks } from  'react-loader-spinner';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';


const Escena3D = ({ width, height, blockSize, croppedImg, setPixelInfo, onExport, theme='light', setProductImg, handleLoading, sceneRef, renderRef}) => {
    const canvasRef = useRef();
	const animationFrameId = useRef(); // Referencia para almacenar el ID del frame de animación
	const floorMaterialRef = useRef(null);
	const wallMaterialRef = useRef(null);
	//const dennisMaterialRef = useRef(null);
	const exportGroupRef = useRef(null);
	const cameraRef = useRef(null);
	const controlsRef = useRef(null);	

	const inch = 0.0254;

	const [isLoading, setIsLoading] = useState(true);
	const [lastZoomRange, setLastZoomRange] = useState(null);

	const manager = new THREE.LoadingManager();
	manager.onStart = function (url, itemsLoaded, itemsTotal) {
		//console.log('Comenzó la carga:', url, itemsLoaded, 'de', itemsTotal);
	};

	manager.onLoad = function () {		
		setIsLoading(false); // Establece la carga como falsa cuando todo esté cargado  		
	};

	manager.onProgress = function (url, itemsLoaded, itemsTotal) {
		//console.log('Cargando archivo: ' + url + '.\nCargados ' + itemsLoaded + ' de ' + itemsTotal + ' archivos.');
	};

	manager.onError = function (url) {
		//console.log('Hubo un error al cargar ' + url);
	};	

	useEffect(() => {
		if(sceneRef.current){
			// Suponiendo que tienes una referencia a tu escena de Three.js
			if (theme === 'light') {
				sceneRef.current.background = new THREE.Color(0xdee2e6); // Fondo blanco para tema claro
				wallMaterialRef.current.color = new THREE.Color(0xFFFFFF);
				floorMaterialRef.current.color = new THREE.Color(0xdee2e6);
				//dennisMaterialRef.current.color = new THREE.Color(0xdee2e6);
				
			} else if (theme === 'dark') {
				sceneRef.current.background = new THREE.Color(0x292929); // Fondo negro para tema oscuro
				wallMaterialRef.current.color = new THREE.Color(0x292929);
				floorMaterialRef.current.color = new THREE.Color(0x292929);
				//dennisMaterialRef.current.color = new THREE.Color(0x121212);
			}
		}	
	
	}, [theme]); // Dependencia del efecto: se ejecuta cuando 'theme' cambia
	
    useEffect(() => {
		console.log("useEffect Scene3d");
		if(!isLoading) setIsLoading(true);
        const xBlocks = Math.round(width / blockSize);
		const yBlocks = Math.round(height / blockSize);
		const scene = new THREE.Scene();
		sceneRef.current = scene; // Almacena la escena en la referencia

		let backColor = theme === 'light' ? 0xdee2e6 : 0x121212;
		scene.background = new THREE.Color(backColor);
    	const gui = new GUI();
		gui.close();
		pixelateImg(croppedImg, xBlocks, yBlocks)
			.then((data) => {
				//despues de pixelada la imagen entonces se crea la escena
					const { imageURL, allColors } = data;
					setPixelInfo({ 
						pixelatedImage: imageURL, 
						colorsArray: allColors 
					});

				if (typeof window !== "undefined") {

					const paintAreaWidth = canvasRef.current?.offsetWidth;
					const paintAreaHeight = canvasRef.current?.offsetHeight;
					cameraRef.current = new THREE.PerspectiveCamera(45, paintAreaWidth / paintAreaHeight, 0.1, 100);
					const cameraZPosition = Math.max( width, height)+2;
					cameraRef.current.position.z = calculateCameraInitialPosition();
					cameraRef.current.updateProjectionMatrix();
				
					const renderer = new THREE.WebGLRenderer({ antialias: true });
					console.log("----------",renderer.capabilities.maxTextureSize);
					
					renderRef.current = renderer; 
				
					renderer.setSize(paintAreaWidth, paintAreaHeight);
					renderer.setPixelRatio(window.devicePixelRatio);
					renderer.shadowMap.enabled = true;
					//renderer.shadowMap.type = THREE.PCFSoftShadowMap;					
					//renderer.shadowMap.type = THREE.PCFShadowMap;
					renderer.shadowMap.type = THREE.VSMShadowMap;

					const directionalLight = new THREE.DirectionalLight(0xffffff, 3)

					//DirectionalLightControl(gui, directionalLight);
					directionalLight.castShadow = true;
					directionalLight.position.x = 0.5;
					directionalLight.position.y = 2;
					directionalLight.position.z = 1;
					directionalLight.shadow.camera.far = 20;
		
					directionalLight.shadow.camera.top = height / 2 + 0.1;
					directionalLight.shadow.camera.left = - (width) / 2 - 0.1 ;
					directionalLight.shadow.camera.right = (width ) / 2 + 0.1;
					directionalLight.shadow.camera.bottom = - (height) / 2 - 0.1;
					directionalLight.shadow.mapSize.width = 1024;
					directionalLight.shadow.mapSize.height = 1024; 

					directionalLight.shadow.radius = 2;
					directionalLight.shadow.blurSamples = 4;
					//directionalLight.shadow.bias = 0.00002;
					directionalLight.shadow.bias = -0.0001;
					/* let shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
					const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
					
					scene.add( helper );
					
					scene.add(shadowHelper);					
				 */
					renderer.toneMappingExposure = 1;
					directionalLight.shadow.camera.updateProjectionMatrix();
				
					//renderer.toneMapping = THREE.LinearToneMapping;
					renderer.toneMapping = THREE.ACESFilmicToneMapping;
					canvasRef.current?.appendChild(renderer.domElement);

					const ambientlight = new THREE.AmbientLight(0xffffff, 4);
					AmbientLightControl(gui,ambientlight);
					
					//config cotrols
					controlsRef.current = new OrbitControls(cameraRef.current, renderer.domElement);
					//controlsRef.current.minDistance = Math.max(5, Math.hypot(width, height)/4);
					controlsRef.current.minDistance = 0.5;
					controlsRef.current.maxDistance = 20;
					controlsRef.current.enablePan = false;
					controlsRef.current.maxPolarAngle = THREE.MathUtils.degToRad(92);
					controlsRef.current.minPolarAngle = THREE.MathUtils.degToRad(45);
					controlsRef.current.maxAzimuthAngle = THREE.MathUtils.degToRad(60);
					controlsRef.current.minAzimuthAngle = THREE.MathUtils.degToRad(-60); 
					controlsRef.current.update();

					scene.add(ambientlight);
					scene.add(directionalLight);

					const material = new THREE.MeshStandardMaterial();

					const floorWidth = 1000;
					const floorDepth = 600;
					const floorGeometry = new THREE.PlaneGeometry( floorWidth, floorDepth );
					const floorColor = theme === 'light' ?0xbbbbbb : 0x121212;
					floorMaterialRef.current = new THREE.MeshStandardMaterial( { color: floorColor } );

					floorMaterialRef.current.side = THREE.DoubleSide;
					const floorMesh = new THREE.Mesh( floorGeometry, floorMaterialRef.current );
					floorMesh.rotateX(Math.PI/2);
					floorMesh.position.set(0, - height/2 -0.001, floorDepth/2 - 3 );
					floorMesh.receiveShadow = true;
					scene.add( floorMesh );

					const wallHeight = 30;
					const wallWidth = 100;
					const wallGeometry = new THREE.PlaneGeometry( wallWidth, wallHeight );
					const wallColor = theme === 'light' ? 0xffffff : 0x121212;
					wallMaterialRef.current = new THREE.MeshStandardMaterial( { color: wallColor } );
					wallMaterialRef.current.side = THREE.DoubleSide;
					const wallMesh = new THREE.Mesh( wallGeometry, wallMaterialRef.current );
					//la altura del muro / 2, menos la mitad de la altura del cuadro
					wallMesh.position.set(0, wallHeight/2 - Math.ceil(height/2) , -2*inch );
					wallMesh.receiveShadow = true;
					scene.add( wallMesh );
					const loaderSvg = new SVGLoader(manager);
					//cargar la geometría
					const loader = new OBJLoader(manager);
					loader.load("CUBO.obj", function (object) {						
						const blockGeometry = object.children[0].geometry;

						paintFrame(scene, blockGeometry, allColors, material);
						
						loaderSvg.load('human_frontal_silhouette_by_ikaros_ainasoja.svg', function(data) {
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
									mesh.position.set(-1.36 - width/2 - 0.5, - height/2 + 1.79, -inch);
									scene.add(mesh);
								}
							}
						
						});
						
					});
					
					// Render the scene and camera
					const renderScene = () => {
						//console.log(cameraRef.current.position.z,'width:' ,width/0.0254);
						renderer.render(scene, cameraRef.current);
						animationFrameId.current = requestAnimationFrame(renderScene);
					};
				  
					// Call the renderScene function to start the animation loop
					renderScene();				
					
					MaterialControl(gui, material);
					//RendererControl(gui, renderer);

					fetch("jueves_config.json")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						console.log("json",data);
						//gui.load(data);						
						//repositionLights(rectLight, directionalLightRef.current, scene);
					})
					.catch((error) => console.error("Error fetching the json:", error));

					const onResize = () => {
						if (canvasRef.current && renderRef.current) {
							const width = canvasRef.current.offsetWidth;
							const height = canvasRef.current.offsetHeight;
				
							renderRef.current.setSize(width, height);
							cameraRef.current.aspect = width / height;
							cameraRef.current.updateProjectionMatrix();

						}
					};
				
					window.addEventListener('resize', onResize);				

				}
			});
			
			// Función de limpieza
			return () => {
				console.log("desmontando");				
				//window.removeEventListener('resize', onResize);
				gui.destroy();
				cancelAnimationFrame(animationFrameId.current);
				removeObjWithChildren(scene);
				// Eliminar el canvas del DOM
				if (canvasRef.current && renderRef.current?.domElement) {
					canvasRef.current.removeChild(renderRef.current.domElement);
				}
			};
    }, [blockSize]); // Dependencias del efecto	

	const calculateCameraInitialPosition = () => {
		//return (width/0.0254)*4/24;
		return 0.04808 * width/0.0254 + 2.84608;
	}
	const handleSomeAction = () => {
        if (onExport && exportGroupRef.current) {
            onExport(exportGroupRef.current);
        }

		//onExport(sceneRef.current);

    };

	const snapshot = () => {
		// Tamaño de la región que deseas capturar
		const regionWidth = 150;
		const regionHeight = 150;

		let canvas = renderRef.domElement;

		// Calcula el centro del canvas original
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		const x = centerX - regionWidth / 2;
		const y = centerY - regionHeight / 2;

		// Crea un canvas temporal y captura la región
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = regionWidth;
		tempCanvas.height = regionHeight;
		const tempCtx = tempCanvas.getContext('2d');

		// Dibuja la región centrada en el canvas temporal
		tempCtx.drawImage(canvas, x, y, regionWidth, regionHeight, 0, 0, regionWidth, regionHeight);

		// Obtén la imagen de la región como data URL
		var dataURL = tempCanvas.toDataURL('image/jpeg', 1); // 80% de calidad
		// Opcional: si quieres descargar la imagen
		/* var link = document.createElement('a');
		link.href = dataURL;
		link.download = 'mi-captura.jpg';
		link.click(); */
		setProductImg(dataURL);
	}

	//limpiar la escena
	const removeObjWithChildren = (obj) => {
		while (obj.children.length > 0) {
		  removeObjWithChildren(obj.children[0]);
		}
		if (obj.geometry) {
		  obj.geometry.dispose();
		}
		if (obj.material) {
		  if (Array.isArray(obj.material)) {
			for (const material of obj.material) {
			  if (material.map) {
				material.map.dispose();
			  }
			  material.dispose();
			}
		  } else {
			if (obj.material.map) {
			  obj.material.map.dispose();
			}
			obj.material.dispose();
		  }
		}
		if (obj.parent) {
		  obj.parent.remove(obj);
		}
	}
	

	const paintFrame = (scene, blockGeometry, allColors, material) => {

		exportGroupRef.current = new THREE.Group();

		blockGeometry.scale(blockSize , blockSize , blockSize );
	
		const currentXBlocks = Math.round(width / blockSize); //la cantidad de bloques disminuye si aumenta el tama;o del bloque
		const currentYBlocks = Math.round(height / blockSize);
		// Calcula el desplazamiento necesario para que (0, 0, 0) quede en el centro del cuadro
		const offsetX = -(currentXBlocks - 1) * blockSize * 0.5;
		const offsetY = -(currentYBlocks - 1) * blockSize * 0.5;	
	
		const diffuseMaps = [
		  "textures/mobile/Textura1_Albedo.jpg",
		  "textures/mobile/Textura2_Albedo.jpg",
		  "textures/mobile/Textura3_Albedo.jpg",
		  "textures/mobile/Textura4_Albedo.jpg",
		  // Agrega más texturas aquí
		];
	
		const roughnessMaps = [
		  "textures/mobile/Textura1_Roughness.jpg",
		  "textures/mobile/Textura2_Roughness.jpg",
		  "textures/mobile/Textura3_Roughness.jpg",
		  "textures/mobile/Textura4_Roughness.jpg",
		];
	
		const normalMaps = [
		  "textures/mobile/Textura1_Normal.jpg",
		  "textures/mobile/Textura2_Normal.jpg",
		  "textures/mobile/Textura3_Normal.jpg",
		  "textures/mobile/Textura4_Normal.jpg",
		];
	
		const diffuseTextures = [];
		const roughnessTextures = [];
		const normalTextures = [];
		const textureLoader = new THREE.TextureLoader(manager);
		 //cargar texturas diffuse
		for (const texturePath of diffuseMaps) {
		  const texture = textureLoader.load(texturePath);
		  diffuseTextures.push(texture);
		}
		//cargar texturas roughness
		for (const texturePath of roughnessMaps) {
		  const texture = textureLoader.load(texturePath);
		  roughnessTextures.push(texture);
		}
	
		for (const texturePath of normalMaps) {
		  const texture = textureLoader.load(texturePath);
		  normalTextures.push(texture);
		} 
	
		// Preparar los 4 materiales
		const material1 = material.clone();
		material1.map = diffuseTextures[0];
		material1.roughnessMap = roughnessTextures[0];
		material1.normalMap = normalTextures[0];
		material1.vertexColors = true;
		material1.needsUpdate = true;
	
		const material2 = material.clone();
		material2.map = diffuseTextures[1];
		material2.roughnessMap = roughnessTextures[1];
		material2.normalMap = normalTextures[1];
		material2.vertexColors = true;
		material2.needsUpdate = true;
	
		const material3 = material.clone();
		material3.map = diffuseTextures[2];
		material3.roughnessMap = roughnessTextures[2];
		material3.normalMap = normalTextures[2];
		material3.vertexColors = true;
		material3.needsUpdate = true;
	
		const material4 = material.clone();
		material4.map = diffuseTextures[3];
		material4.roughnessMap = roughnessTextures[3];
		material4.normalMap = normalTextures[3];
		material4.vertexColors = true;
		material4.needsUpdate = true;
	
		let materials = [material1, material2, material3, material4];
	
		//de cada bloque guarda su color y su posicion y el materrial que le toca
		let blockInfos = allColors.map((color, index) => {
		  const matrix = new THREE.Matrix4();
		  const fila = Math.floor(index / currentXBlocks);
		  const columna = index % currentXBlocks;
		  const posX = columna * blockSize + offsetX;
		  const posY = -fila * blockSize - offsetY;
		  matrix.setPosition(posX, posY, 0);
	
		  const materialIndex = Math.floor(Math.random() * 4);
	
		  return {
			materialIndex: materialIndex,
			matrix: matrix,
			color: color,
			rotation: null, // La rotación se definirá en el siguiente paso
		  };
		});
	
		blockInfos.forEach((block, index) => {
		  const availableRotations = getAvailableRotations(
			index,
			blockInfos,
			currentXBlocks
		  );
	
		  const randomRotation =
			availableRotations[
			  Math.floor(Math.random() * availableRotations.length)
			];
	
		  const rotationMatrix = new THREE.Matrix4().makeRotationZ(randomRotation);
		  block.matrix.multiply(rotationMatrix);
		  block.rotation = randomRotation;
		});  
	
		//por cada material le asigna los bloques que le corresponden
		let organizedByMaterial = materials.map(() => []);
		blockInfos.forEach((blockInfo) => {
		  organizedByMaterial[blockInfo.materialIndex].push(blockInfo);
		});
		//console.log(organizedByMaterial );
		blockGeometry.rotateX(Math.PI / 2);
	
		//---------------------aqui se contruyen las instancedMesh---------------
		organizedByMaterial.forEach((blocksForMaterial, index) => {	
		
			const material = materials[index];
			const instancedMesh = new THREE.InstancedMesh(//crea un instancedMesh
				blockGeometry.clone(),
				material,
				blocksForMaterial.length
			);
			instancedMesh.castShadow = true;
			instancedMesh.receiveShadow = true;
			const allColorsBuffer = new THREE.InstancedBufferAttribute(
				new Float32Array(blocksForMaterial.length * 3),
				3
			);

			//almacenar los colores de esa instancia para pasarlos al convertidor
			let instaceColors = [];

			//cada MATERIAL tine un grupo de bloques asignados, aqui se recorre cada bloque de ese material
			blocksForMaterial.forEach((blockInfo, instanceIndex) => {
				instancedMesh.setMatrixAt(instanceIndex, blockInfo.matrix);
				let color = new THREE.Color(rgbC(blockInfo.color));//se puede optimizar
				instaceColors.push(color);
				allColorsBuffer.setXYZ(instanceIndex, color.r, color.g, color.b);
			});

			instancedMesh.geometry.setAttribute("color", allColorsBuffer);

			instancedMesh.instanceMatrix.needsUpdate = true;		
			
			sceneRef.current.add(instancedMesh);
			convertInstancedMeshToGroup(instancedMesh, instaceColors);
			
		});// fin del siclo donde se crean las instancedMesh	  
	};//fin de PaintFrame

	const convertInstancedMeshToGroup = (instancedMesh, instaceColors)=> {

		for (let i = 0; i < instancedMesh.count; i++) {
			const matrix = new THREE.Matrix4();
			instancedMesh.getMatrixAt(i, matrix);

			const geometryClone = instancedMesh.geometry.clone();
			geometryClone.deleteAttribute('color');
			const materialClone = instancedMesh.material.clone();

			const mesh1 = new THREE.Mesh(geometryClone, materialClone);
			
			// Suponiendo que tienes un array de colores para cada instancia
			mesh1.material.color.set(instaceColors[i]); // 'colors' es un array de colores correspondiente a cada instancia

			mesh1.applyMatrix4(matrix);
			exportGroupRef.current.add(mesh1);
		}

	}	  
	
	  const getAvailableRotations = (index, blockInfos, currentXBlocks) => {
		let rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]; // 0, 90, 180, 270 grados
		let usedRotations = [];
	
		// Adyacente Norte
		if (index >= currentXBlocks) {
		  usedRotations.push(blockInfos[index - currentXBlocks].rotation);
		}
	
		// Adyacente Sur
		let newIndex = index + Number(currentXBlocks);
		if (newIndex < blockInfos.length) {
		  usedRotations.push(blockInfos[newIndex].rotation);
		}
	
		// Adyacente Este
		if (index % currentXBlocks !== currentXBlocks - 1) {
		  usedRotations.push(blockInfos[index + 1].rotation);
		}
	
		// Adyacente Oeste
		if (index % currentXBlocks !== 0) {
		  usedRotations.push(blockInfos[index - 1].rotation);
		}
	
		let availableRotations = rotations.filter(
		  (rotation) => !usedRotations.includes(rotation)
		);
	
		return availableRotations;
	  };
	
	  //Create color string
	  const rgbC = (arr) => {
		return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
	  };
	
    return (
		 <>
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
    		<div ref={canvasRef} style={{ width: '100%', height: '100%'}} />
		</>
    );
};

export default Escena3D;
