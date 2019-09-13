import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import * as http from "http";
import {RequestOptions} from "http";
import {IHueLampState} from "../../hue/hue";
import {AbstractClientAPI} from "../common/abstract-client-api";

export class ClientHueLamp extends AbstractClientAPI {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        super();
        this.configuration = new Configuration();
        this.logger = new Logger('Client Hue lamp');
    }

    setState(hueLampCode: string, state: IHueLampState) {
        let options: RequestOptions = {
            ...{
                path: `${this.configuration.api.root}/hue-lamps/${hueLampCode}/state`,
                method: 'PUT'
            },
            ...this.domoticAPIRequestOptions
        };
        let errorMessage = `Impossible de passer la lampe (code=${hueLampCode}) à l'état ${state}.`;
        let request = http.request(options, (response) => {
            if (response.statusCode !== 200) {
                this.logger.error(errorMessage, errorMessage);
            }
        });

        request.on('error', (e) => {
            this.logger.error(e.name, `${e.message}\n${e.stack}`);
        });
        request.write(`{"state":${JSON.stringify(state)}}`);
        request.end();
    }

    getState(hueLampCode: string): Promise<IHueLampState> {
        return new Promise<IHueLampState>((resolve, reject) => {
            let options: RequestOptions = {
                ...{
                    path: `${this.configuration.api.root}/hue-lamps/${hueLampCode}/state`,
                    method: 'GET'
                },
                ...this.domoticAPIRequestOptions
            };
            let request = http.request(options, (response) => {
                if (response.statusCode !== 200) {
                    let errorMessage = `Impossible de lire l'état de la lampe (code=${hueLampCode}).`;
                    this.logger.error(errorMessage, errorMessage);
                }
                let responseBody = '';
                response.on('data', (chunk) => {
                    responseBody += chunk;
                });
                response.on('end', () => {
                    resolve(JSON.parse(responseBody).state);
                });
            });

            request.on('error', (e) => {
                this.logger.error(e.name, `${e.message}\n${e.stack}`);
            });
            request.end();
        });
    }
}