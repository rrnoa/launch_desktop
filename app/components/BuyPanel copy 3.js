import React from 'react'

import { jsPDF } from "jspdf";
import svgNumbers from "@/app/libs/svg";
import "@/app/libs/svg2pdf.umd.min.js";
import Tippy from '@tippyjs/react';

const BuyPanel = ({pixelatedImage, colorsArray, blockSize, xBlocks, yBlocks, handleLoading, productImg, mobile}) => {

  const handleBuy = async (event) => {

    event.preventDefault();
    handleLoading(true);
    //en lugar de convertir todos los colores debería convertir solo los que van en la leyenda
    const cmykwColors = convertColorsToCmykWithWhite(colorsArray);

    const pdf2 = await drawReportPdf2( ///pdf para imprimir en los paneles de madera      
      xBlocks,
      yBlocks,
      blockSize
    );

    const { pdf1, json } = await drawReportPdf1(//pdf con imagen pixelada y paneles      
      xBlocks,
      yBlocks,
      blockSize,
      pixelatedImage,
      cmykwColors
    );   

    const jsonCMYK = JSON.stringify(json);

    const formData = new FormData();
    formData.append("action", "change_price");
    formData.append("price", calculatePrice());
    formData.append("cmykwColors", jsonCMYK);
    formData.append("pixelated_img_url", productImg);

    formData.append("pdf1", pdf1);
    formData.append("pdf2", pdf2); 

    fetch("https://lignumcd.local/wp-admin/admin-ajax.php", {
    //fetch("https://lignumcd.com/wp-admin/admin-ajax.php", {
      method: "POST",
      credentials: 'include',
      body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status fatal: ${response.status}`);
        } else {
          return response.text(); // Cambiado de response.json() a response.text()
        }
      })
      .then(text => {
        const data = JSON.parse(text); // Luego trata de parsear el texto a JSON
        //window.location.href = 'https://lignumcd.com/checkout/';
        window.location.href = 'https://lignumcd.local/checkout/';
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Connection Error. Please, reload page");
      });
  };

  const calculatePrice = ()=> {
    let pricePerSquareFoot = 0;
    if (blockSize=== 3){
      pricePerSquareFoot = 175;
    }
    if (blockSize=== 2){
        pricePerSquareFoot = 200;
    }
    if (blockSize=== 1){
        pricePerSquareFoot = 225;
    }
    
    //let areaIn = outputWidth * outputHeight;
    let areaIn = (xBlocks * blockSize) * (yBlocks * blockSize);

    let areaFt = areaIn / 144;
    return (pricePerSquareFoot * areaFt).toFixed(2);
  }

  //Pdf para imprimir en el Panel de madera los números de los colores y la posición
  const drawReportPdf2 = async (xBlocks, yBlocks, blockSize ) => {

    const colorInfo = getColorInfo();
    let doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [216, 279],
    });

    doc.setFontSize(12);
    
    // Draw image of product for reference
    let currentPage = 1;
    let xBase = 0;
    let yBase = 0;
    let count = 0;
    let dx = 10;
    let dy = 10;
    //let tileSize = 8 * blockSize;
    let tilesPerPage = 24 / blockSize;
    let tileSize = (216-20) / tilesPerPage;

    let horizontalPages = Math.ceil(xBlocks / tilesPerPage);
    let verticalPages = Math.ceil(yBlocks / tilesPerPage);

    let totalPaginas = horizontalPages * verticalPages;

    let v = 0;

  // Draw report, 24 blocks per page, left to right and then top to bottom
  while (count < colorsArray.length) {

    let currentX = xBase;
    let currentY = yBase;

    // Dibuja las líneas verticales y horizontales para formar una hoja de 24x24 cuadriculas
    let yLineLength = Math.min(tilesPerPage, yBlocks - yBase);//con esto tengo la cantidad de bloques verticales de esta pagina
    for (let xi = 0; xi <= tilesPerPage; xi++) {
      currentX = xBase + xi;
      if (currentX > xBlocks) {
        break;
      }   
      let xLine = dx + xi * tileSize;
      doc.line(xLine, dy, xLine, dy + yLineLength * tileSize); // Dibuja línea vertical
    }

    let xLineLength = Math.min(tilesPerPage, xBlocks - xBase);//con esto tengo la cantidad de bloques horizontales de esta pagina

    for (let yi = 0; yi <= tilesPerPage ; yi++) {
      currentY = yBase + yi;
      if (currentY > yBlocks) {
        break;
      }
      let yLine = dy + yi * tileSize;
      doc.line(dx, yLine, dx + xLineLength * tileSize, yLine); // Dibuja línea horizontal
    }

    // Añade los números a las cuadriculas
    for (let xi = 0; xi < tilesPerPage; xi++) {
      currentX = xBase + xi;
        if (currentX == xBlocks) {
          break;
        }
      for (let yi = 0; yi < tilesPerPage; yi++) {
        currentY = yBase + yi;
          if (currentY >= yBlocks) {
            break;
          }

        let colorIdx = currentX + currentY * xBlocks;
        let color = colorsArray[colorIdx];
        let idx = findColorIndex(colorInfo, color);
        let xRect = dx + xi * tileSize;
        let yRect = dy + yi * tileSize;
        await doc.svg(svgNumbers[idx], {
          x: xRect + tileSize / 2 - 3,
          y: yRect + tileSize / 2 + 2 - 4,
          width: 4,
          height: 4,
        });

        // Incrementa count después de dibujar cada número
        count++;
      }
    }

    // Cálculo para el desplazamiento de la base de las cuadrículas
    if (currentX >= xBlocks - 1) {
      xBase = 0;
      yBase += tilesPerPage;
    } else {
      xBase += tilesPerPage;
    }

    doc.addPage();
    doc. text("Order number:", 20, 20);
    doc. text("Panel: "+ currentPage + "/" + totalPaginas, 20, 25);
    if (count < colorsArray.length) {
      doc.addPage(); // Agrega una página en blanco
      currentPage++; // Incrementa el número de la página actual
    }
    doc.setLineWidth(0.1);

  } //end while


  // Guardar el PDF generado
  //doc.save('cuadriculas_colores.pdf');
  const pdf2 = btoa(doc.output());
  return  pdf2;

  };


  const drawReportPdf1 = async (
    xBlocks,
    yBlocks,
    blockSize,
    pixelatedImage,
    cmykwColors
  ) => {
    const colorInfo = getColorInfo();
    const leyenda = [];
    //almacena el json de la orden []
    const json = {"work_orders": {
      "12345": {
      }      
    }};
    //Draw blueprint of product in pdf format
    let doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [216, 279],
    });


    let dx = 12;
    let dy = 35;
    let tilesPerPage = 24 / blockSize;
    let horizontalPages = Math.ceil(xBlocks / tilesPerPage);//cantidad de paginas
    let verticalPages = Math.ceil(yBlocks / tilesPerPage);//cantidad de paginas
    let horizontalPanels = xBlocks / tilesPerPage;//cantidad de panels (Ej. 2.3)
    let verticalPanels = yBlocks / tilesPerPage;//cantidad de Paneles (Ej 1.4)

    const totalPanels = horizontalPages *  verticalPages;// total de paneles
    doc.setFontSize(12);
    // Draw color index, 43 colors per column, 3 columns per page

    let y = 40;
    let x = 10;

    drawHeader(doc, xBlocks, blockSize, yBlocks, totalPanels);

    //colorInfo tiene el indice de todos los colores con su cantidad [ [posicion, [r,g,b], cantidad]...]
    for (let idx = 0; idx < colorInfo.length; idx++) {    
      let colorData = colorInfo[idx];
      let cmykwData = cmykwColors[colorData[0]]; //relaciona por la posicion guardada en colorinfo
      let rgbData = colorsArray[colorData[0]];
      let atem = [idx + 1, cmykwData, colorData[2]]; //crea un registro con [pos, color, cant] del cmyk+w
      leyenda.push(atem);
      let colorKey = `color_${idx+1}`;
      //arreglo con las rotaciones de cada componente del color [C,M,Y,K,W] 
      const {pasosPorComponente, mililitrosTotal }= calculateRotations(cmykwData,blockSize,colorData[2]);
      json.work_orders[12345][colorKey] = {
        steps_data: [
          { id: 1, steps: pasosPorComponente[0]},
          { id: 2, steps: pasosPorComponente[1]},
          { id: 3, steps: pasosPorComponente[2]},
          { id: 4, steps: pasosPorComponente[3]},
          { id: 5, steps: pasosPorComponente[4]}
        ],
        rgb: rgbData,
        cmykw: cmykwData,
        ml: mililitrosTotal
      };

      const RECT_WIDTH = 25; const RECT_HEIGHT = 25;

      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(colorData[1][0], colorData[1][1], colorData[1][2]);
      doc.rect(x , y - 25, 10, 3, "FD");
      doc.setDrawColor(0, 0, 0);

      let text =
        "Color " +
        (idx + 1) +
        ": " + "(" +
        colorData[2] + //la cantidad de veces que aparece ese color
        ")";
      doc.text(x + 12, y, text);
      y += 5.3;
    }

    // Draw image of product for reference
    
    doc.addPage();
    drawHeader(doc, xBlocks, blockSize, yBlocks, totalPanels);
    // Draw image compressed for speed purposes
    const { desiredWidth, desiredHeight } = getImageWidthHeight(xBlocks, yBlocks);

    doc.addImage(
      pixelatedImage,
      "JPEG",
      10,
      35,
      desiredWidth,
      desiredHeight,
      "",
      "FAST"
    );

    // Draw grid of reference, all pages with numbers

    doc.addPage();
    drawHeader(doc, xBlocks, blockSize, yBlocks, totalPanels);
    const docWidth = 192 //ancho del documento;
    let division = docWidth / horizontalPages;//tama;o de cada panel
    //let yDivision = docWidth / verticalPages;
    let k = 1;
    //let fontSize = Math.min(xDivision, yDivision);
    for (var j = 0; j < verticalPages; j++) {
      let yLength = (verticalPanels >= 1) ? division : division * verticalPanels;
      for (var i = 0; i < horizontalPages; i++) {
        let xLength = (horizontalPanels >= 1) ? division : division * horizontalPanels;
        
        let x0 =  dx + i * division;
        let y0 =  dy + j * division;
        
        doc.setDrawColor(0, 0, 0);
        doc.setFillColor(255, 255, 255);
        doc.rect(
          x0,
          y0,
          xLength,
          yLength,
          "FD"
        );      
        doc.setFontSize(12);
        doc.text(
          dx + i * division + xLength / 2,
          dy + j * division + yLength / 2,
          k.toString(),
          null,
          null,
          "center"
        );

        // Actualiza el conteo de paneles restantes      
        horizontalPanels -= 1;

        k++;
      }
      //restablecer horizontalPanels
      horizontalPanels = xBlocks / tilesPerPage;
      verticalPanels -= 1;

    }
    //transformToOneDimension();//transforma la matriz de posiciones de los bloques en un array 1 dimension

  //print stickers 
  doc.addPage();
  const maringTop = 10;
  const maringLeft = 10;

  const colorCount = 30; //cantidad de colores por defecto
  const stickerWidth = Math.floor(( 216 - (2*maringLeft) ) / 5);
  const stickerHeight = Math.floor(( 279 - (2*maringTop) ) / 6);

  for (let index = 0; index < colorCount; index++) {
    let positionX = index % 5;
    let positionY = Math.floor(index/ 5);
    const colorNum = index + 1;

    if(leyenda[index]) {
      doc.text(
        maringTop + positionX * stickerWidth + stickerWidth/2 ,
        maringTop + positionY * stickerWidth + stickerHeight/2,
        colorNum.toString() + " ("+leyenda[index][2].toString()+")",
        null,
        null,
        "center"
      );
    }
  }
    
    // Save the PDF in base64 format
    //doc.save();
    const pdf1 = btoa(doc.output());
    return { pdf1, leyenda, json };
  };

  const calculateRotations = (cmykBlanco, dimensionBloque, cantidadBloques) => {
    // Datos de referencia para cobertura de acrílico y pasos de motor
    const referencia = {
      1: { ml: 0.6, motorSteps: 258 },
      2: { ml: 1.93, motorSteps: 830 },
      3: { ml: 4.2, motorSteps: 1806 }
    };

    // Obtener los datos de referencia para la dimensión del bloque
    const datosBloque = referencia[dimensionBloque];
    if (!datosBloque) {
      throw new Error('Dimension de bloque no válida');
    }

    const totalPorcentaje = cmykBlanco.reduce((acc, val) => acc + val, 0);//suma todos los valores

    //const pasosPorMililitro = datosBloque.motorSteps / datosBloque.ml;
    const PASOS_POR_MILIMETROS = 430;
    let mililitrosTotal = 0;
    // Calcular los pasos del motor para cada componente de CMYK + Blanco
    const pasosPorComponente = cmykBlanco.map(componente => {//guarda en un arreglo los pasos por cada componente cmykw
      const mililitrosPorComponente = (componente / totalPorcentaje) * datosBloque.ml * cantidadBloques;
      mililitrosTotal += mililitrosPorComponente;
      return Math.round(mililitrosPorComponente * PASOS_POR_MILIMETROS);
    });
    console.log(pasosPorComponente, mililitrosTotal);

    return {pasosPorComponente, mililitrosTotal};
  }

  const getImageWidthHeight = (xBlocks, yBlocks) => {
    const docWidth = 190; // El ancho máximo permitido del documento
    const imageAspect = xBlocks / yBlocks; // suponiendo que tienes width y height

    let desiredWidth, desiredHeight;

    if (imageAspect > 1) {
      // La imagen es más ancha que alta
      desiredWidth = docWidth;
      desiredHeight = docWidth / imageAspect;
    } else {
      // La imagen es más alta que ancha o cuadrada
      desiredHeight = docWidth;
      desiredWidth = docWidth * imageAspect;
    }

    return { desiredWidth, desiredHeight };
  };

  /**
   * ecuentra el indice que le corresponde al color
   */
  function findColorIndex(colorInfo, color) {
    for (let index = 0; index < colorInfo.length; index++) {
      if (colorInfo[index][1].toString() == color.toString()) return index;
    }
    return -1;
  }

  //Devuelve un arreglo con [posicion, color, cant] de los colores rgb
  const getColorInfo = () => {
    const colorInfoMap = {};
    const colorInfoArray = [];

    colorsArray.forEach((color, index) => {
      const colorKey = color.join(",");
      if (colorInfoMap[colorKey] === undefined) {
        colorInfoMap[colorKey] = {
          position: index,
          color,
          count: 1,
        };
      } else {
        colorInfoMap[colorKey].count++;
      }
    });

    for (const key in colorInfoMap) {
      const { position, color, count } = colorInfoMap[key];
      colorInfoArray.push([position, color, count]);
    }

    // Ordenar el arreglo por la posición donde apareció el color por primera vez
    colorInfoArray.sort((a, b) => a[0] - b[0]);

    return colorInfoArray;
  };

  const rgbToCmykWithWhite = (r, g, b) => {
    var c = 1 - r / 255;
    var m = 1 - g / 255;
    var y = 1 - b / 255;
    var k = Math.min(c, Math.min(m, y));
    if (k === 1) {
      return [0, 0, 0, 100, 0]; // Negro
    }
    c = ((c - k) / (1 - k)) * 100;
    m = ((m - k) / (1 - k)) * 100;
    y = ((y - k) / (1 - k)) * 100;
    k = k * 100;
    var w = 100 - Math.max(c, m, y, k); // Componente blanco para aumentar la luminosidad
    c = Math.round(c * 100) / 100; //2 lugares decimales
    m = Math.round(m * 100) / 100; //2 lugares decimales
    y = Math.round(y * 100) / 100; //2 lugares decimales
    k = Math.round(k * 100) / 100; //2 lugares decimales
    w = Math.round(w * 100) / 100; //2 lugares decimales
    return [c, m, y, k, w];
  };

  const convertColorsToCmykWithWhite = (arr) => {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var r = arr[i][0];
      var g = arr[i][1];
      var b = arr[i][2];
      var cmykW = rgbToCmykWithWhite(r, g, b);
      result.push(cmykW);
    }
    return result;
  };

  const drawHeader = (doc, xBlocks, blockSize, yBlocks, totalPanels) => {
    //Header of each report page
    doc.text(10, 10, "Order: ");
    doc.text(
      10,
      15,
      "Final dimension: " + xBlocks * blockSize + "x" + yBlocks * blockSize
    );
    doc.text(10, 20, "Number of panels: " + totalPanels);
    doc.text(10, 25, "Blocks size: " + blockSize );
  };

  return (
    <>    
      {mobile && (
        <button id="buy_panel" onClick={handleBuy}>
          <span>
              WOODXEL Panel 
              {pixelatedImage ? <span className="price-tag">{'$'+calculatePrice()}</span> : ''}
          </span>
        </button>
      )}
      {!mobile && (
        <Tippy content='Buy your panel now'>
          <button id="buy_panel" onClick={handleBuy}>
          <span>
              WOODXEL Panel 
              {pixelatedImage ? <span className="price-tag">{'$'+calculatePrice()}</span> : ''}
          </span>
          </button>
        </Tippy>
      )}   
    </> 
  )

}

export default BuyPanel