import axios, {AxiosResponse} from "axios"
import {tokenCheck} from "./actionsAuth";
import {Sorting} from "@devexpress/dx-react-grid";
import {REACT_APP_ORDERS, REACT_APP_USER_INFO_GET} from "../../additional_components/Routes";


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
    page: number,
    sorting: Sorting[],
    cb?: Function | undefined
): any {
    return async (dispatch: any) => {
        return await axios.get(REACT_APP_ORDERS,
            {
                params: {
                    page: Number(page) + 1,
                    sort: sorting?.length ? JSON.stringify(sorting[0]) : undefined
                }
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
