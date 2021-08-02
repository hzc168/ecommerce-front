import React, { useEffect } from 'react'
import Layout from './Layout'
import Search from './Search'
import { Col, Row, Typography } from 'antd'
import ProductItem from './ProductItem'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../../store/actions/product.action'
import { AppState } from '../../store/reducers'
import { ProductState } from '../../store/reducers/product.reducer'

const { Title } = Typography

const Home = () => {
    const dispatch = useDispatch()

    const { createdAt, sold } = useSelector<AppState, ProductState>(state => state.product)

    useEffect(() => {
        dispatch(getProduct("createdAt"))
        dispatch(getProduct("sold"))
    }, [])

    return (
        <Layout title="首页" subTitle="尽情挑选">
            <Search />
            <Title level={5}>最新上架</Title>
            <Row gutter={[16, 16]}>
                {
                    createdAt.products.map(item => (
                        <Col span="6" key={item._id}>
                            <ProductItem product={item} />
                        </Col>
                    ))
                }
            </Row>
            <Title level={5}>最受欢迎</Title>
            <Row gutter={[16, 16]}>
                {
                    sold.products.map(item => (
                        <Col span="6" key={item._id}>
                            <ProductItem product={item} />
                        </Col>
                    ))
                }
            </Row>
        </Layout>
    )
}

export default Home
