import {Configuration} from "../../configuration/configuration";

const GoogleHome = require('node-googlehome');

export class GoogleHomeService {
    configuration: Configuration;
    device: any;

    constructor() {
        this.configuration = new Configuration();
        let device = new GoogleHome.Connecter(this.configuration);
        console.log('device',device);
    }

    speak(somethingToSay: string) {
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