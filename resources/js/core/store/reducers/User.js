import User from '../../models/User'
import * as ActionTypes from '../action-types'

const initialState = Object.assign({}, new User({}))

const UserReducer = (state = initialState, {type, payload = null}) => {
    switch(type){
        case ActionTypes.USER_UPDATE:
            return updateUser(state, payload);
        case ActionTypes.AUTH_LOGOUT:
            return logout(state);
        default:
            return state;
    }
};

const updateUser = (state, payload) => {
    return {
        ...state, ...payload.user
    }
};


const logout = (state) => {
    state = initialState;
    return state;
};

// const authLogin = (state,payload) => {
//     const access_token = payload.token;
//     const user = payload.user;
    
//     if (!!payload.user.is_admin) {
//         localStorage.setItem('is_admin', true);
//     } else {
//         localStorage.setItem('is_admin', false);
//     }
//     localStorage.setItem('access_token', access_token);
//     Http.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
//     state = Object.assign({}, state, {
//         isAuthenticated: true,
//         isAdmin: localStorage.getItem('is_admin') === 'true',
//         user
//     });
//     return state;

// };

// const checkAuth = (state) => {
//     state =Object.assign({},state,{
//         isAuthenticated : !!localStorage.getItem('access_token'),
//         isAdmin : localStorage.getItem('is_admin') === 'true',
//     });
//     if (state.isAuthenticated) {
//         Http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
//     }
//     return state;
// };

// const logout = (state) => {
//     localStorage.removeItem('access_token');
//     localStorage.setItem('is_admin',false);
//     state = Object.assign({},state,{
//         isAuthenticated: false,
//         isAdmin : false,
//         user
//     });
//     return state;
// };

export default UserReducer;
