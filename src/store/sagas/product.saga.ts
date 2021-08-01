import { takeEvery, put } from "redux-saga/effects";
import { FilterProductAction, filterProductSuccess, FILTER_PRODUCT, GetProductAction, GetProductByIdAction, getProductByIdSuccess, getProductSuccess, GET_PRODUCT, GET_PRODUCT_BY_ID, SearchProductAction, searchProductSuccess, SEARCH_PRODUCT } from "../actions/product.actions";
import axios from 'axios'
import { API } from "../../config";
import { isAuth } from "../../helpers/auth";
import { Jwt } from "../models/auth";

function* handleGetPorduct({ sortBy, order, limit }: GetProductAction): any {
    const { token } = isAuth() as Jwt
    let response = yield axios.get(`${API}/products`, {
        params: { sortBy, order, limit },
        headers: {
            Authorization: `Bearer ${token}`
        }
    },

    )
    yield put(getProductSuccess(response.data, sortBy))
}

function* handleSearchProduct({ payload: { search, category } }: SearchProductAction): any {
    let response = yield axios.get(`${API}/products/search`, {
        params: { search, category }
    })
    yield put(searchProductSuccess(response.data))
}

function* handleFilterProduct(action: FilterProductAction): any {
    let response = yield axios.post(`${API}/products/filter`, action.payload)
    yield put(filterProductSuccess(response.data, action.payload.skip))
}

function* handleGetPorductById({ payload }: GetProductByIdAction): any {
    const { token } = isAuth() as Jwt
    let response = yield axios.get(`${API}/reset/products/${payload.productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    yield put(getProductByIdSuccess(response.data))
}

export default function* productSaga() {
    yield takeEvery(GET_PRODUCT, handleGetPorduct)
    yield takeEvery(SEARCH_PRODUCT, handleSearchProduct)
    yield takeEvery(FILTER_PRODUCT, handleFilterProduct)
    yield takeEvery(GET_PRODUCT_BY_ID, handleGetPorductById)
}
