import React from 'react'
import { useSelector } from 'react-redux'
import Layout from './Layout'
import {Row, Col, Space} from 'antd'
import Checkbox from './Checkbox'
import RadioBox from './RadioBox'

const Shop = () => {
    const state = useSelector(state => state)

    const filterDOM = () => (
        <Space size="middle" direction="vertical">
            <Checkbox></Checkbox>
            <RadioBox></RadioBox>
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
