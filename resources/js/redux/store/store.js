import {applyMiddleware, createStore} from "redux"
import allReducers from "./allReducers"
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from "redux-thunk"
import {createAxiosResponseInterceptor} from "../../additional_components/AxiosRefreshInterceptor/AxiosRefreshInterceptor";
import axios from "axios";


export const store = createStore(allReducers,
    composeWithDevTools(applyMiddleware(
        thunk
    )))

//все запросы включают токен и рефрешат токены
axios.defaults.withCredentials = true
createAxiosResponseInterceptor()
