import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {Alarm} from "../../../security/alarm/alarm";
import {DenonAVR} from "../../../avr/denonAVR";
import {Configuration} from "../../../configuration/configuration";
import {RelayDB} from "../../../relay/relay-db";
import {PowerOutletDB} from "../../../power-outlet/power-outlet-db";

export class AlarmRoutes implements IRoutable {

    alarm: Alarm;
    avr: DenonAVR;
    configuration: Configuration;
    relayDB: RelayDB;
    powerOutletDB: PowerOutletDB;

    gateRelayCode: string = 'k3';
    floorLampPowerOutletCode: string = 'A1';

    constructor() {
        this.alarm = new Alarm();
        this.configuration = new Configuration();
        this.avr = new DenonAVR(this.configuration.avr);
        this.relayDB = new RelayDB();
        this.powerOutletDB = new PowerOutletDB();
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/alarm',
                (req: Request, res: Response) => {
                    this.alarm.arm().then(() => {
                        this.avr.off();
                        this.floorLampOff();
                        setTimeout(
                            () => {
                                this.openGate();
                            },
                            10 * 1000
                        );
                    });
                }
            );
    }

    private openGate() {
        this.relayDB.getByCode(this.gateRelayCode).then((relay) => {
            relay.impulse(100);
        });
    }

    private floorLampOff() {
        this.powerOutletDB.getByCode(this.floorLampPowerOutletCode).then((floorLamp) => {
            floorLamp.off();
        });
    }
}