import {Logger} from "../common/logger/logger";
import {DoorBell} from "./event-handlers/door-bell";
import {TemperatureSensor} from "./event-handlers/temperature-sensor";

let rfxcom = require('rfxcom');

export class RFXcom {

    private static instance;

    public static getInstance = () => {
        if(!RFXcom.instance) {
            RFXcom.instance = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true});
            RFXcom.instance.initialise(() => {
                new Logger('RFXcom').debug('RFXcom initialisé')
            });

            new DoorBell(RFXcom.instance).listen();
            new TemperatureSensor(RFXcom.instance).listen();
        }

      return RFXcom.instance;
    };

    static initialize() {
        this.getInstance();
    }
}