import { takeEvery, put } from "redux-saga/effects";
import { GetProductAction, getProductSuccess, GET_PRODUCT } from "../actions/product.actions";
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

export default function* productSaga() {
    yield takeEvery(GET_PRODUCT, handleGetPorduct)
}
