import Http from '../utils/Http'
import * as action from '../store/actions'

import ability from '../utils/casl/ability'

export function login(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('api/auth/login', credentials)
                .then(res => {
                    dispatch(action.authLogin(res.data));
                    dispatch(action.updateUser(res.data));
                    return resolve(res.data);
                })
                .catch(({response}) => {

                    const statusCode = response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };

                    if (statusCode === 401) {
                        // status 401 means unauthorized
                        data.error = response.data;
                    } else if (statusCode === 422) {
                        // status 422 means unprocessable entity
                        data.error = response.data.errors;
                    }
                    return reject(data);
                })
        })
    )
}

export function socialLogin(data) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post(`../api/auth/login/${data.social}/callback${data.params}`)
                .then(res => {
                    dispatch(action.authLogin(res.data));
                    dispatch(action.updateUser(res.data));
                    return resolve();
                })
                .catch(err => {
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };
                    if (statusCode === 401 || statusCode === 422) {
                        // status 401 means unauthorized
                        // status 422 means unprocessable entity
                        data.error = err.response.data.message;
                    }
                    return reject(data);
                })
        })
    )
}

export function resetPassword(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('../api/password/create', credentials)
                .then(res => {
                    return resolve(res.data);
                })
                .catch(err => {
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };
                    if (statusCode === 401 || statusCode === 422) {
                        // status 401 means unauthorized
                        // status 422 means unprocessable entity
                        data.error = err.response.data.message;
                    }
                    return reject(data);
                })
        })
    )
}

export function updatePassword(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('/api/password/reset', credentials)
                .then(res => {
                    const statusCode = res.data.status;
                    if (statusCode == 202) {
                        const data = {
                            error: res.data.message,
                            statusCode,
                        }
                        return reject(data)
                    }
                    return resolve(res);
                })
                .catch(err => {

                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };
                    if (statusCode === 401 || statusCode === 422) {
                        // status 401 means unauthorized
                        // status 422 means unprocessable entity
                        data.error = err.response.data;
                    }
                    return reject(data);
                })
        })
    )
}

// Resend Email Verification
export function resendEmailVerification(email) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('/api/resend-email-verification', {email: email})
                .then(res => {
                    return resolve(res.data);
                })
                .catch(err => {
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };
                    if (statusCode === 401 || statusCode === 422) {
                        // status 401 means unauthorized
                        // status 422 means unprocessable entity
                        data.error = err.response.data.message;
                    }
                    return reject(data);
                })
        })
    )
}


// Register
export function register(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('api/auth/register', credentials)
                .then(res => {

                    if (res.data.token) {
                        dispatch(action.authLogin(res.data));
                        dispatch(action.updateUser(res.data));
                    }

                    return resolve(res.data);
                })
                .catch(({response}) => {
                    
                    console.log(response.data);

                    const statusCode = response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };

                    if (statusCode === 422 || statusCode === 400) {
                        data.error = response.data;
                    }
                    return reject(data);
                })
        })
    )
}

/**
 * Check if user is authenticated
 *
 * @returns {function(*)}
 */
export function checkAuth() {

    return dispatch => (
        new Promise((resolve, reject) => {
            
            dispatch(action.checkingAuth(true));

            return Http.get('/api/auth/check')
              .then((res) => {

                // Check auth reducer
                dispatch(action.authCheck(res.data));

                // Update ability CASL
                ability.update(res.data.scopes);

                dispatch(action.checkingAuth(false));

                return resolve();
              })
              .catch(err => {
                console.log(err)
              })
      })
    )
}

/**
 * logout user
 *
 * @returns {function(*)}
 */
export function logout() {
  return dispatch => {
    return Http.delete('/api/auth/logout')
      .then(() => {
        dispatch(action.authLogout())
      })
      .catch(err => {
        console.log(err)
      })
  }
}
