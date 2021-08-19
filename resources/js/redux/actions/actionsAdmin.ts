import axios, {AxiosResponse} from "axios"
import {tokenCheck} from "./actionsAuth";
import {SnackBarUtils} from "../../additional_components/SnackBarUtils/SnackBarUtils"
import {Filter, Sorting} from "@devexpress/dx-react-grid";
import fileDownload from "js-file-download";
import {getLocalPlainDateTime} from "../../additional_components/Dates";
import {
    REACT_APP_ADMIN_DOWNLOAD_EXCEL_DOCUMENT_BY_PATH,
    REACT_APP_ADMIN_EXPORT_DATA,
    REACT_APP_ADMIN_GROUPS_DELETE,
    REACT_APP_ADMIN_GROUPS_EDIT,
    REACT_APP_ADMIN_GROUPS_LIST_GET,
    REACT_APP_ADMIN_IMPORT_STUDENTS_TEMPLATE_PATH,
    REACT_APP_ADMIN_MODERATORS_DELETE,
    REACT_APP_ADMIN_MODERATORS_GET,
    REACT_APP_ADMIN_PRIKAZ_DELETE,
    REACT_APP_ADMIN_PRIKAZ_EDIT,
    REACT_APP_ADMIN_PRIKAZ_LIST,
    REACT_APP_ADMIN_STUDENT_EDIT,
    REACT_APP_ADMIN_STUDENTS_LIST_GET
} from "../../additional_components/Routes";

//все запросы включают токен
axios.defaults.withCredentials = true


export function clearStudentsListToRedux(): object {
    return {
        type: "CLEAR_STUDENTS_LIST",
    }
}

export function getStudentsListToRedux(res: AxiosResponse): object {
    return {
        type: "STUDENTS_LIST_GET",
        payload: res
    }
}

export function getStudentsListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "STUDENTS_LIST_LOADING_STATE",
        payload: loading
    }
}

export function getArchivedStudentsListToRedux(res: AxiosResponse): object {
    return {
        type: "ARCHIVED_STUDENTS_LIST_GET",
        payload: res
    }
}

export function getArchivedStudentsListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "ARCHIVED_STUDENTS_LIST_LOADING_STATE",
        payload: loading
    }
}

export function getGroupsListToRedux(res: AxiosResponse): object {
    return {
        type: "GROUPS_LIST_GET",
        payload: res
    }
}

export function getGroupsListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "GROUPS_LIST_LOADING_STATE",
        payload: loading
    }
}

export function getModeratorsListToRedux(res: AxiosResponse): object {
    return {
        type: "MODERATORS_LIST_GET",
        payload: res
    }
}

export function getModeratorsListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "MODERATORS_LIST_LOADING_STATE",
        payload: loading
    }
}

export function getPrikazListToRedux(res: AxiosResponse): object {
    return {
        type: "PRIKAZ_LIST_GET",
        payload: res
    }
}

export function getPrikazListLoadingStateToRedux(loading: boolean): object {
    return {
        type: "PRIKAZ_LIST_LOADING_STATE",
        payload: loading
    }
}


export function getGroupsList(
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getGroupsListLoadingStateToRedux(true))
        return await axios.get(REACT_APP_ADMIN_GROUPS_LIST_GET,
            {
                params: {
                    page: Number(page) + 1,
                    sort: sort?.length ? JSON.stringify(sort) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                },

            }
        )
            .then((res) => {
                dispatch(getGroupsListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getGroupsListLoadingStateToRedux(false))
            })
    }
}

export function getModeratorsList(
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getModeratorsListLoadingStateToRedux(true))
        return await axios.get(REACT_APP_ADMIN_MODERATORS_GET + ``,
            {
                params:{
                    page: Number(page) + 1,
                    sort: sort?.length ? JSON.stringify(sort) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                }
            }
        )
            .then((res) => {
                dispatch(getModeratorsListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getModeratorsListLoadingStateToRedux(false))
            })
    }
}

export function getPrikazList(
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getPrikazListLoadingStateToRedux(true))
        return await axios.get(REACT_APP_ADMIN_PRIKAZ_LIST + ``,
            {
                params: {
                    page: Number(page) + 1,
                    sort: sort?.length ? JSON.stringify(sort) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                }
            }
        )
            .then((res) => {
                dispatch(getPrikazListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getPrikazListLoadingStateToRedux(false))
            })
    }
}

export function getStudentsList(
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getStudentsListLoadingStateToRedux(true))
        return await axios.get(REACT_APP_ADMIN_STUDENTS_LIST_GET + ``,
            {
                params: {
                    page: Number(page) + 1,
                    sort: sort?.length ? JSON.stringify(sort) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                    inProgress: 1,
                },
            }
        )
            .then((res) => {
                dispatch(getStudentsListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getStudentsListLoadingStateToRedux(false))
            })
    }
}

export function getArchivedStudentsList(
    page: string | number,
    sort?: Sorting[],
    filters?: Filter[],
): any {
    return async (dispatch: any) => {
        dispatch(getArchivedStudentsListLoadingStateToRedux(true))
        return await axios.get(REACT_APP_ADMIN_STUDENTS_LIST_GET + ``,
            {
                params: {
                    page: Number(page) + 1,
                    sort: sort?.length ? JSON.stringify(sort) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                    inProgress: 0,
                }
            }
        )
            .then((res) => {
                dispatch(getArchivedStudentsListToRedux(res))
            })
            .catch(e => {
                const res = e.response
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка загрузки списка')

            })
            .finally(() => {
                dispatch(getArchivedStudentsListLoadingStateToRedux(false))
            })
    }
}

