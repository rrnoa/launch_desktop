"use client";
import Image from 'next/image'
import Link from "next/link";
import "@/app/css/landing2.css";
import "@/app/css/bootstrap.min.css";
import "@/app/css/owl.carousel.css";
import "@/app/css/responsive_landing.css";
import { isMobile } from 'react-device-detect';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function Home() {

    useEffect(() => {
        // Este código se ejecuta una vez que jQuery y los plugins han sido cargados
        // y el DOM está listo, ideal para inicializar tus plugins
        console.log("ENrando al useeefect")


          // Scroll to Top
		/* jQuery('.scrolltotop').click(function(){
			jQuery('html').animate({'scrollTop' : '0px'}, 400);
			return false;
		});
		
		jQuery(window).scroll(function(){
			var upto = jQuery(window).scrollTop();
			if(upto > 500) {
				jQuery('.scrolltotop').fadeIn();
			} else {
				jQuery('.scrolltotop').fadeOut();
			}
		}); */

		// accordion
		$('.accordion').accordion({
			collapsible: true,			
		});
		
		$("#owl-csel1").owlCarousel({
			items: 2,
			autoplay: true,
			autoplayTimeout: 3000,
			startPosition: 0,
			rtl: false,
			loop: true,
			margin: 20,
			dots: true,
			nav: true,
			// center:true,
			// stagePadding: 2,
			navText: [
						'<i class="fa-solid fa-arrow-left-long"></i>',
						'<i class="fa-solid fa-arrow-right-long"></i>'
					],
			navContainer: '.main-content .custom-nav',
			responsive:{
				0: {
					items: 1.2,
					center:true,						
				},
				767: {
					items: 1.9,	
					center:true,						
				},
				1200: {
					items: 2,						
				}
			}

		});	
		
		$("#owl-csel2").owlCarousel({
			items: 3,
			autoplay: true,
			autoplayTimeout: 3000,
			startPosition: 0,
			rtl: false,
			loop: true,
			margin: 10,
			dots: true,
			nav: true,
			// center:true,
			// stagePadding: 2,
			navText: [
						'<i class="fa-solid fa-arrow-left-long"></i>',
						'<i class="fa-solid fa-arrow-right-long"></i>'
					],
			navContainer: '.main-content2 .custom-nav',
			responsive:{
				0: {
					items: 1.3,
					center:true,						
				},
				767: {
					items: 1.9,	
					center:true,							
				},
				1200: {
					items: 3,						
				}
			}

		});
                
      }, []);

    return (    
    <div>        
        <Script src="js/owl.carousel.js" strategy="lazyOnload" />
        <Script src="js/videopopup.js" strategy="lazyOnload" />
        <Script src="js/accordion.js" strategy="lazyOnload" />
        <Script src="https://kit.fontawesome.com/e7f2043049.js" strategy="lazyOnload" />

        {/* <!--  nev area start */}
        <header>
            <nav>
                <div className="logo"><a href="#"><img src="images/woodxel-white.png" alt=""/></a></div>
            </nav>
        </header>
        {/* <!--  nev area start */}

        {/* <!-- hero-area-start */}
        <section className="hero-area">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-5 order2">
                        <div className="hero-left">
                            <h2>Transform <br/> Any Image into a <br/> Stunning Custom <br/> Wooden Panel</h2>
                            <p>Combine powerful 3D design with <br/> artisanal craftsmanship</p>
                            <div className="hero-btn">
                                <a href="#">✨ Start Designing Now</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-7 order1">
                        <div className="hero-right">
                            <img src="images/hero.png" className="img-fluid" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="hero-scrool-down">
                    <a href="#down-sce">SCROLL DOWN TO EXPLORE <img src="images/arrow.png" alt=""/></a>
                </div>
            </div>
        </section>
        {/* <!-- hero-area-end */}

        {/* <!-- hero-btm-area-start */}
        <div className="hero-btm-sections" id="down-sce">
            <div className="container">
                <div className="hero-btm-sections-contant">
                    <p>WoodXEL is the ultimate solution for architects and interior designers seeking to create unique, high-quality custom wooden panels. Our platform combines an intuitive 3D design tool with expert craftsmanship to bring your vision to life.</p>
                    <img src="images/images.png" className="img-fluid" alt=""/>
                </div>
            </div>
        </div>
        {/* <!-- hero-btm-area-end */}

        {/* <!-- From Concept area start */}
        <section className="from-concept-area">
            <div className="container">
                <div className="from-conc-title">
                    <h2>From Concept to Creation in 4 Steps</h2>
                </div>
                <div className="row">
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon1.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Upload your image and customize your design with our 3D tool</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon2.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Receive your free 3D model for visualization and client presentations</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon3.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Order your custom wooden panel, handcrafted to your exact specifications</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon1.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Receive your one-of-a-kind panel, ready to install and impress</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- From Concept area end */}

        {/* <!-- Create Stunning Designs video start  */}
        <section className="design-video-area">
            <div className="container">
                <h2>Create Stunning Designs with WoodXEL</h2>
                <div>
                    <a  id="video1">
                        <div className="dsk-img-VD">
                            <img src="images/video.png" className="img-fluid" alt=""/>
                        </div>
                        <div className="mob-img-VD">
                            <img src="images/videomobile.png" className="img-fluid" alt=""/>
                        </div>
                    </a>
                </div>
                <div id="vidBox">
                    <div id="videCont">
                        <video autoPlay={true} id="v1" loop controls>
                            <source src="video/video.mp4" type="video/mp4"/>
                        </video>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- Create Stunning Designs video end */}

        {/* <!-- Designers Choose WoodXEL area start */}
        <section className="from-concept-area">
            <div className="container">
                <div className="from-conc-title">
                    <h2>Why Architects and Designers Choose WoodXEL</h2>
                </div>
                <div className="row">
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon5.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Intuitive 3D design tool for unlimited customization</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon6.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Free 3D model with every design for easy visualization and presentations</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon7.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Highest quality materials and expert craftsmanship</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon8.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Seamless process from design to installation</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- Designers Choose WoodXEL area end */}

        {/* <!-- Testimonials start  */}
        <section className="testimonials-area  overflow-hidden">
            <div className="container">
                <div className="ts-title">
                    <h2>Testimonials</h2>
                </div>
            </div>
            <div className="ts-inner">
                <div className="main-content">
                    <div id="owl-csel1" className="owl-carousel owl-theme">
                        <div>
                            <div className="ts-carousel-item">
                                <p>&quot;I used WoodXEL to create a 3D model for a client presentation, and they were blown away. The free model made it so easy to visualize the final product.&quot;</p>
                                <ul>
                                    <li><img src="images/ts1.png" className="img-fluid" alt=""/></li>
                                    <li>
                                        <h3>Rachel M.</h3>
                                        <span>Interior Designer</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div className="ts-carousel-item">
                                <p>&quot;WoodXEL&apos;s free 3D models have become an essential part of my design process. They save me time and help me communicate my ideas more effectively.&quot;</p>
                                <ul>
                                    <li><img src="images/ts2.png" className="img-fluid" alt=""/></li>
                                    <li>
                                        <h3>Thomas K.</h3>
                                        <span>Architect</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div className="ts-carousel-item">
                                <p>&quot;I used WoodXEL to create a 3D model for a client presentation, and they were blown away. The free model made it so easy to visualize the final product.&quot;</p>
                                <ul>
                                    <li><img src="images/ts1.png" className="img-fluid" alt=""/></li>
                                    <li>
                                        <h3>Rachel M.</h3>
                                        <span>Interior Designer</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="owl-theme">
                        <div className="owl-controls">
                            <div className="custom-nav owl-nav"></div>
                        </div>
                    </div>
                </div>
                <div className="ts-btn">
                    <a href="#">✨ Unlock Your Creativity with WoodXEL</a>
                </div>
            </div>
        </section>
        {/* <!-- Testimonials end */}

        {/* <!-- Why WoodXEL start  */}
        <section className="testimonials-area why-woodxel-area  overflow-hidden">
            <div className="container">
                <div className="ts-title">
                    <h2>Why WoodXEL</h2>
                    <p>At WoodXEL, we believe in empowering designers, architects, and artists with the tools they need to bring their unique visions to life. Our intuitive platform combines cutting-edge technology with user-friendly features, making it easy for anyone to create stunning 3D wood panel designs. With free, high-quality 3D models for every creation, WoodXEL streamlines your design process and helps you communicate your ideas more effectively. Join our growing community of creators and discover the power of custom wood art.</p>
                </div>
            </div>
            <div className="ts-inner">
                <div className="main-content2">
                    <div id="owl-csel2" className="owl-carousel owl-theme">
                        <div>
                            <div className="Wood-carousel-item">
                                <img src="images/img1.png" className="img-fluid" alt=""/>
                            </div>
                        </div>
                        <div>
                            <div className="Wood-carousel-item">
                                <img src="images/img2.png" className="img-fluid" alt=""/>
                            </div>
                        </div>
                        <div>
                            <div className="Wood-carousel-item">
                                <img src="images/img3.png" className="img-fluid" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="owl-theme">
                        <div className="owl-controls">
                            <div className="custom-nav owl-nav"></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
        {/* <!-- Why WoodXEL end */}

        {/* <!-- FAQs area start  */}
        <section className="faq-area">
            <div className="container">
                <div className="faqs-title">
                    <h2>FAQs</h2>
                </div>
                <div className="faq-wrapper">
                    <div className="accordion">
                        <h3 className="active">Lorem ipsum dolor sit amet consectetur. Scelerisque ipsum hac laoreet id tempor. ?</h3>
                        <div style={{display: "block"}} >
                            <p>Lorem ipsum dolor sit amet consectetur. Urna diam nunc quis iaculis montes. Elit in eget vivamus vitae mi. Augue ultrices turpis aliquam massa blandit volutpat auctor dis. Neque commodo feugiat a pharetra velit. Dictum orci fermentum quis eget cras diam et. Mi dignissim felis.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>Lorem ipsum dolor sit amet consectetur. Urna diam nunc quis iaculis montes. Elit in eget vivamus vitae mi?</h3>
                        <div>
                            <p>Lorem ipsum dolor sit amet consectetur. Urna diam nunc quis iaculis montes. Elit in eget vivamus vitae mi. Augue ultrices turpis aliquam massa blandit volutpat auctor dis. Neque commodo feugiat a pharetra velit. Dictum orci fermentum quis eget cras diam et. Mi dignissim felis.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>Lorem ipsum dolor sit amet consectetur. Urna diam nunc quis iaculis montes. Elit in eget ?</h3>
                        <div>
                            <p>Lorem ipsum dolor sit amet consectetur. Urna diam nunc quis iaculis montes. Elit in eget vivamus vitae mi. Augue ultrices turpis aliquam massa blandit volutpat auctor dis. Neque commodo feugiat a pharetra velit. Dictum orci fermentum quis eget cras diam et. Mi dignissim felis.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>Lorem ipsum dolor sit amet consectetur. Scelerisque ipsum ?</h3>
                        <div>
                            <p>Lorem ipsum dolor sit amet consectetur. Urna diam nunc quis iaculis montes. Elit in eget vivamus vitae mi. Augue ultrices turpis aliquam massa blandit volutpat auctor dis. Neque commodo feugiat a pharetra velit. Dictum orci fermentum quis eget cras diam et. Mi dignissim felis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- FAQs area end */}

        {/* <!-- footer area start  */}
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="f-logo"><img src="images/logo.png" alt=""/></div>
                        <ul>
                            <li>Lignum Custom Design Co.<br/>8211 NW 74th Design Co.</li>
                            <li><a href="mailto:info@lignumcd.com">info@lignumcd.com</a></li>
                            <li><a href="callto:786 - 472 - 1833">786 - 472 - 1833</a></li>
                        </ul>
                    </div>
                    <div className="footer-right">
                        <ul>
                            <li><a href="#">Terms</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        {/* <!-- footer area end */}

        {/* <!-- copyright */}
        <div className="copytight">
            <div className="contianer">
                <p>Woodxel © 2024. All rights reserved.</p>
            </div>
        </div>
        {/* <!-- copyright */}
        

        {/* <!-- Scroll-Top button */}
        <a href="#" className="scrolltotop" style={{display: 'inline'}}>
        <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
        <span className="pluse"></span>
        <span className="pluse2"></span>
        </a>
    </div>
    )
}
