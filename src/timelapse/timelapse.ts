import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';
import * as _ from "lodash";
import {INotifier} from "../notifications/notifier";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";

let getPixels = require('get-pixels')
let GifEncoder = require('gif-encoder');

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

        console.log(`This timelapse will lasts less than ${Math.ceil((this.occurence * this.period) / (1000 * 60))} minutes and take ${this.occurence} photos`);
    }

    private takePhotos():Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let photosPathes: string[] = [];

            for(let photoIndex = 0; photoIndex < this.occurence; photoIndex ++) {
                setTimeout(
                    () => {
                        let photoPath = `${this.configuration.general.tempDir}/snapshot-${photoIndex}-${process.pid}.jpg`;
                        let photo = fs.createWriteStream(photoPath);
                        http.get(this.stillImageUrl, (response) => {
                            response.pipe(photo);
                            photosPathes.push(photoPath);
                        });
                    },
                    photoIndex * this.period
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
                if(err) {
                    this.notifier.notify({
                        title: 'Impossible de supprimer une photo',
                        description: err.message
                    });
                }
            });
        });
    }

transforrmToGIF(photos: string[]) {
    let gif = new GifEncoder(1280, 720);
    let file = require('fs').createWriteStream(`${this.configuration.general.tempDir}/test.gif`);

    gif.pipe(file);
    gif.setQuality(20);
    gif.setDelay(33);
    gif.writeHeader();

    var addToGif = function(images, counter = 0) {
        getPixels(images[counter], function(err, pixels) {
            gif.addFrame(pixels.data);
            gif.read();
            if (counter === images.length - 1) {
                gif.finish();
                this.clean();
            } else {
                addToGif(images, ++counter);
            }
        })
    }
    addToGif(photos);
}

    start() {
        this.takePhotos().then((photos: string[]) => {
            this.transforrmToGIF(photos);
        });
    }
}