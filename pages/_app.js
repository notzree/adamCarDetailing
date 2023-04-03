import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
export default function App({ Component, pageProps }) {
  return (
    <>
    <Toaster/>
  <Component {...pageProps} />
    </>
  )
}
