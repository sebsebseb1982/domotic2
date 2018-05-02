import {Configuration} from "../../configuration/configuration";

const GoogleHome = require('node-googlehome');

export class GoogleHomeService {
    configuration: Configuration;
    device: any;

    constructor() {
        this.configuration = new Configuration();
        this.device = new GoogleHome.Connecter(this.configuration.googleHome.hostname);
        this.device.config({lang: this.configuration.googleHome.language});
    }

    speak(somethingToSay: string) {
        console.log('Google Home va énoncer le message suivant : ', somethingToSay);
        this.device.speak(somethingToSay)
            .then(console.log)
            .catch(console.log);
    }

    playMedia(mediaURL: string) {
        this.device.playMedia(mediaURL)
            .then(console.log)
            .catch(console.log);
    }
}