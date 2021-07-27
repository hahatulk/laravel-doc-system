import {applyMiddleware, createStore} from "redux"
import allReducers from "./allReducers"
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from "redux-thunk"
// import logger from 'redux-logger'

export const store = createStore(allReducers,
    composeWithDevTools(applyMiddleware(
        thunk
    )))
// export const store = createStore(allReducers,
//     composeWithDevTools(applyMiddleware(
//         logger, thunk
//     )))
// window.store = store