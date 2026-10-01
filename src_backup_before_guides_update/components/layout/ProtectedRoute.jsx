import { useAuth } from '../../context/AuthContext.jsx'
import ProtectedFeatureAccess from '../auth/ProtectedFeatureAccess.jsx'

export default function ProtectedRoute({ children, feature, description }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <ProtectedFeatureAccess feature={feature} description={description} />
  }

  return children
}
