import {Configuration} from "../../configuration/configuration";
import * as fs from 'fs';
import {PathLike} from "fs";
import * as _ from "lodash";
import * as moment from 'moment';
import * as mkdirp from 'mkdirp';
import * as archiver from 'archiver';

export class Vault {
    configuration: Configuration;
    yesterday23h59:  moment.Moment;

    constructor() {
        this.configuration = new Configuration();
        this.yesterday23h59 = moment()
            .add(-1, 'days')
            .milliseconds(999)
            .seconds(59)
            .minutes(59)
            .hours(23);
    }

    private findYesterdaySnapshots(path: PathLike): string[] {

        let foundFiles;

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
                    if (moment(fileStats.birthtime).isBefore(yesterday23h59)) {
                        filelist.push(fileFullPath);
                    }
                }
            });
            return filelist;
        };

        return walkSync(path, foundFiles);
    }

    private moveYesterdaySnapshotsToTmpFolder(yesterdaySnapshots: string[]) {
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

    private zipYesterdaySnaphots() {
        let output = fs.createWriteStream(`${this.configuration.cctv.snapshotsDir}${this.yesterday23h59.format('dd-mm-yyyy')}.zip`);
        let archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        output.on('end', function() {
            console.log('Data has been drained');
        });

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);

        archive.directory(`${this.configuration.general.tempDir}cctv/`, false);

        archive.finalize();
    }

    archiveYesterdaySnaphots() {
        let yesterdaySnapshots = this.findYesterdaySnapshots(this.configuration.cctv.snapshotsDir);
        this.moveYesterdaySnapshotsToTmpFolder(yesterdaySnapshots);
        this.zipYesterdaySnaphots();
    }
}