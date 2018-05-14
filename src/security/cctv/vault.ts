import {Configuration} from "../../configuration/configuration";
import * as fs from 'fs';
import {PathLike} from "fs";
import * as _ from "lodash";
import * as moment from 'moment';

export class Vault {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
    }

    private findYesterdayFiles(path: PathLike): string[] {

        let foundFiles;

        let yesterday00h00 = moment()
            .add(-1, 'days')
            .setMilliseconds(0)
            .setSeconds(0)
            .setMinutes(0)
            .setHours(0);
        let yesterday23h59 = moment()
            .add(-1, 'days')
            .setMilliseconds(999)
            .setSeconds(59)
            .setMinutes(59)
            .setHours(23);

        let walkSync = (dir, filelist) => {
            let files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach((file) => {
                let fileFullPath = dir + file;
                let fileStats = fs.statSync(fileFullPath);
                if (fileStats.isDirectory()) {
                    filelist = walkSync(fileFullPath + '/', filelist);
                } else {
                    if (moment(fileStats.birthtime).isBetween(yesterday00h00, yesterday23h59, null, '[]')) {
                        filelist.push(fileFullPath);
                    }
                }
            });
            return filelist;
        };

         return walkSync(path, foundFiles);
    }

    archiveYesterdayPhotos() {
        let yesterdayFiles = this.findYesterdayFiles(this.configuration.cctv.snapshotsDir);
        console.log(yesterdayFiles)
    }
}