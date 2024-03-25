"use client";
import "@/app/css/landing2.css";
import "@/app/css/bootstrap.min.css";
import "@/app/css/owl.carousel.css";
import "@/app/css/responsive_landing.css";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import  YoutubeEmbed  from '@/app/components/YoutubeEmbed'
import Script from 'next/script';
import Link from 'next/link'



export default function Home() {
    const [is, setIs] = useState(null);

    useEffect(() => {
       
        setIs(isMobile);

        if (window.jQuery) {
            
            jQuery('.accordion').accordion({
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
       
        }        
       

      }, []);

    return (    
    <div >
        <Script src="https://kit.fontawesome.com/e7f2043049.js" strategy="lazyOnload" />
        {/* top section*/}
        <div className="head-wrapper" style={{position: 'relative'}}>
        { <video className='video-hero' src='video/hero_section_desktop_lq.mp4' autoPlay loop muted playsInline preload="auto"></video> }

            {/* <!--  nev area start */}
            <header>
                <nav style={{zIndex: 1, position: 'relative'}}>
                    <div className="logo"><a href="#"><img src="images/woodxel-white.png" alt=""/></a></div>
                </nav>
            </header>
            {/* <!-- hero-area-start */}
            <section className="hero-area">
                <div className="container">
                    <div style={{zIndex: 1, textAlign: 'center'}}>
                            <div className="hero-left">
                                <h2 className="hidde-m">Transform Any Image into <br/> A Bespoke PixelArt Custom Wooden Panel</h2>
                                <h2 className="hidde-b">Transform Any Image <br/> into A Bespoke PixelArt<br/> Custom Wooden Panel</h2>
                                <p>WoodXEL is the ultimate solution for architects and interior designers seeking to create unique, high-quality custom wooden panels. Our platform combines an intuitive 3D design tool with expert craftsmanship to bring your vision to life.</p>
                            </div>
                        
                    </div>
                    <div className="hero-btn">
                        <a className={is === null? "inactive": ""} href={is?"mobile":"main"}>✨ Start Designing Now</a>
                    </div>
                    <div className="hero-scrool-down" >
                        <a href="#down-sce"><img src="images/arrow.png" alt=""/></a>
                    </div>
                </div>
            </section>
        {/* <!-- hero-area-end */}

        </div>

        {/* <!-- From Concept area start */}
        <section className="from-concept-area" id="down-sce">
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
                            <p>Download your free 3D model for visualization and client presentations</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="form-concept-item">
                            <div className="conts-icon">
                                <img src="images/icon3.png" className="img-fluid" alt=""/>
                            </div>
                            <p>Order a custom wooden panel, handcrafted to your exact specifications</p>
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
                {is !== null ? ( // Asegúrate de que 'is' se ha inicializado antes de renderizar
                    is ? 
                    (<YoutubeEmbed embedId="SL1OKCqP3Io" />) : 
                    (<YoutubeEmbed embedId="186uTz0VUQ8" />)
                ) : (
                    <p>Loading...</p> // Puedes personalizar este mensaje o componente para la carga inicial
                )}

             
                <div className="hero-btn" style={{textAlign: 'center'}}>
                    <a className={is === null? "inactive": ""} href={is?"mobile":"main"}>✨ Start Designing Now</a>
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
                            <p>Free 3D model for easy visualization and presentations</p>
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
                    <a className={is === null? "inactive": ""} href={is?"mobile":"main"}>✨ Unlock Your Creativity with WoodXEL</a>
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
                        <h3 className="active">What is Woodxel, and what does it offer?</h3>
                        <div style={{display: "block"}} >
                            <p>Woodxel is an online platform that creates personalized wood block panels from your uploaded photos or images. Our service allows you to transform your favorite pictures into stunning wooden art pieces.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>How does creating wood block panels work on Woodxel?</h3>
                        <div>
                            <p>Creating your custom wood block panel is simple and enjoyable. Begin by uploading your chosen photo to our platform and selecting your desired customization options. Based on the uploaded image, our system will generate a 3D model and design for your wood block panel. Once you approve the design and place your order, we&apos;ll handle the manufacturing and shipping of your personalized product.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>What types of photos can I use to create woodblock panels on Woodxel?</h3>
                        <div>
                            <p>You can upload any photo or image transformed into a wood block panel. Our versatile customization tools can adapt to various images, from personal portraits to natural landscapes.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>What will I receive when I order from Woodxel?</h3>
                        <div>
                            <p>When you order from Woodxel, your personalized product will be made to fit your desired size. We can start as small as 24&quot;x24&quot;, which would be one panel. If you need a larger size, we&apos;ll create your order using multiple individual panels, each measuring between 12&quot; and 24&quot; in size. For example, if you order a panel measuring 50&quot; x 48&quot;, it might consist of six panels measuring 16&quot;x16&quot; and three panels measuring 18&quot; x 16&quot;. We divide the total dimension into 2 to 3 sections to get panels as close as possible between them. Each panel will display a portion of your chosen photo or image that together shows the pixeled original image, meticulously painted on wood blocks. Once these individual panels are assembled, they will form the desired image in wooden blocks. Plus, we&apos;ll provide simple installation instructions to make setup a breeze.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>How long does it take to receive my order once it is placed?</h3>
                        <div>
                            <p>The delivery time for your order depends on factors such as your location and the size of the custom product requested. Typically, you can expect to receive your personalized wood block panel within 15-30 business days after placing your order.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>Do you offer international shipping?</h3>
                        <div>
                            <p>Yes, we offer international shipping services. Shipping rates and delivery times will vary depending on the destination and the shipping method selected during checkout.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>Can I make changes to the design after I&apos;ve approved it?</h3>
                        <div>
                            <p>Once you&apos;ve approved the design generated by our system and placed the order, you won&apos;t be able to make any changes. However, if you wish to cancel the order, you have a 24-hour window. After this period, we&apos;ll begin the manufacturing process based on the approved design. We recommend carefully reviewing the design before confirming your approval to ensure it meets your expectations.</p>
                        </div>
                    </div>
                    <div className="accordion">
                        <h3>How can I contact Woodxel&apos;s support team with any questions or concerns?</h3>
                        <div>
                            <p>If you require assistance or have any questions, please don&apos;t hesitate to contact our dedicated support team at support@woodxel.com. We're here to help you every step of the way.</p>
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
                            <li><Link href="/terms">Terms & Conditions</Link></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/refound">Retrun & Refound Policy</a></li>
                            <li><a href="/shipping">Shipping Policy</a></li>                            
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
        
    </div>
    )
}
