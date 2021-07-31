import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { Form, Input, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'
import axios from 'axios'
import { API } from '../../config'

const AddCategory = () => {
    const [name, setName] = useState<string>("")

    const { token } = isAuth() as Jwt
    const [form] = Form.useForm()

    useEffect(() => {
        async function addCategory() {
            try {
                let response = await axios.post<{ name: string }>(
                    // `${API}/category/create/${user._id}`,
                    `${API}/reset/category`,
                    {
                        name: name
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                message.success(`[${response.data.name}] 分类添加成功`)
                form.resetFields();
            } catch (e) {
                console.log(e.response);
                message.error(e.response.data.message)
            }
        }
        name && addCategory()
    }, [name])

    const onFinish = (value: { name: string }) => {
        setName(value.name)
    }

    return (
        <Layout title="添加分类" subTitle="这里是添加分类">
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="name" label="分类名称">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        添加分类
                    </Button>
                </Form.Item>
            </Form>
            <Button><Link to="/admin/dashboard">返回Dashboard</Link></Button>
        </Layout>
    )
}

export default AddCategory
