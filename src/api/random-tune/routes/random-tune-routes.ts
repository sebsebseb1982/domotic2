import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import * as fs from 'fs';
import * as _ from "lodash";
import {Configuration} from "../../../configuration/configuration";
import {Logger} from "../../../common/logger/logger";

export class RandomTuneRoutes {
    private configuration: Configuration;
    private tunes: string[];
    private randomTunePath: string;
    private logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.tunes = fs.readdirSync(this.configuration.doorBell.randomTune.tunePath);
        this.randomTunePath = this.getRandomTunePath();
        this.logger = new Logger('RandomTune');
    }

    public routes(router: core.Router): void {
        router
            .get(
                '/random-tune',
                (req: Request, res: Response) => {
                    let randomizeTuneDebounced = _.debounce(
                        () => {
                            this.randomTunePath = this.getRandomTunePath();
                        },
                        500
                    );

                    randomizeTuneDebounced();
                    this.logger.debug(`Sending ${this.randomTunePath}`);
                    res.sendFile(this.randomTunePath);
                }
            );
    }

    private getRandomTunePath() {
        return `${this.configuration.doorBell.randomTune.tunePath}/${this.tunes[Math.floor(Math.random() * this.tunes.length)]}`;
    }
}