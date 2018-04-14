import {Parser} from "xml2js";

let Client = require('node-rest-client').Client;

interface IValue {
    value: string;
}

interface IItem {
    MasterVolume: IValue;
    Power: IValue;
}

export interface IAVRStatus {
    item: IItem;
}

export class DenonAVR {
    client;
    parser: Parser;

    constructor(private avrIPAddress: string) {
        this.client = new Client();
        this.parser = new Parser();
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
        this.getStatus().then((status: IAVRStatus) => {

            let initialVolumedB = parseInt(status.item.MasterVolume.value);
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

    getStatus(): Promise<IAVRStatus> {
        return new Promise((resolve, reject) => {
            this.client.get(
                `http://${this.avrIPAddress}/goform/formMainZone_MainZoneXml.xml`,
                (statusXML, response) => {
                    console.log('AVR status XML', statusXML);
                    this.parser.parseString(statusXML, (statusJSON) => {
                        console.log('AVR status JSON', statusJSON);
                        resolve(statusJSON);
                    });
                }
            );
        });
    }
}

