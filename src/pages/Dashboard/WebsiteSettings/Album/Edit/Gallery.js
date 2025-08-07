import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Divider, Dropdown, Row, Space, Table, Typography } from 'antd';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { MoreOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

export default function Gallery({ data }) {

    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([])
    let navigate = useNavigate();

    const readDocuments = useCallback(async () => {
        setIsLoading(true)

        if (data.id) {
            const q = query(collection(firestore, "images"), where("status", "==", "active"));
            const docSnap = await getDocs(q)
            let array = [];
            docSnap.forEach((doc) => {
                let data = { ...doc.data() }
                data.key = data.id
                array.push(data)
                setImages(array)
            });
        }
        setIsLoading(false)
    }, [data])

    useEffect(() => {
        readDocuments()
    }, [readDocuments])

    const handleDelete = async (item) => {

        setIsLoading(true);
        const docRef = doc(firestore, "images", item.id);
        try {
            await updateDoc(docRef, { status: "deleted" });
            const activeImages = images.filter((image) => image.id !== item.id);
            setImages(activeImages);
            window.toastify("A document has been successfully deleted", "success")
        } catch (error) {
            console.log(error);
            window.toastify("Something went wrong. Please try again", "error")
        }
        setIsLoading(false);

    };

    const columns = [
        {
            title: 'Image',
            render: (item, row) => { return (<img src={row.photo?.url} alt="logo" className='avatar' />) }
        },
        {
            title: 'ID',
            render: (item, row) => { return (<Text>{row.id}</Text>) }
        },
        {
            title: 'Title',
            render: (item, row) => { return (<Text>{row.title}</Text>) }
        },
        {
            title: 'Size',
            render: (_, row) => { return (<Text>{row.photo?.size}.KB</Text>) }
        },

        {
            title: 'Action',
            render: (item, row) => {
                return (
                    <>
                        <Dropdown
                            menu={{
                                items: [
                                    { label: "Edit", onClick: () => { navigate(`edit?id=${row.id}`) } },
                                    { label: "Delete", onClick: () => { handleDelete(row) } },
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
            <Row>
                <Col span={24}>
                    <div className="card">
                        <Row>
                            <Col span={24} className="d-flex justify-content-end align-items-center">
                                <Space size="small">
                                    <Button type='primary' onClick={() => navigate("add")} >Add </Button>
                                </Space>
                            </Col>
                        </Row>

                        <Divider />

                        <Table columns={columns} dataSource={images} loading={isLoading} scroll={{ x: true }} bordered
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div className='px-5 py-3'>
                                        <div className='mb-3'>
                                            <Title level={5} className="mb-0">Description</Title>
                                            <Text>{record.description} </Text>
                                        </div>
                                    </div>
                                ),
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </>
    )
}


