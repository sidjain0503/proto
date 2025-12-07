let request = require('request');
request = request.defaults({
    headers: {
        'content-type': 'application/json',
    },
});
const get = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
        request({ method: 'GET', url: url, ...options }, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode > 299 || response.statusCode < 200) {
                if (response.headers['content-type'] == 'application/json') {
                    response.error = JSON.parse(response.body);
                } else {
                    response.error = body;
                }
                return reject({
                    statusCode: response.statusCode,
                    error: response.error,
                });
            }
            if (body && response.headers['content-type'].includes('application/json')) {
                response.data = JSON.parse(body);
            } else {
                response.data = body;
            }
            resolve(response);
        });
    });
};
const post = async (url, body, options = {}, formData) => {
    return new Promise((resolve, reject) => {
        const requestObj = {
            method: 'POST',
            url: url,
            ...options,
        };

        if (formData) {
            requestObj.formData = formData;
        } else if (body) {
            requestObj.body = typeof body == 'object' ? JSON.stringify(body) : body;
        }

        request(requestObj, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode > 299 || response.statusCode < 200) {
                if (response.headers['content-type'] == 'application/json') {
                    response.error = JSON.parse(response.body);
                } else {
                    response.error = body;
                }
                return reject({
                    statusCode: response.statusCode,
                    error: response.error,
                });
            }
            if (body && response.headers['content-type'].includes('application/json')) {
                response.data = JSON.parse(body);
            } else {
                response.data = body;
            }
            resolve(response);
        });
    });
};
const put = async (url, body, options = {}) => {
    return new Promise((resolve, reject) => {
        request({ method: 'PUT', url: url, body: JSON.stringify(body), ...options }, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode > 299 || response.statusCode < 200) {
                if (response.headers['content-type'] == 'application/json') {
                    response.error = JSON.parse(response.body);
                } else {
                    response.error = body;
                }
                return reject({
                    statusCode: response.statusCode,
                    error: response.error,
                });
            }
            if (body && response.headers['content-type'].includes('application/json')) {
                response.data = JSON.parse(body);
            } else {
                response.data = body;
            }
            resolve(response);
        });
    });
};
const remove = async (url, options = {}, body) => {
    return new Promise((resolve, reject) => {
        request({ method: 'DELETE', body: JSON.stringify(body), url: url, ...options }, function (error, response, body) {
            if (error) {
                return reject(error);
            }
            if (response.statusCode > 299 || response.statusCode < 200) {
                if (response.headers['content-type'] == 'application/json') {
                    response.error = JSON.parse(response.body);
                } else {
                    response.error = body;
                }
                return reject({
                    statusCode: response.statusCode,
                    error: response.error,
                });
            }
            if (body && response.headers['content-type'].includes('application/json')) {
                response.data = JSON.parse(body);
            } else {
                response.data = body;
            }
            resolve(response);
        });
    });
};
module.exports = {
    get,
    post,
    put,
    remove,
};
