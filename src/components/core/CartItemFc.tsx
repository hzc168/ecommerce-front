import React, { ChangeEvent, FC, useState } from 'react'
import { CartItem, deleteItem, updateItem } from '../../helpers/cart'
import { Image, Input, Button } from 'antd'
import { API } from '../../config'

interface Props {
    product: CartItem,
    setCart: (arg: CartItem[]) => void
}

const CartItemFc: FC<Props> = ({ product, setCart }) => {
    const [count, setCount] = useState<number>(product.count)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let count = parseInt(event.target.value)
        setCart(updateItem(product._id, count))
        setCount(count)
    }

    return (
        <tr className="ant-table-row">
            <td className="ant-table-cell">
                <Image src={`${API}/products/photo/${product._id}`} />
            </td>
            <td className="ant-table-cell">
                {product.name}
            </td>
            <td className="ant-table-cell">
                {product.price}
            </td>
            <td className="ant-table-cell">
                {product.category.name}
            </td>
            <td className="ant-table-cell">
                <Input type="number" value={product.count} onChange={handleChange} />
            </td>
            <td className="ant-table-cell">
                <Button danger type="primary" onClick={() => setCart(deleteItem(product._id))}>删除</Button>
            </td>
        </tr>
    )
}

export default CartItemFc
