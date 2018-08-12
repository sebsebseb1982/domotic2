import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";

export class AlarmRoutes implements IRoutable {
    public routes(router: core.Router): void {
        router
            .post(
                '/alarm',
                (req: Request, res: Response) => {
                }
            );
    }
}