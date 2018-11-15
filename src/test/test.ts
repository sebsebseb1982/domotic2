import {ClientAPIDomotic} from "../api/domotic/client-api-domotic";

let client = new ClientAPIDomotic();

client.setPowerOutletState('A4', false);