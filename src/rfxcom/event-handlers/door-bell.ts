import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Configuration} from "../../configuration/configuration";
import {MailService} from "../../notifications/services/mailService";
import {Logger} from "../../common/logger/logger";
import {TocToc} from "../../toctoc/toctoc";
import {HueLampManager} from "../../hue/hueLampManager";
import {lamps} from "../../hue/hue-lamps";

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
    hue: HueLampManager;

    constructor(private rfxcom: any) {
        this.configuration = new Configuration();
        this.googleHome = new GoogleHomeService();
        let service = 'Sonnette';
        this.mailService = new MailService(service);
        this.logger = new Logger(service);
        this.toctoc = new TocToc();
        this.hue = new HueLampManager();
    }

    listen() {
        this.rfxcom.on("chime1", (evt: DoorBellEvent) => {
            this.logger.debug(JSON.stringify(evt));
            if (evt.id === this.configuration.doorBell.buttonID) {
                this.googleHome.play(`http://${this.configuration.doorBell.randomTune.publicHostname}:${this.configuration.doorBell.randomTune.port}${this.configuration.doorBell.randomTune.root}/random-tune`);
                let message = 'Quelqu\'un vient de sonner';
                this.mailService.send({
                    title: message,
                    description: message
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
                this.hue.setState(lamps.salon, {
                    on: true,
                    bri: 255,
                    rgb: [255, 255, 255]
                });
                setTimeout(
                    () => {
                        this.hue.setState(lamps.salon, {
                            on: false
                        });
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