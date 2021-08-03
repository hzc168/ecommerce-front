import React from 'react'
import Layout from '../core/Layout'
import { Row, Col, Menu, Typography, Descriptions } from 'antd'
import { Link } from 'react-router-dom'
import {
    ShoppingCartOutlined,
    UserOutlined,
    OrderedListOutlined
} from '@ant-design/icons'
import { isAuth } from '../../helpers/auth'
import { Jwt } from '../../store/models/auth'

const { Title } = Typography


const AdminDashboard = () => {
    // 添加分类 添加产品 订单列表

    const {
        user: { name, email }
    } = isAuth() as Jwt

    const adminLinks = () => (
        <>
            <Title level={5}>管理员连接</Title>
            <Menu>
                <Menu.Item>
                    <ShoppingCartOutlined />
                    <Link to="/create/category">添加分类</Link>
                </Menu.Item>
                <Menu.Item>
                    <UserOutlined />
                    <Link to="/create/product">添加产品</Link>
                </Menu.Item>
                <Menu.Item>
                    <OrderedListOutlined />
                    <Link to="/admin/orders">订单列表</Link>
                </Menu.Item>
            </Menu>
        </>
    )

    const adminInfo = () => (
        <Descriptions title="管理员信息">
            <Descriptions.Item label="昵称">{name}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{email}</Descriptions.Item>
            <Descriptions.Item label="角色">管理员</Descriptions.Item>
        </Descriptions>
    )

    return (
        <Layout title="AdminDashboard" subTitle="这里是 AdminDashboard">
            <Row>
                <Col span="4">
                    {adminLinks()}
                </Col>
                <Col span="20">
                    {adminInfo()}
                </Col>
            </Row>
        </Layout>
    )
}

export default AdminDashboard
