import * as cheerio from 'cheerio';
import * as request from 'request';
import {IMeteo} from "../model/meteo";

export class GenericMeteoScraper {

    meteoDuJour:Promise<IMeteo>;

    constructor(urlPageVille: string, selecteurCSS: string, encoding: string) {
        this.meteoDuJour = new Promise((resolve, reject) => {
            request.get(
                {
                    uri: urlPageVille,
                    encoding: encoding
                },
                (error, response, html) => {
                    let $ = cheerio.load(html);
                    resolve({
                        texte: $(selecteurCSS).text()
                    });
                }
            );
        });
    }
}