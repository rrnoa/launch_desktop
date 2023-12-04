"use client";
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link";
import MobileDetect from 'mobile-detect';

export default function Home() {

  const handleButtonClick = () => {
    const md = new MobileDetect(window.navigator.userAgent);
    const isMobile = md.mobile() ? true : false;
  
    if (isMobile) {
      // Redirigir a la versión móvil
      window.location.href = '/mobile';
      //console.log("/mobile");
    } else {
      // Redirigir a la versión de escritorio
      window.location.href = '/main';
    }
  };

  return (
    <main className={styles.main}>
      
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <button onClick={handleButtonClick}>
          Load version
        </button>
        <h2>
            Art Attack <span>-&gt;</span>
          </h2>
          <p>The journey begins</p>
        
      </div>
    </main>
  )
}
