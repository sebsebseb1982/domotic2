import {DB} from "../notify-me/lbc/db";
import {IRecherche} from "../notify-me/lbc/lbcType";

let db = new DB();

db.listerRecherches().then((recherches: IRecherche[]) => {
    console.log(recherches);
});