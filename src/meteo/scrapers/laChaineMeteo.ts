import * as cheerio from 'cheerio';
import * as request from 'request';
import {IMeteo} from "../model/meteo";

export class LaChaineMeteo {

    meteoDuJour:Promise<IMeteo>;

    constructor(private urlPageVille: string) {
        this.meteoDuJour = new Promise((resolve, reject) => {
            request.get(
                {
                    uri: urlPageVille,
                    encoding: 'binary'
                },
                (error, response, html) => {
                    let $ = cheerio.load(html);
                    resolve({
                        texte: $('#texte_description').text().trim().replace(/\s*/g, ' ')
                    });
                }
            );
        });
    }
}