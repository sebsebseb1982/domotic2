import {DB} from "../power-outlet/db";

let db = new DB();

db.getByCode('A1').then((outlet) => {
   outlet.impulse(5 * 1000);
});