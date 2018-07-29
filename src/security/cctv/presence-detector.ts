import {Snapshot} from "./snapshot";
import {Configuration} from "../../configuration/configuration";
import * as fs from 'fs';
import * as moment from 'moment';


export class PresenceDetector {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
    }

    getSnapshotForNLastMinutes(nLastMinutes: number): Snapshot[] {
        let nMinutesAgo = moment().add(nLastMinutes * -1, 'minutes');
        let snapshots = [];

        this.configuration.cameras.forEach(camera => {
            fs.readdirSync(camera.snapshotPath).forEach((file) => {
                let fileStats = fs.statSync(`${camera.snapshotPath}/${file}`);
  
                if (!fileStats.isDirectory() && moment(fileStats.birthtime).isAfter(nMinutesAgo)) {
                    snapshots.push({
                        camera: camera,
                        path: `${camera.snapshotPath}/${file}`,
                        date: fileStats.birthtime
                    });
                }
            });
        });

        return snapshots;
    }
}