import {HueAPIDiscovery, IHueAPI} from "./hue-api-discovery";
import {lamps} from "./hue-lamps";
import {IHueLampState} from "./hue";
import {Logger} from "../common/logger/logger";

export class HueLamp {
    private futureAPI: Promise<IHueAPI>;
    id: number;
    label: string;
    logger: Logger;

    constructor(hueLampCode: string) {
        this.futureAPI = HueAPIDiscovery.instance;
        this.logger = new Logger(`Lampe Hue ${hueLampCode}`);
        if (!lamps[hueLampCode]) {
            this.logger.error(`Erreur lors de l'instanciation`, `aucune lampe n'existe avec le code ${hueLampCode}`);
        }
        this.id = lamps[hueLampCode].id;
        this.label = lamps[hueLampCode].label;
    }

    on() {
        this.logger.info(`Allumage de la lampe ${this.label}`);
        this.setState({
            on: true
        });
    }

    off() {
        this.logger.info(`Extinction de la lampe ${this.label}`);
        this.setState({
            on: false
        });
    }

    setState(state: IHueLampState) {
        this.futureAPI.then((api) => {
            this.logger.info(`Affectation de l'état suivant à la lampe ${this.label} : ${JSON.stringify(state)}`);
            api.setLightState(this.id, state)
                .fail(this.logSetStateError)
                .done();
        });
    }

    getState(): Promise<IHueLampState> {
        return new Promise<IHueLampState>((resolve, reject) => {
            this.futureAPI.then((api) => {
                this.logger.info(`Récupération de l'état de la lampe ${this.label}`);
                api.lightStatusWithRGB(this.id, (err, status) => {
                    if (err) {
                        this.logger.error(`Erreur lors de la lecture de l'état de la lampe ${this.label}`, err);
                        reject(err);
                    }

                    resolve(status);
                });
            });
        });
    }

    logSetStateError(message: string) {
        let logger = new Logger(`Lampe Hue`);
        logger.error(`Erreur lors de l'affectation d'un état pour une lampe HUE`, message);
    }
}