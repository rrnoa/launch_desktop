import Link from 'next/link'
import React from 'react'

function FooterPage() {
  return (
    <div className='footer-simple-pages'>
        {/* <!-- footer area start  */}
        <footer style={{backgroundColor: '#7AA197'}}>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="f-logo"><img src="images/logo.png" alt=""/></div>
                        <ul>
                            <li>Lignum Custom Design Co.<br/>8211 NW 74th Design Co.</li>
                            <li><a href="mailto:info@lignumcd.com">info@lignumcd.com</a></li>
                            <li><a href="callto:786 - 472 - 1833">786 - 472 - 1833</a></li>
                        </ul>
                        <div >
                            <ul>
                                <li><Link href="/terms" target="_blank">Terms & Conditions</Link></li>
                                <li><Link href="/privacy" target="_blank">Privacy Policy</Link></li>
                                <li><Link href="/refound" target="_blank">Return & Refound Policy</Link></li>
                                <li><Link href="/shipping" target="_blank">Shipping Policy</Link></li>                            
                                <li><Link href="#">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>
        </footer>
        {/* <!-- footer area end */}

        {/* <!-- copyright */}
        <div className="copytight" style={{backgroundColor: '#7AA197'}}>
            <div className="contianer">
                <p>Woodxel © 2024. All rights reserved.</p>
            </div>
        </div>
        {/* <!-- copyright */}
    </div>
  )
}


export default FooterPage
