import {Configuration} from "../../configuration/configuration";

//const GoogleHome = require('node-googlehome');
let googleHome = require('google-home-notifier');

export class GoogleHomeService {
    configuration: Configuration;
    device: any;

    constructor() {
        this.configuration = new Configuration();
        googleHome.ip(this.configuration.googleHome.hostname, this.configuration.googleHome.language);
        googleHome.device('Salon', this.configuration.googleHome.language);
    }

    speak(somethingToSay: string) {
        console.log('Google Home va énoncer le message suivant : ', somethingToSay);
        googleHome.notify(somethingToSay);
    }

    play(mediaURL: string) {
        console.log('Google Home va lire le fichier suivant : ', mediaURL);
        googleHome.play(mediaURL);
    }
}