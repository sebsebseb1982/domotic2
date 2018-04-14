import {IHueLamp} from "./hue";

interface IHueLamps {
    [key: string]:IHueLamp;
}

export const lamps: IHueLamps = {
    salon : {
        id:1,
        label:'Salon'
    },
    chevetSebastien : {
        id:3,
        label:'Chevet Sébastien'
    },
    bureau : {
        id:2,
        label:'Bureau'
    },
};