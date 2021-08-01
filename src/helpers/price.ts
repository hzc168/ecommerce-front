import { Price } from '../store/models/product'

const prices: Price[] = [
    {
        id: 0,
        name: "不限制价格",
        array: []
    },
    {
        id: 2,
        name: "1 - 50",
        array: [1 - 50]
    },
    {
        id: 3,
        name: "51 - 100",
        array: [51 - 100]
    },
    {
        id: 4,
        name: "101 - 150",
        array: [101, 150]
    },
    {
        id: 5,
        name: "151 - 200",
        array: [151, 200]
    },
    {
        id: 6,
        name: "201 - 250",
        array: [201, 250]
    },
    {
        id: 7,
        name: "251 - 300",
        array: [251, 300]
    },
    {
        id: 8,
        name: "301 - 350",
        array: [301, 350]
    },
    {
        id: 9,
        name: "351 - 400",
        array: [351, 400]
    }
]

export default prices