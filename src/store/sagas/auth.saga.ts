import { put, takeEvery } from "redux-saga/effects"
import { SIGNUP, SignupAction, signupFail, signupSuccess, SIGNIN, SigninAction, signinSuccess, signinFail } from "../actions/auth.action"
import axios from 'axios'
import { API } from '../../config'

function* handleSignup(action: SignupAction) {
    try {
        console.log('提交注册数据', action.payload)
        yield axios.post(`${API}/reset/sign`, action.payload)
        yield put(signupSuccess())
    } catch (e) {
        yield put(signupFail(e.response.data.message))
    }
}

function* handleSignin(action: SigninAction): any {
    try {
        console.log('提交登录数据', action.payload)
        let response = yield axios.post(`${API}/signin`, action.payload)
        localStorage.setItem('jwt', JSON.stringify(response.data))
        yield put(signinSuccess())
    } catch (e) {
        yield put(signinFail(e.response.data.message))
    }
}

export default function* authSaga() {
    // 注册
    yield takeEvery(SIGNUP, handleSignup)
    // 登录
    yield takeEvery(SIGNIN, handleSignin)
}