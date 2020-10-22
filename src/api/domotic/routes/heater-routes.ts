import * as core from "express-serve-static-core";
import {Request, Response} from "express";
import {Logger} from "../../../common/logger/logger";
import {IRoutable} from "../../common/routes";
import {IConfiguration} from "../../../configuration/configurationType";
import {Configuration} from "../../../configuration/configuration";
import {Heater} from "../../../thermospi/heater";


export class HeaterRoutes implements IRoutable {

    private configuration: IConfiguration;
    logger: Logger;
    private heater: Heater;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(`Controleur chaudière`);
        this.heater = new Heater();
    }

    routes(router: core.Router): void {
        router
            .post(
                '/heater',
                (req: Request, res: Response) => {
                    let state:boolean = req.body.state;
                    if(state) {
                        this.heater.on();
                    }else{
                        this.heater.off();
                    }
                    res.sendStatus(200);
                }
            );
    }
}