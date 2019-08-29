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
    

    if (params.usage == 0) { // 가입
        if (params.username == null || params.password == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters by usage 0";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("insert into deliverers(username, password, status, x, y) value('" + params.username + "', password('" + params.password + "'), 0, '0', '0')", (error, result, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            });

            connection.end();
        }
    } else if (params.usage == 1) { // 좌표 최신화
        if (params.username == null || params.x == null || params.y == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters " + params.status;
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("update deliverers set x = '" + params.x + "', y = '" + params.y + "' where username = '" + params.username + "'", (error, result, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            });

            connection.end();
        }
    } else if (params.usage == 2) { // 상태 최신화
        if (params.username == null || params.status == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters " + params.status;
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("update deliverers set status = " + params.status + " where username = '" + params.username + "'", (error, result, fields) => {
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

    if (params.usage == 0) { // 로그인
        if (params.username == null || params.password == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select id, status from deliverers where username = '" + params.username + "' and password = password('" + params.password + "');", (error, results, fields) => {
                if (error || results.length == 0){
                    response.errorcode = 1;
                    response.errormessage = error ? error : "invalid password";
                } else {
                    response.userid = results[0].id;
                    response.status = results[0].status;
                }
                cb(response);
            });
            connection.end();
        }
    } else if (params.usage == 1) { // status 1인 딜리버러
        if (params.x == null || params.y == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select * from deliverers where status = 1;", (error, results, fields) => {
                if (error || results.length == 0){
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results;
                }
                cb(response);
            });
            connection.end();
        }
    } else if (params.usage == 2) { // status 불러오기
        if (params.username == null) {
            response.errorcode = 1;
            response.errormessage = "Invalid Parameters";
            cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select status from deliverers where username = '" + params.username + "';", (error, results, fields) => {
                if (error || results.length == 0){
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results[0].status;
                }
                cb(response);
            });
            connection.end();
        }
    } else if (params.usage == 8){
        var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("select * from deliverers", (error, results, fields) => {
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
            connection.query("select count(*) as cnt from deliverers", (error, results, fields) => {
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
        connection.query("delete from deliverers where id = ?", [params.id], (error, results, fields) => {
            if (error) {
                response.errorcode = 1;
                response.errormessage = error;
            }
            cb(response);
        });
        connection.end();
    }
}
