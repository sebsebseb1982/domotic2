import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';
import * as _ from "lodash";
import {INotifier} from "../notifications/notifier";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";
import * as moment from 'moment';
import {AbstractConfigurationCamera} from "../configuration/camera";
import {RequestOptions} from "http";

let getPixels = require('get-pixels');
let GifEncoder = require('gif-encoder');

export class Timelapse {
    configuration: Configuration;
    stillImageUrl: string;
    period: number;
    occurence: number;
    notifier: INotifier;
    processStartDate: Date;
    camera:AbstractConfigurationCamera;

    constructor() {
        this.configuration = new Configuration();
        this.notifier = new NotifyMyAndroidNotifierService('Timelapse');
        this.occurence = 100;
        this.period = 100;
        this.processStartDate = new Date();
        this.camera = this.configuration.cameras[2];

        console.log(this.camera.stillImagePath);
        console.log(`This timelapse will lasts less than ${Math.ceil((this.occurence * this.period) / (1000 * 60))} minutes and take ${this.occurence} photos`);
    }

    private takePhotos(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let photosPaths: string[] = [];

            for (let photoIndex = 0; photoIndex < this.occurence; photoIndex++) {
                setTimeout(
                    () => {
                        let options1: RequestOptions = {
                            host: this.camera.hostname,
                            port: this.camera.port,
                            path: this.camera.stillImagePath,
                            headers: {
                                'Authorization': 'Basic ' + new Buffer(this.camera.user + ':' + this.camera.password).toString('base64')
                            }
                        };
                        http.get(options1, (response) => {
                            if (response.statusCode === 200) {
                                let photoPath = `${this.configuration.general.tempDir}/snapshot-${photoIndex}-${process.pid}.jpg`;
                                console.log(`Saving ${photoPath} ...`);
                                let photo = fs.createWriteStream(photoPath);
                                response.pipe(photo);
                                photosPaths.push(photoPath);
                            }
                        });
                    },
                    photoIndex * this.period
                );
            }

            setTimeout(
                () => {
                    resolve(photosPaths);
                },
                this.occurence * this.period + 1000
            );

        });
    }

    private clean(photos: string[]) {
        _.forEach(photos, (aPhotoPath) => {
            fs.unlink(aPhotoPath, (err) => {
                if (err) {
                    this.notifier.notify({
                        title: 'Impossible de supprimer une photo',
                        description: err.message
                    });
                }
            });
        });
    }

    private transformToGIF(photos: string[]): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let gif = new GifEncoder(this.camera.resolutionX, this.camera.resolutionY);
            let gifFilePath = `${this.configuration.general.tempDir}/${moment(this.processStartDate).format('DD-MM-YYYY')}.gif`;
            let file = require('fs').createWriteStream(gifFilePath);

            gif.pipe(file);
            gif.setQuality(10);
            gif.setDelay(33);
            gif.writeHeader();

            let addToGif = (images, counter = 0) => {
                console.log(`Adding ${images[counter]} to GIF ...`);
                getPixels(images[counter], (err, pixels) => {
                    gif.addFrame(pixels.data);
                    gif.read();
                    if (counter === images.length - 1) {
                        gif.finish();
                        resolve(gifFilePath);
                    } else {
                        addToGif(images, ++counter);
                    }
                });
            };
            addToGif(photos);
        });
    }

    generate(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.takePhotos().then((photos: string[]) => {
                this.transformToGIF(photos).then((gifFilePath) => {
                    this.clean(photos);
                    resolve(gifFilePath);
                });
            });
        });
    }
}