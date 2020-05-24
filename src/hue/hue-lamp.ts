import {lamps} from "./hue-lamps";
import {IHueLampState} from "./hue";
import {Logger} from "../common/logger/logger";
import {ClientHueLamp} from "../api/domotic/client-hue-lamp";

export class HueLamp {
    label: string;
    logger: Logger;
    client: ClientHueLamp;

    constructor(private hueLampCode: string, private clientName:string) {
        this.logger = new Logger(`Lampe Hue ${hueLampCode}`);
        if (!lamps[hueLampCode]) {
            this.logger.error(`Erreur lors de l'instanciation`, `aucune lampe n'existe avec le code ${hueLampCode}`);
        }
        this.label = lamps[hueLampCode].label;
        this.client = new ClientHueLamp(clientName);
    }

    on() {
        this.logger.info(`Allumage de la lampe ${this.label}`);
        this.client.setState(this.hueLampCode, {
            on: true
        });
    }

    off() {
        this.logger.info(`Extinction de la lampe ${this.label}`);
        this.client.setState(this.hueLampCode, {
            on: false
        });
    }

    setState(state: IHueLampState, durationInMs?: number) {
        this.logger.debug(`HueLamp.setState(${JSON.stringify(state)}, ${durationInMs})`);
        if(durationInMs) {
            this.getState().then((previousLampState: IHueLampState) => {
                this.client.setState(this.hueLampCode, state);

                setTimeout(
                    () => {
                        this.client.setState(this.hueLampCode, previousLampState);
                    },
                    durationInMs
                );
            });
        } else {
            this.client.setState(this.hueLampCode, state);
        }
    }

    getState(): Promise<IHueLampState> {
        return this.client.getState(this.hueLampCode);
    }
}