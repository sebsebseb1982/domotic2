import app from "./app";
import {Logger} from "../../common/logger/logger";
import {Configuration} from "../../configuration/configuration";

let configuration = new Configuration();

app.listen(configuration.doorBell.randomTune.port, () => {
    new Logger('API').info(`L'API RandomTune écoute sur le port ${configuration.doorBell.randomTune.port}`);
});