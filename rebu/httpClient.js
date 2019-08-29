var http = require('http');

var option = {
    host: "127.0.0.1",
    port: 8000,
    path: "/"
};

var req = http.request(option, (res) => {
    var data = "";
    res.on('data', (chunk) =>{
        data += chunk;
    });

    res.on('end', () => {
        console.log(data);
    });
});

req.end();