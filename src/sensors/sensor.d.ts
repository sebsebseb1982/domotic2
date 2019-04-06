export type SensorTag =
    'maison' |
    'exterieur' |
    'cabanon' |
    'congelateur' |
    'rdc' |
    'etage' |
    'radio' |
    'wired' |
    'temperature' |
    'humidity';

export interface ISensor {
    id: string;
    label: string;
    tags: SensorTag[];
    path?: string;
    radio: boolean;
}