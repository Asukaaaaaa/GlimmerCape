import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'

import { Form, Icon, Input, Button, Checkbox } from 'antd'

import style from './sign.css'

class NormalLoginForm extends React.Component {
    handleSubmit(e) {
        const { handleSign } = this.props
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // TODO
                handleSign(values)
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
                <Route path='/sign/up'
                    render={() => (
                        <Form.Item>
                            {getFieldDecorator('password2', {
                                rules: [{ required: true, message: 'input your Password again!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password again"
                                />,
                            )}
                        </Form.Item>
                    )}
                />
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <a className={style["login-form-forgot"]} href="#">
                        Forgot password
                    </a>
                    <Button type="primary" htmlType="submit" className={style["login-form-button"]}>
                        Log in
                    </Button>
                    Or <Route path='/sign' exact
                        render={() => <Link to='/sign/up'>Sign Up!</Link>}
                    />
                    <Route path='/sign/up' exact
                        render={() => <Link to='/sign'>Sign In.</Link>}
                    />
                </Form.Item>
            </Form>
        )
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm)

export default WrappedNormalLoginForm
