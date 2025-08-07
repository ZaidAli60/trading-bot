import React from 'react'
import Auth from './Auth'

const AppProviders = ({ children }) => {
    return (
        <Auth>
            {children}
        </Auth>
    )
}

export default AppProviders