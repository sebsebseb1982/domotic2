export interface IHumidity {
    value: number;
    probe: string;
    batteryLevel?: number;
    status?: number;
    date: Date;
}