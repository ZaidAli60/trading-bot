import React from 'react'
import { Link, useLocation } from "react-router-dom"
import { Typography } from 'antd'
const { Title } = Typography;

export default function InsufficientPermission() {

    const location = useLocation()

    const dashboardRoutes = location.pathname.indexOf("/dashboard") !== -1

    if (dashboardRoutes)
        return <div className='min-vh-100 flex-center p-4 px-md-5'>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-10 offset-md-1">
                        <div className="card p-3 p-md-4 text-center">
                            <Title level={2} className="mb-0 text-primary">You don't have permission to access this page.</Title>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    return (
        <main className='auth flex-center p-4 px-md-5'>
            <div className="card p-3 p-md-4 text-center">
                <Title level={2} className="mb-0 text-primary">You don't have permission to access this page.</Title>
                <Link to={-1} className="btn btn-primary mt-4">Go Back</Link>
            </div>
        </main>
    )
}
