function AmbientLightControl(gui, light) {
  let folder = gui.addFolder("AmbientLight");
  folder.add(light, "intensity", 0, 5, 0.01);
  const data = {
    background: "#000000",
    "ambient light": light.color.getHex(),
  };

  folder
    .addColor(data, "ambient light")
    .onChange(handleColorChange(light.color));
  folder.close();
}

function handleColorChange(color) {
  return function (value) {
    if (typeof value === "string") {
      value = value.replace("#", "0x");
    }

    color.setHex(value);
  };
}

export default AmbientLightControl;
