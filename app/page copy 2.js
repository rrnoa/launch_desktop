"use client";
import Image from 'next/image'
import styles from './page.module.css'
import Link from "next/link";
import { isMobile } from 'react-device-detect';
import { useEffect, useRef, useState } from 'react';

export default function Home() {

  const [is, setIs] = useState();


  useEffect(()=>{
    //const is = isMobile ? '/mobile' : '/main';
    setIs(isMobile);
  },[]);

  

  return (    
    <div style={{textAlign: 'center'}} >
      <Link className="button button--brand" href={is?"/mobile":"/main"}>
         <img style={{width: '100%', maxWidth: '300px', marginTop: '150px'}} src='comming.jpg'></img>
        </Link>
    </div>
  )
}
