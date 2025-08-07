import React, { useState } from 'react'
import { Typography, Row, Col, Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { Title, Text } = Typography

const initialState = { email: "" }

const ForgotPassword = () => {

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()

        let { email } = state

        if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }

        const formData = { email }

        setIsProcessing(true)
        axios.post(`${window.api}/auth/forgot-password`, formData)
            .then(res => {
                let { status } = res
                if (status === 200) {
                    window.toastify("Email sent successful successful. Please check your mail box to reset your password.", "success")
                }
            })
            .catch(err => {
                // console.error('err', err)
                window.toastify(err?.response?.data?.message || "Something went wrong while sending email, please try again", "error")
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    return (
        <main className='auth flex-center p-4'>
            <div className="card mx-auto px-3 py-4 px-md-4 py-md-5 rounded-4">
                <div className='text-center'>
                    <div className='logo'>
                        <Link className='main-link text-decoration-none text-primary fs-5' to='/'>
                            <i className="fa-solid fa-leaf me-2"></i> Organic2Buy
                        </Link>
                    </div>
                    <Title level={1} className='text-primary text-center mt-4 mb-1'>Verify Identity</Title>
                    <Text>I knew it? <Link to="/auth/login" className='text-decoration-none'>Login now</Link></Text>
                </div>

                <Form layout="vertical" className='form-label-colored mt-4'>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Email Address" required>
                                <Input size='large' type='email' placeholder='Enter your email address' name='email' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Button size='large' type='primary' block htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Forgot Password</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </main>
    )
}

export default ForgotPassword