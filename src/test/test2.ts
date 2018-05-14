import {Vault} from "../security/cctv/vault";

let vault = new Vault();

// vault.archiveYesterdaySnaphots();



import * as fs from 'fs';

fs.readdirSync('/home/pi/node').forEach((file) => {
    let fileStats = fs.statSync(`/home/pi/node/${file}`);
    console.log(fileStats.birthtime);
});