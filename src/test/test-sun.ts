import {SunAPI} from "../meteo/data/sun-api";

let sun = new SunAPI();

sun.phases.then((sunPhases) => {
    console.log(sunPhases);
});

sun.isUp().then((isUp) => {
    console.log(`isUp:${isUp}`);
});

sun.isDown().then((isDown) => {
    console.log(`isDown:${isDown}`);
});