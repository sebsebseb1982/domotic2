import * as http from "http";
import {RequestOptions} from "http";
import {AbstractClientAPI} from "../api/common/abstract-client-api";
import {Logger} from "../common/logger/logger";

let spawn = require('child_process').spawn;
let exec = require('child_process').exec;

class Health extends AbstractClientAPI {

    logger: Logger;

    constructor() {
        super();
        this.logger = new Logger('Health Check');
        this.testAPI(
            'Domotic',
            `${this.configuration.api.root}/health`,
            `${this.configuration.general.installDir}/src/health/scripts/restart-domotic-api.sh`,
            this.domoticAPIRequestOptions
        );
        this.testAPI(
            'Random Tune',
            `${this.configuration.doorBell.randomTune.root}/health`,
            `${this.configuration.general.installDir}/src/health/scripts/restart-random-tune-api.sh`,
            this.randomTuneAPIRequestOptions
        );
    }

    testAPI(name: string, path: string, restartCommand: string, apiRequestOption: RequestOptions) {
        this.getStatus(path, apiRequestOption).then((status: boolean) => {
            if (status) {
                this.logger.info(`L'API ${name} fonctionne correctement`);
            } else {
                this.logger.error(`L'API ${name} ne répond plus`, `Restart de l'API ${name} en cours`);
                spawn(restartCommand, [], {
                    detached: true,
                    stdio: 'ignore'
                }).unref();
            }
        });
    }

    getStatus(path: string, apiRequestOption: RequestOptions): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let options: RequestOptions = {
                ...{
                    path: path,
                    method: 'GET'
                },
                ...apiRequestOption
            };
            let request = http.request(options, (response) => {
                if (response.statusCode !== 200) {
                    this.logger.debug(`L'URL ${path} ne répond pas correctement (code=${response.statusCode}).`);
                    resolve(false);
                }
                let responseBody = '';
                response.on('data', (chunk) => {
                    responseBody += chunk;
                });
            });

            request.on('error', (e) => {
                this.logger.debug(`L'URL ${path} ne répond pas.`);
                resolve(false);
            });
            request.end();
        });
    }
}

new Health();