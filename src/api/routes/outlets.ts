import {Application, Request, Response} from "express";
import * as core from "express-serve-static-core";

export class OutletsRoutes {
    public routes(router: core.Router): void {
        router
            .get(
                '/',
                (req: Request, res: Response) => {
                    res.status(200).send({
                        message: 'GET request successfulll!!!!'
                    })
                }
            );
    }
}