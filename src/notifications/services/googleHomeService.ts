import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import * as moment from 'moment';
import {Moment} from 'moment';

let googleHome = require('google-home-notifier');

export class GoogleHomeService {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Google Home');
        googleHome.ip(this.configuration.googleHome.hostname, this.configuration.googleHome.language);
        googleHome.device('', this.configuration.googleHome.language);
    }

    say(somethingToSay: string, onlyDay: boolean = false) {

        let now = moment();
        let dayOfTheWeek = now.day();
        let hours = now.hours();

        let isWeekEndNight = (dayOfTheWeek === 5 || dayOfTheWeek === 6) && (hours < 11 && hours >= 22);
        let isWeekNight = dayOfTheWeek < 5 && (hours < 7 && hours >= 21);
        if (!onlyDay || !(isWeekNight || isWeekEndNight)) {
            this.logger.debug(`Google Home va énoncer le message suivant "${somethingToSay}"`);
            googleHome.notify(somethingToSay.substring(0, 199), () => {
            });
        } else {
            this.logger.debug(`Google Home n'a pas énoncé le message suivant  car il est trop tard "${somethingToSay}"`);
        }
    }

    play(mediaURL: string) {
        this.logger.debug(`Google Home va lire le fichier suivant "${mediaURL}"`);
        googleHome.play(mediaURL, () => {
        });
    }
}