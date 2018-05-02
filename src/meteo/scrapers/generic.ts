import * as cheerio from 'cheerio';
import * as request from 'request';
import {IMeteo, IMeteoSource} from "../model/meteo";

export class GenericMeteoScraper {

    meteoDuJour:Promise<IMeteo>;

    constructor(sourceMeteo: IMeteoSource) {
        this.meteoDuJour = new Promise((resolve, reject) => {
            request.get(
                {
                    uri: sourceMeteo.url,
                    encoding: sourceMeteo.encoding
                },
                (error, response, html) => {
                    let $ = cheerio.load(html);
                    resolve({
                        texte: $(sourceMeteo.selecteurCSS).text()
                    });
                }
            );
        });
    }
}