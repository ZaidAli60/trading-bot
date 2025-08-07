import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from 'contexts/Auth'
import InsufficientPermission from 'pages/Misc/InsufficientPermission'

export default function PrivateRoute(props) {

    const { user, isAuth } = useAuthContext()
    const location = useLocation()
    const { Component, allowedRoles = [] } = props

    if (!isAuth)
        return <Navigate to="/auth/login" state={{ from: location }} replace />

    if (!allowedRoles.length || user?.roles?.find(role => allowedRoles.includes(role)))
        return <Component />
    return <InsufficientPermission />
}