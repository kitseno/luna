import Http from '../utils/Http'


export function sendMessage(message) {

    return dispatch => (
        new Promise((resolve, reject) => {

            Http.post('/api/sendMessage', {message: message})
                .then(res => {
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
                        data.error = err.response.data.message;
                    }
                    return reject(data);
                })
        })
    )

}
