import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import {RequestOptions} from "http";
import * as http from "http";
import {IHueLampState} from "../../hue/hue";
import {AbstractClientAPI} from "./routes/abstract-client-api";
import * as _ from "lodash";
import * as moment from "moment";
import * as makedir from "make-dir";
import * as fs from "fs";

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
                method: 'POST'
            },
            ...this.defaultRequestOptions
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
        request.write(`{"state":${state}}`);
        request.end();
    }

    getState(hueLampCode: string): IHueLampState {
        let options: RequestOptions = {
            ...{
                path: `${this.configuration.api.root}/hue-lamps/${hueLampCode}/state`
            },
            ...this.defaultRequestOptions
        };
        http.get(options, (response) => {
            if (response.statusCode === 200) {
                console.log(response);
            }
        });

        return null;
    }
}