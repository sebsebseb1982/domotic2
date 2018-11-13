import {Configuration} from "../configuration/configuration";
import {IHueBridge, IHueLamp, IHueLampState} from "./hue";
import {Logger} from "../common/logger/logger";

let hue = require("node-hue-api");
let HueApi = require("node-hue-api").HueApi;

export class HueLampManager {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Hue Manager');
    }

    setState(lamp:IHueLamp, state:IHueLampState) {
        this.findBridge().then((bridge:IHueBridge) => {
            let api = new HueApi(bridge.ipaddress, this.configuration.hue.username, this.configuration.hue.timeOut);

            console.log('Set lamp "' + lamp.label + '" to state : ', state);

            api.setLightState(lamp.id, state)
                .fail(this.displayError)
                .done();
        });
    }

    getLampStatus(lamp: IHueLamp): Promise<IHueLampState> {
        return new Promise((resolve, reject) => {
            this.findBridge().then((bridge:IHueBridge) => {
                let api = new HueApi(bridge.ipaddress, this.configuration.hue.username, this.configuration.hue.timeOut);

                api.lightStatusWithRGB(lamp.id, (err, status) => {
                    if (err) {
                        this.logger.error(`Erreur lors de la lecture de l'état de la lampe ${lamp.id}`, err);
                        reject(err);
                    }

                    resolve(status);
                });
            });
        });
    }

    private findBridge(): Promise<IHueBridge> {
        return new Promise<any>((resolve, reject) => {
            hue.nupnpSearch(function(err, bridges) {
                if (err) {
                    this.handleError('Impossible de trouver le bridge Hue', err);
                    reject(err);
                }

                resolve(bridges[0]);
            });
        });
    }

    private displayError(message:string) {
        this.logger.error('Impossible de modifier l\état d\'une lampe', message);
    }
}
