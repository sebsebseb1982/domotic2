import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/scrapers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoScraper} from "../meteo/scrapers/generic";

let googleHome = new GoogleHomeService();

googleHome.playMedia('~/JRMelodies/51\\ Hana\\ to\\ Sora.mp3');


