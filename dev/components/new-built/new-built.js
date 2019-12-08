import React, { Component } from 'react'

import { Modal, Form, Input, Button } from 'antd'

import { host, imgs } from '../../utils'
import style from './new-built.css'

const ModalForm = ({ form, handleSubmit }) => {
    const { getFieldDecorator } = form
    return (
        <Form className={style.form}
            onSubmit={e => {
                e.preventDefault()
                form.validateFields((err, values) => {
                    if (!err) {
                        $.post(host + '/project/createProject', {
                            'project.user_id': window.user_id,
                            'project.project_name': values.name,
                            'project.project_desc': values.desc
                        }, res => {
                            if (res.resultDesc === 'Success') {
                                handleSubmit()
                            }
                        })
                    }
                })
            }}
        >
            <Form.Item>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input project name!' }],
                })(
                    <Input placeholder="Projct Name" />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('desc')(
                    <Input placeholder="Project Description" rows={2} />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={style["form-button"]}>
                    Create
                </Button>
            </Form.Item>
        </Form >
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
        this.props.handleUpdate()
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
                        <img src={imgs.cross} />
                    </div>
                </div>
                <Modal
                    title="创建项目"
                    footer={null}
                    visible={this.state.visible} destroyOnClose
                    onCancel={this.handleCancel.bind(this)}
                >
                    <WrappedModalForm handleSubmit={this.handleSubmit.bind(this)} />
                </Modal>
            </div>
        )
    }
}
