import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';
import {RequestOptions} from 'http';
import * as _ from "lodash";
import {Camera} from "../security/cctv/camera";
import * as moment from 'moment';
import * as makedir from 'make-dir';
import {Logger} from "../common/logger/logger";
import * as yargs from  'yargs';

class Timelapse {
    configuration: Configuration;
    periodInMs: number;
    occurences: number;
    processStartDate: Date;
    camera: Camera;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.processStartDate = new Date();
        this.logger = new Logger('Timelapse');

        this.occurences = yargs.argv.occurences ? yargs.argv.occurences : 100;
        this.periodInMs = yargs.argv.periodInMs ? yargs.argv.periodInMs : 1000;
        this.camera = this.configuration.cameras[yargs.argv.camera ? yargs.argv.camera : 0];

        this.logger.info(`This timelapse will lasts less than ${Math.ceil((this.occurences * this.periodInMs) / (1000 * 60))} minutes and take ${this.occurences} photos`);
        this.start();
    }

    private start(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let photosPaths: string[] = [];

            for (let photoIndex = 0; photoIndex < this.occurences; photoIndex++) {
                setTimeout(
                    () => {
                        let options: RequestOptions = {
                            host: this.camera.hostname,
                            port: this.camera.port,
                            path: this.camera.stillImagePath,
                            headers: {
                                'Authorization': 'Basic ' + new Buffer(this.camera.user + ':' + this.camera.password).toString('base64')
                            }
                        };
                        http.get(options, (response) => {
                            if (response.statusCode === 200) {
                                let snapshotId = _.padStart(photoIndex.toString(), (this.occurences - 1).toString().length, '0');
                                let timestamp = moment().format("YYYY-MM-DD");
                                let snaphotOutputDir = `${this.configuration.timelapse.output}/${timestamp}`;
                                let snaphotCompletePath = `${snaphotOutputDir}/snapshot-${snapshotId}-${process.pid}.jpg`;
                                makedir(snaphotOutputDir).then(() => {
                                    this.logger.debug(`Saving ${snaphotCompletePath} ...`);
                                    let photo = fs.createWriteStream(snaphotCompletePath);
                                    response.pipe(photo);
                                    photosPaths.push(snaphotCompletePath);
                                });
                            }
                        });
                    },
                    photoIndex * this.periodInMs
                );
            }

            setTimeout(
                () => {
                    resolve(photosPaths.sort());
                },
                this.occurences * this.periodInMs + 10000
            );

        });
    }
}

new Timelapse();