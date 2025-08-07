import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Form, Image, Input, Row, Select, Typography } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { useAuthContext } from 'contexts/Auth'
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import genders from 'data/genders.json'

const { Title, Text } = Typography

const initialState = {firstName: "", lastName: "", gender: null, designation: "", role: "", order: null, shortBio: "", }

const Add = () => {

  const {getApiConfig } = useAuthContext()
  const [isNew, setIsNew] = useState(true)
  const [state, setState] = useState(initialState)
  const [image, setImage] = useState(null)
  const [isImageVisible, setIsImageVisible] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const params = useParams()

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] }, multiple: false,
    onDrop: acceptedFiles => { setImage(acceptedFiles[0]) }
  });

  const readMember = useCallback(async () => {
    if (params.id !== "add") {
      axios.get(`${window.api}/teams/single-with-id/${params.id}`, getApiConfig())
        .then((res) => {
          const { data, status } = res
          if (status === 200) {
            setState(s => ({ ...s, ...data.member }))
            setIsNew(false)
          }
        })
        .catch(error => {
          console.error(error)
          window.toastify(error.response?.data?.message || "Something went wrong while getting the team member", "error")
        })
    } else {
      setState(initialState)
      setIsNew(true)
    }
  }, [params.id, getApiConfig])
  useEffect(() => { readMember() }, [readMember])


  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
  const handleChangeSelect = (name, val) => { setState(s => ({ ...s, [name]: val })) }

  const handleSubmit = e => {
    e.preventDefault()

    let { firstName, lastName, gender, designation, role, order, shortBio } = state

    firstName = firstName.trim()
    lastName = lastName.trim()
    let fullName = firstName + " " + lastName
    fullName = fullName.trim()

    designation = designation.trim()
    role = role.trim()
    shortBio = shortBio.trim()

    if (firstName.length < 3) { return window.toastify('Please enter first name', "error") }
    if (!gender) { return window.toastify('Please select gender', "error") }
    if (designation.length < 3) { return window.toastify('Please enter designation', "error") }
    if (!order) { return window.toastify('Please enter order', "error") }
    if (!image && !state.photoURL) { return window.toastify("Please upload photo", "error") }
    if (image && image.size > 524288) { return window.toastify("File size should be less than 500KB", "error") }

    let data = { firstName, lastName, fullName, gender, designation, role, order, shortBio }

    const formData = new FormData()
    for (const key in data) { formData.append(key, data[key]); }
    if (image) { formData.append('image', image) }

    setIsProcessing(true)
    createDocument(formData)
  }


  const createDocument = async (formData) => {

    axios[isNew ? "post" : "patch"](`${window.api}/teams/${isNew ? "add" : `update/${state.id}`}`, formData, getApiConfig())
      .then((res) => {
        const { data, status } = res
        if (status === isNew ? 201 : 200) {
          window.toastify(data.message, "success")
        }
      })
      .catch(error => {
        console.error(error)
        window.toastify(error.response?.data?.message || `Something went wrong while ${isNew ? "adding a new" : "updating the"} team member`, "error")
      })
      .finally(() => {
        setIsProcessing(false)
      })

  }

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <Title level={3} className="mb-0">Team Members</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="card">
            <Row className='mb-4'>
              <Col>
                <Title level={4} className="mb-0">{isNew ? "Add New" : "Update"} Member</Title>
              </Col>
            </Row>
            <Form layout='vertical'>
              <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="First name" required>
                    <Input placeholder="First name" name="firstName" value={state.firstName} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Last name" >
                    <Input placeholder="Last name" name="lastName" value={state.lastName} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Gender" required>
                    <Select
                      showSearch
                      placeholder="Select a gender"
                      onChange={val => { handleChangeSelect("gender", val) }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={genders}
                      value={state.gender}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Designation" required>
                    <Input placeholder="Enter designation" name="designation" value={state.designation} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Role">
                    <Input placeholder="Enter role" name="role" value={state.role} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item label="Sort Order" required>
                    <Input placeholder="Enter order" name="order" value={state.order} onChange={handleChange} onKeyDown={window.onlyNumber} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Short Bio">
                    <Input.TextArea rows={5} style={{ resize: "none" }} placeholder="Short Bio (Max Length: 100 Characters)" name="shortBio" maxLength={100} showCount value={state.shortBio} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
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