import React, { useState, useEffect, useCallback } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { useAuthContext } from 'contexts/Auth'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography

const initialState = { question: '', answer: "", order: null, }

const Add = () => {

  const { getApiConfig } = useAuthContext()
  const [isNew, setIsNew] = useState(true)
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate()
  const params = useParams()

  const readTestimonials = useCallback(async () => {
    if (params.id !== "add") {
      axios.get(`${window.api}/faqs/single-with-id/${params.id}`, getApiConfig())
        .then((res) => {
          const { data, status } = res
          if (status === 200) {
            setState(s => ({ ...s, ...data.faqs }))
            setIsNew(false)
          }
        })
        .catch(error => {
          console.error(error)
          window.toastify(error.response?.data?.message || "Something went wrong while getting the faqs", "error")
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

    let { question, answer, order } = state

    question = question.trim()
    answer = answer.trim()

    if (question.length < 3) { return window.toastify('Please enter question', "error") }
    if (answer.length < 3) { return window.toastify('Please select answer', "error") }
    if (order.length < 1) { return window.toastify('Please enter sort order', "error") }

    let formData = { question, answer, order }

    setIsProcessing(true)
    createDocument(formData)
  }


  const createDocument = async (formData) => {

    axios[isNew ? "post" : "patch"](`${window.api}/faqs/${isNew ? "create" : `update/${state.id}`}`, formData, getApiConfig())
      .then((res) => {
        const { data, status } = res
        if (status === isNew ? 201 : 200) {
          window.toastify(data.message, "success")
          setState(initialState)
          navigate("/dashboard/website-settings/faqs/all")
        }
      })
      .catch(error => {
        console.error(error)
        window.toastify(error.response?.data?.message || `Something went wrong while ${isNew ? "adding a new" : "updating the"} faqs`, "error")
      })
      .finally(() => {
        setIsProcessing(false)
      })

  }

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <Title level={3} className="mb-0">Faqs</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="card">
            <Row className='mb-4'>
              <Col>
                <Title level={4} className="mb-0">{isNew ? "Add New" : "Update"} FAQ</Title>
              </Col>
            </Row>
            <Form layout='vertical'>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Question" required>
                    <Input placeholder="Question" name="question" value={state.question} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Sort Order" required>
                    <Input placeholder="Sort Order" name="order" value={state.order} onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item label="Answer">
                    <Input.TextArea rows={5} style={{ resize: "none" }} placeholder="Answer (Max Length: 500 Characters)" name="answer" maxLength={500} showCount value={state.answer} onChange={handleChange} />
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
    </>
  )
}

export default Add