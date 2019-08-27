import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'

import { Form, Icon, Input, Button, Checkbox, Upload } from 'antd'

import { host } from '../../util'
import style from './sign.css'

class NormalLoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sign: 'in'
        }
    }

    handleSubmit(e) {
        const { handleSign } = this.props
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // TODO
                if (this.state.sign === 'in')
                    fetch(host + '/user/login', {
                        method: 'POST',
                        body: {
                            account: values.username,
                            password: values.password
                        }
                    }).then(r => r.json()).then(res => {
                        if (res.resultDesc === 'Success') {
                            window.user_id = res.data
                            handleSign(values)
                        }
                    })
                else if (this.state.sign === 'up') {
                    const formData = new FormData()
                    formData.append('user', {
                        account: values.username,
                        password: values.password,
                        phone: values.phone
                    })
                    formData.append('photo', values.upload.fileList[0])
                    fetch(host + '/user/signUp', {
                        method: 'POST',
                        body: formData
                    }).then(r => r.json()).then(res => {
                        if (res.resultDesc === 'Success') {
                            handleSign(values)
                        }
                    })
                }
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className={style["login-form"]}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                {this.state.sign === 'up' ?
                    <div>
                        <Form.Item>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入手机号!' }],
                            })(
                                <Input
                                    prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Phone"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('upload', {
                                rules: [{ required: true, message: '请选择头像!' }],
                                valuePropName: 'fileList',
                                getValueFromEvent: e => e.fileList ? e.fileList : e,
                            })(
                                <Upload
                                    beforeUpload={() => false}>
                                    <Button>
                                        <Icon type="upload" /> 上传头像
                                        </Button>
                                </Upload>,
                            )}
                        </Form.Item>
                    </div> : null}
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    {this.state.sign === 'in' ?
                        <a className={style["login-form-forgot"]} href="#">
                            Forgot password
                        </a> : null}
                    <Button type="primary" htmlType="submit" className={style["login-form-button"]}>
                        Sign
                    </Button>
                    Or <a
                        onClick={() => this.setState({ sign: this.state.sign === 'in' ? 'up' : 'in' })}>
                        Sign {this.state.sign}!</a>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm)

export default WrappedNormalLoginForm
