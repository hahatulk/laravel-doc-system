import {combineReducers} from "redux"
import authReducer from "../reducers/authReducer"
import LkReducer from "../reducers/LkReducer";
import {loadingBarReducer} from "react-redux-loading-bar";
import studentsReducer from "../reducers/adminReducer";

const allReducers = combineReducers({
    Auth: authReducer,
    User: LkReducer,
    loadingBar: loadingBarReducer,
    Admin: studentsReducer,
})
export default allReducers