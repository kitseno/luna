import Http from '../utils/Http'
import * as action from '../store/actions'

import ability from '../utils/casl/ability'


export function getRoles(page) {

    return dispatch => (
        new Promise((resolve, reject) => {

            Http.get('/api/roles'+(page?'?page='+page:''))
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

export function create(data) {

    return dispatch => (
        new Promise((resolve, reject) => {

            Http.post('/api/roles', data)
                .then(res => {
                    console.log(res);
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
