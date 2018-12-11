import Http from '../utils/Http'
import * as action from '../store/actions'


export function getMyInfo() {

    return dispatch => (
        new Promise((resolve, reject) => {

            Http.get('/api/me')
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

export function updateAvatar(data) {

    return dispatch => (
        new Promise((resolve, reject) => {

            Http.post('/api/me/updateAvatar', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then(res => {
                    // console.log(res.data);
                    dispatch(action.updateUser(res.data));
                    return resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };
                    if (
                        statusCode === 401 ||
                        statusCode === 402 ||
                        statusCode === 403 ||
                        statusCode === 422
                    ) {
                        // status 401 means unauthorized
                        // status 422 means unprocessable entity
                        // status 403 Forbidden
                        data.error = err.response.data;
                    }

                    return reject(data);
                })
        })
    )

}