import * as ActionTypes from '../action-types'

export function authLogin(payload){
    return {
        type: ActionTypes.AUTH_LOGIN,
        payload
    }
}

export function authLogout(){
    return {
        type: ActionTypes.AUTH_LOGOUT
    }
}

export function authCheck(payload){
    return {
        type: ActionTypes.AUTH_CHECK,
        payload
    }
}

export function checkingAuth(payload){
    return {
        type: ActionTypes.AUTH_CHECKING,
        payload
    }
}

//

export function updateUser(payload){
    return {
        type: ActionTypes.USER_UPDATE,
        payload
    }
}