import {Configuration} from "../../configuration/configuration";
import * as fs from 'fs';
import {PathLike} from "fs";

export class Vault {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
    }

    private findFiles(path: PathLike): string[] {

        let foundFiles;

        let walkSync = (dir, filelist) => {
            let files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach((file) => {
                if (fs.statSync(dir + file).isDirectory()) {
                    filelist = walkSync(dir + file + '/', filelist);
                }
                else {
                    filelist.push(dir + file);
                }
            });
            return filelist;
        };

         return walkSync(path, foundFiles);
    }

    archiveYesterdayPhotos() {
        console.log(this.findFiles(this.configuration.cctv.snapshotsDir))
    }
}