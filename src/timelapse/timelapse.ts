import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';

export class Timelapse {
    configuration: Configuration;
    stillImageUrl: string;

    constructor() {
        this.configuration = new Configuration();
        let foscamR2Etage = this.configuration.cameras[0];
        this.stillImageUrl = `http://${foscamR2Etage.hostname}:${foscamR2Etage.port}/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=${foscamR2Etage.user}&pwd=${foscamR2Etage.password}`;
    }

    start() {
        for(let photoIndex = 0; photoIndex < 100; photoIndex ++) {
            setTimeout(
                () => {
                    let file = fs.createWriteStream(`${this.configuration.general.tempDir}/snapshot${photoIndex}.jpg`);
                    http.get(this.stillImageUrl, (response) => {
                        response.pipe(file);
                    });
                },
                photoIndex * 100
            );
        }
    }
}