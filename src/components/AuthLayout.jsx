import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, Navigate } from 'react-router-dom'
import authService from '../appwrite/auth'
import { login, logout } from '../store/authSlice'

export default function AuthLayout({ children, authentication = true }) {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status)
  const location = useLocation()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) {
    return <div className="text-center text-xl py-10">Loading...</div>
  }

  // 🚫 Not logged in but route requires auth
  if (authentication && !authStatus) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🚫 Already logged in but on login/signup
  if (!authentication && authStatus) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
