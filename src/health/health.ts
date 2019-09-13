import {IConfiguration} from "../configuration/configurationType";
import {IHueLampState} from "../hue/hue";
import {RequestOptions} from "http";
import * as http from "http";
import {AbstractClientAPI} from "../api/common/abstract-client-api";
import {Logger} from "../common/logger/logger";

let spawn = require('child_process').spawn;

class Health extends AbstractClientAPI {

    configuration: IConfiguration;
    logger: Logger;

    constructor() {
        super();
        this.logger = new Logger('Health Check');
        this.testDomoticAPI();
    }

    testDomoticAPI() {
        this.getStatus(`${this.configuration.api.root}/sante`).then((status: boolean) => {
            if (!status) {
                this.logger.notify(`L'API Domotic ne répond plus`, `Restart de l'API en cours`);
                spawn(`${this.configuration.general.installDir}/src/health/scripts/restart-api.sh`, [], {
                    detached: true
                }).unref();
            }
        });
    }

    getStatus(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let options: RequestOptions = {
                ...{
                    path: path,
                    method: 'GET'
                },
                ...this.defaultRequestOptions
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