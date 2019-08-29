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

        window.user_id = 1 //TODO
    }

    handleSubmit(e) {
        const { handleSign } = this.props
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // TODO
                if (this.state.sign === 'in')
                    $.post(host + '/user/login', {
                        account: values.username,
                        password: values.password
                    }, res => {
                        if (res.resultDesc === 'Success') {
                            window.user_id = res.data
                            handleSign(values)
                        }
                    })
                else if (this.state.sign === 'up') {
                    const formData = new FormData()
                    /*formData.append('user', JSON.stringify({
                        account: values.username,
                        password: values.password,
                        phone: values.phone
                    }))*/
                    formData.append('user.account', values.username)
                    formData.append('user.password', values.password)
                    formData.append('user.phone', values.phone)
                    formData.append('photo', values.upload[0])
                    $.get({
                        url: host + '/user/signUp',
                        processData: false,
                        contentType: false,
                        data: formData,
                        success: res => {
                            if (res.resultDesc === 'Success') {
                                window.user_id = data
                                handleSign(values)
                            }
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
                    <a className={style["login-form-forgot"]} onClick={e => this.props.handleSign({})}>
                        Skip~~
                    </a>
                    <Button type="primary" htmlType="submit" className={style["login-form-button"]}>
                        Sign
                    </Button>
                    Or <a
                        onClick={() => this.setState({ sign: this.state.sign === 'in' ? 'up' : 'in' })}>
                        Sign {this.state.sign === 'in' ? 'up' : 'in'}!</a>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm)

export default WrappedNormalLoginForm
