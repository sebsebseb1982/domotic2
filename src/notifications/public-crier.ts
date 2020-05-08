import {TocToc} from "../toctoc/toctoc";
import * as yargs from 'yargs';
import {Logger} from "../common/logger/logger";
import {GoogleHomeService} from "./services/googleHomeService";

export class PublicCrier {
    toctoc: TocToc;
    logger: Logger;
    googleHomeService: GoogleHomeService;

    constructor() {
        this.toctoc = new TocToc();
        this.logger = new Logger(`Crieur de rue`);
        this.googleHomeService = new GoogleHomeService();
    }

    spreadTheNews(message: string) {
        this.toctoc.ifAbsent(() => {
            this.logger.debug(`Il n'y à personne à informer.`);
        }, () => {
            this.logger.info(`Le crieur de rue annonce le message suivant : ${message}`);
            this.googleHomeService.say(message);
        });
    }
}

new PublicCrier().spreadTheNews(yargs.argv.message);