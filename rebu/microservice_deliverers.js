
'use strict';

// 비즈?��?��로직 ?��?�� 참조
const business = require('./monolithic_deliverers.js');

// Server?��?��?�� 참조
class deliverers extends require('./server.js') {
    constructor() {
        super("deliverers"                                                   // �?�? ?��?��?�� ?��?��?�� ?���?
            , process.argv[2] ? Number(process.argv[2]) : 9070
            , ["POST/deliverers", "GET/deliverers", "DELETE/deliverers"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {        // Distributor ?���?
            console.log("Distributor Notification", data);
        });
    }

    // ?��?��?��?��?�� ?���??�� ?���? 비즈?��?��로직 ?���?
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

new deliverers();                                                            // ?��?��?��?�� ?��?��
