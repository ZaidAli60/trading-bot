import React, { useState } from 'react'
import { Col, Input, Row, Space, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from 'contexts/Auth';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore } from 'config/firebase';

export default function Details({ state, setState }) {

    const { user } = useAuthContext()
    const [isProcessing, setIsProcessing] = useState(false);
    let navigate = useNavigate();

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {

        let { name } = state;
        if (name.length < 3) { return window.toastify("Please enter album name correctly", "error") }
        name = name.trim();

        const formData = { ...state, name }
        formData.dateModified = serverTimestamp()
        formData.modifiedBy = {
            fullName: user.fullName,
            email: user.email,
            uid: user.uid
        }

        setIsProcessing(true)
        try {
            const docRef = doc(firestore, "albums", state.id)
            await updateDoc(docRef, formData)
            navigate("/dashboard/website-settings/albums")
            window.toastify("Document has been successfully updated", "success")
        } catch (error) {
            setIsProcessing(false)
            console.log(error)
            window.toastify("Something went wrong. Please try again", "error")
        }
        setIsProcessing(false)
    }

    return (
        <>
            <div className='card'>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ maxWidth: 400 }}>
                    <Form.Item label="Album name" required>
                        <Input placeholder="Album Name" name='name' value={state.name} onChange={handleChange} />
                    </Form.Item>
                    <Row>
                        <Col xs={24} sm={{ span: 18, offset: 6 }}>
                            <Space size="small">
                                <button className='btn btn-primary text-white' disabled={isProcessing} onClick={handleUpdate} >
                                    {
                                        !isProcessing ? "Update" : (<span className='spinner-grow spinner-grow-sm'></span>)
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
