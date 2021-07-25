import { createStore, applyMiddleware } from 'redux'
import { createHashHistory } from 'history'
import createRootReducer from './reducers'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'
import { composeWithDevTools } from 'redux-devtools-extension'

export const history = createHashHistory()

const sagaMiddleWare = createSagaMiddleware()

const store = createStore(
    createRootReducer(history),
    composeWithDevTools(
        applyMiddleware(routerMiddleware(history), sagaMiddleWare)
    )
)

sagaMiddleWare.run(rootSaga)

export default store
