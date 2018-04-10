export interface IConfigurationHueBridge {
    username: string;
    timeOut: number;
}

export interface IConfigurationNotifiyMyAndroid {
    hostname: string;
    port: number;
    apiKey: string;
}

export interface IConfiguration {
    nma:IConfigurationNotifiyMyAndroid;
    hue:IConfigurationHueBridge;
}
