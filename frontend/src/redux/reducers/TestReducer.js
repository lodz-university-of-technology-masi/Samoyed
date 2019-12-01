import { combineReducers } from 'redux';

const INITIAL_STATE = {
    isLogged : false,
    userId: '',
    userType: ''
}

const testReducer = ( state = INITIAL_STATE, action ) => {
    switch (action.type){
        default:
            return state

    }
}

export default combineReducers({
    testState: testReducer,
  });