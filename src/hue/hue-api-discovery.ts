import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";

let hue = require("node-hue-api");
let HueApi = require("node-hue-api").HueApi;

interface IHueBridge {
    ipaddress: string;
}

export interface IHueAPI {
    setLightState(id: number, state: {}, callback: (err, lights) => Promise<boolean>);
    lightStatusWithRGB(id: number, callback: (err, status) => void): void;
}

export class HueAPIDiscovery {

    private static api: Promise<IHueAPI>;
    private static logger: Logger = new Logger(`Bridge Hue`);

    static get instance(): Promise<IHueAPI> {
        if (!HueAPIDiscovery.api) {
            HueAPIDiscovery.api = new Promise<IHueAPI>((resolve, reject) => {
                hue.nupnpSearch((err, bridges: IHueBridge[]) => {
                    if (err) {
                        HueAPIDiscovery.logger.error('Impossible de trouver le bridge Hue', err);
                        reject(err);
                    }

                    let configuration = new Configuration();
                    resolve(new HueApi(bridges[0].ipaddress, configuration.hue.username, configuration.hue.timeOut));
                });
            });
        }

        return HueAPIDiscovery.api;
    }
}