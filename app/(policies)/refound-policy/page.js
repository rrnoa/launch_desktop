"use client";
import HeadPage from '@/app/components/HeadPage';
import "@/app/css/landing2.css";
import "@/app/css/responsive_landing.css";
import "@/app/css/bootstrap.min.css";

import React from 'react'
import FooterPage from '@/app/components/FooterPage';

export default function Refound() {
    return (
        <div className='simple-page-policy'>
            <HeadPage title={"Return & Refound Policy"}/>
            <section className='container'>
            <h2>RETURNS</h2>
            <p>Due to the personalized nature of our products, we regret to inform you that we cannot offer refunds or returns once an order has been confirmed and processed. Each item is crafted explicitly according to the customer&#x27;s preferences, so we cannot resell or reuse it. We appreciate your understanding and encourage you to carefully review your options before purchasing. However, if your product arrives damaged or defective, we will happily address the issue promptly and satisfactorily. Please contact our customer service team with any concerns or further inquiries.</p>

            <h2>CANCELLATION PERIOD</h2>

            <h3>Upon purchasing a personalized product, you have a 24-hour window to cancel your order. If you choose to cancel within this period, the cancellation will be processed, and a refund will be initiated.</h3>
            <p>After 24 hours, no refund will be issued.</p>

            <h2>REFUND TERMS</h2>

            <h3>A refund will be issued for the canceled order; however, please note that a 5% administration fee will be applied to the refunded amount.</h3>

            <h2>DAMAGES AND ISSUES</h2>

            <h3>Please carefully inspect your order upon receipt. If the item is defective or damaged, or you receive the wrong item, kindly contact us within 24 hours of receiving the product. This allows us to promptly evaluate the issue and take the necessary steps to make it right.</h3>
            <p>This policy accommodates situations where customers may need to reconsider their purchase shortly after completing the transaction.</p>
            <p>For any questions or concerns regarding cancellations and refunds, please contact us at cancellations@woodxel.com.</p>
            </section>
            <FooterPage/>
        </div>
        )
}