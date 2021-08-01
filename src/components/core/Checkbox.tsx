import React from 'react'
import { Typography, List, Checkbox as AntdCheckbox } from 'antd'

const { Title } = Typography

const categories = [{name: 'node'}, {name: 'angular'}]

const Checkbox = () => {
    return (
        <>
            <Title level={4}>按照分类筛选</Title>
            <List dataSource={categories}
                renderItem={item => (
                    <List.Item>
                        <AntdCheckbox>{item.name}</AntdCheckbox>
                    </List.Item>
                )}
            />
        </>
    )
}

export default Checkbox

