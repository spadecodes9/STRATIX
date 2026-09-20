import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './layout/Navbar.jsx'
import Footer from './layout/Footer.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Keyed by path so a crashed page doesn't keep showing the
            fallback after navigating away from it. */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
