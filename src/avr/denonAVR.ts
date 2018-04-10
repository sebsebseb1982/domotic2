let Client = require('node-rest-client').Client;
let parser = require('xml2json');

interface MasterVolume {
    value: number;
}

interface Item {
    MasterVolume: MasterVolume;
}

export interface AVRStatus {
    item: Item;
}

export class DenonAVR {
    client;

    constructor(private avrIPAddress: string) {
        this.client = new Client();
    }

    sendCommand(command: string) {
        console.log(`Send command ${command} to AVR`);

        this.client.post(
            `http://${this.avrIPAddress}/MainZone/index.put.asp`,
            {
                data: `cmd0=${encodeURI(command)}&cmd1=aspMainZone_WebUpdateStatus%2F`
            },
            (data, response) => {
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

    setVolume(volumedB: number) {
        this.getStatus().then((status: AVRStatus) => {

            let initialVolumedB = status.item.MasterVolume.value;
            let deltaVolumedB = volumedB - initialVolumedB

            let ellapsedTime = 0;

            for (let volumeChanges = 0; volumeChanges < Math.abs(deltaVolumedB / 0.5); volumeChanges++) {
                //setTimeout(() => {
                if (deltaVolumedB < 0) {
                    this.sendCommand('PutMasterVolumeBtn/<');
                } else {
                    this.sendCommand('PutMasterVolumeBtn/>');
                }
                //}, volumeChanges * 100);
            }

        });
    }

    getStatus(): Promise<AVRStatus> {
        return new Promise((resolve, reject) => {
            this.client.get(
                `http://${this.avrIPAddress}/goform/formMainZone_MainZoneXml.xml`,
                (data, response) => {
                    resolve(JSON.parse(parser.toJson(data)));
                }
            );
        });
    }
}

