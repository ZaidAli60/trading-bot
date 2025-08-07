import React from 'react'
import { Route, Routes } from 'react-router-dom'

import All from './All'
import Add from './Add'

const Testimonials = () => {
    return (
        <Routes>
            <Route path='all' element={<All />} />
            <Route path=':id' element={<Add />} />
        </Routes>
    )
}

export default Testimonials