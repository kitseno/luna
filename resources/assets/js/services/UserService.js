import Http from '../utils/Http'
import * as action from '../store/actions'


export function getUsers() {

    return dispatch => (
        new Promise((resolve, reject) => {
            Http.get('/api/users')
                .then(res => {
                    // console.log(res.data);
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

export function getUserById(id) {

    return dispatch => (
        new Promise((resolve, reject) => {
            Http.get('/api/users/'+id)
                .then(res => {
                    console.log(res.data);
                    // dispatch(action.authLogin(res.data));
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

export function changeName(user) {

    return dispatch => (
        new Promise((resolve, reject) => {
            Http.put(`/api/users/${user.id}`, {name: user.name, method: 'changeName'})
                .then(res => {
                    dispatch(action.updateUser(res.data));
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
                        data.error = err.response.data;
                    }
                    return reject(data);
                })
        })
    )
}
