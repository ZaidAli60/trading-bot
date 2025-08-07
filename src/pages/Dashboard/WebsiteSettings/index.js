import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Teams from './Teams'
import Testimonials from './Testimonials'
import Faqs from './Faqs'
import Announcements from './Announcements'

const WebsiteSettings = () => {
    return (
        <Routes>
            <Route path='teams/*' element={<Teams />} />
            <Route path='testimonials/*' element={<Testimonials />} />
            <Route path='faqs/*' element={<Faqs />} />
            <Route path='announcements/*' element={<Announcements />} />
        </Routes>
    )
}

export default WebsiteSettings