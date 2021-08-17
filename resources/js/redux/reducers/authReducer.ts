interface Iinitial_state {

}

let initial_state: Iinitial_state = {
    isAuthenticated: '',
}

export default function authReducer(state = initial_state, action: any) {
    let p = action.payload
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: p?.r?.status === 200
            }
        case 'TOKEN_CHECK':
            return {
                ...state,
                isAuthenticated: p?.r?.status === 200
            }
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false
            }
        default:
            return state
    }
}