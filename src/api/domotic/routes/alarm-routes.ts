import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {Alarm} from "../../../security/alarm/alarm";
import {DenonAVR} from "../../../avr/denonAVR";
import {Configuration} from "../../../configuration/configuration";
import {RelayDB} from "../../../relay/relay-db";
import {ClientPowerOutlet} from "../client-power-outlet";
import {IRoutable} from "../../common/routes";

export class AlarmRoutes implements IRoutable {

    alarm: Alarm;
    avr: DenonAVR;
    configuration: Configuration;
    clientPowerOutlet: ClientPowerOutlet;

    gateRelayCode: string = 'k3';
    floorLampPowerOutletCode: string = 'A1';

    constructor() {
        this.alarm = new Alarm();
        this.configuration = new Configuration();
        this.avr = new DenonAVR(this.configuration.avr);
        this.clientPowerOutlet = new ClientPowerOutlet();
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
                            30 * 1000
                        );
                    });
                }
            );
    }

    private openGate() {
        RelayDB.instance.getByCode(this.gateRelayCode).then((relay) => {
            relay.impulse(100);
        });
    }

    private floorLampOff() {
        this.clientPowerOutlet.off(this.floorLampPowerOutletCode);
    }
}