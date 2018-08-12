import {DB} from "../relay/db";
import {IRelay} from "../relay/relayType";

let db = new DB();

db.getByCode('k4').then((relay:IRelay) => {
    console.log(relay);
});

db.getByCode('k3').then((relay:IRelay) => {
    console.log(relay);
});