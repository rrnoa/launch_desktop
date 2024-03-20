import React from 'react'

import { jsPDF } from "jspdf";
import svgNumbers from "@/app/libs/svg";
import "@/app/libs/svg2pdf.umd.min.js";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

const BuyPanel = ({pixelatedImage, colorsArray, colorDetails, blockSize, xBlocks, yBlocks, handleLoading, productImg, mobile}) => {

  const handleBuy = async (event) => {

    event.preventDefault();
    handleLoading(true); 

    //en lugar de convertir todos los colores debería convertir solo los que van en la leyenda    

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
    );
    
    const jsonCMYK = JSON.stringify(json);

    const formData = new FormData();
    formData.append("action", "change_price");
    formData.append("price", calculatePrice());
    formData.append("cmykwColors", jsonCMYK);
    formData.append("pixelated_img_url", productImg);

    formData.append("pdf1", pdf1);
    formData.append("pdf2", pdf2);

    //fetch("https://lignumcd.local/wp-admin/admin-ajax.php", {
    fetch("https://lignumcd.com/wp-admin/admin-ajax.php", {
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
        window.location.href = 'https://lignumcd.com/checkout/';
        //window.location.href = 'https://lignumcd.local/checkout/';
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
        pricePerSquareFoot = 480; //antes 200
    }
    if (blockSize=== 1){
        pricePerSquareFoot = 500; //antes 225
    }
    
    //let areaIn = outputWidth * outputHeight;
    let areaIn = (xBlocks * blockSize) * (yBlocks * blockSize);

    let areaFt = areaIn / 144;
    return (pricePerSquareFoot * areaFt).toFixed(2);
  }

  //Pdf para imprimir en el Panel de madera los números de los colores y la posición
  const drawReportPdf2 = async (xBlocks, yBlocks, blockSize ) => {
    
    //arreglo posicion del color, color[r,g,b] y cantidad, es una agrupacion de los colores
    const colorInfo = getColorInfo();
    let doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: [216, 279],
    });

    doc.setFontSize(12);
    
    // Draw image of product for reference
    let currentPage = 1;
    let yBase = 0;
    let count = 0;
    let dx = 10;
    let dy = 10;

    let tilesPerPage = 24 / blockSize; //24 ó 12 cantidad maxima de bloques de cada página
    let pageWidth = (216-20);
    let tileSize = pageWidth / tilesPerPage; //el tamaño(lado) de la cuadricula en mm

    let horizontalPages = Math.ceil(xBlocks / tilesPerPage);
    let verticalPages = Math.ceil(yBlocks / tilesPerPage);

    let totalPaginas = horizontalPages * verticalPages;

    let xGroups = distribuirEnGrupos(xBlocks, tilesPerPage);
    let yGroups = distribuirEnGrupos(yBlocks, tilesPerPage);

    let contando = 0;
    let xBase = 0;

    let countPixels = 0;

    yGroups.forEach((yElement, xIndex) => {
      let yLength = yElement * tileSize; //longitud en mm de las verticales
      console.log("countPixels",countPixels);
      let currentX = countPixels;
      xBase = 0;
      xGroups.forEach ((xElement, yIndex) => { //de izquierda a derecha
        let xLength = xElement * tileSize;//longitud en mm de las horizontales       

        for (let row = 0; row <= yElement; row++) { //dibuja las lineas horizontales
          doc.line(dx, dy + row * tileSize , xLength + dx , dy + row * tileSize);
        }

        for (let column = 0; column <= xElement; column++) { //dibuja las lineas verticales
          doc.line(dx + column * tileSize, dy, dx + column * tileSize, yLength + dy);
        }

        for (let i = 0; i < yElement; i++) { //cantidad de filas que tiene ese panel
          //pos = pos + i * (xBlocks - xElement);
          for (let j = 0; j < xElement; j++) {
            let colorIdx = xBase + (i * xBlocks ) + j ;  //(i * xBlocks) es el salto
            countPixels++;
            let color = colorsArray[colorIdx + currentX];
            let idx = findColorIndex(colorInfo, color);
            doc.text((idx+1)+"", dx + tileSize/2 + j*tileSize -2, dy + tileSize/2 + i*tileSize + 2);
          }
        }//termina una pagina
        if(countPixels < colorsArray.length) doc.addPage();
        xBase += xElement;
        console.log(xBase);
      });//termina de pintar de izquierda a derecha
      //
    });

  // Guardar el PDF generado
  //doc.save('cuadriculas_colores.pdf');
  //const pdf2 = btoa(doc.output());
  const pdf2 = doc.output('blob');

  return  pdf2;

  };

  const drawReportPdf1 = async (
    xBlocks,
    yBlocks,
    blockSize,
    pixelatedImage,    
  ) => {

    //arreglo posicion del color, color y cantidad, es una agrupacion de los colores
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


    const totalPanels = horizontalPages *  verticalPages;// total de paneles
    doc.setFontSize(12);
    // Draw color index, 43 colors per column, 3 columns per page

    drawHeader(doc, xBlocks, blockSize, yBlocks, totalPanels);

    //colorInfo tiene el indice de todos los colores con su cantidad [ [posicion, [r,g,b], cantidad]...]
    for (let idx = 0; idx < colorInfo.length; idx++) {    
      let colorData = colorInfo[idx];
      //let atem = [idx + 1, cmykwData, colorData[2]]; //crea un registro con [pos, color, cant] del cmyk+w
      //leyenda.push(atem);

      const RECT_WIDTH = 34; const RECT_HEIGHT = 34;

      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(colorData[1][0], colorData[1][1], colorData[1][2]);
      doc.rect(5 + idx % 6 * RECT_WIDTH, 5 + Math.trunc(idx/6) * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT, "FD");
      doc.setDrawColor(0, 0, 0);

      let textPaleta =
        "" +
        (idx + 1) +
        ": " +
      colorDetails[colorData[0]][0];

      doc.text(5 + idx % 6 * RECT_WIDTH, 10 + Math.trunc(idx/6) * RECT_HEIGHT, textPaleta);

      let textName = ""+colorDetails[colorData[0]][1];
       
      doc.text(5 + idx % 6 * RECT_WIDTH, 14 + Math.trunc(idx/6) * RECT_HEIGHT, textName);

      let textCode = ""+colorDetails[colorData[0]][2]; 
       
      doc.text(5 + idx % 6 * RECT_WIDTH, 18 + Math.trunc(idx/6) * RECT_HEIGHT, textCode);

      let textHex = ""+colorDetails[colorData[0]][3]; 
       
      doc.text(5 + idx % 6 * RECT_WIDTH, 22 + Math.trunc(idx/6) * RECT_HEIGHT, textHex);

      let textCant = "("+colorData[2]+")"; //la cantidad de veces que aparece ese color
       
      doc.text(5 + idx % 6 * RECT_WIDTH, 26 + Math.trunc(idx/6) * RECT_HEIGHT, textCant);


    }
    //draw Leyenda

    doc.addPage();
    drawHeader(doc, xBlocks, blockSize, yBlocks, totalPanels);

    let y = 40;
    let x = 10;

    for (let idx = 0; idx < colorInfo.length; idx++) {    
      let colorData = colorInfo[idx];
     

      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(colorData[1][0], colorData[1][1], colorData[1][2]);
      doc.rect(x , y-3, 10, 3, "FD");
      doc.setDrawColor(0, 0, 0);

      let text =
        "Color " +
        (idx + 1) +
        ": " + colorDetails[colorData[0]][0] +","+colorDetails[colorData[0]][1]+","
        +colorDetails[colorData[0]][2]+","
        +colorDetails[colorData[0]][3]
        +"(" +
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
    let division = docWidth / horizontalPages;//tamaño máximo de cada panel para que quepan en la página

    let gruposLargo = distribuirEnGrupos(xBlocks, tilesPerPage);
    let gruposAlto = distribuirEnGrupos(yBlocks, tilesPerPage);

    let k = 1;
    let xLengthAnterior = 0;
    let yLengthAnterior = 0;
    for (var j = 0; j < gruposAlto.length; j++) {
      let yLength =  (gruposAlto[j]/tilesPerPage) * division;//encontrar qué parte representa esa cantida 
                                                              //del tamaño de un panel
      for (var i = 0; i < gruposLargo.length; i++) {
        let xLength = (gruposLargo[i] / tilesPerPage) * division;        

        let x0 =  dx + i * xLengthAnterior; //dx dy son los margenes izquierdo/superior de la página
        let y0 =  dy + j * yLengthAnterior;
        
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
          dx + i * xLengthAnterior + xLength / 2,
          dy + j * yLengthAnterior + yLength / 2,
          '(' + k.toString() + ') ' + gruposLargo[i] + 'x' + gruposAlto[j],
          null,
          null,
          "center"
        ); 
        k++;
        xLengthAnterior =  (gruposLargo[i] / tilesPerPage) * division;
      }

      yLengthAnterior =  (gruposAlto[j]/tilesPerPage) * division;

    }
    
    // Save the PDF in base64 format
    //const pdf1 = btoa(doc.output());
    const pdf1 = doc.output('blob');

    return { pdf1, leyenda, json };
  };

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
//distrubuye el numero de bloque en grupos menores de 24
function distribuirEnGrupos(numero, maxTamanoGrupo) {
  let minGrupos = Math.ceil(numero / maxTamanoGrupo);
  let tamanoBase = Math.floor(numero / minGrupos);
  let excedente = numero % minGrupos;
  let grupos = new Array(minGrupos).fill(tamanoBase);

  // Distribuir el excedente para equilibrar los grupos tanto como sea posible
  for (let i = 0; i < excedente; i++) {
      grupos[i] += 1;
  }

  return grupos;
}

export default BuyPanel