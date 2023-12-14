function DirectionalLightControl(gui, light, cameraHelper) {
  // Crear la luz
  light.castShadow = true;

  function updateLight() {
    light.target.updateMatrixWorld();
    if (cameraHelper) cameraHelper.update();
  }

  const params = {
    shadowMapWidth: 2048,
    shadowMapHeight: 2048,
    near: 1,
    far: 40,
    top: 10,
    bottom: -10,
    left: -10,
    right: 10,
    intensity: 3.0,
    showCameraHelper: false,
    lightX: light.position.x,
    lightY: light.position.y,
    lightZ: light.position.z,
    bias: -0.0005,
  };

  light.intensity = params.intensity;
  light.position.set(params.lightX, params.lightY, params.lightZ);
  light.shadow.mapSize.width = params.shadowMapWidth;
  light.shadow.mapSize.height = params.shadowMapHeight;
  light.shadow.bias = params.bias;
  light.shadow.camera.near = params.near;
  light.shadow.camera.far = params.far;
  light.shadow.camera.top = params.top;
  light.shadow.camera.bottom = params.bottom;
  light.shadow.camera.left = params.left;
  light.shadow.camera.right = params.right;

  light.shadow.camera.updateProjectionMatrix();

  if (cameraHelper) {
    cameraHelper.update();
    cameraHelper.visible = params.showCameraHelper;
  }

  let folder = gui.addFolder("DirectionalLight");
  folder.add(params, "intensity", 0, 100).onChange((value) => {
    light.intensity = value;
  });

  folder.add(params, "lightX", -50, 50).onChange((value) => {
    light.position.x = value;
    if (cameraHelper) cameraHelper.update();
  });

  folder.add(params, "lightY", -50, 50).onChange((value) => {
    light.position.y = value;
    if (cameraHelper) cameraHelper.update();
  });

  folder.add(params, "lightZ", -50, 50).onChange((value) => {
    light.position.z = value;
    if (cameraHelper) cameraHelper.update();
  });

  const shadowSizes = [256, 512, 1024, 2048, 4096];

  folder.add(params, "shadowMapWidth", shadowSizes).onChange((value) => {
    if (light.shadow.map) {
      light.shadow.map.dispose();
      light.shadow.map = null;
    }

    light.shadow.mapSize.width = value;
  });

  folder.add(params, "shadowMapHeight", shadowSizes).onChange((value) => {
    if (light.shadow.map) {
      light.shadow.map.dispose();
      light.shadow.map = null;
    }
    light.shadow.mapSize.height = value;
  });

  folder.add(light.shadow, "radius", 0, 25, 1).onChange((value) => {
    console.log(light.shadow);
  });
  folder.add(light.shadow, "blurSamples", 1, 30, 1);
  folder
    .add(params, "bias", -0.0005, 0.0005, 0.00001)
    .onChange(() => updateBias());

  function updateBias() {
    light.shadow.bias = params.bias;
  }

  folder.add(params, "near", 0.1, 20).onChange((value) => {
    light.shadow.camera.near = value;
    if (cameraHelper) cameraHelper.update();
    light.shadow.camera.updateProjectionMatrix();
  });

  folder.add(params, "far", 10, 100).onChange((value) => {
    light.shadow.camera.far = value;
    if (cameraHelper) cameraHelper.update();
    light.shadow.camera.updateProjectionMatrix();
  });

  folder.add(params, "top", 0, 100).onChange((value) => {
    light.shadow.camera.top = value;
    if (cameraHelper) cameraHelper.update();
    light.shadow.camera.updateProjectionMatrix();
  });

  folder.add(params, "bottom", -100, 0).onChange((value) => {
    if (cameraHelper) cameraHelper.update();

    light.shadow.camera.bottom = value;
    light.shadow.camera.updateProjectionMatrix();
  });

  folder.add(params, "left", -100, 0).onChange((value) => {
    light.shadow.camera.left = value;
    if (cameraHelper) cameraHelper.update();

    light.shadow.camera.updateProjectionMatrix();
  });

  folder.add(params, "right", 0, 100).onChange((value) => {
    light.shadow.camera.right = value;
    if (cameraHelper) cameraHelper.update();
    light.shadow.camera.updateProjectionMatrix();
  });

  let folderTarget = folder.addFolder("Target");

  folderTarget.add(light.target.position, "x", -100, 100).onChange(updateLight);
  folderTarget.add(light.target.position, "y", -100, 100).onChange(updateLight);
  folderTarget.add(light.target.position, "z", -100, 100).onChange(updateLight);

  folder
    .add(params, "showCameraHelper")
    .name("Show Camera Helper")
    .onChange((value) => {
      if (cameraHelper) cameraHelper.visible = value;
    });
}

export default DirectionalLightControl;
