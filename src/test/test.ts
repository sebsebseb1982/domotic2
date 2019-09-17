import {HueAPIDiscovery, IHueAPI} from "../hue/hue-api-discovery";
import {Logger} from "../common/logger/logger";
import {lamps} from "../hue/hue-lamps";
import {IHueLamp, IHueLampState} from "../hue/hue";
import {v3} from "node-hue-api";



export class HueRoutes {

    private futureAPI: Promise<IHueAPI>;
    logger: Logger;

     constructor() {

this.init().then((tutu)=> {
    console.log(tutu);
});
        this.logger = new Logger(`Test`);
    }

    async init() {
        const discoveryResults = await v3.discovery.nupnpSearch();

        if (discoveryResults.length === 0) {
            console.error('Failed to resolve any Hue Bridges');
            return null;
        } else {
            // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
            return discoveryResults[0].ipaddress;
        }
    }

    test() {
        let state: IHueLampState = {
            on: true,
            bri: 255,
            rgb: [
                255,
                255,
                255
            ]
        };
        let lamp = this.getLampByCode('salon');

        this.futureAPI.then((api) => {
            this.logger.info(`Affectation de l'état suivant à la lampe ${lamp.label} : ${JSON.stringify(state)}`);

            api.setLightState(5, state,  (err, lights) => {
                if (err) {
                    this.logger.error('KO',err);
                } else {
                    this.logger.info('OK');
                }
            });
        });
    }


    private getLampByCode(hueLampCode: string): IHueLamp {
        if (!lamps[hueLampCode]) {
            this.logger.error(`Impossible de trouver une lampe`, `Aucune lampe n'existe avec le code ${hueLampCode}`);
        }
        return lamps[hueLampCode];
    }

}

let test = new HueRoutes();
//test.test();