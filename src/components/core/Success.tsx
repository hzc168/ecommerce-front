import React from 'react'
import Layout from './Layout'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

const Success = () => {
    return (
        <Layout title="支付完成" subTitle="">
            <Button>
                <Link to="/">继续购物</Link>
            </Button>
        </Layout>
    )
}

export default Success
