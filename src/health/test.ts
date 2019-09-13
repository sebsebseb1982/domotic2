import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";

let spawn = require('child_process').spawn;

class Test {
    configuration: IConfiguration;

    constructor() {
        this.configuration = new Configuration();

        let command = `${this.configuration.general.installDir}/src/health/scripts/test.sh`;
        console.log(`executing ${command}`);
        spawn(command);
    }
}

new Test();