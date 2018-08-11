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
        let authentifiedRouter = express.Router();
        new Auth().filter(authentifiedRouter);

        // Routes
        new OutletsRoutes().routes(authentifiedRouter);
        let unauthentifiedRouter = express.Router();
        new RandomTuneRoutes().routes(unauthentifiedRouter);

        this.app.use(this.configuration.api.root, authentifiedRouter);
        this.app.use(this.configuration.api.root, unauthentifiedRouter);

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