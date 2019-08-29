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
        if (params.send == null || params.receive == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("insert into orders(send, receive, status, image, fromx, fromy, tox, toy, info) values('" + params.send + "', '" + params.receive + "', 0, '" + params.image + "', '" + params.fromx + "', '" + params.fromy + "', '" + params.tox + "', '" + params.toy + "', '" + params.info + "')", (error, result, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            });

            connection.end();
        }
    } else if (params.usage == 1) { // 배달자 연결 및 status 최신화
        if (params.send == null || params.deliverer == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("update orders set deliver = '" + params.deliverer + "' where send = '" + params.send + "' and status = 0", (error, result, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            });

            connection.end();
        }
    } else if (params.usage == 2) {
        if (params.oldStatus == null || params.deliverer == null || params.newStatus == null) { // 상태 최신화
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("update orders set status = " + params.newStatus + " where deliver = '" + params.deliverer + "' and status = " + params.oldStatus, (error, result, fields) => {
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
        connection.query("select * from orders where send = '" + params.send + "' OR receive = '" + params.send + "';", (error, results, fields) => {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.results = results;
            }
            cb(response);
        });

        connection.end();
    } else if (params.usage == 1) {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("select * from orders where deliver = '" + params.deliver + "' AND (status = 0 OR status = 1)", (error, results, fields) => {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.results = results;
            }
            cb(response);
        });

        connection.end();
    } else if (params.usage == 8){
        var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select * from orders", (error, results, fields) => {
                if (error || results.length == 0){
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results;
                }
                cb(response);
            });
            connection.end();
    } else if (params.usage == 9){
        var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select count(*) as cnt from orders", (error, results, fields) => {
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
        connection.query("delete from orders where id = ?", [params.id], (error, results, fields) => {
            if (error) {
                response.errorcode = 1;
                response.errormessage = error;
            }
            cb(response);
        });
        connection.end();
    }
}
