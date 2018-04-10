export class MyNotification {
    constructor(title: string, description: string, priority?: number, url?: string) {
        this.title = encodeURIComponent(title);
        this.description = encodeURIComponent(description);
    }

    title: string;
    description?: string;
    priority?: number;
    url?: string;
}