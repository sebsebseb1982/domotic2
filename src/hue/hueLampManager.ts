import {Configuration} from "../configuration/configuration";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";
import {INotifier} from "../notifications/notifier";
import {MyNotification} from "../notifications/myNotification";
import {IHueBridge, IHueLamp, IHueLampState} from "./hue";

let hue = require("node-hue-api");
let HueApi = require("node-hue-api").HueApi;

export class HueLampManager {
    configuration: Configuration;
    notifier: INotifier;

    constructor() {
        this.configuration = new Configuration();
        this.notifier =  new NotifyMyAndroidNotifierService('Hue bridge');
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
                        this.handleError(`Erreur lors de la lecture de l'état de la lampe ${lamp.id}`, err);
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
        this.handleError('Impossible de modifier l\état d\'une lampe', message);
    }

    private handleError(error, message) {
        this.notifier.notify(new MyNotification(error, message));
    }
}
