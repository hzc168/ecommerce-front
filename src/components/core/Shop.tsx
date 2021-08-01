import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Layout from './Layout'
import { Row, Col, Space } from 'antd'
import Checkbox from './Checkbox'
import RadioBox from './RadioBox'
import { filterProduct } from '../../store/actions/product.actions'

const Shop = () => {
    const state = useSelector(state => state)

    const dispatch = useDispatch()

    const [myFilters, setMyFilters] = useState<{ category: string[], price: number[] }>({ category: [], price: [] })

    useEffect(() => {
        dispatch(filterProduct({filter: myFilters, skip: 0}))
    }, [myFilters])

    const filterDOM = () => (
        <Space size="middle" direction="vertical">
            <Checkbox handleFilter={(filters: string[]) => {
                setMyFilters({...myFilters, category: filters})
            }} />
            <RadioBox handleFilter={(filters: number[]) => {
                setMyFilters({...myFilters, price: filters})
            }} />
        </Space>
    )
    return (
        <Layout title="商品页" subTitle="选择你喜欢的商品吧">
            <Row>
                <Col span="4">
                    {filterDOM()}
                </Col>
                <Col span="20">right</Col>
            </Row>
        </Layout>
    )
}

export default Shop
