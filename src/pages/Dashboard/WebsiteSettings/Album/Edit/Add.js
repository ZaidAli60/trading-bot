import React, { useState, useEffect, useCallback } from 'react'
import { Breadcrumb, Col, Form, Input, Row, Space } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone';
import { InboxOutlined } from "@ant-design/icons";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthContext } from 'contexts/Auth';
import { firestore, storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function AddGallery() {

    const { user } = useAuthContext()
    const [files, setfiles] = useState([]);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([]);
    const [album, setAlbum] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    let navigate = useNavigate();
    let params = useParams();

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        multiple: true,
        onDrop: acceptedfiles => {
            const updatedFiles = acceptedfiles.map((file) => {
                return { id: window.getRandomId(), file: file };
            });
            setfiles([...files, ...updatedFiles])
            setTitle([...title, ...new Array(acceptedfiles.length).fill("")]);
            setDescription([...description, ...new Array(acceptedfiles.length).fill("")]);
        }
    });

    const readDocuments = useCallback(async () => {

        const docRef = doc(firestore, "albums", params.id)
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data()
            setAlbum(data)
        }

    }, [params.id])

    useEffect(() => {
        readDocuments()
    }, [readDocuments])

    const handleSubmit = async () => {

        const formData = {
            album,
            status: "active",
            createdBy: {
                fullName: user.fullName,
                email: user.email,
                uid: user.uid
            }
        }
        setIsLoading(true)
        uploadPhoto(formData)

    }

    const uploadPhoto = (formData) => {

        for (let i = 0; i < files?.length; i++) {

            const fileData = files[i];
            const randomId = window.getRandomId();
            const imgTitle = title[i];
            const descriptionValue = description[i];
            const ext = fileData.file.name.split('.').pop()
            const pathwithFileName = `${randomId}/images/photo${i}.${ext}`

            const fileRef = ref(storage, pathwithFileName);

            const uploadTask = uploadBytesResumable(fileRef, fileData.file);
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

                        setfiles(prevFiles => prevFiles.filter(file => file !== fileData));
                        let obj = { url: downloadURL, size: fileData.file.size }
                        let sizeInKB = Math.round(fileData.file.size / 1024);
                        let newData = { ...formData, title: imgTitle, id: randomId, description: descriptionValue, photo: { ...obj, size: sizeInKB } }
                        updateDocument(newData)

                    });
                }
            )

        }
    }

    const updateDocument = async (newData) => {

        const docRef = doc(firestore, "images", newData.id)
        try {
            await setDoc(docRef, newData, { merge: true })
            setfiles(null)
            navigate("/dashboard/website-settings/albums")
            window.toastify("A gallery has been successfully added.", "success")
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            window.toastify("Something went wrong. Please try again", "error")
        }
        setIsLoading(false)

    }

    const removeFile = (id) => {
        const newfiles = [...files];
        let filterFile = newfiles.filter((item) => item.id !== id)
        setfiles(filterFile);
    };

    return (
        <>
            <Breadcrumb className='my-3'>
                <Breadcrumb.Item><Link to="/dashboard/website-settings/albums" className='text-decoration-none'>Images</Link></Breadcrumb.Item>
                <Breadcrumb.Item className='text-black'>Add</Breadcrumb.Item>
            </Breadcrumb>
            <div className='card'>
                <Form layout='vertical'>
                    <Row>
                        <Col lg={24}>
                            <Form.Item label="Album Photos " required>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <InboxOutlined />
                                    <input {...getInputProps()} />
                                    <p>Click or drag files</p>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        {files &&
                            files?.map((files, index) => {
                                return (
                                    <Col key={files.id} xs={24} md={12} lg={6}>
                                        <div className='card shadow-lg p-0 border '>
                                            <div className='image-preview '>
                                                <button className="close btn-sm bg-dark rounded-circle d-flex p-0 px-2 py-2 justify-content-center align-items-center" onClick={() => removeFile(files.id)} >
                                                    <i className="fa-sharp fa-solid fa-xmark  " style={{ fontSize: "10px" }}></i>
                                                </button>
                                                <img src={URL.createObjectURL(files.file)} className='img-fluid rounded-1 ' style={{ width: "100%", height: "280px" }} alt="img" />
                                            </div>
                                            <div className='card-body'>
                                                <div>
                                                    <Form.Item label="Title" required>
                                                        <Input placeholder="Title" value={title[index]} onChange={e => {
                                                            const newTitle = [...title]
                                                            newTitle[index] = e.target.value;
                                                            setTitle(newTitle)
                                                        }} />
                                                    </Form.Item>
                                                    <Form.Item label="Description" required className='mb-0'>
                                                        <Input.TextArea rows={2} style={{ resize: "none" }} placeholder="Short Bio" name="shortBio" maxLength={100} showCount
                                                            value={description[index]} onChange={e => {
                                                                const newDescription = [...description]
                                                                newDescription[index] = e.target.value;
                                                                setDescription(newDescription)
                                                            }} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })}
                    </Row>
                    <div className='d-flex justify-content-end mt-3'>
                        <Space size="small">
                            <button className='btn btn-primary text-white' onClick={handleSubmit} disabled={files.length < 1}>
                                {!isLoading ? ("Add") : (<span className='spinner-grow spinner-grow-sm'></span>)}
                            </button>
                            <button className='btn text-white' style={{ backgroundColor: "#6c757d" }} onClick={() => navigate("/dashboard/website-settings/albums")}>Cancel</button>
                        </Space>
                    </div>
                </Form>
            </div>
        </>
    )
}
