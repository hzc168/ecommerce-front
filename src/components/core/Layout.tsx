import React, { FC } from 'react'
import Navigator from './Navigation'

interface Props {
    children: React.ReactNode
}

const Layout: FC<Props> = ({children}) => {
    return (
        <div>
            <Navigator />
            {children}
        </div>
    )
}

export default Layout