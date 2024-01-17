"use client"
import React from 'react'
import { Blocks } from 'react-loader-spinner';

const style = {
  backgroundColor:'#ffffff',
    display: 'flex',
    margin: 'auto',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
}

const Loading = () => {
  return (
    <div className="spinner_home" style={style}>
			<Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
			/>
		</div>
  )
}

export default Loading