import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/scrapers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoScraper} from "../meteo/scrapers/generic";

let googleHome = new GoogleHomeService();

googleHome.play('http://www.orangefreesounds.com/wp-content/uploads/2015/04/Birds-chirping-sound-morning-bird-sounds.mp3?_=1');


