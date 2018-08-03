import * as ActionTypes from '../action-types'
import Http from '../../utils/Http'

import User from '../../models/User'

//

const user = new User({});

const initialState = {
    isAuthenticated : false,
    isAdmin: false,
    user,
    
};

const Auth = (state= initialState,{type,payload = null}) => {
    switch (type) {
        case ActionTypes.AUTH_LOGIN:
            return authLogin(state,payload);
        case ActionTypes.AUTH_CHECK:
            return checkAuth(state);
        case ActionTypes.AUTH_LOGOUT:
            return logout(state);
        case ActionTypes.USER_UPDATE:
            return updateUser(state,payload);
        default:
            return state;
    }
};

const authLogin = (state, payload) => {
    const access_token = payload.token;
    const user = new User(payload.user).toJson();
    
    if (!!payload.user.is_admin) {
        localStorage.setItem('is_admin', true);
    } else {
        localStorage.setItem('is_admin', false);
    }
    localStorage.setItem('access_token', access_token);
    Http.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    state = Object.assign({}, state, {
        isAuthenticated: true,
        isAdmin: localStorage.getItem('is_admin') === 'true',
        user
    });
    return state;

};

const checkAuth = (state) => {
    state = Object.assign({}, state, {
        isAuthenticated : !!localStorage.getItem('access_token'),
        isAdmin : localStorage.getItem('is_admin') === 'true',
    });
    if (state.isAuthenticated) {
        Http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    }
    return state;
};

const logout = (state) => {
    localStorage.removeItem('access_token');
    localStorage.setItem('is_admin',false);
    state = Object.assign({}, state, {
        isAuthenticated: false,
        isAdmin : false,
        user
    });
    return state;
};

const updateUser = (state, payload) => {

    const user = new User(payload.user).toJson();

        state = Object.assign({}, state, {
            isAuthenticated: true,
            isAdmin: localStorage.getItem('is_admin') === 'true',
            user
        });

       return state;
};

export default Auth;
