import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';
import * as _ from "lodash";
import {INotifier} from "../notifications/notifier";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";

export class Timelapse {
    configuration: Configuration;
    stillImageUrl: string;
    period: number;
    occurence: number;
    notifier: INotifier;

    constructor() {
        this.configuration = new Configuration();
        this.notifier =  new NotifyMyAndroidNotifierService('Timelapse');
        let foscamR2Etage = this.configuration.cameras[0];
        this.stillImageUrl = `http://${foscamR2Etage.hostname}:${foscamR2Etage.port}/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=${foscamR2Etage.user}&pwd=${foscamR2Etage.password}`;
        this.occurence = 100;
        this.period = 100;

        console.log(`This timelapse will last ${Math.round((this.occurence * this.period) / (1000 * 60))} minutes and take ${this.occurence} photos`);
    }

    private takePhotos():Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let photosPathes: string[] = [];

            for(let photoIndex = 0; photoIndex < 100; photoIndex ++) {
                setTimeout(
                    () => {
                        let photoPath = `${this.configuration.general.tempDir}/snapshot-${photoIndex}-${process.pid}.jpg`;
                        let photo = fs.createWriteStream(photoPath);
                        http.get(this.stillImageUrl, (response) => {
                            response.pipe(photo);
                            photosPathes.push(photoPath);
                        });
                    },
                    photoIndex * 100
                );
            }

            setTimeout(
                () => {
                    resolve(photosPathes);
                },
                this.occurence * this.period + 1000
            );

        });
    }

    private clean(photos: string[]) {
        _.forEach(photos, (aPhotoPath) => {
            fs.unlink(aPhotoPath, (err) => {
                this.notifier.notify({
                    title: 'Impossible de supprimer une photo',
                    description: err.message
                });
            });
        });
    }

    start() {
        this.takePhotos().then((photos: string[]) => {
            this.clean(photos);
        });
    }
}