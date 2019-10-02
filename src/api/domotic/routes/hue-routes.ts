import * as core from "express-serve-static-core";
import {Request, Response} from "express";
import {IHueLamp, IHueLampState} from "../../../hue/hue";
import {HueAPIDiscovery, IHueAPI} from "../../../hue/hue-api-discovery";
import {Logger} from "../../../common/logger/logger";
import {lamps} from "../../../hue/hue-lamps";
import {IRoutable} from "../../common/routes";
import {v3, HueApi} from "node-hue-api";
import {Relay} from "../../../relay/relay";
import * as _ from "lodash";
import {IConfiguration} from "../../../configuration/configurationType";
import {Configuration} from "../../../configuration/configuration";

const LightState = v3.lightStates.LightState;


export class HueRoutes implements IRoutable {

    private configuration: IConfiguration;
    logger: Logger;
    private hueAPI: HueApi;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(`API Hue`);
        this.initHueAPI().then((hueAPI) => {
            this.hueAPI = hueAPI;
        });
    }

    initHueAPI(): Promise<HueApi> {
        return new Promise<HueApi>((resolve, reject) => {
            v3.discovery.nupnpSearch()
                .then(searchResults => {
                    const host = searchResults[0].ipaddress;
                    return v3.api.create(host, this.configuration.hue.username);
                })
                .then((api) => {
                    resolve(api);
                });
        });
    }

    routes(router: core.Router): void {
        router
            .put(
                '/hue-lamps/:hueLampCode/state',
                (req: Request, res: Response) => {
                    let state: IHueLampState = req.body.state;
                    let hueLampCode = req.params.hueLampCode;
                    let lamp = this.getLampByCode(hueLampCode);

                    this.logger.info(`La lampe ${lamp.label} (code=${hueLampCode},ID=${lamp.id}) va avoir pour nouvel état ${JSON.stringify(state)}`);

                    this.hueAPI.lights.setLightState(lamp.id, state)
                        .then((isOK) => {
                            if (isOK) {
                                res.sendStatus(200);
                            } else {
                                res.sendStatus(500);
                            }
                        })
                        .catch((error) => {
                            res.sendStatus(500);
                            res.send(error);
                        });
                }
            )
            .get(
                '/hue-lamps/:hueLampCode/state',
                (req: Request, res: Response) => {
                    let hueLampCode = req.params.hueLampCode;
                    let lamp = this.getLampByCode(hueLampCode);

                    /*this.futureAPI.then((api) => {
                        this.logger.info(`Récupération de l'état de la lampe ${lamp.label}`);
                        api.lightStatusWithRGB(lamp.id, (err, status) => {
                            if (err) {
                                this.logger.error(`Erreur lors de la lecture de l'état de la lampe ${lamp.label}`, err);
                                res.sendStatus(500);
                            } else {
                                res.send({
                                    state: status.state
                                });
                            }
                        });
                    });*/
                }
            );
    }

    private getLampByCode(hueLampCode: string): IHueLamp {
        if (!lamps[hueLampCode]) {
            this.logger.error(`Impossible de trouver une lampe`, `Aucune lampe n'existe avec le code ${hueLampCode}`);
        }
        return lamps[hueLampCode];
    }

    private logSetStateError(message: string) {
        let logger = new Logger(`Lampe Hue`);
        logger.error(`Erreur lors de l'affectation d'un état pour une lampe HUE`, message);
    }
}