import {Logger} from "../common/logger/logger";
import {GPIO} from "../gpio/gpio";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {Configuration} from "../configuration/configuration";
import {MailService} from "../notifications/services/mailService";
import {PushoverService} from "../notifications/services/pushover-service";
import {TocToc} from "../toctoc/toctoc";
import {HueLamp} from "../hue/hue-lamp";
import {ClientPowerOutlet} from "../api/domotic/client-power-outlet";
import * as _ from "lodash";


let exec = require('child_process').execSync;

export class Doorbell {

    logger: Logger = new Logger('Sonnette');
    gpio: GPIO;
    googleHome: GoogleHomeService;
    configuration: Configuration;
    mailService: MailService;
    pushover: PushoverService;
    toctoc: TocToc;
    lampSalon: HueLamp;
    clientPowerOutlet: ClientPowerOutlet;

    constructor() {
        this.gpio = new GPIO(3, 'in');
        this.googleHome = new GoogleHomeService();
        this.configuration = new Configuration();
        this.mailService = new MailService('Sonnette');
        this.pushover = new PushoverService();
        this.toctoc = new TocToc();
        this.lampSalon = new HueLamp('salon');
        this.clientPowerOutlet = new ClientPowerOutlet();

        let onDoorBellRing = _.throttle(() => {
            this.googleHome.play(`http://${this.configuration.doorBell.randomTune.publicHostname}:${this.configuration.doorBell.randomTune.port}${this.configuration.doorBell.randomTune.root}/random-tune`);
            let message = `Quelqu'un vient de sonner`;
            this.mailService.send({
                title: message,
                description: message
            });
            this.pushover.send({
                title: message,
                description: message,
                priority: 1
            });
            this.toctoc.ifAbsent(() => {
                this.simulatePresence();
            });
        }, 5000);

        setInterval(() => {
            let state = this.gpio.readState();
            if (state == 1) {
                onDoorBellRing();
            }
        }, 100);
    }
    private simulatePresence() {
        let delayBeforeLight = this.getRandomNumberBetween(10, 15) * 1000;
        setTimeout(
            () => {
                if(Math.random() >= 0.5) {
                    this.turnOnLivingRoomFloorLamp();
                } else {
                    this.turnOnLivingRoomLamp();
                }
            },
            delayBeforeLight
        );
    }

    private turnOnLivingRoomLamp() {
        this.lampSalon.setState(
            {
                on: true,
                bri: 255,
                rgb: [255, 255, 255]
            },
            this.getRandomNumberBetween(15, 30) * 1000
        );
    }

    private turnOnLivingRoomFloorLamp() {
        this.clientPowerOutlet.impulse('A1', this.getRandomNumberBetween(15, 30) * 1000);
    }

    private getRandomNumberBetween(start: number, end: number): number {
        return Math.floor(Math.random() * (end - start)) + start;
    }
}