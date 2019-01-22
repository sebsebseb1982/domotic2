import * as http from "http";
import {RequestOptions} from "http";
import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import {AbstractClientAPI} from "./routes/abstract-client-api";
import {duration} from "moment";

export class ClientPowerOutlet extends AbstractClientAPI {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        super();
        this.configuration = new Configuration();
        this.logger = new Logger('ClientPowerOutlet RFXcom');
    }

    setState(powerOutletCode: string, state: boolean) {
        let options: RequestOptions = {
            ...{
                path: `${this.configuration.api.root}/outlet/${powerOutletCode}`,
                method: 'POST'
            },
            ...this.defaultRequestOptions
        };
        let errorMessage = `Impossible de passer la prise (code=${powerOutletCode}) à l'état ${state}.`;
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

    on(powerOutletCode: string) {
        this.setState(powerOutletCode, true);
    }

    off(powerOutletCode: string) {
        this.setState(powerOutletCode, false);
    }

    impulse(powerOutletCode: string, durationInMs: number) {
        this.on(powerOutletCode);
        setInterval(
            () => {
                this.off(powerOutletCode);
            },
            durationInMs
        )
    }
}