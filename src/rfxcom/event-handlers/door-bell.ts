import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Configuration} from "../../configuration/configuration";
import {MailService} from "../../notifications/services/mailService";
import {Logger} from "../../common/logger/logger";
import {TocToc} from "../../toctoc/toctoc";
import {HueLamp} from "../../hue/hue-lamp";
import {PushoverService} from "../../notifications/services/pushover-service";
import {ClientPowerOutlet} from "../../api/domotic/client-power-outlet";

interface DoorBellEvent {
    "subtype": number,
    "seqnbr": number,
    "rssi": number,
    "id": string,
    "commandNumber": number,
    "command": string
}

export class DoorBell {
    googleHome: GoogleHomeService;
    configuration: Configuration;
    mailService: MailService;
    logger: Logger;
    toctoc: TocToc;
    lampSalon: HueLamp;
    pushover: PushoverService;
    clientPowerOutlet: ClientPowerOutlet;

    constructor(private rfxcom: any) {
        this.configuration = new Configuration();
        this.googleHome = new GoogleHomeService();
        let service = 'Sonnette';
        this.mailService = new MailService(service);
        this.logger = new Logger(service);
        this.toctoc = new TocToc();
        this.lampSalon = new HueLamp('salon');
        this.pushover = new PushoverService();
        this.clientPowerOutlet = new ClientPowerOutlet();
    }

    listen() {
        this.rfxcom.on("chime1", (evt: DoorBellEvent) => {
            this.logger.debug(JSON.stringify(evt));
            if (evt.id === this.configuration.doorBell.buttonID) {
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
            }
        });
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