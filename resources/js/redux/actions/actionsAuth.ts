import axios, {AxiosResponse} from "axios"
import {clearUserInfoToRedux} from "./actionsLk";
import {SnackBarUtils} from "../../additional_components/SnackBarUtils/SnackBarUtils";
import {REACT_APP_LOGIN, REACT_APP_LOGOUT, REACT_APP_SERVER_RESTART, REACT_APP_TOKENCHECK} from "../../additional_components/Routes";

export function loginToRedux(r: AxiosResponse): object {
    return {
        type: "LOGIN",
        payload: {
            r
        }
    }
}

export function login(username: string, password: string, cb: Function = () => {
}): any {
    return async (dispatch: any) => {
        return await axios.post(
            REACT_APP_LOGIN + '',
            {
                username,
                password
            }
        )
            .then((res) => {
                dispatch(loginToRedux(res))
                cb()
            })
            .catch(e => {
                SnackBarUtils.error('Вы ввели неверный логин или пароль')

                //dispatch(createNotification('error', '', 'Ошибка'))
                cb()
            })
    }
}

export function tokenCheckToRedux(r: AxiosResponse): object {
    return {
        type: "TOKEN_CHECK",
        payload: {
            r
        }
    }
}

//опросить сервер на валидность токенов
export function tokenCheck(cb?: Function | undefined): any {
    return async (dispatch: any) => {
        return await axios.get(
            REACT_APP_TOKENCHECK + ''
        )
            .then((res) => {
                dispatch(tokenCheckToRedux(res))
                if (cb) {
                    cb(res)
                }
            })
            .catch(async (e: any) => {
                dispatch(tokenCheckToRedux(e.response))
                dispatch(clearUserInfoToRedux())

                // if (cb) {
                //     cb()
                // }
            })
    }
}

export function logoutToRedux(r: AxiosResponse): object {
    return {
        type: "LOGOUT",
        payload: {
            r
        }
    }
}

export function logout(cb: Function = () => undefined): any {
    return async (dispatch: any) => {
        return await axios.post(REACT_APP_LOGOUT + '',)
            .then((res) => {
                dispatch(logoutToRedux(res))
                dispatch(clearUserInfoToRedux())
                cb(res)
            })
            .catch(e => {
                let response = e.response
                let responseMsg = e.response.data.msg
                let responseData = e.response.data.data

                cb(response)
            })
    }
}
