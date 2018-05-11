import {Configuration} from "../configuration/configuration";
import * as fs from 'fs';
import * as http from 'http';
import * as _ from "lodash";
import {INotifier} from "../notifications/notifier";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";

let videoshow = require('videoshow');

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

        console.log(`This timelapse will last less than ${Math.ceil((this.occurence * this.period) / (1000 * 60))} minutes and take ${this.occurence} photos`);
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

    private transformToVideo(photos: string[]) {
        var videoOptions = {
            fps: 25,
            loop: 5, // seconds
            transition: true,
            transitionDuration: 1, // seconds
            videoBitrate: 1024,
            videoCodec: 'mpeg4',
            size: '640x?',
            format: 'mp4',
            pixelFormat: 'yuv420p'
        };

        videoshow(photos, videoOptions)
            .save(`${this.configuration.general.tempDir}/video.mp4`)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
            })
            .on('end', function (output) {
                console.error('Video created in:', output)
            })
    }

    start() {
        this.takePhotos().then((photos: string[]) => {
            this.transformToVideo(photos);
            this.clean(photos);
        });
    }
}