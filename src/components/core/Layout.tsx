import React, { FC } from 'react'
import { PageHeader } from '_antd@4.16.8@antd'
import Navigator from './Navigation'

interface Props {
    children: React.ReactNode,
    title: string,
    subTitle: string
}

const Layout: FC<Props> = ({ children, title, subTitle }) => {
    return (
        <div>
            <Navigator />
            <PageHeader className="jumbotron" title={title} subTitle={subTitle} />
            <div style={{width: "85%", margin: "0 auto"}}>{children}</div>
        </div>
    )
}

export default Layout