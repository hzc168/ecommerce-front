import { put, takeEvery } from "redux-saga/effects"
import { SIGNUP, SignupAction, signupFail, signupSuccess } from "../actions/auth.action"
import axios from 'axios'
import { API } from '../../config'

function* handleSignup(action: SignupAction) {
    try {
        console.log('提交注册数据', action.payload)
        yield axios.post(`${API}/sign`, action.payload)
        yield put(signupSuccess())
    } catch (e) {
        yield put(signupFail(e.response.data.error))
    }
}

export default function* authSaga() {
    yield takeEvery(SIGNUP, handleSignup)
}