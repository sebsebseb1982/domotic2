export abstract class AbstractConfigurationCamera {
    label: string;
    hostname: string;
    port: number;
    user: string;
    password: string;
    resolutionX: number;
    resolutionY: number;

    abstract get stillImageUrl();

    constructor(
        private label: string,
        private hostname: string,
        private port: number,
        private user: string,
        private password: string,
        private resolutionX: number,
        private resolutionY: number
    ) {}
}

export class AxisCamera extends AbstractConfigurationCamera {
    get stillImageUrl() {
        return `http://${this.user}:${encodeURI(this.password)}@${this.hostname}:${this.port}/jpg/image.jpg?size=3`;
    }
}

export class FoscamCamera extends AbstractConfigurationCamera {
    get stillImageUrl() {
        return `http://${this.hostname}:${this.port}/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=${this.user}&pwd=${encodeURI(this.password)}`;
    }
}