import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import authReducer, { AuthState } from './auth.reducer'
import categoryReducer, { CategoryState } from './category.reducer'

export interface AppState {
    router: RouterState,
    auth: AuthState,
    category: CategoryState
}

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    category: categoryReducer
})

export default createRootReducer