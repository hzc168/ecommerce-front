import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import testReducer from './test.reducer'
import { History } from 'history'

const createRootReducer = (history: History) => combineReducers({
    test: testReducer,
    router: connectRouter(history)
})

export default createRootReducer