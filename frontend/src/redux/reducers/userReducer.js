import { USER_LOGIN } from '../actions/userLogIn';
import { USER_LOGOUT } from '../actions/userLogOut';
import { USER_UPDATE } from '../actions/userUpdate';
import jwt from 'jsonwebtoken'

const NULL_STATE = {
    isLogged : false,
    tokens: {},
    data: {}
}
let INITIAL_STATE = {...NULL_STATE}
// Load data from localStorage (or not)
if (localStorage.getItem("user") !== null) {
    INITIAL_STATE = JSON.parse(localStorage.getItem("user"))
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN:
            // Decode token
            let data = jwt.decode(action.tokens.idToken)
            // Update state
            let updatedState = {
                ...state,
                isLogged: true,
                tokens: action.tokens,
                data: data
            }
            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(updatedState))
            // Return state
            return updatedState
        case USER_LOGOUT:
            // Destroy data in localStorage
            localStorage.removeItem("user")
            return {...NULL_STATE}
        case USER_UPDATE:
            const { given_name, family_name, gender, email } = action.data
            let updatedUserState = {
                ...state,
                data: {
                    ...state.data,
                    given_name,
                    family_name,
                    gender,
                    email
                }
            }
            return updatedUserState    
        default:
            return state
    }
}


export default userReducer
