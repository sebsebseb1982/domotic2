import {MyNotification} from "./myNotification";

export interface INotifier {
    notify(notification:MyNotification);
}