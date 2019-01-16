import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Configuration} from "../../configuration/configuration";
import {MailService} from "../../notifications/services/mailService";
import {Logger} from "../../common/logger/logger";
import {TocToc} from "../../toctoc/toctoc";
import {HueLamp} from "../../hue/hue-lamp";
import {PushoverService} from "../../notifications/services/pushover-service";

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

    constructor(private rfxcom: any) {
        this.configuration = new Configuration();
        this.googleHome = new GoogleHomeService();
        let service = 'Sonnette';
        this.mailService = new MailService(service);
        this.logger = new Logger(service);
        this.toctoc = new TocToc();
        this.lampSalon = new HueLamp('salon');
        this.pushover = new PushoverService();
    }

    listen() {
        this.rfxcom.on("chime1", (evt: DoorBellEvent) => {
            this.logger.debug(JSON.stringify(evt));
            this.pushover.send({
                title: 'Réception évènement "chime1"',
                description: JSON.stringify(evt),
                priority: -2
            });
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
                this.toctoc.ifPresent(() => {
                    this.simulatePresence();
                });
            }
        });
    }

    private simulatePresence() {
        setTimeout(
            () => {
                this.lampSalon.setState({
                    on: true,
                    bri: 255,
                    rgb: [255, 255, 255]
                });
                setTimeout(
                    () => {
                        this.lampSalon.off();
                    },
                    this.getRandomNumberBetween(15, 30) * 1000
                );
            },
            this.getRandomNumberBetween(5, 10) * 1000
        );
    }

    private getRandomNumberBetween(start: number, end: number): number {
        return Math.floor(Math.random() * (end-start)) + start;
    }
}