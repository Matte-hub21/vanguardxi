'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import { hasRole, hasPermission } from '@/lib/auth/roles'

/**
 * RoleGuard component - Protects routes based on user role
 * @param {string} requiredRole - Required role (e.g., 'captain', 'admin')
 * @param {string} requiredPermission - Required permission (alternative to requiredRole)
 * @param {ReactNode} children - Child components to render if authorized
 * @param {ReactNode} fallback - Fallback component if not authorized (default: redirects to /dashboard)
 */
export function RoleGuard({ 
  requiredRole, 
  requiredPermission, 
  children, 
  fallback = null 
}) {
  const { user } = useUser()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!user) {
      setIsChecking(false)
      return
    }

    const userRole = user.user_metadata?.role_name || 'player'
    
    // Check authorization
    const authorized = requiredPermission
      ? hasPermission(userRole, requiredPermission)
      : requiredRole
      ? hasRole(userRole, requiredRole)
      : true

    if (authorized) {
      setIsAuthorized(true)
      setIsChecking(false)
    } else {
      setIsChecking(false)
      if (!fallback) {
        router.replace('/dashboard')
      }
    }
  }, [user, requiredRole, requiredPermission, router, fallback])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-3 w-3 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-display tracking-widest text-sm">LOADING VANGUARD HQ</span>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this area.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded font-semibold hover:bg-[#e6c200]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return children
}
