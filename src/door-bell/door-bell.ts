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

let DOOR_BELL_PIN = 3;

export class DoorBell {

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
        this.gpio = new GPIO(DOOR_BELL_PIN, 'in');
        this.googleHome = new GoogleHomeService();
        this.configuration = new Configuration();
        let service = 'Sonnette';
        this.mailService = new MailService(service);
        this.pushover = new PushoverService();
        this.toctoc = new TocToc();
        this.lampSalon = new HueLamp('salon', service);
        this.clientPowerOutlet = new ClientPowerOutlet();
    }

    watch() {
        let onDoorBellRing = _.debounce(() => {
                this.googleHome.play(`http://${this.configuration.doorBell.randomTune.publicHostname}:${this.configuration.doorBell.randomTune.port}${this.configuration.doorBell.randomTune.root}/random-tune`);
                let message = `Quelqu'un vient de sonner`;
                this.logger.info(message);
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
            },
            10 * 1000,
            {leading: true, trailing: false}
        );

        setInterval(() => {
            if (this.gpio.readState()) {
                this.logger.debug('Appui sur la sonnette');
                onDoorBellRing();
            }
        }, 200);
    }

    private simulatePresence() {
        let delayBeforeLight = this.getRandomNumberBetween(10, 15) * 1000;
        setTimeout(
            () => {
                if (Math.random() >= 0.5) {
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
                bri: 254,
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

new DoorBell().watch();