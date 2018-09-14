import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Configuration} from "../../configuration/configuration";
import {MailService} from "../../notifications/services/mailService";
import {Logger} from "../../common/logger/logger";

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

    constructor(private rfxcom: any) {
        this.configuration = new Configuration();
        this.googleHome = new GoogleHomeService();
        let service = 'Sonnette';
        this.mailService = new MailService(service);
        this.logger = new Logger(service);
    }

    listen() {
        this.rfxcom.on("chime1", (evt: DoorBellEvent) => {
            this.logger.debug(JSON.stringify(evt));
            if(evt.id === this.configuration.doorBell.buttonID) {
                this.googleHome.play(`http://${this.configuration.doorBell.randomTune.publicHostname}:${this.configuration.doorBell.randomTune.port}${this.configuration.doorBell.randomTune.root}/random-tune`);
                let message = 'Quelqu\'un vient de sonner';
                this.mailService.send({
                    title: message,
                    description: message
                });
            }
        });
    }
}