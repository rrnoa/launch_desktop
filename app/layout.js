//import './globals.css'
//import './css/bootstrap.css';
//import './css/jquery-ui.css';
//import './css/jquery-ui.theme.css';
//import './css/responsive.css'

//import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Lignum',
  description: 'Blocks Art',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
