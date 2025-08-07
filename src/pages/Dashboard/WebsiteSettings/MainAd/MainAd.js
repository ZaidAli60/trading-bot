import React, { useState, useEffect, useCallback } from 'react'
import { Col, Form, Input, Row, Switch, Typography } from 'antd'
import { useDropzone } from 'react-dropzone';
import { useAuthContext } from 'contexts/Auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const initialState = { title: "", url: "" }

export default function MainAd() {

    const { user } = useAuthContext()
    const [state, setState] = useState(initialState);
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { getRootProps: getRootPhotoProps, getInputProps: getInputPhotoProps } = useDropzone({
        accept: { 'image/*': [] }, multiple: false,
        onDrop: acceptedFiles => { setFile(acceptedFiles[0]) }
    });

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleSwitch = async (val) => {

        const docRef = doc(firestore, "setting", "BsOoHwoeNibJ4IO795QH")
        try {
            await updateDoc(docRef, { isNewAds: val })
            setState(s => ({ ...s, isNewAds: val }))
            window.toastify("Switch status successfullfy updated", "success")
        } catch (error) {
            console.log(error)
        }
    }

    const readMainAd = useCallback(async () => {

        const docRef = doc(firestore, "setting", "BsOoHwoeNibJ4IO795QH");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            setState(data)
        } else {
            console.log("Something went wrong. Please try again")
        }

    }, [],)


    useEffect(() => {
        readMainAd();
    }, [readMainAd])


    const handleSubmit = () => {

        let { title, url } = state;
        title = title.trim();
        url = url.trim();

        if (!file) { return window.toastify("Please upload photo", "error") }
        if (!title) { return window.toastify("Please enter professional title", "error") }
        if (!url) { return window.toastify("Please enter url", "error") }

        const formData = {
            title, url,
            isNewAds: true,
            status: "active",
            dateCreated: serverTimestamp(),
            id: "BsOoHwoeNibJ4IO795QH",
            createdBy: {
                fullName: user.fullName,
                email: user.email,
                uid: user.uid
            }
        }
        setIsProcessing(true)
        uploadFile(formData)

    }

    const uploadFile = (formData) => {

        const ext = file.name.split('.').pop()
        const pathwithFileName = `${formData.id}/images/photo.${ext}`

        const fileRef = ref(storage, pathwithFileName);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        },
            (error) => {
                console.error(error)
                window.toastify("Something went wrong while uploading photo.", "error")
                setIsProcessing(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    let photo = { url: downloadURL, size: file.size }
                    createDocument({ ...formData, photo })
                });
            }
        )
    }

    const createDocument = async (formData) => {

        const docRef = doc(firestore, "setting", formData.id)
        try {
            await setDoc(docRef, formData, { merge: true })
            window.toastify("A new main ad has been successfullfy added", "success")
        } catch (error) {
            console.log(error)
            window.toastify("Something went wrong. Please try again", "error")
        }
        setIsProcessing(false)

    }

    return (
        <>
            <Row className='mb-4'>
                <Col>
                    <Title level={3} className="mb-0">Main Ad Settings</Title>
                </Col>
            </Row>
            <div className='d-flex justify-content-end mb-3'>
                <Switch checkedChildren={<CheckOutlined style={{ marginLeft: 'auto', marginRight: 'auto' }} />} unCheckedChildren={<CloseOutlined style={{ marginLeft: 'auto', marginRight: 'auto' }} />} checked={state.isNewAds} onChange={handleSwitch} />
            </div>
            <Row gutter={16} >
                <Col xs={24} xl={16} >
                    <div className="card">
                        <Row className='mb-4'>
                            <Col>
                                <Title level={4} className="mb-0">Main Ad</Title>
                            </Col>
                        </Row>
                        <Form layout='vertical'>
                            <Row gutter={16}>
                                <Col xs={24} md={12} lg={12}>
                                    <Form.Item label="Tilte" required>
                                        <Input placeholder='title' name='title' value={state.title} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={12}>
                                    <Form.Item label="URL" required>
                                        <Input placeholder='URL' name='url' value={state.url} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
                <Col xs={24} xl={8}>
                    <div className="card p-2 mb-3">
                        <Form layout="vertical">
                            <Form.Item label="Picture (1000*1000) px" className='mb-0 text-center'>
                                <>
                                    {file
                                        ? <img src={URL.createObjectURL(file)} alt="Thumbnail" className='img-fluid rounded-1' style={{ maxWidth: "50%" }} />
                                        : <img src={state.photo?.url} alt="Thumbnail" className='img-fluid rounded-1' style={{ maxWidth: "50%" }} />
                                    }

                                    <div {...getRootPhotoProps({ className: 'dropzone p-1 mt-2' })}>
                                        {/* <InboxOutlined /> */}
                                        <input name='photo' {...getInputPhotoProps()} />
                                        <p className='mb-0'>Click or drag file</p>
                                    </div>
                                </>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="card p-2 mb-3">
                        <button className='btn btn-primary btn-sm' disabled={isProcessing} onClick={handleSubmit}>
                            {!isProcessing
                                ? "Add"
                                : <span className='spinner-grow spinner-grow-sm'></span>
                            }
                        </button>
                    </div>
                </Col>
            </Row>
        </>
    )
}
