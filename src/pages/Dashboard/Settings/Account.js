import React, { useState } from 'react'
import { Col, Form, Input, Row, Typography, Button } from 'antd'
import { useAuthContext } from 'contexts/Auth'
import axios from 'axios'

const { Title } = Typography
const initialState = { currentPassword: "", newPassword: "", confirmPassword: "" }

export default function Account() {

    const { user, getApiConfig, dispatch } = useAuthContext()
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = async () => {

        let { currentPassword, newPassword, confirmPassword } = state

        if (!currentPassword) { return window.toastify("Please enter your current password", "error") }
        if (confirmPassword !== newPassword) { return window.toastify("Password doesn't match.", "error") }

        const formData = { currentPassword, newPassword }

        setIsProcessing(true)
        axios.patch(`${window.api}/auth/change-password`, formData, getApiConfig())
            .then((res) => {
                const { data, status } = res
                if (status === 200) {
                    window.toastify(data.message, "success")
                    localStorage.removeItem("jwt")
                    dispatch({ type: "SET_LOGGED_OUT" })
                }
            })
            .catch(error => {
                console.error(error)
                window.toastify(error.response?.data?.message || "Something went wrong changing password", "error")
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    return (
        <>
            <Row className='mb-4'>
                <Col>
                    <Title level={3} className="mb-0">Settings</Title>
                </Col>
            </Row>
            <Form layout='vertical'>
                <Row gutter={[16, 16]}>
                    <Col xs={24} xl={18}>
                        <div className="card">
                            <Row className='mb-4'>
                                <Col>
                                    <Title level={4} className="mb-0">Change Password</Title>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24}>
                                    <Form.Item label="Email">
                                        <Input placeholder="Email" name="email" value={user.email} disabled />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8} >
                                    <Form.Item label="Current Password" required>
                                        <Input.Password placeholder="Current Password" name="currentPassword" value={state.currentPassword} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8} >
                                    <Form.Item label="New Password" required>
                                        <Input.Password placeholder="Enter your new password" name="newPassword" value={state.newPassword} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item label="Confirm Password" required>
                                        <Input.Password placeholder="Confirm your new password" name="confirmPassword" value={state.confirmPassword} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={24} xl={6} className="mt-3 mt-xl-0">
                        <div className="card p-2 mb-3">
                            <Button type='primary' block htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Change Password</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
