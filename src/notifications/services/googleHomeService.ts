import {Configuration} from "../../configuration/configuration";

let googleHome = require('google-home-notifier');

export class GoogleHomeService {
    configuration: Configuration;
    device: any;

    constructor() {
        this.configuration = new Configuration();
        googleHome.ip(this.configuration.googleHome.hostname, this.configuration.googleHome.language);
        googleHome.device('', this.configuration.googleHome.language);
    }

    say(somethingToSay: string) {
        console.log('Google Home va énoncer le message suivant : ', somethingToSay);
        googleHome.notify(somethingToSay.substring(0,199), () => {});
    }

    play(mediaURL: string) {
        console.log('Google Home va lire le fichier suivant : ', mediaURL);
        googleHome.play(mediaURL, () => {});
    }
}