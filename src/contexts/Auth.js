import React, { useState, useEffect, useCallback, createContext, useContext, useReducer } from 'react'
import axios from 'axios';

const AuthContext = createContext();

const initialState = { isAuth: true, isSuperAdmin: true, user: {} }

const reducer = (state, { type, payload }) => {

    switch (type) {
        case "SET_LOGGED_IN":
            const { user } = payload
            const isSuperAdmin = user.roles.includes("superAdmin")
            const isOwner = user.roles.includes("owner")
            const isSuperAdminOrOwner = user.roles.some(role => ['superAdmin', 'admin'].includes(role))
            return { ...state, isAuth: true, user, isSuperAdmin, isOwner, isSuperAdminOrOwner }
        case "SET_PROFILE":
            return { ...state, ...payload }
        case "SET_LOGGED_OUT":
            return initialState
        default:
            return state
    }
}

export default function Auth({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState)
    const [isAppLoading, setIsAppLoding] = useState(true)

    const getApiConfig = () => {
        const token = localStorage.getItem("jwt")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        return config
    }

    const readUserProfile = useCallback(data => {

        const { token } = data
        const config = { headers: { Authorization: `Bearer ${token}` } }
        axios.get(`${window.api}/auth/api/user`, config)
            .then(res => {
                let { data, status } = res
                if (status === 200) {
                    let user = { ...data.user }
                    dispatch({ type: "SET_LOGGED_IN", payload: { user } })
                }
            })
            .catch(error => {
                // console.error('error', error)
                localStorage.removeItem("jwt")
            })
            .finally(() => {
                setIsAppLoding(false)
            })
    }, [])
    useEffect(() => {
        let token = localStorage.getItem("jwt")
        if (token) { readUserProfile({ token }) }
        else { setTimeout(() => setIsAppLoding(false), 500); }
    }, [readUserProfile])

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        dispatch({ type: "SET_LOGGED_OUT" })
        window.toastify("Logout successful", "success")
    }
    // const handleLogoutWithAPI = () => {
    //     axios.post(`${window.api}/auth/logout`, {}, getApiConfig())
    //         .then(res => {
    //             let { data, status } = res
    //             if (status === 200) {
    //                 window.toastify(data.message, "success")
    //                 localStorage.removeItem("jwt")
    //                 dispatch({ type: "SET_LOGGED_OUT" })
    //             }
    //         })
    //         .catch(error => {
    //             // console.error('error', error)
    //             window.toastify("Something went wrong", "error")
    //         })
    // }

    return (
        <AuthContext.Provider value={{ ...state, dispatch, isAppLoading, handleLogout, readUserProfile, getApiConfig }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)