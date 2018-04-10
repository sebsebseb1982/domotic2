export class Notification {
    constructor(title: string, description: string, priority?: number, url?: string);

    title: string;
    description?: string;
    priority?: number;
    url?: string;
}

export interface INotifier {
    notify(notification:Notification);
}