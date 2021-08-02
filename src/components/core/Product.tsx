import React, { useEffect } from 'react'
import Layout from './Layout'
import { Row, Col } from 'antd'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductById } from '../../store/actions/product.action'
import { AppState } from '../../store/reducers'
import { ProductState } from '../../store/reducers/product.reducer'
import ProductItem from './ProductItem'

const Product = () => {
    const dispatch = useDispatch()

    const { product } = useSelector<AppState, ProductState>(state => state.product)

    const { productId } = useParams<{ productId: string }>()
    console.log(productId)
    useEffect(() => {
        dispatch(getProductById({ productId }))
    }, [])

    return (
        <Layout title="商品名称" subTitle="商品详情">
            <Row gutter={36}>
                <Col span="18">
                    <ProductItem showViewProduct={false} product={product.result} />
                </Col>
                <Col span="6">right</Col>
            </Row>
        </Layout>
    )
}

export default Product
