import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import {Camera} from "./../security/cctv/camera";

export interface IConfigurationHueBridge {
    username: string;
    timeOut: number;
}

export interface IConfigurationAVR {
    label: string;
    hostname: string;
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

export interface IConfigurationAPI {
    root: string;
    port: number;
    users: IUserConfiguration[];
}

export interface IUserConfiguration {
    name: string;
    token: string;
}

export interface IConfigurationRandomTuneEndPoint {
    tunePath: string;
    root: string;
    publicHostname: string;
    port: number;
}

export interface IConfigurationDoorBell {
    randomTune: IConfigurationRandomTuneEndPoint;
    buttonID: string;
}

export interface IConfigurationTimelapse {
    output: string;
}


export interface IconfigurationAlarm {
    user: string;
    password: string;
    hostname: string;
}

export interface IConfiguration {
    api: IConfigurationAPI;
    hue: IConfigurationHueBridge;
    avr: IConfigurationAVR;
    synology: IConfigurationSynology;
    toctoc: IConfigurationTocToc;
    thermospi: IConfigurationThermospi;
    adminMailAddress: string;
    smtp: SMTPTransport.Options;
    googleHome: IConfigurationGoogleHome;
    doorBell: IConfigurationDoorBell;
    cameras: Camera[];
    general: IGeneralConfiguration;
    cctv: ICCTVConfiguration;
    timelapse: IConfigurationTimelapse;
    alarm: IconfigurationAlarm;
}
