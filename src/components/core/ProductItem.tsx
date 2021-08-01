import React from 'react'
import { Card, Button, Typography, Row, Col, Image } from 'antd'
import { Link } from 'react-router-dom'
import { FC } from 'react'
import { Product } from '../../store/models/product'
import { API } from '../../config'
import moment from 'moment'

const { Title, Paragraph } = Typography

interface Props {
    product: Product
}

const ProductItem: FC<Props> = ({ product }) => {
    return (
        <Card
            style={{ width: 300 }}
            cover={
                <Image src={`${API}/products/photo/${product._id}`} alt={product.name} />
            }
            actions={[
                <Button type="link">
                    <Link to="">查看详情</Link>
                </Button>,
                <Button type="link">
                    <Link to="">加入购物车</Link>
                </Button>
            ]}
        >
            <Title level={5}>{product.name}</Title>
            <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
            <Row>
                <Col span="12">销量：{product.sold}</Col>
                <Col span="12" style={{ textAlign: 'right' }}>价格：{product.price}</Col>
            </Row>
            <Row>
                <Col span="12">上架时间：{moment(product.createdAt).format('YYYY-MM-DD')}</Col>
                <Col span="12" style={{ textAlign: 'right' }}>
                    所属分类：{product.category.name}
                </Col>
            </Row>
        </Card>
    )
}

export default ProductItem
