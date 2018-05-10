import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/scrapers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoScraper} from "../meteo/scrapers/generic";
import {ThermospiDB} from "../thermospi/db";

let googleHome = new GoogleHomeService();

/*
new LaChaineMeteo('http://france.lachainemeteo.com/meteo-france/ville/previsions-meteo-talence-5432-0.php').meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});
*/

/*
new GenericMeteoScraper({
    url: 'http://www.meteocity.com/france/talence_v33522/',
    selecteurCSS: '.dataDescription span:not(.linkHeureparheure)',
    encoding: 'utf8'
}).meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});
*/

let db = new ThermospiDB();
db.currentInsideTemperature;

googleHome.play('http://maison.sebastienblondy.com:28985/random-tune');