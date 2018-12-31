import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {RelayDB} from "../../../relay/relay-db";
import {PushoverService} from "../../../notifications/services/pushover-service";
import {Configuration} from "../../../configuration/configuration";

export class GateRoutes implements IRoutable {

    pushover: PushoverService;

    constructor() {
        this.pushover = new PushoverService();
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/gate',
                (req: Request, res: Response) => {
                    RelayDB.instance.getByCode('k3').then((relay) => {
//                        relay.impulse(100);
                        console.log(`User : ${req.headers['user']}`);

                        res.status(200).send({
                            message: 'GET request successfulll!!!!'
                        });
                    });
                }
            );
    }
}