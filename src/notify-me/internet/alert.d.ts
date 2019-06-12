import {ScheduledTask} from "node-cron";

export interface IAlert {
    _id: any;
    name: string;
    url: string;
    lastValue: string;
    schedule: string;
    announceChange: boolean;
    cssSelector: string;
    field: any;
}

export interface IScheduledTask {
    alert: IAlert;
    task:ScheduledTask;
}