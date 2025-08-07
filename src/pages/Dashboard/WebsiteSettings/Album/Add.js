import React, { useState } from 'react'
import { Breadcrumb, Col, Form, Input, Row, Space } from 'antd'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthContext } from 'contexts/Auth';
import { firestore } from 'config/firebase';
import { Link, useNavigate } from 'react-router-dom'

const initialState = { name: "" };

export default function AddNewAlbum() {

    const { user } = useAuthContext();
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    let navigate = useNavigate()

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {

        let { name } = state;
        if (name.length < 3) { return window.toastify("Please enter album name correctly", "error") }
        name = name.trim();

        const formData = {
            name,
            status: "active",
            id: window.getRandomId(),
            dateCreated: serverTimestamp(),
            createdBy: {
                fullName: user.fullName,
                email: user.email,
                uid: user.uid
            }
        }
        setIsProcessing(true)
        try {
            let docRef = doc(firestore, "albums", formData.id)
            await setDoc(docRef, formData)
            navigate("/dashboard/website-settings/albums")
            window.toastify("A new album has beeen successfully added", "success")
        } catch (error) {
            setIsProcessing(false)
            console.log(error)
            window.toastify("Something went wrong. Please try again", "error")
        }
        setIsProcessing(false)

    }

    return (
        <>
            <Breadcrumb className='my-3'>
                <Breadcrumb.Item><Link to="/dashboard/website-settings/albums" className='text-decoration-none'>Album</Link></Breadcrumb.Item>
                <Breadcrumb.Item className='text-black'>Create</Breadcrumb.Item>
            </Breadcrumb>

            <div className='card'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ maxWidth: 400 }}>
                    <Form.Item label="Album name" required>
                        <Input placeholder="Album Name" name='name' onChange={handleChange} />
                    </Form.Item>
                    <Row>
                        <Col xs={24} sm={{ span: 18, offset: 6 }}>
                            <Space size="small">
                                <button className='btn btn-primary text-white' disabled={isProcessing} onClick={handleSubmit}>
                                    {
                                        !isProcessing ? "Save" : (<span className='spinner-grow spinner-grow-sm'></span>)
                                    }
                                </button>
                                <button className='btn text-white' style={{ backgroundColor: "#6c757d" }} onClick={() => navigate("/dashboard/website-settings/albums")}>Cancel</button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </div>
        </ >
    )
}
