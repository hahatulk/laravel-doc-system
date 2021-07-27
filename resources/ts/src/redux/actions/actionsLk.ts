import axios, {AxiosResponse} from "axios"
import {tokenCheck} from "./actionsAuth";
import {Sorting} from "@devexpress/dx-react-grid";
import {REACT_APP_ORDERS, REACT_APP_USER_INFO_GET} from "../../additional_components/Routes/Routes";
//все запросы включают токен
axios.defaults.withCredentials = true

export function clearUserInfoToRedux(): object {
    return {
        type: "CLEAR_USER_INFO",
    }
}

export function userInfoToRedux(r: AxiosResponse): object {
    return {
        type: "USER_INFO_GET",
        payload: {
            r
        }
    }
}

export function userInfoGet(cb?: Function | undefined): any {
    return async (dispatch: any) => {
        return await axios.get(REACT_APP_USER_INFO_GET + '',)
            .then((res) => {
                dispatch(userInfoToRedux(res))
                if (cb) {
                    cb()
                }
            })
            .catch(res => {
                //check if tokens expired already
                if (res.status !== 200) {
                    dispatch(tokenCheck())
                }
                if (cb) {
                    cb()
                }
            })
    }
}

export function ordersGetToRedux(r: AxiosResponse): object {
    return {
        type: "ORDERS_GET",
        payload: {
            r
        }
    }
}

export function ordersGet(
    limit: number,
    offset: number,
    page: number,
    sorting: Sorting[],
    cb?: Function | undefined
): any {
    return async (dispatch: any) => {
        return await axios.post(REACT_APP_ORDERS + ``,
            {
                limit: limit,
                offset: offset,
                page: page,
                sorting: sorting,
            }
        )
            .then((res) => {
                dispatch(ordersGetToRedux(res))
                if (cb) {
                    cb()
                }
            })
            .catch(res => {
                //check if tokens expired already
                if (res.status !== 200) {
                    dispatch(tokenCheck())
                }
                if (cb) {
                    cb()
                }
            })
    }
}
