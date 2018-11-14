import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {RelayDB} from "../../../relay/relay-db";

export class GateRoutes implements IRoutable {

    constructor() {
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/gate',
                (req: Request, res: Response) => {
                    RelayDB.instance.getByCode('k3').then((relay) => {
                        relay.impulse(100);

                        res.status(200).send({
                            message: 'GET request successfulll!!!!'
                        });
                    });
                }
            );
    }
}