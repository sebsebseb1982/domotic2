import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";

let spawn = require('child_process').spawn;

class Test {
    configuration: IConfiguration;

    constructor() {
        this.configuration = new Configuration();

        spawn(`${this.configuration.general.installDir}/src/health/scripts/test.sh`)
    }
}

new Test();