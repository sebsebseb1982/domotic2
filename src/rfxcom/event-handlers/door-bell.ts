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
            this.googleHome.play(`${this.configuration.api.users[1].name}:${this.configuration.api.users[1].token}@192.168.1.52:${this.configuration.api.port}/home/random-tune`);
        });
    }
}