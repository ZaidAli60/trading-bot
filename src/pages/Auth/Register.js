import React, { useState } from 'react'
import { Typography, Row, Col, Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { Title, Text } = Typography

const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }

const Register = () => {

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()

        let { firstName, lastName, email, password, confirmPassword } = state

        firstName = firstName.trim()
        lastName = lastName.trim()
        const fullName = (firstName + " " + lastName).trim()

        if (firstName.length < 3) { return window.toastify("Please enter your firstName", "error") }
        if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }
        if (password.length < 6) { return window.toastify("Password must be atleast 6 chars.", "error") }
        if (confirmPassword !== password) { return window.toastify("Password doesn't match", "error") }

        const formData = { firstName, lastName, fullName, email, password }

        setIsProcessing(true)
        axios.post(`${window.api}/auth/register`, formData)
            .then(res => {
                let { status } = res
                if (status === 201) {
                    window.toastify("Your account has been created successfully", "success")
                }
            })
            .catch(err => {
                // console.error('err', err)
                window.toastify(err?.response?.data?.message || "Something went wrong while creating your account, please try again", "error")
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
                    <Title level={1} className='text-primary text-center mt-4 mb-1'>Register</Title>
                    <Text>Already have an account? <Link to="/auth/login" className='text-decoration-none'>Login now</Link></Text>
                </div>

                <Form layout="vertical" className='form-label-colored mt-4'>
                    <Row gutter={16}>
                        <Col xs={24} lg={12}>
                            <Form.Item label="First Name" required>
                                <Input size='large' type='text' placeholder='Enter your first name' name='firstName' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Last Name">
                                <Input size='large' type='text' placeholder='Enter your last name' name='lastName' onChange={handleChange} />
                            </Form.Item>
                        </Col>
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
                        <Col span={24}>
                            <Form.Item label="Confirm Password" required>
                                <Input.Password size='large' placeholder='Enter your password again' name='confirmPassword' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Button size='large' type='primary' block htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Register</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </main>
    )
}

export default Register