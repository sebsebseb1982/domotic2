import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import {Camera} from "./../security/cctv/camera";

export interface IConfigurationHueBridge {
    username: string;
    timeOut: number;
}

export interface IConfigurationAVR {
    hostname: string;
}

export interface IConfigurationNotifiyMyAndroid {
    hostname: string;
    port: number;
    apiKey: string;
}

export interface IConfigurationSynology {
    hostname: string;
    port: number;
    user: string;
    password: string;
}

export interface IMailAccount {
    address: string;
    password: string;
}

export interface IConfigurationThermospi {
    mailAccount: IMailAccount;
    mongoURL: string;
}

export interface IConfigurationTocToc {
    mailAccount: IMailAccount;
    scriptPath: string;
}

export interface IConfigurationGoogleHome {
    hostname: string;
    language: string;
}

export interface IGeneralConfiguration {
    tempDir:string;
}

export interface ICCTVConfiguration {
    snapshotsDir:string;
}

export interface IConfiguration {
    nma: IConfigurationNotifiyMyAndroid;
    hue: IConfigurationHueBridge;
    avr: IConfigurationAVR;
    synology: IConfigurationSynology;
    toctoc: IConfigurationTocToc;
    thermospi: IConfigurationThermospi;
    adminMailAddress: string;
    smtp: SMTPTransport.Options;
    googleHome: IConfigurationGoogleHome;
    cameras: Camera[];
    general: IGeneralConfiguration;
    cctv: ICCTVConfiguration;
}
