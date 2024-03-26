import React from 'react'

function HeadPage({title}) {
  return (
    <div className='head-simple-pages'>
     <header>
        <nav style={{zIndex: 1, position: 'relative'}}>
            <div className="logo" ><a href="/"><img src="images/woodxel-white.png" alt=""/></a></div>
        </nav>
        <h1>{title}</h1>
    </header>
    </div>
  )
}


export default HeadPage
