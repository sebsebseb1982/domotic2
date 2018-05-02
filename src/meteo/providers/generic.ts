import * as cheerio from 'cheerio';
import * as request from 'request';
import {IMeteo} from "../model/meteo";

export class GenericMeteoProvider {

    meteoDuJour:Promise<IMeteo>;

    constructor(urlPageVille: string, selecteurCSS: string) {
        this.meteoDuJour = new Promise((resolve, reject) => {
            request.get(
                {
                    uri: urlPageVille,
                    encoding: 'binary'
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