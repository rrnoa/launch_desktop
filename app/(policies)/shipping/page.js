"use client";
import HeadPage from '@/app/components/HeadPage';
import "@/app/css/landing2.css";
import "@/app/css/responsive_landing.css";
import "@/app/css/bootstrap.min.css";

import React from 'react'
import FooterPage from '@/app/components/FooterPage';

export default function Privacy() {
    return (
        <div className='simple-page-policy'>
            <HeadPage title={"Terms & Conditions"}/>

            <section className='container'>
            <h2>ORDER PROCESSING</h2>
            <p>You will receive your order confirmation within 24-48 hours after purchase. All orders are processed within 15-30 business days. You will receive another notification with the tracking number when your order is shipped.</p>

            <h2>POTENTIAL DELAYS</h2>
            <p>While we strive to avoid delays caused by a high volume of orders or postal service issues beyond your control, please be aware that they might occur. We are committed to doing our best to minimize any potential disruptions.</p>

            <h2>DOMESTIC SHIPPING RATES</h2>
            <p>For the frameless option, we offer complimentary shipping via UPS. Enjoy the convenience of free shipping for your frameless wood block panel orders.</p>
            <p>Shipping rates will be applied for the frame option based on your order&#x27;s weight, dimensions, and destination. These rates are calculated to ensure the safe and reliable delivery of your personalized wood block panel with frame.</p>

            <h2>INTERNATIONAL SHIPPING</h2>
            <p>Shipping charges for international orders will be calculated and displayed at checkout. Email us if you find the rates excessive, and we will endeavor to provide a more suitable solution.</p>

            <h2>IMPORT DUTIES AND TAXES</h2>
            <p>Your order may be subject to import duties and taxes, including VAT, once it reaches your destination country. WOODXEL is not responsible for these charges if applied, as they are your responsibility as the customer.</p>
            </section>
            <FooterPage/>


        </div>
        )
}