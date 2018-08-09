import {IAppliance} from "../../common/appliance";

export abstract class Camera implements IAppliance{
    label: string;
    hostname: string;
    port: number;
    user: string;
    password: string;
    resolutionX: number;
    resolutionY: number;
    snapshotPath: string;
    canTriggerLight: boolean;
    canTriggerVoice: boolean;
    canTriggerNotification: boolean;

    abstract get stillImagePath();

    constructor(args: {
        label: string, 
        hostname: string, 
        port: number, 
        user: string, 
        password: string, 
        resolutionX: number, 
        resolutionY: number, 
        snapshotPath: string,
        canTriggerLight: boolean,
        canTriggerVoice: boolean,
        canTriggerNotification: boolean
    }) {
        this.label = args.label;
        this.hostname = args.hostname;
        this.port = args.port;
        this.user = args.user;
        this.password = args.password;
        this.resolutionX = args.resolutionX;
        this.resolutionY = args.resolutionY;
        this.snapshotPath = args.snapshotPath;
        this.canTriggerLight = args.canTriggerLight;
        this.canTriggerVoice = args.canTriggerVoice;
        this.canTriggerNotification = args.canTriggerNotification;
    }
}

export class AxisCamera extends Camera {
    get stillImagePath() {
        return '/jpg/image.jpg?size=3';
    }
}

export class FoscamCamera extends Camera {
    get stillImagePath() {
        return `/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=${this.user}&pwd=${encodeURIComponent(this.password)}`;
    }
}