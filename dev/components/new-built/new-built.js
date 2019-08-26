import React, { Component } from 'react'

import { Modal, Form, Input, Button } from 'antd'

import style from './new-built.css'

const ModalForm = ({ form, handleSubmit }) => {
    const { getFieldDecorator } = form
    return (
        <Form className={style.form}
            onSubmit={e => {
                e.preventDefault()
                form.validateFields((err, values) => {
                    if (!err) {
                        // TODO
                        handleSubmit(values)
                    }
                })
            }}
        >
            <Form.Item>
                {getFieldDecorator('projname', {
                    rules: [{ required: true, message: 'Please input project name!' }],
                })(
                    <Input placeholder="Projct Name" />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('projdesc')(
                    <Input placeholder="Project Description" rows={2} />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={style["form-button"]}>
                    Create
                </Button>
            </Form.Item>
        </Form>
    )
}
const WrappedModalForm = Form.create()(ModalForm)

export default class NewBuilt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }

    }

    handleSubmit() {
        this.setState({ visible: false })
    }
    handleCancel() {
        this.setState({ visible: false })
    }

    render() {
        return (
            <div className={style.main}>
                <div className={style.title}>
                    <span>创建新项目</span>
                </div>
                <div className={style.blocks} >
                    <div onClick={e => this.setState({ visible: true })}>
                        <img src='./img/cross.png' />
                    </div>
                </div>
                <Modal
                    title="创建项目"
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <WrappedModalForm handleSubmit={this.handleSubmit.bind(this)} />
                </Modal>
            </div>
        )
    }
}
