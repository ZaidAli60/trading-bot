import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Divider, Dropdown, Image, Row, Space, Table, Tooltip, Typography, Tag, Input } from 'antd'
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuthContext } from 'contexts/Auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const { Title } = Typography

const All = () => {

  const { user, getApiConfig } = useAuthContext()
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [status] = useState("active")
  const navigate = useNavigate()

  const handleSearch = e => {
    const value = e.target.value.toLowerCase()
    setSearchText(value)

    const searchableColumns = columns
      .filter((col) => col.search !== false) // Include columns where search is true or undefined
      .map((col) => col.dataIndex)

    const filtered = documents.filter((item) =>
      searchableColumns.some(
        (key) => item[key] && item[key].toString().toLowerCase().includes(value)
      )
    )

    setFilteredDocuments(filtered)
  }

  const readDocuments = useCallback(async () => {
    setIsLoading(true)
    axios.get(`${window.api}/announcements/all?status=${status}`, getApiConfig())
      .then((res) => {
        const { data, status } = res
        if (status === 200) {
          const array = data.announcements?.map(item => ({ ...item, key: item.id }))
          setDocuments(array)
          setFilteredDocuments(array)
        }
      })
      .catch(error => {
        console.error(error)
        window.toastify(error.response?.data?.message || "Something went wrong while getting the announcements", "error")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [getApiConfig, status])
  useEffect(() => { readDocuments() }, [readDocuments])

  const handleDelete = (row) => {
    axios.delete(`${window.api}/announcements/single/${row.id}`, getApiConfig())
      .then((res) => {
        const { data, status } = res
        if (status === 200) {
          window.toastify(data.message, "success")
          const filteredDocuments = documents.filter(item => item.id !== row.id)
          setDocuments(filteredDocuments)
          setFilteredDocuments(filteredDocuments)
        }
      })
      .catch(error => {
        console.error(error)
        window.toastify(error.response?.data?.message || "Something went wrong while deleting the announcement", "error")
      })
  }

  const columns = [
    { title: 'Sort Order', dataIndex: 'order', align: "center", },
    {
      title: 'Image', align: "center",
      render: (item, row) => <Image src={row.photoURL} alt={row.fullName} className="rounded-circle" style={{ width: 48, height: 48 }} />,
    },
    { title: 'Text', dataIndex: 'text', align: "center", },
    { title: 'Button Text', dataIndex: 'btnText', align: "center", className: "text-capitalize" },
    { title: 'Button Url', dataIndex: 'btnUrl', align: "center", },
    {
      title: 'Status', dataIndex: 'status', align: "center", className: 'text-capitalize',
      render: (_, row) => <Tag color={window.getTagColor(row.status)}>{row.status}</Tag>,
    },
    {
      title: 'Action', align: "center",
      render: (_, row) => (
        <Dropdown
          menu={{
            items: [
              { label: "Edit", icon: <EditOutlined />, onClick: () => { navigate(`/dashboard/website-settings/announcements/${row.id}`) } },
              { label: "Delete", icon: <DeleteOutlined />, onClick: () => { handleDelete(row) } },
            ]
          }}
          trigger={['click']}
        >
          <MoreOutlined className='text-primary' />
        </Dropdown>
      ),
    },
  ]

  return (
    <>
      <Row className='mb-3'>
        <Col>
          <Title level={3} className="mb-0">Announcements</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="card">
            <Row>
              <Col span={24} className="d-flex justify-content-end align-items-center">
                <Space size="small">
                  <Input placeholder="Search..." value={searchText} onChange={handleSearch} />
                  <Tooltip title="Refresh Announcements"><Button icon={<ReloadOutlined />} onClick={readDocuments} /></Tooltip>
                  <Tooltip title="Add Announcement"><Button type='primary' icon={<PlusOutlined />} onClick={() => { navigate("/dashboard/website-settings/announcements/add") }} /></Tooltip>
                </Space>
              </Col>
            </Row>

            <Divider />

            <Table
              columns={columns.filter((item) => !item.allowedroles || user.roles?.find(role => item.allowedroles?.includes(role)))}
              dataSource={filteredDocuments}
              loading={isLoading}
              scroll={{ x: true }}
              size="small"
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default All