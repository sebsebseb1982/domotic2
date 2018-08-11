import {NotifyPageChange} from "../notify-me/internet/notify-page-change";
import * as cheerio from "cheerio";

new NotifyPageChange(
    'PS4 édition limitée 500 millions',
    'http://www.micromania.fr/ps4/consoles/editions-speciales.html',
    (html: string) => {
        let $ = cheerio.load(html);
        return $('.products-grid li').length !== 5
    }
);