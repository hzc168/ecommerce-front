import { createStore, applyMiddleware } from 'redux'
import { createHashHistory } from 'history'
import createRootReducer from './reducers'
import { routerMiddleware } from 'connected-react-router'

export const history = createHashHistory()

const store = createStore(
    createRootReducer(history),
    applyMiddleware(routerMiddleware(history))
)

export default store
