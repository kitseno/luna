import Http from '../utils/Http'
import * as action from '../store/actions'


export function changePermission(data) {

    return dispatch => (
        new Promise((resolve, reject) => {

            Http.put('/api/permissions/'+data.id, data)
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
