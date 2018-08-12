import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Configuration} from "../../configuration/configuration";
import {MailService} from "../../notifications/services/mailService";

export class DoorBell {
    googleHome: GoogleHomeService;
    configuration: Configuration;
    mailService: MailService;

    constructor(private rfxcom: any){
        this.configuration = new Configuration();
        this.googleHome = new GoogleHomeService();
        this.mailService = new MailService('Sonnette');
    }

    listen() {
        this.rfxcom.on("chime1", (evt) => {
            this.googleHome.play(`http://${this.configuration.doorBell.randomTune.publicHostname}:${this.configuration.doorBell.randomTune.port}${this.configuration.doorBell.randomTune.root}/random-tune`);

            let message = 'Quelqu\'un vient de sonner';
            this.mailService.send({
               title: message,
               description:  message
            });
        });
    }
}