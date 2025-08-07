import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Image, Input, Row,Typography } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { useAuthContext } from 'contexts/Auth'
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const { Title, Text } = Typography

const initialState = {
    roles: [],
    firstName: "", lastName: "", 
    email: "", address: "", shortBio: "",
}

export default function Add() {

    const { user, dispatch, getApiConfig } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [image, setImage] = useState(null)
    const [isImageVisible, setIsImageVisible] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    // Dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] }, multiple: false,
        onDrop: acceptedFiles => { setImage(acceptedFiles[0]) }
    });

    useEffect(() => { setState(s => ({ ...s, ...user })) }, [user])

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
    
    const handleUploadImage = () => {

        if (!image) { return window.toastify("Please upload photo", "error") }
        if (image && image.size > 1048576) { return window.toastify("File size should be less than 1MB", "error") }

        setIsProcessing(true)

        const formData = new FormData()
        formData.append('image', image)

        axios.patch(`${window.api}/users/update-profile-photo`, formData, getApiConfig())
            .then((res) => {
                const { data, status } = res
                if (status === 200) {
                    const photoURL = data.user?.photoURL
                    if (photoURL) {
                        setState(s => ({ ...s, photoURL }))
                        dispatch({ type: 'SET_PROFILE', payload: { user: { ...user, photoURL } } })
                        window.toastify("Photo uploaded successfully", "success")
                    }
                }
            })
            .catch(error => {
                console.error(error)
                window.toastify(error.response?.data?.message || "Something went wrong while uploading the photo", "error")
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
            <Row>
                <Col span={24}>
                    <div className="card">
                        <Row className='mb-4'>
                            <Col className='align-center'>
                                <Title level={4} className="mb-0 me-2">Profile</Title>
                                <Text className='text-primary'>(You can update your photo here.)</Text>
                            </Col>
                        </Row>
                        <Form layout='vertical'>
                            <Row gutter={16}>
                                <Col xs={24} md={12} lg={6}>
                                    <Form.Item label="First name" required>
                                        <Input placeholder="First name" name="firstName" value={state.firstName} onChange={handleChange} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={6}>
                                    <Form.Item label="Last name" >
                                        <Input placeholder="Last name" name="lastName" value={state.lastName} onChange={handleChange} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={6}>
                                    <Form.Item label="Email" required>
                                        <Input placeholder="Email" name="email" value={state.email} onChange={handleChange} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item label="Address" required>
                                        <Input placeholder="Address" name="address" value={state.address} onChange={handleChange} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} className='mb-md-0'>
                                    <Form.Item label="Short Bio">
                                        <Input.TextArea rows={5} style={{ resize: "none" }} placeholder="Short Bio (Max Length: 100 Characters)" name="shortBio" maxLength={100} showCount value={state.shortBio} onChange={handleChange} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="User Photo (512px X 512px)" required className='mb-0'>
                                        <>
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <InboxOutlined />
                                                <input {...getInputProps()} />
                                                <p>Click or drag file</p>
                                            </div>
                                            {(image || state.photoURL) && <Text className='text-primary cursor-pointer text-decoration-underline' onClick={() => { setIsImageVisible(true) }}>Click to view photo</Text>}
                                            {image && <Button type='link' className='text-primary p-0 h-auto ms-3' loading={isProcessing} onClick={handleUploadImage}>Upload photo</Button>}
                                        </>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
            </Row>

            {(image || state.photoURL) && <Image preview={{ visible: isImageVisible, src: image ? URL.createObjectURL(image) : state.photoURL, onVisibleChange: (value) => { setIsImageVisible(value) } }} />}
        </>
    )
}
