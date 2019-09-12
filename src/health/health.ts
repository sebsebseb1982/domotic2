import {IConfiguration} from "../configuration/configurationType";
import {IHueLampState} from "../hue/hue";
import {RequestOptions} from "http";
import * as http from "http";
import {AbstractClientAPI} from "../api/common/abstract-client-api";
import {Logger} from "../common/logger/logger";

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
                console.log('coucou');
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
                    let errorMessage = `L'URL ${path} ne répond pas (code=${response.statusCode}).`;
                    this.logger.error(errorMessage, errorMessage);
                    resolve(false);
                }
                let responseBody = '';
                response.on('data', (chunk) => {
                    responseBody += chunk;
                });
                response.on('end', () => {
                    resolve(JSON.parse(responseBody).state === 200);
                });
            });

            request.on('error', (e) => {
                this.logger.error(e.name, `${e.message}\n${e.stack}`);
                resolve(false);
            });
            request.end();
        });
    }
}

new Health();