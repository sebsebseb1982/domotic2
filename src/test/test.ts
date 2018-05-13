import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/scrapers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoScraper} from "../meteo/scrapers/generic";
import {ThermospiDB} from "../thermospi/db";
import {VentilateHouse} from "../thermospi/ventilate-house";

//let googleHome = new GoogleHomeService();

/*
new LaChaineMeteo('http://france.lachainemeteo.com/meteo-france/ville/previsions-meteo-talence-5432-0.php').meteoDuJour.then((meteo:IMeteo) => {
    googleHome.say(meteo.texte);
});
*/

/*
new GenericMeteoScraper({
    url: 'http://www.meteocity.com/france/talence_v33522/',
    selecteurCSS: '.dataDescription span:not(.linkHeureparheure)',
    encoding: 'utf8'
}).meteoDuJour.then((meteo:IMeteo) => {
    googleHome.say(meteo.texte);
});
*/

//let ventilate = new VentilateHouse();
//ventilate.check();

//googleHome.play('http://maison.sebastienblondy.com:28985/random-tune');

var videoshow = require('videoshow')

var images = [
    '/home/pi/tmp/snapshot-198-30057.jpg.jpg',
    '/home/pi/tmp/snapshot-199-30057.jpg.jpg',
    '/home/pi/tmp/snapshot-200-30057.jpg.jpg',
    '/home/pi/tmp/snapshot-201-30057.jpg.jpg',
    '/home/pi/tmp/snapshot-202-30057.jpg.jpg',
    '/home/pi/tmp/snapshot-203-30057.jpg.jpg'
]

var videoOptions = {
    fps: 25,
    loop: 5, // seconds
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
}

videoshow(images, videoOptions)
    .save('video.mp4')
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