import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Configuration} from "../../configuration/configuration";

export class DoorBell {
    googleHome: GoogleHomeService;
    configuration: Configuration;

    constructor(private rfxcom: any){
        this.configuration = new Configuration();
        this.googleHome = new GoogleHomeService();
    }

    listen() {
        this.rfxcom.on("chime1", (evt) => {
            this.googleHome.play(`http://${this.configuration.doorBell.randomTune.publicHostname}:${this.configuration.doorBell.randomTune.port}/${this.configuration.doorBell.randomTune.root}/random-tune`);
        });
    }
}