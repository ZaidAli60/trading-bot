import React, { useState } from 'react'
import { Typography,Row, Col, Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthContext } from 'contexts/Auth'

const { Title, Text } = Typography

const initialState = { email: "", password: "" }

const Login = () => {

    const { readUserProfile } = useAuthContext()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()

        let { email, password } = state

        if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }

        const formData = { email, password }

        setIsProcessing(true)
        axios.post(`${window.api}/auth/login`, formData)
            .then(res => {
                let { data, status } = res
                if (status === 200) {
                    const { token } = data
                    localStorage.setItem("jwt", token)
                    readUserProfile({ token })
                    window.toastify("Login successful", "success")
                }
            })
            .catch(err => {
                window.toastify(err?.response?.data?.message || "Something went wrong while logging in, please try again", "error")
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
                    <Title level={1} className='text-primary text-center mt-4 mb-1'>Login</Title>
                    <Text>New user? <Link to="/auth/register" className='text-decoration-none'>Create an account</Link></Text>
                </div>

                <Form layout="vertical" className='form-label-colored mt-4'>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Email Address" required>
                                <Input size='large' type='email' placeholder='Enter your email address' name='email' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Password" required>
                                <Input.Password size='large' placeholder='Enter your password' name='password' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={12} className='align-center'>
                            <Link to="/auth/forgot-password" className='text-decoration-none text-muted opacity-50'>Forgot password?</Link>
                        </Col>
                        <Col span={12}>
                            <Button size='large' type='primary' block htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Login</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </main>
    )
}

export default Login