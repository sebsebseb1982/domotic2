let Client = require('node-rest-client').Client;
let parser = require('xml2json');

const avrHTTPAddress = 'http://192.168.1.152';

export class AVR {
    client;

    AVR() {
        this.client = new Client();
    }

    sendCommand(command:string) {

        console.log('Send command \'' + command + '\' to AVR');

        // set content-type header and data as json in args parameter
        let args = {
            data: 'cmd0=' + encodeURI(command) + '&cmd1=aspMainZone_WebUpdateStatus%2F'
        };

        this.client.post(
            avrHTTPAddress + '/MainZone/index.put.asp',
            args,
            (data, response) => {
                // parsed response body as js object
                //console.log(data);
                // raw response
            }
        );
    }

    on() {
        this.sendCommand('PutZone_OnOff/ON');
    }

    off() {
        this.sendCommand('PutZone_OnOff/OFF');
    }

    tuner() {
        this.sendCommand('PutZone_InputFunction/TUNER');
    }

    setVolume(volumedB) {
            this.getStatus((status) => {
            let initialVolumedB = status.item.MasterVolume.value;
            let deltaVolumedB = volumedB - initialVolumedB

            let ellapsedTime = 0;

            for (let volumeChanges = 0; volumeChanges < Math.abs(deltaVolumedB/0.5); volumeChanges++) {
                //setTimeout(() => {
                if(deltaVolumedB < 0) {
                this.sendCommand('PutMasterVolumeBtn/<');
            } else {
            this.sendCommand('PutMasterVolumeBtn/>');
            }
            //}, volumeChanges * 100);
            }
        });
    }

    getStatus(callback) {
        this.client.get(
            avrHTTPAddress + '/goform/formMainZone_MainZoneXml.xml',
            (data, response) => {
                // parsed response body as js object
                //console.log(data);
                // raw response
                callback(JSON.parse(parser.toJson(data)));
            }
        );
    }
}

