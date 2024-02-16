import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


export const configCamera = (paintAreaWidth, paintAreaHeight, width, height) => {
    const camera = new THREE.PerspectiveCamera(45, paintAreaWidth / paintAreaHeight, 0.1, 100);
    const cameraZPosition = Math.max( width, height)+2;
    camera.position.z = cameraZPosition;
    camera.updateProjectionMatrix();
    return camera;
}

export const configRender = (renderer, mount, paintAreaWidth, paintAreaHeight) => {
    renderer.setSize(paintAreaWidth, paintAreaHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;					
    //renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMappingExposure = 1;
    //renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);
}

export const configLights = (width, height) => {
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
    directionalLight.shadow.camera.updateProjectionMatrix();

    return directionalLight;
}

export const configControls = (camera, renderer) => {
    //config cotrols
    const controls = new OrbitControls(camera, renderer.domElement);
    //controls.minDistance = Math.max(5, Math.hypot(width, height)/4);
    controls.minDistance = 0.5;
    controls.maxDistance = 20;
    controls.enablePan = false;
    //controls.maxPolarAngle = THREE.MathUtils.degToRad(92);
    controls.minPolarAngle = THREE.MathUtils.degToRad(45);
    controls.maxPolarAngle = controls.getPolarAngle();
    controls.maxAzimuthAngle = THREE.MathUtils.degToRad(60);
    controls.minAzimuthAngle = THREE.MathUtils.degToRad(-60);
    controls.update();

    return controls;
}

export const configFloor = (height) => {
    const floorWidth = 1000;
	const floorDepth = 600;
	const floorGeometry = new THREE.PlaneGeometry( floorWidth, floorDepth );
	const floorColor = 0xbbbbbb;
	const floorMaterial = new THREE.MeshStandardMaterial( { color: floorColor } );
	
	floorMaterial.side = THREE.DoubleSide;
	const floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
	floorMesh.rotateX(Math.PI/2);
	floorMesh.position.set(0, - height/2 -0.001, floorDepth/2 - 3 );
	floorMesh.receiveShadow = false;

    return floorMesh;
}

export const configWall = (height) => {
    const inch = 0.0254;
    const wallHeight = 30;
	const wallWidth = 100;
	const wallGeometry = new THREE.PlaneGeometry( wallWidth, wallHeight );
	const wallColor = 0xffffff;
	const wallMaterial = new THREE.MeshStandardMaterial( { color: wallColor } );
	wallMaterial.side = THREE.DoubleSide;
	const wallMesh = new THREE.Mesh( wallGeometry, wallMaterial );
	//la altura del muro / 2, menos la mitad de la altura del cuadro
	wallMesh.position.set(0, wallHeight/2 - Math.ceil(height/2) , -inch );
	wallMesh.receiveShadow = true;
	wallMesh.castShadow = false;
    return wallMesh;
}

export const animate = (renderer, scene, camera, width, height, setProductImg, snapshot, countAnimate) => {
    let frameId;
    function animation() {
      frameId = requestAnimationFrame(animation);
      renderer.render(scene, camera);
        if(countAnimate === 0){
            snapshot(renderer, width, height, setProductImg);
            countAnimate ++;
        }
    }
    animation();

    return () => {
        cancelAnimationFrame(frameId);
    };
};

