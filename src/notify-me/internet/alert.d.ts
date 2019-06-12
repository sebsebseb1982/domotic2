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

export interface IScheduledCron {
    id: string;
    cron:any;
}