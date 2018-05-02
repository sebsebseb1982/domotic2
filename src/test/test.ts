import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/providers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";

let googleHome = new GoogleHomeService();

new LaChaineMeteo('http://france.lachainemeteo.com/meteo-france/ville/previsions-meteo-talence-5432-0.php').meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});



