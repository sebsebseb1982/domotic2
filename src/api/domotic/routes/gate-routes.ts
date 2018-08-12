import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {DB} from "../../../relay/db";
import {IRoutable} from "./routes";

export class GateRoutes implements IRoutable {
    relayDB: DB;

    constructor() {
        this.relayDB = new DB();
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/gate',
                (req: Request, res: Response) => {
                    this.relayDB.getByCode('k3').then((relay) => {
                        relay.impulse(100);

                        res.status(200).send({
                            message: 'GET request successfulll!!!!'
                        });
                    });
                }
            );
    }
}