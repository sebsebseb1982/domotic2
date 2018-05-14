import {Configuration} from "../../configuration/configuration";
import * as fs from 'fs';
import {PathLike} from "fs";
import * as _ from "lodash";
import * as moment from 'moment';
import * as mkdirp from 'mkdirp';

export class Vault {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
    }

    private findYesterdaySnapshots(path: PathLike): string[] {

        let foundFiles;

        let yesterday00h00 = moment()
            .add(-1, 'days')
            .milliseconds(0)
            .seconds(0)
            .minutes(0)
            .hours(0);
        let yesterday23h59 = moment()
            .add(-1, 'days')
            .milliseconds(999)
            .seconds(59)
            .minutes(59)
            .hours(23);

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

    archiveYesterdaySnaphots() {
        let yesterdaySnapshots = this.findYesterdaySnapshots(this.configuration.cctv.snapshotsDir);
        _.forEach(yesterdaySnapshots, (aYesterdaySnapshot) => {
            let newYesterdaySnapshotPath = aYesterdaySnapshot.replace(this.configuration.cctv.snapshotsDir, `${this.configuration.general.tempDir}cctv/`);
            mkdirp(
                newYesterdaySnapshotPath.substring(0, newYesterdaySnapshotPath.lastIndexOf("/")),
                (err, made) => {
                    fs.renameSync(aYesterdaySnapshot, newYesterdaySnapshotPath);
                    console.log(`Moving ${aYesterdaySnapshot} to ${newYesterdaySnapshotPath} ...`)
                }
            );
        });
    }
}