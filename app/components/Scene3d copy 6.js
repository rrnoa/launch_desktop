import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import pixelateImg from '@/app/libs/pixelate';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import DirectionalLightControl from '../libs/3d/controls/DirectionalLightControl';
import RectLightControl from '../libs/3d/controls/RectLightControl';
import AmbientLightControl from '../libs/3d/controls/AmbientLightControl';
import MaterialControl from '../libs/3d/controls/MaterialControl';
import RendererControl from '../libs/3d/controls/RendererControl';
import { Blocks } from  'react-loader-spinner';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';




const Escena3D = ({ width, height, blockSize, croppedImg, setPixelInfo, onGroupRefChange, theme='light', setProductImg, handleLoading, sceneRef, renderRef }) => {
    const canvasRef = useRef();
	const animationFrameId = useRef(); // Referencia para almacenar el ID del frame de animación
	//const dennisMaterialRef = useRef(null);
	const exportGroupRef = useRef(null);

	const inch = 0.0254;

	const snap = useRef(false);

	const models = ['v5_1.glb', 'v5_2.glb', 'v5_3.glb', 'v5_4.glb'];

	const meshesRef = useRef([]);
	const allColorsRef = useRef([]);

	const manager = new THREE.LoadingManager();
	manager.onStart = function (url, itemsLoaded, itemsTotal) {
		handleLoading(true);
		console.log('Comenzó la carga:', url, itemsLoaded, 'de', itemsTotal);
	};

	manager.onLoad = function () {	
		paintFrame(meshesRef.current, allColorsRef.current);
		handleLoading(false);
	};

	manager.onProgress = function (url, itemsLoaded, itemsTotal) {
		console.log('Cargando archivo: ' + url + '.\nCargados ' + itemsLoaded + ' de ' + itemsTotal + ' archivos.');
	};

	manager.onError = function (url) {
		console.log('Hubo un error al cargar ' + url);
	};
	
    useEffect(() => {
		console.log("----------------------useEffect Scene3d----------------------------");
		//handleLoading(true);
        const xBlocks = Math.round(width / blockSize);
		const yBlocks = Math.round(height / blockSize);
		let backColor = theme === 'light' ? 0xdee2e6 : 0x121212;
		sceneRef.background = new THREE.Color(backColor);
    	//const gui = new GUI();
		//gui.close();
		pixelateImg(croppedImg, xBlocks, yBlocks)
			.then((data) => {
				//despues de pixelada la imagen entonces se crea la escena
					const { imageURL, allColors } = data;
					allColorsRef.current = allColors;
					console.log(allColorsRef.current);
					setPixelInfo({ 
						pixelatedImage: imageURL, 
						colorsArray: allColors 
					});

				if (typeof window !== "undefined") {

					const paintAreaWidth = canvasRef.current?.offsetWidth;
					const paintAreaHeight = canvasRef.current?.offsetHeight;
					const camera = new THREE.PerspectiveCamera(45, paintAreaWidth / paintAreaHeight, 0.1, 100);
					const cameraZPosition = Math.max( width, height)+2;
					camera.position.z = cameraZPosition;
					camera.updateProjectionMatrix();			
					
					//console.log("----------",renderRef.capabilities.maxTextureSize);					
				
					renderRef.setSize(paintAreaWidth, paintAreaHeight);
					renderRef.setPixelRatio(window.devicePixelRatio);
					renderRef.shadowMap.enabled = true;
					//renderer.shadowMap.type = THREE.PCFSoftShadowMap;					
					//renderer.shadowMap.type = THREE.PCFShadowMap;
					renderRef.shadowMap.type = THREE.VSMShadowMap;

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
					//DirectionalLightControl(gui,directionalLight);
					//let shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
					//const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
					
					//scene.add( helper );
					
					//scene.add(shadowHelper);					
				 
					renderRef.toneMappingExposure = 1;
					directionalLight.shadow.camera.updateProjectionMatrix();
				
					//renderer.toneMapping = THREE.LinearToneMapping;
					renderRef.toneMapping = THREE.ACESFilmicToneMapping;
					canvasRef.current?.appendChild(renderRef.domElement);

					const ambientlight = new THREE.AmbientLight(0xffffff, 3);
					//AmbientLightControl(gui,ambientlight);
					
					//config cotrols
					const controls = new OrbitControls(camera, renderRef.domElement);
					//controls.minDistance = Math.max(5, Math.hypot(width, height)/4);
					controls.minDistance = 0.5;
					controls.maxDistance = 20;
					controls.enablePan = false;
					/* controls.maxPolarAngle = THREE.MathUtils.degToRad(92);
					controls.minPolarAngle = THREE.MathUtils.degToRad(45);
					controls.maxAzimuthAngle = THREE.MathUtils.degToRad(60);
					controls.minAzimuthAngle = THREE.MathUtils.degToRad(-60);  */
					controls.update();

					sceneRef.add(ambientlight);
					sceneRef.add(directionalLight);

					const floorWidth = 1000;
					const floorDepth = 600;
					const floorGeometry = new THREE.PlaneGeometry( floorWidth, floorDepth );
					const floorColor = theme === 'light' ?0xbbbbbb : 0x121212;
					const floorMaterial = new THREE.MeshStandardMaterial( { color: floorColor } );

					floorMaterial.side = THREE.DoubleSide;
					const floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
					floorMesh.rotateX(Math.PI/2);
					floorMesh.position.set(0, - height/2 -0.001, floorDepth/2 - 3 );
					floorMesh.receiveShadow = false;
					sceneRef.add( floorMesh );

					const wallHeight = 30;
					const wallWidth = 100;
					const wallGeometry = new THREE.PlaneGeometry( wallWidth, wallHeight );
					const wallColor = theme === 'light' ? 0xffffff : 0x121212;
					const wallMaterial = new THREE.MeshStandardMaterial( { color: wallColor } );
					wallMaterial.side = THREE.DoubleSide;
					const wallMesh = new THREE.Mesh( wallGeometry, wallMaterial );
					//la altura del muro / 2, menos la mitad de la altura del cuadro
					wallMesh.position.set(0, wallHeight/2 - Math.ceil(height/2) , -inch );
					wallMesh.receiveShadow = true;
					wallMesh.castShadow = false;
					sceneRef.add( wallMesh );
					
					// Render the scene and camera
					const animate = () => {
						//animationFrameId.current = requestAnimationFrame(renderScene);
						requestAnimationFrame(animate);
						controls.update();
						renderRef.render(sceneRef, camera);
						/* if(snap.current){
							snapshot();
							snap.current = false;
						} */
					};
				  
					// Call the renderScene function to start the animation loop
					animate();	

					const loaderSvg = new SVGLoader(manager);
					//cargar la geometría
					const loaderGltf = new GLTFLoader(manager);	
					//const models = ['bloque_optimizado.glb', 'bloque_optimizado.glb', 'bloque_optimizado.glb', 'bloque_optimizado.glb'];
					//const meshes = [];
					for (let index = 0; index < models.length; index++) {
						loaderGltf.load(models[index], 
							(gltf)=> meshesRef.current.push(gltf.scene.children[0]));
					}
					loaderSvg.load('human_frontal_silhouette_by_ikaros_ainasoja.svg', (data) => {
						const paths = data.paths;
						for (let i = 0; i < paths.length; i++) {
							const path = paths[i];
						
							const material = new THREE.MeshStandardMaterial({
								color: new THREE.Color(0xdee2e6),
								side: THREE.DoubleSide,
								depthWrite: false,								
							});
						
							const shapes = path.toShapes(true);
						
							for (let j = 0; j < shapes.length; j++) {
								const shape = shapes[j];
								const geometry = new THREE.ShapeGeometry(shape);
								const mesh = new THREE.Mesh(geometry, material);
								mesh.scale.set(0.0032, -0.0032, 0.0032);
								mesh.name = "Man Shape";
								mesh.position.set(-1.36 - width/2 - 0.5, - height/2 + 1.79, inch);
								sceneRef.add(mesh);
							}
						}		
					});

					//paintFrame(meshes, allColors);

					
					//handleLoading(false);
					snap.current = true;
					
					//MaterialControl(gui, material);
					//RendererControl(gui, renderer);

					/* fetch("jueves_config.json")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						console.log("json",data);
						gui.load(data);						
						//repositionLights(rectLight, directionalLightRef.current, scene);
					})
					.catch((error) => console.error("Error fetching the json:", error)); */

					/* const onResize = () => {
						if (canvasRef.current && renderRef.current) {
							const width = canvasRef.current.offsetWidth;
							const height = canvasRef.current.offsetHeight;
				
							renderRef.current.setSize(width, height);
							cameraRef.current.aspect = width / height;
							cameraRef.current.updateProjectionMatrix();

						}
					};
				
					window.addEventListener('resize', onResize);				
 				*/
				}
			});

			//const canvasElements = document.querySelectorAll('canvas');
    		//console.log(`Número de elementos <canvas>: ${canvasElements.length}`);
			
			// Función de limpieza
			return () => {
				console.log("desmontando");		
				if (canvasRef.current) {
					canvasRef.current.removeChild(renderRef.domElement);
				}
				renderRef.dispose();
				/* //window.removeEventListener('resize', onResize);
				gui.destroy();*/
				cancelAnimationFrame(animationFrameId.current);
				removeObjWithChildren(sceneRef);
				console.log('After clean scene', sceneRef);
				
			};
    }, [blockSize]); // Dependencias del efecto	
	
	const toggleSnap = () => {
		snap.current = true;
	}

	const snapshot = () => {
		// Tamaño de la región que deseas capturar
		const regionWidth = 150;
		const regionHeight = 150;

		let canvas = renderRef.current.domElement;

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
		  //obj.geometry = undefined;
		}
		if (obj.material) {
		  if (Array.isArray(obj.material)) {
			for (let material of obj.material) {
			  if (material.map) material.map.dispose();
			  if (material.metalnessMap) material.metalnessMap.dispose();
			  if (material.normalMap) material.metalnessMap.dispose();
			  material.dispose();
			  //material = undefined;
			}
		  } else {			
			  if (obj.material.map) obj.material.map.dispose();
			  if (obj.material.metalnessMap) obj.material.metalnessMap.dispose();
			  if (obj.material.normalMap) obj.material.metalnessMap.dispose();
				obj.material.dispose();
				//obj.material = undefined
		  }
		}
		if (obj.parent) {
		  obj.parent.remove(obj);
		}
	}
	

	const paintFrame = (meshes, allColors) => {

		exportGroupRef.current = new THREE.Group();
	
		const currentXBlocks = Math.round(width / blockSize); //la cantidad de bloques disminuye si aumenta el tama;o del bloque
		const currentYBlocks = Math.round(height / blockSize);

		// Calcula el desplazamiento necesario para que (0, 0, 0) quede en el centro del cuadro
		const offsetX = -(currentXBlocks - 1) * blockSize * 0.5;
		const offsetY = -(currentYBlocks - 1) * blockSize * 0.5;	
	
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
		let organizedByMaterial = meshes.map(() => []);
		blockInfos.forEach((blockInfo) => {
		  organizedByMaterial[blockInfo.materialIndex].push(blockInfo);
		});

		const geometry = meshes[0].geometry; //cualquier geometria porque todas son iguales
		geometry.scale(blockSize/2 , blockSize/2 , blockSize/2 );
	
		//---------------------aqui se contruyen las instancedMesh---------------
		organizedByMaterial.forEach((blocksForMaterial, index) => {				
			const material = meshes[index].material;
			material.vertexColors = true;
			material.metalness = 0;
			material.emissiveIntensity = 0;
			material.needsUpdate = true;
			material.color = new THREE.Color(0xffffff);
			const instancedMesh = new THREE.InstancedMesh(//crea un instancedMesh
				geometry.clone(),
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
			
			sceneRef.add(instancedMesh);
			//convertInstancedMeshToGroup(instancedMesh, instaceColors);
			
		});// fin del siclo donde se crean las instancedMesh

		console.log("Paint frame",sceneRef);
		//onGroupRefChange(exportGroupRef.current);//devuelve al padre el grupo con todos los mesh para exportar

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
		 	{console.log('re-render Scene-3D')}
    		<div ref={canvasRef} style={{ width: '100%', height: '100%'}} />
		{/* <button onClick={toggleSnap}>Imagen</button> */}
		</>
    );
};

export default Escena3D;
