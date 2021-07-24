import React from 'react'
import Layout from './Layout'
import { useSelector } from 'react-redux'

const Home = () => {
    const state = useSelector(state => state)
    return (
        <Layout title="首页" subTitle="尽情挑选">
            Home
            {JSON.stringify(state)}
        </Layout>
    )
}

export default Home
