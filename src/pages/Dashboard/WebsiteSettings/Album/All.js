import React, { useCallback, useState, useEffect } from 'react';
import { Breadcrumb, Button, Col, Divider, Dropdown, Row, Space, Table, Tag, Typography } from 'antd'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { MoreOutlined } from "@ant-design/icons"
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function AllAlbums() {

    const [isLoading, setIsLoading] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [images, setImages] = useState([]);
    let navigate = useNavigate()

    const readAlbums = useCallback(async () => {
        setIsLoading(true)
        const collectionRef = query(collection(firestore, "albums"), where("status", "==", "active"))
        const querySnapshot = await getDocs(collectionRef);

        let array = [];
        querySnapshot.forEach((docs) => {

            let data = docs.data()
            data.key = data.id
            array.push(data)

        })
        setAlbums(array)
        setIsLoading(false)

    }, [])

    useEffect(() => {
        readAlbums()
    }, [readAlbums])

    const readImages = useCallback(async () => {
        setIsLoading(true)
        const collectionRef = query(collection(firestore, "images"), where("status", "==", "active"))
        const querySnapshot = await getDocs(collectionRef);

        let array = [];
        querySnapshot.forEach((docs) => {

            let data = docs.data()
            data.key = data.id
            array.push(data)

        })
        setImages(array)
        setIsLoading(false)

    }, [])

    useEffect(() => {
        readImages()
    }, [readImages])

    const handleDelete = async (id) => {

        setIsLoading(true)
        try {
            await updateDoc(doc(firestore, "albums", id), { status: "deleted" })
            let activeAlbums = albums.filter(item => item.id !== id);
            setAlbums(activeAlbums)
            setIsLoading(false)
            window.toastify("Album successfully deleted", "success")
        } catch (error) {
            window.toastify("Something went wrong. Please try again.", "error")
        }
        setIsLoading(false)

    }

    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Images',
            render: (row, item) => { return (<Text>{images.length}</Text>) }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (tags) => { return (<Tag color="success" key={tags} className="text-capitalize" > {tags} </Tag>); }
        },
        {
            title: 'Action',
            render: (row) => {
                return (
                    <>
                        <Dropdown
                            menu={{
                                items: [
                                    { label: "Edit", onClick: () => { navigate(row.id) } },
                                    { label: "Delete", onClick: () => { handleDelete(row.id) } },
                                ]
                            }}
                            trigger={['click']}
                        >
                            <MoreOutlined className='text-primary' />
                        </Dropdown>
                    </>
                )
            }
        }

    ];

    return (
        <>
            <Row className='mb-4'>
                <Col>
                    <Title level={3} className="mb-0">Albums</Title>
                </Col>
            </Row>
            <div className='mb-4'>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link className='text-decoration-none' to="/dashboard">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Albums</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Row>
                <Col span={24}>
                    <div className="card">
                        <Row>
                            <Col span={24} className="d-flex justify-content-end align-items-center">
                                <Space size="small">
                                    <Button type='primary' onClick={() => navigate("add")}>Add</Button>
                                </Space>
                            </Col>
                        </Row>

                        <Divider />

                        <Table columns={columns} dataSource={albums} scroll={{ x: true }} bordered loading={isLoading} />
                    </div>
                </Col>
            </Row>
        </>
    )
}
