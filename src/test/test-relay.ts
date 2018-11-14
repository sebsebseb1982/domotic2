import {RelayDB} from "../relay/relay-db";

/*
let relayDB = new RelayDB();

relayDB.getByCode('k3').then((relay) => {

    console.log(relay);
});
*/
RelayDB.instance.getByCode('k3').then((relay) => {
    console.log(relay);
    RelayDB.instance.getByCode('k3').then((relay) => {
        console.log(relay);
        RelayDB.instance.getByCode('k3').then((relay) => {
            console.log(relay);
            RelayDB.instance.getByCode('k3').then((relay) => {
                console.log(relay);
            });
        });
    });
});
