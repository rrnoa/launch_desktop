import Head from 'next/head';
import './globals.css'
import Script from 'next/script';

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
          <Script src="js/jquery-3.6.0.min.js" strategy="beforeInteractive" />
          <Script src="js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
          <Script src="js/accordion.js" strategy="beforeInteractive" />
          <Script src="js/owl.carousel.js" strategy="beforeInteractive" />
        </div>
      </body>

    </html>
  )
}
