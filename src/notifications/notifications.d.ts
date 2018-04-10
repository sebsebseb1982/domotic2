export class Notification {
    title: string;
    description?: string;
    priority?: number;
    url?: string;
}

export interface INotifier {
    notify(notification:Notification);
}