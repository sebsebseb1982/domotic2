/*
import express, {Request, Response, NextFunction} from "express";
import logger from "morgan";
import {logger as log} from "./commun/logger/log"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import badgeageRouter from "./badgeages/badgeages.route";
import authentificationeRouter from "./authentification/authentification.route";

class Application {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cookieParser());
        this.configRouter();
        this.app.use(this.handlerErrors);
    }

    private handlerErrors(err: any, req: Request, res: Response, next: NextFunction) {
        next(err);
        res.status(err.status || 500).send({error: 'Something failed!'});
    }

    private configRouter(): void {
        let router = express.Router();
        // Routes
        badgeageRouter.init(router);
        authentificationeRouter.init(router);
        this.app.use('/api', router);
    }

    public get() {
        return this.app
    }

}

const application = new Application();
export default application;*/
