"use client";
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link";
import MobileDetect from 'mobile-detect';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(()=>{
    const md = new MobileDetect(window.navigator.userAgent)
    console.log(md.mobile());
    const is = md.mobile() ? true : false;
    setIsMobile(is) ;
  },[]);

  return (
    <main className={styles.main}>
      <Link className="button button--brand" href={isMobile?"/mobile":"/main"}>
          <h2>Load version</h2>
        </Link>
    </main>
  )
}
