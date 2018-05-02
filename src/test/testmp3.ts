import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {LaChaineMeteo} from "../meteo/scrapers/laChaineMeteo";
import {IMeteo} from "../meteo/model/meteo";
import {GenericMeteoScraper} from "../meteo/scrapers/generic";

let googleHome = new GoogleHomeService();

googleHome.playMedia('http://192.168.1.169:5000/fsdownload/webapi/file_download.cgi/01%20Seseragi.mp3?dlink=%222f6d757369632f4a524d656c6f646965732f30312053657365726167692e6d7033%22&noCache=1525294458816&_sharing_id=%22wAI0THCMH%22&api=SYNO.FolderSharing.Download&version=2&method=download&mode=download&stdhtml=false');


