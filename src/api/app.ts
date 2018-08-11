import * as express from "express";
import * as bodyParser from "body-parser";
import {OutletsRoutes} from "./routes/outlets-routes";
import {Auth} from "./filters/auth";
import {Configuration} from "../configuration/configuration";
import {RFXcom} from "../rfxcom/RFXcom";
import {RandomTuneRoutes} from "./routes/random-tune-routes";

class App {
    public app: express.Application;
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
        this.app = express();
        this.config();

        // Filters
        let router = express.Router();
        new Auth().filter(router);

        // Routes
        new OutletsRoutes().routes(router);
        //new RandomTuneRoutes().routes(unauthentifiedRouter);

        this.app.use(this.configuration.api.root, router);

        RFXcom.initialize();
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
export default new App().app;