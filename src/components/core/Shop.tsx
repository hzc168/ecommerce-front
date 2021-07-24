import React from 'react'
import { useSelector } from 'react-redux'
import Layout from './Layout'

const Shop = () => {
    const state = useSelector(state => state)
    return (
        <Layout>
            Shop
            {JSON.stringify(state)}
        </Layout>
    )
}

export default Shop
