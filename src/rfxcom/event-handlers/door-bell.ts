import {GoogleHomeService} from "../../notifications/services/googleHomeService";

export class DoorBell {
    googleHome: GoogleHomeService;
    constructor(private rfxcom: any){
        this.googleHome = new GoogleHomeService();
    }

    listen() {
        this.rfxcom.on("chime1", (evt) => {
            this.googleHome.say('Ding dong !');
        });
    }
}