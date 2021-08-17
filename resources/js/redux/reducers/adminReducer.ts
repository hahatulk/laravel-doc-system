let initial_state = {
    groupsList: {
        loading: false,
        list: [],
        count: 0,
    },
    prikazList: {
        loading: false,
        list: [],
        count: 0,
    },
    ordersList: {
        loading: false,
        list: [],
        count: 0,
    },
    archivedOrdersList: {
        loading: false,
        list: [],
        count: 0,
    },
    studentsList: {
        loading: false,
        list: [],
        count: 0,
    },
    archivedStudentsList: {
        loading: false,
        list: [],
        count: 0,
    },
    moderatorsList: {
        loading: false,
        list: [],
        count: 0,
    }
}

export default function admin(state = initial_state, action: any) {
    let p = action.payload
    switch (action.type) {
        case 'STUDENTS_LIST_GET':
            let studentsList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []

            return {
                ...state,
                studentsList: {
                    loading: false,
                    list: studentsList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'CLEAR_STUDENTS_LIST':
            return {
                ...state,
                studentsList: {
                    loading: state.studentsList.loading,
                    list: [],
                    count: state.studentsList.count
                }
            }
        case 'STUDENTS_LIST_LOADING_STATE':
            return {
                ...state,
                studentsList: {
                    loading: p,
                    list: state.studentsList.list,
                    count: state.studentsList.count
                }
            }

        case 'ARCHIVED_STUDENTS_LIST_GET':
            let archivedStudentsList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []

            return {
                ...state,
                archivedStudentsList: {
                    loading: false,
                    list: archivedStudentsList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'CLEAR_ARCHIVED_STUDENTS_LIST':
            return {
                ...state,
                archivedStudentsList: {
                    loading: state.archivedStudentsList.loading,
                    list: [],
                    count: state.archivedStudentsList.count
                }
            }
        case 'ARCHIVED_STUDENTS_LIST_LOADING_STATE':
            return {
                ...state,
                archivedStudentsList: {
                    loading: p,
                    list: state.archivedStudentsList.list,
                    count: state.archivedStudentsList.count
                }
            }

        case 'ORDERS_LIST_GET':
            let ordersList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []
            return {
                ...state,
                ordersList: {
                    loading: false,
                    list: ordersList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'CLEAR_ORDERS_LIST':
            return {
                ...state,
                ordersList: {
                    loading: state.ordersList.loading,
                    list: [],
                    count: state.ordersList.count
                }
            }
        case 'ORDERS_LIST_LOADING_STATE':
            return {
                ...state,
                ordersList: {
                    loading: p,
                    list: state.ordersList.list,
                    count: state.ordersList.count
                }
            }

        case 'ARCHIVED_ORDERS_LIST_GET':
            let archivedOrdersList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []
            return {
                ...state,
                archivedOrdersList: {
                    loading: false,
                    list: archivedOrdersList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'ARCHIVED_CLEAR_ORDERS_LIST':
            return {
                ...state,
                archivedOrdersList: {
                    loading: state.archivedOrdersList.loading,
                    list: [],
                    count: state.archivedOrdersList.count
                }
            }
        case 'ARCHIVED_ORDERS_LIST_LOADING_STATE':
            return {
                ...state,
                archivedOrdersList: {
                    loading: p,
                    list: state.archivedOrdersList.list,
                    count: state.archivedOrdersList.count
                }
            }

        case 'GROUPS_LIST_GET':
            let groupsList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []

            return {
                ...state,
                groupsList: {
                    loading: false,
                    list: groupsList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'CLEAR_GROUPS_LIST':
            return {
                ...state,
                groupsList: {
                    loading: state.groupsList.loading,
                    list: [],
                    count: state.groupsList.count
                }
            }
        case 'GROUPS_LIST_LOADING_STATE':
            return {
                ...state,
                groupsList: {
                    loading: p,
                    list: state.groupsList.list,
                    count: state.groupsList.count
                }
            }

        case 'PRIKAZ_LIST_GET':
            let prikazList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []

            return {
                ...state,
                prikazList: {
                    loading: false,
                    list: prikazList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'CLEAR_PRIKAZ_LIST':
            return {
                ...state,
                prikazList: {
                    loading: state.prikazList.loading,
                    list: [],
                    count: state.prikazList.count
                }
            }
        case 'PRIKAZ_LIST_LOADING_STATE':
            return {
                ...state,
                prikazList: {
                    loading: p,
                    list: state.prikazList.list,
                    count: state.prikazList.count
                }
            }

        case 'MODERATORS_LIST_GET':
            let moderatorsList: any[] = p.data.data.data?.length
                ? p.data.data.data
                : []

            return {
                ...state,
                moderatorsList: {
                    loading: false,
                    list: moderatorsList,
                    count: p.data.data.total ? p.data.data.total : 0
                }
            }
        case 'CLEAR_MODERATORS_LIST':
            return {
                ...state,
                moderatorsList: {
                    loading: state.moderatorsList.loading,
                    list: [],
                    count: state.moderatorsList.count
                }
            }
        case 'MODERATORS_LIST_LOADING_STATE':
            return {
                ...state,
                moderatorsList: {
                    loading: p,
                    list: state.moderatorsList.list,
                    count: state.moderatorsList.count
                }
            }
        default:
            return state
    }
}