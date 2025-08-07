import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthContext } from 'contexts/Auth'
import PrivateRoute from 'components/PrivateRoute'

import Auth from './Auth'
import Dashboard from './Dashboard'

const Index = () => {
    const { isAuth } = useAuthContext()
    return (
        <Routes>
            <Route path='/*' element={<Navigate to="/auth/login" />} />
            <Route path='auth/*' element={!isAuth ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path='dashboard/*' element={<PrivateRoute Component={Dashboard} allowedRoles={[]} />} />
        </Routes>
    )
}
export default Index