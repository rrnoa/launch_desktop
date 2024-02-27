import Head from 'next/head';
import './globals.css'
//import './css/bootstrap.css';
//import './css/jquery-ui.css';
//import './css/jquery-ui.theme.css';
//import './css/responsive.css'

//import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Lignum',
  description: 'Blocks Art',
  keywords: ['Pixel', 'Wood', 'Art'],
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="myAppRoot">
          {children}
        </div>
      </body>
    </html>
  )
}
