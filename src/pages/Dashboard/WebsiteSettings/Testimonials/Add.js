import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Form, Image, Input, Row, Select, Typography } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { useAuthContext } from 'contexts/Auth'
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography

const initialState = { fullName: '', designation: "", star: null, order: null, review: "", category: null }

const Add = () => {

  const { getApiConfig } = useAuthContext()
  const [isNew, setIsNew] = useState(true)
  const [state, setState] = useState(initialState)
  const [image, setImage] = useState(null)
  const [isImageVisible, setIsImageVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] }, multiple: false,
    onDrop: acceptedFiles => { setImage(acceptedFiles[0]) }
  });

  const readTestimonials = useCallback(async () => {
    if (params.id !== "add") {
      axios.get(`${window.api}/testimonials/single-with-id/${params.id}`, getApiConfig())
        .then((res) => {
          const { data, status } = res
          if (status === 200) {
            setState(s => ({ ...s, ...data.testimonial }))
            setIsNew(false)
          }
        })
        .catch(error => {
          console.error(error)
          window.toastify(error.response?.data?.message || "Something went wrong while getting the testimonials", "error")
        })
    } else {
      setState(initialState)
      setIsNew(true)
    }
  }, [params.id, getApiConfig])
  useEffect(() => { readTestimonials() }, [readTestimonials])

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()

    let { fullName, star, designation, order, review, category } = state

    fullName = fullName.trim()
    designation = designation.trim()
    review = review.trim()

    if (fullName.length < 3) { return window.toastify('Please enter full name', "error") }
    if (!category) { return window.toastify("Please Select Category", "error") }
    if (review.length < 3) { return window.toastify('Please select review', "error") }
    if (star < 1) { return window.toastify('Please select star', "error") }
    if (designation.length < 3) { return window.toastify('Please enter designation', "error") }
    if (!order) { return window.toastify('Please enter order', "error") }
    if (!image && !state.photoURL) { return window.toastify("Please upload photo", "error") }
    if (image && image.size > 524288) { return window.toastify("File size should be less than 500KB", "error") }

    let data = { fullName, star, designation, review, order, category }

    const formData = new FormData()
    for (const key in data) { formData.append(key, data[key]); }
    if (image) { formData.append('image', image) }

    setIsProcessing(true)
    createDocument(formData)
  }


  const createDocument = async (formData) => {

    axios[isNew ? "post" : "patch"](`${window.api}/testimonials/${isNew ? "add" : `update/${state.id}`}`, formData, getApiConfig())
      .then((res) => {
        const { data, status } = res
        if (status === isNew ? 201 : 200) {
          window.toastify(data.message, "success")
          setState(initialState)
          navigate("/dashboard/website-settings/testimonials/all")
        }
      })
      .catch(error => {
        console.error(error)
        window.toastify(error.response?.data?.message || `Something went wrong while ${isNew ? "adding a new" : "updating the"} testimonials`, "error")
      })
      .finally(() => {
        setIsProcessing(false)
      })

  }

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <Title level={3} className="mb-0">Testimonials</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="card">
            <Row className='mb-4'>
              <Col>
                <Title level={4} className="mb-0">{isNew ? "Add New" : "Update"} Testimonial</Title>
              </Col>
            </Row>
            <Form layout='vertical'>
              <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Full Name" required>
                    <Input placeholder="Full Name" name="fullName" value={state.fullName} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Designation" required>
                    <Input placeholder="Enter designation" name="designation" value={state.designation} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Stars">
                    <Input placeholder="Enter Star" name="star" value={state.star} onChange={handleChange} onKeyDown={window.onlyNumber} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Sort Order" required>
                    <Input placeholder="Enter order" name="order" value={state.order} onChange={handleChange} onKeyDown={window.onlyNumber} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item label="Category" required>
                    <Select placeholder="Select Category" options={[{ label: 'Client', value: 'client' }, { label: 'Student', value: 'student' }]} name="category" value={state.category} onChange={(value) => setState(s => ({ ...s, category: value }))} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Review">
                    <Input.TextArea rows={5} style={{ resize: "none" }} placeholder="Review (Max Length: 500 Characters)" name="review" maxLength={500} showCount value={state.review} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
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
                </Col>
              </Row>
              <Row>
                <Col span={24} className='text-end'>
                  <Button type='primary' loading={isProcessing} onClick={handleSubmit}>{isNew ? "Add" : "Update"}</Button>
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

export default Add