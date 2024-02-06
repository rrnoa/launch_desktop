import kmeans from "./kmeans";
import paletteList from "./lignum_palette";

export default function pixelateImg(croppedImageSrc, xBlocks, yBlocks) {

  let c = 0;
  function RGBtoXYZ(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    r *= 100; g *= 100; b *= 100;
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x, y, z];
  }

  function XYZtoLAB(x, y, z) {
      let refX = 95.047;
      let refY = 100.000;
      let refZ = 108.883;
      x /= refX; y /= refY; z /= refZ;
      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);
      let L = (116 * y) - 16;
      let a = 500 * (x - y);
      let b = 200 * (y - z);
      return [L, a, b];
  }

  function RGBtoLAB(r, g, b) {
      let xyz = RGBtoXYZ(r, g, b);
      let lab = XYZtoLAB(...xyz);
      return lab;
  }

  function colorDistanceLab(color1, color2) {
      return Math.sqrt(Math.pow(color1[0] - color2[0], 2) + Math.pow(color1[1] - color2[1], 2) + Math.pow(color1[2] - color2[2], 2));
  }

  function similarColor(actualColorRGB) {
      let actualColorLAB = RGBtoLAB(...actualColorRGB);
      let closestColorInfo = []; // Guarda la información detallada del color tomada de la paleta [nombre, número, hex]
      let smallestDistance = Infinity;
      let selectedColorLAB;

      paletteList.forEach((color) => {
          // Los valores L, a, b están directamente disponibles en las posiciones 3, 4, 5 del arreglo color
          selectedColorLAB = [parseFloat(color[5]), parseFloat(color[6]), parseFloat(color[7])];
          let distance = colorDistanceLab(actualColorLAB, selectedColorLAB);
          if (distance < smallestDistance) {
              closestColorInfo = [color[0], color[1], color[2], color[3], color[4],]; // paleta,nombre, codigo, hex
              smallestDistance = distance;
          }
      });

      return { selectedColor: closestColorInfo[4], infoColorPalette: closestColorInfo }; // Retorna el hex del color más similar y la información detallada
  }


  // Set canvas size
  return new Promise((resolve, reject) => {
    const croppedImage = new Image();
    croppedImage.src = croppedImageSrc;

    croppedImage.onload = () => {
      let ctxSettings = {
        willReadFrequently: true,
        mozImageSmoothingEnabled: false,
        webkitImageSmoothingEnabled: false,
        imageSmoothingEnabled: false,
      };   


      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", ctxSettings);

      let croppedWidth = croppedImage.width;
      let croppedHeight = croppedImage.height;
      let ratio = croppedWidth / croppedHeight;

      let canvasWidth = 500;
      let canvasHeight = canvasWidth / ratio;

      //este es el tamaño del bloque en pixeles
      //xBlocks va a depender del tamaño en "pulgadas" que se seleccionó en la interfaz puede ser (1,2,3)
      //si pulgas es igual a 2, xBlockc va a ser la mitad los bloque cuando había 1 pulgada
      // xBlockSize seria el tamaño en píxeles de la base(cuadrada) del bloque que se va a pintar

      let xBlockSize = Math.max(Math.floor(canvasWidth / xBlocks), 1);
      let yBlockSize = Math.max(Math.floor(canvasHeight / yBlocks), 1);

      let width = xBlockSize * xBlocks;
      let height = yBlockSize * yBlocks;
      canvas.width = width;
      canvas.height = height;

      // Draw initial image (en el canvas que esta oculto se dibuja la image con crop)
      ctx.drawImage(
        croppedImage,
        0,
        0,
        croppedImage.width,
        croppedImage.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      let allColors = [];
      let colorDetails = [];
      // Get image data in form of array of pixels (RGBA) not array of arrays
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const imData = imageData.data;
      // Calculate average color of each block
      //llena el arreglo allColors
      for (let y = 0; y < height; y += yBlockSize) {
        for (let x = 0; x < width; x += xBlockSize) {
          let red = 0;
          let green = 0;
          let blue = 0;
          let alpha = 0;
          let numPixels = 0;

          for (let dy = 0; dy < yBlockSize; dy++) {
            for (let dx = 0; dx < xBlockSize; dx++) {
              if (x + dx < width && y + dy < height) {
                let offset = 4 * ((y + dy) * width + (x + dx));
                let redValue = imData[offset];
                let greenValue = imData[offset + 1];
                let blueValue = imData[offset + 2];
                let alphaValue = imData[offset + 3];

                if (alphaValue === 0) {
                  continue;
                }
                red += redValue;
                green += greenValue;
                blue += blueValue;
                alpha += alphaValue;
                numPixels++;
              }
            }
          }

          if (numPixels != 0) {
            red = Math.floor(red / numPixels);
            green = Math.floor(green / numPixels);
            blue = Math.floor(blue / numPixels);
            alpha = Math.floor(alpha / numPixels);
          } else {
            red = 0;
            green = 0;
            blue = 0;
            alpha = 0;
          }
          // Add color to array
          allColors.push([red, green, blue]);
        }
      }
      // Cluster colors using kmeans
      let kmeansResult = kmeans(allColors, 30);
      //let colorPalette = [];
      let i = 0;
      let colorCache = {}; // Este objeto almacenará los colores ya procesados.
      // Replace colors with cluster centroids
      for (let y = 0; y < height; y += yBlockSize) {
        let newColor, simColor;
        for (let x = 0; x < width; x += xBlockSize) {
          let color = allColors[i];
          let clusterFound = false;
          for (let cluster of kmeansResult.clusters) {
            for (let point of cluster.points) {
              if (point === color) {
                newColor = cluster.centroid;

                newColor[0] = Math.floor(newColor[0]);
                newColor[1] = Math.floor(newColor[1]);
                newColor[2] = Math.floor(newColor[2]);

                // Convertir newColor a string para usar como clave en el caché
                let colorKey = `rgb(${newColor[0]},${newColor[1]},${newColor[2]})`;

                if (!colorCache[colorKey]) {
                  // Si el color no está en el caché, buscar un color similar y almacenarlo en el caché.
                  simColor = similarColor(newColor);
                  colorCache[colorKey] = { selectedColor: simColor.selectedColor, infoColorPalette: simColor.infoColorPalette };
                } else {
                  // Si el color ya está en el caché, utilizar ese resultado
                  simColor = colorCache[colorKey];
                }
                

                allColors[i] = colorCache[colorKey].selectedColor;
                colorDetails[i] = colorCache[colorKey].infoColorPalette;
                clusterFound = true;
                break;
              }
            }
            if (clusterFound) {
              break;
            }
          }
          //Set color for the entire block
          ctx.clearRect(x, y, xBlockSize, yBlockSize);
          //buscar color similar en la paleta         
          
          color =
            "rgb(" + simColor.selectedColor[0] + "," + simColor.selectedColor[1] + "," + simColor.selectedColor[2] + ")";
          ctx.fillStyle = color;
          ctx.fillRect(x, y, xBlockSize, yBlockSize);
          i++;
        }
      }

      //Display image and set download link
      resolve({
        imageURL: canvas.toDataURL(),
        allColors: allColors,
        colorDetails: colorDetails
      });
    };
    croppedImage.onerror = (error) => {
      reject(error);
    };
  });


}


