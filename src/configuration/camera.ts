export abstract class AbstractConfigurationCamera {
    label: string;
    hostname: string;
    port: number;
    user: string;
    password: string;
    resolutionX: number;
    resolutionY: number;

    abstract get stillImagePath();

    constructor(label: string, hostname: string, port: number, user: string, password: string, resolutionX: number, resolutionY: number) {
        this.label = label;
        this.hostname = hostname;
        this.port = port;
        this.user = user;
        this.password = password;
        this.resolutionX = resolutionX;
        this.resolutionY = resolutionY;
    }
}

export class AxisCamera extends AbstractConfigurationCamera {
    get stillImagePath() {
        return '/jpg/image.jpg?size=3';
    }
}

export class FoscamCamera extends AbstractConfigurationCamera {
    get stillImagePath() {
        return `/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=${this.user}&pwd=${encodeURIComponent(this.password)}`;
    }
}