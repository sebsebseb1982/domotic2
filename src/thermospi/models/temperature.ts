export interface ITemperature {
    value: number;
    probe: number;
    batteryLevel?: number;
    date: Date;
}