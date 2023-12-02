import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import pixelateImg from '@/app/libs/pixelate';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import DirectionalLightControl from '../libs/3d/controls/DirectionalLightControl';
import RectLightControl from '../libs/3d/controls/RectLightControl';
import AmbientLightControl from '../libs/3d/controls/AmbientLightControl';
import MaterialControl from '../libs/3d/controls/MaterialControl';
import RendererControl from '../libs/3d/controls/RendererControl';


const Escena3D = ({ width, height, blockSize, croppedImg, setPixelInfo, onExport, theme='light'}) => {
    const canvasRef = useRef();
	const animationFrameId = useRef(); // Referencia para almacenar el ID del frame de animación
	const renderRef = useRef();
	const sceneRef = useRef(null); // Referencia para la escena
	const floorMaterialRef = useRef(null);
	const wallMaterialRef = useRef(null);
	const dennisMaterialRef = useRef(null);

	useEffect(() => {
		if(sceneRef.current){
			// Suponiendo que tienes una referencia a tu escena de Three.js
			if (theme === 'light') {
				sceneRef.current.background = new THREE.Color(0xdee2e6); // Fondo blanco para tema claro
				wallMaterialRef.current.color = new THREE.Color(0xFFFFFF);
				floorMaterialRef.current.color = new THREE.Color(0xdee2e6);
				dennisMaterialRef.current.color = new THREE.Color(0xdee2e6);
				
			} else if (theme === 'dark') {
				sceneRef.current.background = new THREE.Color(0x292929); // Fondo negro para tema oscuro
				wallMaterialRef.current.color = new THREE.Color(0x292929);
				floorMaterialRef.current.color = new THREE.Color(0x292929);
				dennisMaterialRef.current.color = new THREE.Color(0x121212);
			}
		}	
	
	}, [theme]); // Dependencia del efecto: se ejecuta cuando 'theme' cambia
	
    useEffect(() => {
		console.log("useEffect Scene3d");
        const xBlocks = Math.floor(width / blockSize);
		const yBlocks = Math.floor(height / blockSize);
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
					const camera = new THREE.PerspectiveCamera(75, paintAreaWidth / paintAreaHeight, 2, 1000);
					const cameraZPosition = Math.max( width, height)+40;
					camera.position.z = cameraZPosition;
					camera.updateProjectionMatrix();
				
					const renderer = new THREE.WebGLRenderer({ antialias: true });
					renderRef.current = renderer; 
				
					renderer.setSize(paintAreaWidth, paintAreaHeight);
					renderer.setPixelRatio(window.devicePixelRatio);
					renderer.shadowMap.enabled = true;
					renderer.shadowMap.type = THREE.PCFShadowMap;
				
					renderer.toneMappingExposure = 1;
				
					renderer.toneMapping = THREE.LinearToneMapping;
					canvasRef.current?.appendChild(renderer.domElement);


					const rectLight = new THREE.RectAreaLight(0xffffff, 1, 24, 1);
					const ambientlight = new THREE.AmbientLight(0xffffff, 1);
					const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
					directionalLight.castShadow = true;
					//config cotrols
					const controls = new OrbitControls(camera, renderer.domElement);
					//controls.minDistance = Math.max( width, height);
					controls.maxDistance = cameraZPosition * 1.5;
					controls.enablePan = false;
					controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
					controls.minPolarAngle = THREE.MathUtils.degToRad(45);
					controls.maxAzimuthAngle = THREE.MathUtils.degToRad(30);
					controls.minAzimuthAngle = THREE.MathUtils.degToRad(-30);
					controls.update();

					scene.add(ambientlight);
					scene.add(rectLight);
					scene.add(directionalLight);
					const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

					const floorWidth = 1000;
					const floorDepth = 600;
					const floorGeometry = new THREE.PlaneGeometry( floorWidth, floorDepth );
					const floorColor = theme === 'light' ? 0xdee2e6 : 0x121212;
					floorMaterialRef.current = new THREE.MeshStandardMaterial( { color: floorColor } );

					floorMaterialRef.current.side = THREE.DoubleSide;
					const floorMesh = new THREE.Mesh( floorGeometry, floorMaterialRef.current );
					floorMesh.rotateX(Math.PI/2);
					floorMesh.position.set(0, - Math.ceil(height/2), floorDepth/2 - 3 );
					floorMesh.receiveShadow = true;
					//scene.add( floorMesh );

					const wallHeight = 1000;
					const wallWidth = 1000;
					const wallGeometry = new THREE.PlaneGeometry( wallWidth, wallHeight );
					const wallColor = theme === 'light' ? 0xffffff : 0x121212;
					wallMaterialRef.current = new THREE.MeshStandardMaterial( { color: wallColor } );
					wallMaterialRef.current.side = THREE.DoubleSide;
					const wallMesh = new THREE.Mesh( wallGeometry, wallMaterialRef.current );
					//la altura del muro / 2, menos la mitad de la altura del cuadro
					wallMesh.position.set(0, wallHeight/2 - Math.ceil(height/2) , -3 );
					wallMesh.receiveShadow = true;
					//scene.add( wallMesh );

					//cargar la geometría
					const loader = new OBJLoader();
					loader.load("CUBO.obj", function (object) {
						const blockGeometry = object.children[0].geometry;
						paintFrame(scene, blockGeometry, allColors, material);
						loader.load("dennis.obj", function (dennis) {
							console.log("modelo cargado");
							console.log(object);
							
							const box = new THREE.Box3().setFromObject(dennis);
							const currentHeight = box.max.y - box.min.y; // Altura actual del objeto
							const desiredHeight = 68;
							const scaleRatio = desiredHeight / currentHeight; // La relación de escala necesaria para alcanzar la altura deseada
							console.log(currentHeight, scaleRatio);
						  // Escalar el objeto para alcanzar la altura deseada
							dennis.scale.set(scaleRatio, scaleRatio, scaleRatio);
							dennis.children[0].castShadow = true;
							const dennisColor = theme === 'light' ? 0xdee2e6 : 0x121212;
							dennisMaterialRef.current = dennis.children[0].material;
							dennisMaterialRef.current.color = new THREE.Color(dennisColor);
							const stickmanOffsetX = 20;
							dennis.position.set(-stickmanOffsetX - Math.ceil(width/2), - Math.ceil(height/2), 5);
							dennis.rotation.y += Math.PI/4;

							//scene.add(dennis);

						  },// called when loading is in progresses
						  function ( xhr ) {
						  
							console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
						  
						  },
						  // called when loading has errors
						  function ( error ) {
							console.log( 'An error happened' );
						  });
						
					});
					
					// Render the scene and camera
					const renderScene = () => {
						renderer.render(scene, camera);
						animationFrameId.current = requestAnimationFrame(renderScene);
					};
				  
					// Call the renderScene function to start the animation loop
					renderScene();

					AmbientLightControl(gui, ambientlight);					

					DirectionalLightControl(gui, directionalLight);

					scene.add(directionalLight.target);
					RectLightControl(gui, rectLight);
					MaterialControl(gui, material);
					RendererControl(gui, renderer);

					fetch("jueves_config.json")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						console.log("json",data);
						gui.load(data);
						repositionLights(rectLight, directionalLight, scene);
					})
					.catch((error) => console.error("Error fetching the json:", error));

					const onResize = () => {
						if (canvasRef.current && renderRef.current) {
							console.log("redimensionando..");
							const width = canvasRef.current.offsetWidth;
							const height = canvasRef.current.offsetHeight;
							console.log(width,height);
				
							renderRef.current.setSize(width, height);
							camera.aspect = width / height;
							camera.updateProjectionMatrix();
						}
					};
				
					//window.addEventListener('resize', onResize);				

				}
			});
			
			// Función de limpieza
			return () => {
				console.log("desmontando");
				//window.removeEventListener('resize', onResize);
				gui.destroy();
				cancelAnimationFrame(animationFrameId.current);
				removeObjWithChildren(scene);
				console.log(scene);
				// Eliminar el canvas del DOM
				if (canvasRef.current && renderRef.current?.domElement) {
					canvasRef.current.removeChild(renderRef.current.domElement);
				}
			};
    }, [blockSize]); // Dependencias del efecto	

	const handleSomeAction = () => {
        if (onExport && sceneRef.current) {
            onExport(sceneRef.current);
        }
    };

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
			
		blockGeometry.scale(blockSize, blockSize, blockSize);
	
		const currentXBlocks = width / blockSize; //la cantidad de bloques disminuye si aumenta el tama;o del bloque
		const currentYBlocks = height / blockSize;
		// Calcula el desplazamiento necesario para que (0, 0, 0) quede en el centro del cuadro
		const offsetX = -(currentXBlocks - 1) * blockSize * 0.5;
		const offsetY = -(currentYBlocks - 1) * blockSize * 0.5;	
	
		const diffuseMaps = [
		  "textures/Textura1_Albedo.jpg",
		  "textures/Textura2_Albedo.jpg",
		  "textures/Textura3_Albedo.jpg",
		  "textures/Textura4_Albedo.jpg",
		  // Agrega más texturas aquí
		];
	
		const roughnessMaps = [
		  "textures/Textura1_Roughness.jpg",
		  "textures/Textura2_Roughness.jpg",
		  "textures/Textura3_Roughness.jpg",
		  "textures/Textura4_Roughness.jpg",
		];
	
		const normalMaps = [
		  "textures/Textura1_Normal.jpg",
		  "textures/Textura2_Normal.jpg",
		  "textures/Textura3_Normal.jpg",
		  "textures/Textura4_Normal.jpg",
		];
	
		const diffuseTextures = [];
		const roughnessTextures = [];
		const normalTextures = [];
		const textureLoader = new THREE.TextureLoader();
		/* //cargar texturas diffuse
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
		} */
	
		// Preparar los 4 materiales
		const material1 = material.clone();
		//material1.map = diffuseTextures[0];
		//material1.roughnessMap = roughnessTextures[0];
		//material1.normalMap = normalTextures[0];
		//material1.vertexColors = true;
		material1.needsUpdate = true;
	
		const material2 = material.clone();
		/* material2.map = diffuseTextures[1];
		material2.roughnessMap = roughnessTextures[1];
		material2.normalMap = normalTextures[1];
		material2.vertexColors = true; */
		material2.needsUpdate = true;
	
		const material3 = material.clone();
		/* material3.map = diffuseTextures[2];
		material3.roughnessMap = roughnessTextures[2];
		material3.normalMap = normalTextures[2];
		material3.vertexColors = true; */
		material3.needsUpdate = true;
	
		const material4 = material.clone();
		/* material4.map = diffuseTextures[3];
		material4.roughnessMap = roughnessTextures[3];
		material4.normalMap = normalTextures[3];
		material4.vertexColors = true; */
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
	
		/* blockInfos.forEach((block, index) => {
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
		}); */
	
		//por cada material los bloques que le corresponden
		let organizedByMaterial = materials.map(() => []);
		blockInfos.forEach((blockInfo) => {
		  organizedByMaterial[blockInfo.materialIndex].push(blockInfo);
		});
		//console.log(organizedByMaterial );
		blockGeometry.rotateX(Math.PI / 2);
	
		organizedByMaterial.forEach((blocksForMaterial, index) => {
		  const material = materials[index];
		  const instancedMesh = new THREE.InstancedMesh(
			blockGeometry.clone(),
			material,
			blocksForMaterial.length
		  );
		  instancedMesh.castShadow = true;
		  instancedMesh.receiveShadow = true;
		  //const colorsArray = new Float32Array(blocksForMaterial.length * 3);
		  const allColors = new THREE.InstancedBufferAttribute(
			new Float32Array(blocksForMaterial.length * 3),
			3
		  );
	
		  blocksForMaterial.forEach((blockInfo, instanceIndex) => {
			instancedMesh.setMatrixAt(instanceIndex, blockInfo.matrix);
			let color = new THREE.Color(rgbC(blockInfo.color));
			allColors.setXYZ(instanceIndex, color.r, color.g, color.b);
		  });
	
		  instancedMesh.geometry.setAttribute("color", allColors);
		  instancedMesh.instanceMatrix.needsUpdate = true;
	
		  scene.add(instancedMesh);
		});
	  };
	
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

	  const repositionLights = (rectLight, directionalLight, scene) => {
		//config Rect Light
		let offsetRect = rectLight.position.y - 12;
		rectLight.width = width;
		rectLight.position.y = (height) / 2 + offsetRect;

		const offSet = 20;//para incluir al mu;eco  en las zombras
		directionalLight.position.y = directionalLight.position.y + 30;
		directionalLight.position.z = directionalLight.position.z + 30;
		directionalLight.shadow.camera.far = directionalLight.shadow.camera.far + 120;
		let dennisHeight = 68;
		let overHeight = (height) > dennisHeight ? 0 : (dennisHeight - height); //la actura que Denni le lleva al cuadro

		directionalLight.shadow.camera.top = height / 2 + overHeight;
		directionalLight.shadow.camera.left = - (width) / 2 - 60;
		directionalLight.shadow.camera.right = (width ) / 2;
		directionalLight.shadow.camera.bottom = - (height) / 2;
		let shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
		//const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
		//scene.add( helper );
		directionalLight.shadow.camera.updateProjectionMatrix();

		//scene.add(shadowHelper);
	  };
	
	  //Create color string
	  const rgbC = (arr) => {
		return "rgb(" + arr[0] + "," + arr[1] + "," + arr[2] + ")";
	  };
	
    return (
		<>	
        <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
		<button onClick={handleSomeAction}>Export</button>
		</>
    );
};

export default Escena3D;
