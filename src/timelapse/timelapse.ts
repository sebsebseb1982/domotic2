import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';

export class Timelapse {
    configuration: Configuration;
    stillImageUrl: string;
    period: number;
    occurence: number;

    constructor() {
        this.configuration = new Configuration();
        let foscamR2Etage = this.configuration.cameras[0];
        this.stillImageUrl = `http://${foscamR2Etage.hostname}:${foscamR2Etage.port}/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=${foscamR2Etage.user}&pwd=${foscamR2Etage.password}`;
        this.occurence = 100;
        this.period = 100;
    }

    takePhotos():Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let photos: string[] = [];

            for(let photoIndex = 0; photoIndex < 100; photoIndex ++) {
                setTimeout(
                    () => {
                        let photoPath = `${this.configuration.general.tempDir}/snapshot-${photoIndex}-${process.pid}.jpg`;
                        let photo = fs.createWriteStream(photoPath);
                        http.get(this.stillImageUrl, (response) => {
                            response.pipe(photo);
                        });
                    },
                    photoIndex * 100
                );
            }

            setTimeout(
                () => {
                    resolve(photos);
                },
                this.occurence * this.period + 1000
            );

        });
    }

    start() {
        this.takePhotos().then((photos: string[]) => {
           console.log(photos);
        });
    }
}