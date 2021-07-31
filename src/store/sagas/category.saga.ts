import { getCategorySuccess, GET_CATEGORY } from "../actions/category.actions";
import { takeEvery, put } from "redux-saga/effects";
import axios from 'axios'
import { API } from "../../config";
import { Category } from "../models/category";
import { isAuth } from "../../helpers/auth";
import { Jwt } from "../models/auth";

function* handleGetCategory():any {
    const { token } = isAuth() as Jwt
    try {
        let response = yield axios.get<Category[]>(`${API}/reset/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        yield put(getCategorySuccess(response.data))
    } catch(e) {
        
    }
    
}

export default function* categorySaga() {
    // 获取分类列表
    yield takeEvery(GET_CATEGORY, handleGetCategory)
}