export class MyNotification {
    constructor(title: string, description: string, priority?: number, url?: string) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.url = url;
    }

    title: string;
    description?: string;
    priority?: number;
    url?: string;
}