export function editStudent(
    userId: number,
    values: any,
    cb?: Function | undefined,
): any {
    return async (dispatch: any) => {
        return await axios.post(REACT_APP_ADMIN_STUDENT_EDIT + ``,
            {
                userId: userId,
                ...values

            }
        )
            .then((res) => {
                SnackBarUtils.success('Данные студента изменены!')

                if (cb) {
                    cb()
                }
            })
            .catch(e => {
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка изменения данных студента')
            })
    }
}

export function editPrikaz(
    prikazId: number,
    values: any,
    cb?: Function | undefined,
): any {
    return async (dispatch: any) => {
        return await axios.post(REACT_APP_ADMIN_PRIKAZ_EDIT + ``,
            {
                prikazId: prikazId,
                N: values.N,
                name: values.name,
                date: values.date,
            }
        )
            .then((res) => {
                SnackBarUtils.success('Данные приказа изменены')

                if (cb) {
                    cb()
                }
            })
            .catch(e => {
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка изменения данных приказа')
            })
    }
}

export function deletePrikaz(
    prikazId: number,
    cb?: Function | undefined,
): any {
    return async (dispatch: any) => {
        return await axios.delete(REACT_APP_ADMIN_PRIKAZ_DELETE + ``,
            {
                params: {
                    id: prikazId,
                }
            }
        )
            .then((res) => {
                SnackBarUtils.warning('Приказ удален')

                if (cb) {
                    cb()
                }
            })
            .catch(e => {
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка удаления приказа')
            })
    }
}

export function editGroup(
    groupId: number,
    values: any,
    cb?: Function | undefined,
): any {
    return async (dispatch: any) => {
        return await axios.post(REACT_APP_ADMIN_GROUPS_EDIT + ``,
            {
                groupId: groupId,
                values: values
            }
        )
            .then((res) => {
                SnackBarUtils.success('Данные группы изменены!')

                if (cb) {
                    cb()
                }
            })
            .catch(e => {
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка изменения данных группы')
            })
    }
}

export function deleteGroup(
    groupId: number,
    cb?: Function | undefined,
): any {
    return async (dispatch: any) => {
        return await axios.delete(REACT_APP_ADMIN_GROUPS_DELETE,
            {
                params: {
                    groupId: groupId,
                }
            }
        )
            .then((res) => {
                SnackBarUtils.warning('Группа удалена!')

                if (cb) {
                    cb()
                }
            })
            .catch(e => {
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка удаления группы')
            })
    }
}

export function deleteModerator(
    userId: number,
    cb?: Function | undefined,
): any {
    return async (dispatch: any) => {
        return await axios.delete(REACT_APP_ADMIN_MODERATORS_DELETE + ``,
            {
                params:{
                    userId: userId,
                }
            }
        )
            .then((res) => {
                SnackBarUtils.warning('Администратор удален!')

                if (cb) {
                    cb()
                }
            })
            .catch(e => {
                //check if tokens expired already
                dispatch(tokenCheck())
                SnackBarUtils.error('Ошибка удаления')
            })
    }
}

export function downloadImportStudentsTemplate(): any {
    return async (dispatch: any) => {
        return await axios.get(REACT_APP_ADMIN_IMPORT_STUDENTS_TEMPLATE_PATH + ``,
            {
                responseType: 'blob'
            }
        )
            .then((r) => {
                fileDownload(
                    r.data,
                    'шаблон_импорт_студентов.xlsx',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
            })
            .catch(res => {
                //check if tokens expired already
                if (res.status !== 200) {
                    dispatch(tokenCheck())
                }
            })
    }
}

export function exportStudents(restrictedColumns: any[], filters: any[], inProgress: number): any {
    return async (dispatch: any) => {
        return await axios.get(REACT_APP_ADMIN_EXPORT_DATA + ``,
            {
                responseType: 'blob',
                params: {
                    restrictedColumns: restrictedColumns?.length ? JSON.stringify(restrictedColumns) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                    inProgress: inProgress,
                }
            }
        )
            .then((r) => {
                fileDownload(
                    r.data,
                    `экспорт_${getLocalPlainDateTime(new Date())}.xlsx`,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
                // dispatch(downloadExcelFile(r.data.data.path))
            })
            .catch(res => {
                //check if tokens expired already
                if (res.status !== 200) {
                    dispatch(tokenCheck())
                }
            })
    }
}

export function exportStudentsWithCredentials(restrictedColumns: any[], filters: any[], inProgress: number): any {
    return async (dispatch: any) => {
        return await axios.get(REACT_APP_ADMIN_EXPORT_DATA + ``,
            {
                responseType: 'blob',
                params: {
                    restrictedColumns: restrictedColumns?.length ? JSON.stringify(restrictedColumns) : undefined,
                    filters: filters?.length ? JSON.stringify(filters) : undefined,
                    inProgress: inProgress,
                    credentials: true
                }
            }
        )
            .then((r) => {
                fileDownload(
                    r.data,
                    `экспорт_${getLocalPlainDateTime(new Date())}.xlsx`,
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                );
                // dispatch(downloadExcelFile(r.data.data.path))
            })
            .catch(res => {
                //check if tokens expired already
                if (res.status !== 200) {
                    dispatch(tokenCheck())
                }
            })
    }
}
