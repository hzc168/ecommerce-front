import React from 'react'
import { Button, Form, Input } from 'antd'
import Layout from './Layout'
import { signin, SigninPayload } from '../../store/actions/auth.action'
import { useDispatch } from 'react-redux'

const Signin = () => {
    // 获取dispatch
    const dispatch = useDispatch()

    const onFinish = (value: SigninPayload) => {
        console.log(value)
        dispatch(signin(value))
    }

    return (
        <Layout title="登录" subTitle="登录页面">
            <Form onFinish={onFinish}>
                <Form.Item name="email" label="邮箱">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码">
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">登录</Button>
                </Form.Item>
            </Form>
        </Layout>
    )
}

export default Signin
