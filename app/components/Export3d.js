import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Tippy from '@tippyjs/react'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import "../libs/svg2pdf.umd.min.js";
import pako from 'pako';
import LeadModal from './LeadModal.js'; // Asegúrate de que la ruta de importación sea correcta

const Export3d = ({exportGroup, handleLoading, mobile, setCurrentStep}) => {
	const [modalIsOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	  }
	
	function closeModal() {
		setIsOpen(false);
	}
    
	const onclickHandler = (event) => {
        event.preventDefault();
		openModal();
    }

	const compressModel = () => {
		const exporter = new GLTFExporter();
        exporter.parse(
			exportGroup, 
			async (gltf) => {
			// gltf es un objeto JSON que representa tu escena
			const output = JSON.stringify(gltf, null, 2);
			const compressedData = pako.gzip(output, { level: 9 });
			downloadJSON(compressedData, 'model3D-'+Date.now()+'.gltf.zip');
			},// called when there is an error in the generation
			function ( error ) {	
				console.log( 'An error happened wen creating model', error );	
			},
			{maxTextureSize: 256}
		);
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
	<LeadModal 
		modalIsOpen={modalIsOpen} 
		closeModal={closeModal}  
		setCurrentStep = {setCurrentStep}
		compressModel = {compressModel}
	/>
	{mobile && (
		<button id="woodxel_panel_3d" onClick={onclickHandler}>			
			<span>
				Get Your FREE 3D Model
            </span>
		</button>
	)}
	{!mobile && (		
		<button id="woodxel_panel_3d" onClick={onclickHandler}>
			<span>
				Get Your FREE 3D Model
            </span>
		</button>		
	)}	
	</>	
  )
}

//Export3d.propTypes = {}

export default Export3d