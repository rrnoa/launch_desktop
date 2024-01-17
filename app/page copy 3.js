"use client";
import Image from 'next/image'
import Link from "next/link";
import "@/app/css/landing-style.css"
import { isMobile } from 'react-device-detect';
import { useEffect, useRef, useState } from 'react';
import SliderTestimonials from './components/SliderTestimonials';

export default function Home() {
  const [is, setIs] = useState();


  useEffect(()=>{
    //const is = isMobile ? '/mobile' : '/main';
    setIs(isMobile);
  },[]);

  return (    
    <div id="main" >
      <div className='overlap-wrapper'>        
        <div className='banner'>
          <div className='banner-hover'>
            <img src='images/banner.png'/>
          </div>
        <div className='header'>
          <div className='header-inner'>
            <div className="left">
              <img className="image-2" alt="Woodxel" src="images/woodxel-white.png"/>              
            </div>
          </div>          
        </div>
          <div className='content'>
            <div className="top">
              <p className="caption">CRAFT CUSTOM WOOD PANELS FROM YOUR PHOTOS WITH PIXEL ART PRECISION</p>
              <p className="main-headline">WOODEXEL: Transforming Design into Reality</p>
            </div>
            <p className="txt">Embark on a design journey with WOODEXEL. Our unique platform transforms your photographs into stunning, custom-made wooden panels, intricately pixelated to perfection.</p>
            <div className="boton">
              <button className="button">
                <div className="text-container">
                  <Link  href={is?"/mobile":"/main"}>
                    <div className="text-wrapper-4">Start Designing Your Masterpiece</div>
                  </Link>
                </div>
              </button>
              </div>
          </div>
        </div>
        <div className='section-1-wrapper' style={{backgroundImage: 'url(images/blocks.png)', backgroundRepeat: 'no-repeat', backgroundPosition: '0 75px'}}>
        <div className='section-1'>
          <div className="overlap-14">
            <div className="top">
              <div className="secondary-headline">LignumBLOCKS</div>
              <p className="bringing-acoustic">Bringing Acoustic Design to Digital &amp; Physical Realms</p>
            </div>
          </div>
          <p className="p">In the bustling sphere of modern interior design and architecture, every detail counts, and every second is invaluable. At LignumBLOCKS, we don’t just provide a tool; we present a transformative dual experience</p>
          <div className="frame-2">
            <div className="frame-wrapper">
              <div className="frame-3">                
                <div className="x-wrapper"> 
                    <img className="img-2" src="images/vector-1.svg"/>                 
                    <div className="title">How WOODEXEL Works:</div>                    
                </div>
                <p className="paragraph">
                  <span className="span-b">Start with a Photo: </span>
                  <span className="text-wrapper-6">Select an image that inspires.<br/>
                  </span><span className="span-b">Pixel Art Transformation:</span>
                  <span className="text-wrapper-6"> Our tool skillfully converts your photo into a beautifully pixelated wood panel design.<br/>
                  </span>
                  <span className="span-b">See the Magic Unfold:</span>
                  <span className="text-wrapper-6"> Get real-time 3D previews and instant, accurate quotes.</span>
                </p>
                  </div>
            </div>
            <div className="frame-wrapper">
              <div className="frame-3">
                <div className="x-wrapper">
                  <img className="img-2" src="images/vector.svg"/>
                  <div className="title">Challenges We Solve:</div>                    
                </div>
                    <p className="paragraph">
                      <span className="span-b">Complex Design Processes: </span>
                      <span className="text-wrapper-6">Streamline your workflow with our intuitive tool that guides you from photo to pixel-perfect panel.<br/></span>
                      <span className="span-b">Extended Project Timelines: </span>
                      <span className="text-wrapper-6">Receive instant quotes and previews, accelerating your project from concept to completion.</span>
                    </p>
                </div>
            </div>
            <div className="frame-wrapper">
              <div className="frame-3">                
              <div className="x-wrapper">
                <img className="img-2" src="images/group-122.png"/>                
                <div className="title">Why Choose WOODEXEL:</div>                    
              </div>
                    <p className="paragraph">
                      <span className="span-b">Pixel Art Precision: </span>
                      <span className="text-wrapper-6">Each panel is a work of art, reflecting your vision with striking detail and color accuracy.<br/></span>
                      <span className="span-b">Artisan Skill and Digital Precision: </span>
                      <span className="text-wrapper-6">WOODEXEL merges traditional craftsmanship with modern digital techniques.<br/></span>
                      <span className="span-b">Ideal for Creative Professionals: </span>
                      <span className="text-wrapper-6">Our platform empowers architects and designers with innovative, efficient design solutions.</span>
                    </p>
              </div>
            </div>
          </div>
          <div className='frame-paint'>
            <div className="frame-6">
              <div className="secondary-headline-3">From this</div>
              <img className="photo" alt="Photo" src="images/photo-1544376798-89aa6b82c6cd-4.png"/>
            </div>
            <div className="frame-6"><div className="secondary-headline-3">To This</div>
            <img className="mask-group-2" alt="Art" src="images/mask-group.png"/></div>
          </div>          
        </div>        
        </div>
        
        <div className='testimonials'>
          <div className='testimonials-inner'>
            <div className="secondary-headline-2">Testimonials</div>
            <SliderTestimonials/>
          </div>         
        </div>
        <footer className="footer">
          <div className='footer-inner'>
            <div className='columns-wrapper'>
              <div className="columns">
                <div className="div-2">
                  <img className="image" alt="Woodxel" src="images/woodxel-white.png"/>
                </div>
                <div className="footer-components">
                    <div className="lignum-custom-design-wrapper">
                    <p className="lignum-custom-design">Lignum Custom Design Co.<br/>8211 NW 74th Design Co.<br/>info@lignumcd.com<br/>786 - 472 - 1833</p>
                    </div>
                </div>
              </div>
            </div>           
            <div className="bottom">
              <p className="text-wrapper">Woodxel @ 2023. All rights reserved.
              </p>
              <div className="footer-components-2">
                  <div className="div-wrapper">
                    <div className="text-wrapper-2">Terms</div>
                  </div>
                  <div className="div-wrapper">
                    <div className="text-wrapper-2">Privacy</div>
                  </div>
                  <div className="div-wrapper">
                    <div className="text-wrapper-2">Contact</div>
                  </div>
              </div>
            </div>
          </div>
        </footer>
        

      </div>
    </div>
  )
}
