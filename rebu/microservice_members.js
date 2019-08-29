
'use strict';

// 비즈?��?��로직 ?��?�� 참조
const business = require('./monolithic_members.js');

// Server?��?��?�� 참조
class members extends require('./server.js') {
    constructor() {
        super("members"                                                     // �?�? ?��?��?�� ?��?��?�� ?���?
            , process.argv[2] ? Number(process.argv[2]) : 9020
            , ["POST/members", "GET/members", "DELETE/members"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {            // Distributor ?���?
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

new members();                                                              // ?��?��?��?�� ?��?��
