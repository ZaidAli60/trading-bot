import React from 'react'

export default function Footer() {

    const year = new Date().getFullYear()

    return (
        <footer className='align-center' style={{ height: 48 }}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <p className='mb-0 text-dark fw-bold text-center'>&copy; {year}. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
