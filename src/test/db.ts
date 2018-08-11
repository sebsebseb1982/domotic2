import {ThermospiDB} from "../thermospi/db";

let db = new ThermospiDB();

db.isWindowsOpened().then(
    (isWindowsOpened) => {
        console.log(isWindowsOpened);
    }, (tutu) => {
        console.log(`tutu:${tutu}`);
    }
);