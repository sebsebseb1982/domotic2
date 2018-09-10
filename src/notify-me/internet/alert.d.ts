export interface Alert {
    _id: any;
    name: string;
    url: string;
    lastValue: string;
    announceChange: boolean;
    cssSelector: string;
    field: any;
}