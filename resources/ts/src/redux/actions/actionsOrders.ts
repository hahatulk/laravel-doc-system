import axios, {AxiosResponse} from "axios"
import {tokenCheck} from "./actionsAuth";
import {SnackBarUtils} from "../../additional_components/SnackBarUtils/SnackBarUtils"
import {Filter, Sorting} from "@devexpress/dx-react-grid";
import {REACT_APP_ADMIN_ORDERS_LIST, REACT_APP_ADMIN_ORDERS_LIST_ARCHIVED, REACT_APP_ORDER_CANCEL, REACT_APP_ORDER_CREATE_SPRAVKA_OB_OBUCHENII} from "../../additional_components/Routes/Routes";

//все запросы включают токен
axios.defaults.withCredentials = true

export function orderSpravkaObObuchenii(count: number, comment: string | undefined, cb?: Function | undefined): any {
    return async (dispatch: any) => {
        return await axios.post(REACT_APP_ORDER_CREATE_SPRAVKA_OB_OBUCHENII + '',
            {
                count: count,
                comment: comment,
                type: 'справка_об_обучении',
            })
            .then((res) => {
                SnackBarUtils.success('Заявка отправлена')

                if (cb) {
                    cb(res)
                }
            })
            .catch(e => {
                try {
                    let responseMsg = e.response.data.msg
                    let responseData = e.response.data.data


                    switch (responseMsg) {
                        case 'Order limit reached':
                            SnackBarUtils.error('Достигнут лимит заказов "Справка с места обучения"')
                            break
                        case 'Order count is more than can order':
                            SnackBarUtils.error(`Вы заказываете справок больше чем разрешено (осталось ${responseData.left})`)
                            break
                        default:
                            SnackBarUtils.error('Попробуйте повторить операцию позже')
                    }
                } catch (e) {
                    SnackBarUtils.error('Попробуйте повторить операцию позже')
                }
                //check if tokens expired already
                dispatch(tokenCheck())

                if (cb) {
                    cb()
                }
            })
    }
}

export function cancelOrder(orderId: string | number, cb?: Function | undefined): any {
    return async (dispatch: any) => {
        return await axios.delete(REACT_APP_ORDER_CANCEL + `?orderId=${orderId}`,
        )
            .then((res) => {
                SnackBarUtils.success('Заказ отменен')

                if (cb) {
                    cb(res)
                }
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Попытайтесь отменить заказ позднее')

                if (cb) {
                    cb(res)
                }
            })
    }
}

export function getOrdersListToRedux(res: AxiosResponse): object {
    return {
        type: "ORDERS_LIST_GET",
        payload: res
    }
}

export function getOrdersListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "ORDERS_LIST_LOADING_STATE",
        payload: loading
    }
}

export function getOrdersList(
    limit: string | number,
    offset: string | number,
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getOrdersListLoadingStateToRedux(true))
        return await axios.post(REACT_APP_ADMIN_ORDERS_LIST + ``,
            {
                offset: offset,
                limit: limit,
                page: page,
                sort: sort,
                filters: filters,
            }
        )
            .then((res) => {
                dispatch(getOrdersListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getOrdersListLoadingStateToRedux(false))
            })
    }
}

export function getArchivedOrdersListToRedux(res: AxiosResponse): object {
    return {
        type: "ARCHIVED_ORDERS_LIST_GET",
        payload: res
    }
}

export function getArchivedOrdersListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "ARCHIVED_ORDERS_LIST_LOADING_STATE",
        payload: loading
    }
}

export function getArchivedOrdersList(
    limit: string | number,
    offset: string | number,
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getArchivedOrdersListLoadingStateToRedux(true))
        return await axios.post(REACT_APP_ADMIN_ORDERS_LIST_ARCHIVED + ``,
            {
                offset: offset,
                limit: limit,
                page: page,
                sort: sort,
                filters: filters,
            }
        )
            .then((res) => {
                dispatch(getArchivedOrdersListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getArchivedOrdersListLoadingStateToRedux(false))
            })
    }
}
