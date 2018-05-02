import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/providers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoProvider} from "../meteo/providers/generic";

let googleHome = new GoogleHomeService();

/*new LaChaineMeteo('http://france.lachainemeteo.com/meteo-france/ville/previsions-meteo-talence-5432-0.php').meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});*/

new GenericMeteoProvider('http://www.meteocity.com/france/talence_v33522/', '.dataDescription span:not[class=linkHeureparheure]').meteoDuJour.then((meteo:IMeteo) => {
    googleHome.speak(meteo.texte);
});


