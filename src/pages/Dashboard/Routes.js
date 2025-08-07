import React from 'react'
import { Routes, Route } from 'react-router-dom'

// pages
import Home from './Home'
import Settings from './Settings'

export default function Index() {
    return (
        <div className="dashboard">
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='settings/*' element={<Settings />} />
            </Routes>
        </div>
    )
}
