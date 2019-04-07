import * as core from "express-serve-static-core";
import {Request, Response} from "express";
import {IHueLamp, IHueLampState} from "../../../hue/hue";
import {HueAPIDiscovery, IHueAPI} from "../../../hue/hue-api-discovery";
import {Logger} from "../../../common/logger/logger";
import {lamps} from "../../../hue/hue-lamps";
import {IRoutable} from "../../common/routes";

export class HueRoutes implements IRoutable {

    private futureAPI: Promise<IHueAPI>;
    logger: Logger;

    constructor() {
        this.futureAPI = HueAPIDiscovery.instance;
        this.logger = new Logger(`API Hue`);
    }

    routes(router: core.Router): void {
        router
            .put(
                '/hue-lamps/:hueLampCode/state',
                (req: Request, res: Response) => {
                    let state: IHueLampState = req.body.state;
                    let hueLampCode = req.params.hueLampCode;
                    let lamp = this.getLampByCode(hueLampCode);

                    this.futureAPI.then((api) => {
                        this.logger.info(`Affectation de l'état suivant à la lampe ${lamp.label} : ${JSON.stringify(state)}`);
                        api.setLightState(lamp.id, state)
                            .fail(this.logSetStateError)
                            .done();
                    });

                    res.sendStatus(200);
                }
            )
            .get(
                '/hue-lamps/:hueLampCode/state',
                (req: Request, res: Response) => {
                    let hueLampCode = req.params.hueLampCode;
                    let lamp = this.getLampByCode(hueLampCode);

                    this.futureAPI.then((api) => {
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
                    });
                }
            );
    }

    private getLampByCode(hueLampCode:string): IHueLamp {
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