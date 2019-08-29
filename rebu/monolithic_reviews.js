const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'micro',
    password: 'service',
    database: 'monolithic'
};

exports.onRequest = function (res, method, pathname, params, cb) {
    switch (method) {
        case "POST":
            return register(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        case "GET":
            return inquiry(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        case "DELETE":
            return unregister(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        default:
            return process.nextTick(cb, res, null);
    }
}

function register(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };
    if (params.usage == 0) { // 주문 등록
        if (params.deliver == null || params.text == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("insert into reviews(deliver, text) values('" + params.deliver + "', '" + params.text + "')", (error, result, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            });

            connection.end();
        }
    } 
}

function inquiry(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.usage == 0) {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("select * from reviews where deliver = '" + params.deliver + "'", (error, results, fields) => {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.results = results;
            }
            cb(response);
        });

        connection.end();
    } else if (params.usage == 9){
        var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select count(*) as cnt from reviews", (error, results, fields) => {
                if (error || results.length == 0){
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results[0];
                }
                cb(response);
            });
            connection.end();
    }
}

function unregister(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.id == null) {
        response.errorcode = 1;
        response.errormessage = "Invaild Parameters";
        cb.response();
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("delete from reviews where reviewid = ?", [params.id], (error, results, fields) => {
            if (error) {
                response.errorcode = 1;
                response.errormessage = error;
            }
            cb(response);
        });
        connection.end();
    }
}
