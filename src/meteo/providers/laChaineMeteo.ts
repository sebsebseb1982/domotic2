import * as cheerio from 'cheerio';
import {IMeteo} from "../model/meteo";

export class LaChaineMeteo {
    constructor(private urlPageVille: string) {
        cheerio.load();
    }

    get meteoDuJour():IMeteo {
        return {
            texte:'tutu'
        }
    }
}