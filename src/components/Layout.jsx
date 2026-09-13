import { Outlet } from 'react-router-dom'
import Navbar from './layout/Navbar.jsx'
import Footer from './layout/Footer.jsx'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
