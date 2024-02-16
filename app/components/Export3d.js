import React from 'react'
import PropTypes from 'prop-types'
import Tippy from '@tippyjs/react'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import "../libs/svg2pdf.umd.min.js";
import pako from 'pako';


const Export3d = ({exportGroup, handleLoading, mobile}) => {
    
	const onclickHandler = (event) => {
        event.preventDefault();
		handleLoading(true);
		const exporter = new GLTFExporter();
        exporter.parse(
			exportGroup, 
			async (gltf) => {
			// gltf es un objeto JSON que representa tu escena
			const output = JSON.stringify(gltf, null, 2);
			const compressedData = pako.gzip(output, { level: 9 });
			//downloadJSON(compressedData, 'modelo3d.gltf.zip');
			await makeAjaxRequest(compressedData);
			},// called when there is an error in the generation
			function ( error ) {	
				console.log( 'An error happened' );	
			},
			{maxTextureSize: 256}
		);
    }

	const makeAjaxRequest = async (compressedData) => {
		const formData = new FormData();
    	formData.append("action", "buy_3d");
		formData.append("price", calculatePrice());
		formData.append("file", new Blob([compressedData], { type: "application/octet-stream" }), "modelo3d.gltf.gz");

		console.log("haciendo ajax request...")

		//fetch("https://lignumcd.local/wp-admin/admin-ajax.php", {
		fetch("https://lignumcd.com/wp-admin/admin-ajax.php", {
			method: "POST",
			//credentials: 'include',
			body: formData
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			} else {
				return response.text(); // Cambiado de response.json() a response.text()
			}
		})
		.then(text => {
			//const data = JSON.parse(text); // Luego trata de parsear el texto a JSON
			//window.location.href = "https://lignumcd.local/checkout/";
			window.location.href = "https://lignumcd.com/checkout/";
		})
      .catch((error) => {
		alert("Server connection error");
        console.error("Fetch error:", error);
		handleLoading(false);
      });
  	};

	const calculatePrice = () => {
		return 25;
	}

    const downloadJSON = (compressedData, filename) => {
		const blob = new Blob([compressedData], { type: 'application/zip' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

  return (
	<>
	{mobile && (
		<button id="woodxel_panel_3d" onClick={onclickHandler}>			
			<span>
				3D Model
				{exportGroup ? <span className="price-tag">{'$'+calculatePrice()}</span> : ''}
            </span>
		</button>
	)}
	{!mobile && (
		<Tippy content='Get your 3D file'>
		<button id="woodxel_panel_3d" onClick={onclickHandler}>
			<span>
				3D Model
				{exportGroup ? <span className="price-tag">{'$'+calculatePrice()}</span> : ''}
            </span>
		</button>
		</Tippy>
	)}	
	</>	
  )
}

//Export3d.propTypes = {}

export default Export3d