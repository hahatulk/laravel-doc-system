let initial_state = {
    id: '',
    surname: '',
    name: '',
    patronymic: '',
    gender: '',
    birthday: '',
    group: '',
    formaObuch: '',
    prikaz: '',
    groupName: '',
    groupType: '',
    kurs: '',
    startDate: '',
    finishDate: '',
    orders: {
        orders: [],
        ordersCount: 0
    },
    role: ''
}

export default function authReducer(state = initial_state, action: any) {
    let p = action.payload

    switch (action.type) {
        case 'USER_INFO_GET':
            let student_data = p?.r.data.data
            console.log(student_data.surname)
            if (student_data.role === 'student') {
                return {
                    ...state,
                    role: student_data.role,
                    id: student_data.id,
                    surname: student_data.surname,
                    name: student_data.name,
                    patronymic: student_data.patronymic,
                    gender: student_data.gender,
                    birthday: student_data.birthday,
                    group: student_data.group,
                    formaObuch: student_data.formaObuch === 0 ? 'бюджетная' : 'платная',
                    prikaz: student_data.prikaz,
                    groupName: student_data.groupName,
                    groupType: student_data.groupType,
                    kurs: student_data.kurs,
                    startDate: student_data.startDate,
                    finishDate: student_data.finishDate,
                }
            } else {
                let admin_data = p?.r.data.data

                return {
                    ...state,
                    role: admin_data.role,
                    id: admin_data.id,
                    name: admin_data.fio,
                    gender: admin_data.gender,
                }
            }
        case 'ORDERS_GET':
            let order_get_data = p?.r.data.data
            return {
                ...state,
                orders: {
                    orders: order_get_data,
                    ordersCount: order_get_data?.length,
                }
            }
        case 'CLEAR_USER_INFO':
            return {
                ...initial_state
            }
        default:
            return state
    }
}