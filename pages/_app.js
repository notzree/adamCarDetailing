import '@/styles/globals.css'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Toaster/>
        <Component {...pageProps} />
     </LocalizationProvider>
    </>
  )
}
