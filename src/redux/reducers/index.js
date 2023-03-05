import { combineReducers } from "redux";
import TokenReducers from './tokenReducer'
import UserReducer from "./userReducer";

const Reducers = combineReducers({
    allUsers: UserReducer,
    token: TokenReducers
})

export default Reducers;