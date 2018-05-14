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

        let walkSync = (dir, filelist) => {
            let files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach((file) => {
                let fileFullPath = dir + file;
                let fileStats = fs.statSync(fileFullPath);
                if (fileStats.isDirectory()) {
                    filelist = walkSync(fileFullPath + '/', filelist);
                } else {
                    let maintenant = moment();
                    var quatreHeuresAuparavant = moment().add(-4, 'hours');

                    if (moment(fileStats.birthtime).isBetween(quatreHeuresAuparavant, maintenant, null, '[]')) {
                        filelist.push(fileFullPath);
                    }
                }
            });
            return filelist;
        };

         return walkSync(path, foundFiles);
    }

    archiveYesterdayPhotos() {
        console.log(this.findYesterdayFiles(this.configuration.cctv.snapshotsDir))
    }
}