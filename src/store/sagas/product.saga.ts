import { takeEvery, put } from "redux-saga/effects";
import { GetProductAction, getProductSuccess, GET_PRODUCT, SearchProductAction, searchProductSuccess, SEARCH_PRODUCT } from "../actions/product.actions";
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

function* handleSearchProduct({payload: {search, category}}: SearchProductAction): any {
    let response = yield axios.get(`${API}/products/search`, {
        params: { search, category }
    })
    yield put(searchProductSuccess(response.data))
}

export default function* productSaga() {
    yield takeEvery(GET_PRODUCT, handleGetPorduct)
    yield takeEvery(SEARCH_PRODUCT, handleSearchProduct)
}
