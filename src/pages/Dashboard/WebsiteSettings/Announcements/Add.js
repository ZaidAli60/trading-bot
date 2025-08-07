import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Form, Image, Input, Row, Typography } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { useAuthContext } from 'contexts/Auth'
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography

const initialState = { text: "", btnText: "", btnUrl: null, order: null }

const Add = () => {

  const { getApiConfig } = useAuthContext()
  const [isNew, setIsNew] = useState(true)
  const [state, setState] = useState(initialState)
  const [image, setImage] = useState(null)
  const [isImageVisible, setIsImageVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const params = useParams()
  const navigate = useNavigate()

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] }, multiple: false,
    onDrop: acceptedFiles => { setImage(acceptedFiles[0]) }
  });

  const readMember = useCallback(async () => {
    if (params.id !== "add") {
      axios.get(`${window.api}/announcements/single-with-id/${params.id}`, getApiConfig())
        .then((res) => {
          const { data, status } = res
          if (status === 200) {
            setState(s => ({ ...s, ...data.announcement }))
            setIsNew(false)
          }
        })
        .catch(error => {
          console.error(error)
          window.toastify(error.response?.data?.message || "Something went wrong while getting the announcement", "error")
        })
    } else {
      setState(initialState)
      setIsNew(true)
    }
  }, [params.id, getApiConfig])
  useEffect(() => { readMember() }, [readMember])

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()

    let { text, btnText, btnUrl, order } = state

    text = (text || '').trim();
    btnText = (btnText || '').trim();
    btnUrl = (btnUrl || '').trim();

    if (text.length < 3) { return window.toastify('Please enter text', 'text') }
    if (btnText.length < 3) { return window.toastify('Please enter button text', 'text') }
    if (btnUrl.length < 3) { return window.toastify('Please enter button url', 'text') }
    if (!order) { return window.toastify('Please enter order', "error") }
    if (!image && !state.photoURL) { return window.toastify("Please upload photo", "error") }
    if (image && image.size > 524288) { return window.toastify("File size should be less than 500KB", "error") }

    let data = { btnText, text, btnUrl, order }

    const formData = new FormData()
    for (const key in data) { formData.append(key, data[key]); }
    if (image) { formData.append('image', image) }

    setIsProcessing(true)
    createDocument(formData)
  }


  const createDocument = async (formData) => {

    axios[isNew ? "post" : "patch"](`${window.api}/announcements/${isNew ? "add" : `update/${state.id}`}`, formData, getApiConfig())
      .then((res) => {
        const { data, status } = res
        if (status === isNew ? 201 : 200) {
          window.toastify(data.message, "success")
          setState(initialState)
          navigate('/dashboard/website-settings/announcements/all')
        }
      })
      .catch(error => {
        console.error(error)
        window.toastify(error.response?.data?.message || `Something went wrong while ${isNew ? "adding a new" : "updating the"} announcement`, "error")
      })
      .finally(() => {
        setIsProcessing(false)
      })

  }

  return (
    <>
      <Form layout='vertical'>
        <Row className='mb-4'>
          <Col>
            <Title level={3} className="mb-0">Announcements</Title>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col span={18}>
            <div className="card">
              <Row className='mb-4'>
                <Col>
                  <Title level={4} className="mb-0">{isNew ? "Add New" : "Update"} announcement</Title>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Sort Order" required>
                    <Input placeholder="Enter order" name="order" value={state.order} onChange={handleChange} onKeyDown={window.onlyNumber} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Text" required>
                    <Input placeholder="Enter Text" name="text" value={state.text} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Button Text" required>
                    <Input placeholder="Enter Button Text" name="btnText" value={state.btnText} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24}>
                  <Form.Item label="Button Url" required>
                    <Input placeholder="Enter Button Url" name="btnUrl" value={state.btnUrl} onChange={handleChange} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={24} xl={6} className="mt-3 mt-xl-0">
            <div className='card'>
              <Form.Item label="Photo (512px X 512px)" required>
                <>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <InboxOutlined />
                    <input {...getInputProps()} />
                    <p>Click or drag file</p>
                  </div>
                  {(image || state.photoURL) && <Text className='text-primary cursor-pointer text-decoration-underline' onClick={() => { setIsImageVisible(true) }}>Click to view photo</Text>}
                </>
              </Form.Item>
            </div>
            <div className="card p-2 my-3">
              {/* <button className='btn btn-primary btn-sm' disabled={isProcessing} onClick={handleSubmit}>
                {!isProcessing
                  ? "Add"
                  : <span className='spinner-grow spinner-grow-sm'></span>
                }
              </button> */}
              <Button type='primary' loading={isProcessing} onClick={handleSubmit}>{isNew ? "Add" : "Update"}</Button>
            </div>
          </Col>
        </Row>

      </Form >
      {(image || state.photoURL) && <Image preview={{ visible: isImageVisible, src: image ? URL.createObjectURL(image) : state.photoURL, onVisibleChange: (value) => { setIsImageVisible(value) } }} />
      }
    </>
  )
}

export default Add