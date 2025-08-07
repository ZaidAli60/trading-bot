import React, { useState, useEffect, useCallback } from 'react'
import { Breadcrumb, Col, Form, Input, Row, Space } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';
import { InboxOutlined } from "@ant-design/icons";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthContext } from 'contexts/Auth';
import { firestore, storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const initialValue = { title: "", description: "" };

export default function EditGalllery() {

    const { user } = useAuthContext()
    const [file, setfile] = useState(null);
    const [images, setImages] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const [imageId, setImageId] = useState("")
    let navigate = useNavigate();

    const handleChange = (e) => {
        setImages({ ...images, [e.target.name]: e.target.value })
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        onDrop: acceptedfile => {
            setfile(acceptedfile[0])
        }
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        let id = searchParams.get('id');
        setImageId(id)
    }, [])

    const readDocuments = useCallback(async () => {

        if (imageId) {

            const docRef = doc(firestore, "images", imageId)
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let data = docSnap.data();
                setImages(data)
            }

        }
    }, [imageId])

    useEffect(() => {
        readDocuments()
    }, [readDocuments])

    const handleSubmit = async () => {
        const formData = {
            ...images,
            status: "active",
            modified: {
                fullName: user.fullName,
                email: user.email,
                uid: user.uid
            },
        }
        setIsLoading(true)
        if (file) {
            uploadPhoto(formData)
        } else {
            updateDocument(formData)
        }

    }

    const uploadPhoto = (formData) => {

        const { id } = images;
        const ext = file.name.split('.').pop()
        const pathwithFileName = `${id}/images/photo${0}.${ext}`
        const fileRef = ref(storage, pathwithFileName);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        },
            (error) => {
                console.error(error)
                window.toastify("Something went wrong while uploading photo.", "error")
                setIsLoading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    let obj = { url: downloadURL, size: file.size }
                    let sizeInKB = Math.round(file.size / 1024);
                    let newData = { ...formData, photo: { ...obj, size: sizeInKB } }
                    updateDocument(newData)
                });
            }
        )
    }

    const updateDocument = async (newData) => {

        const docRef = doc(firestore, "images", imageId)
        try {
            await setDoc(docRef, newData, { merge: true })
            setfile(null)
            navigate("/dashboard/website-settings/albums")
            window.toastify("A document has been successfully updated.", "success")
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            window.toastify("Something went wrong. Please try again", "error")
        }
        setIsLoading(false)

    }

    return (
        <>
            <Breadcrumb className='my-3'>
                <Breadcrumb.Item><Link to="/dashboard/website-settings/albums" className='text-decoration-none'>Images</Link></Breadcrumb.Item>
                <Breadcrumb.Item className='text-black'>Edit</Breadcrumb.Item>
            </Breadcrumb>
            <div className='card'>
                <Form layout='vertical'>
                    <Row>
                        <Col lg={24}>
                            <Form.Item label="Album Photos " required>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <InboxOutlined />
                                    <input {...getInputProps()} />
                                    <p>Click or drag file</p>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={6}>
                            <div className='card shadow-lg p-0 border '>
                                <div className='image-preview '>
                                    <img src={file ? URL.createObjectURL(file) : images.photo?.url} className='img-fluid rounded-1 ' style={{ width: "100%", height: "280px" }} alt="img" />
                                </div>
                                <div className='card-body'>
                                    <div>
                                        <Form.Item label="Title" required>
                                            <Input placeholder="Title" name='title' value={images.title} onChange={handleChange} />
                                        </Form.Item>
                                        <Form.Item label="Description" required className='mb-0'>
                                            <Input.TextArea rows={2} style={{ resize: "none" }} placeholder="Short Bio" name="description" maxLength={100} showCount value={images.description} onChange={handleChange} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className='d-flex justify-content-end mt-3'>
                        <Space size="small">
                            <button className='btn btn-primary text-white' onClick={handleSubmit}>
                                {!isLoading ? ("Update") : (<span className='spinner-grow spinner-grow-sm'></span>)}
                            </button>
                            <button className='btn text-white' style={{ backgroundColor: "#6c757d" }} onClick={() => navigate("/dashboard/website-settings/albums")}>Cancel</button>
                        </Space>
                    </div>
                </Form>
            </div>
        </>
    )
}
