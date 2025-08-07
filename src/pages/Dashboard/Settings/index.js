import React from 'react'
import { Routes, Route } from "react-router-dom"
import Account from './Account'
import Profile from './Profile'

export default function Settings() {
    return (
        <Routes>
            <Route path='account' element={<Account />} />
            <Route path='profile' element={<Profile />} />
        </Routes>
    )
}
