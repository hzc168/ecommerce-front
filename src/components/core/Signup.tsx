import React from 'react'
import { Button, Form, Input } from 'antd'
import Layout from './Layout'
import { signup, SignupPayload } from '../../store/actions/auth.action'
import { useDispatch } from 'react-redux'

const Signup = () => {
    // 获取dispatch方法
    const dispatch = useDispatch()
    const onFinish = (value: SignupPayload) => {
        console.log(value)
        dispatch(signup(value))
    }

    return (
        <Layout title="注册" subTitle="注册页面">
            <Form onFinish={onFinish}>
                <Form.Item name="name" label="昵称">
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="邮箱">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码">
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
        </Layout>
    )
}

export default Signup
