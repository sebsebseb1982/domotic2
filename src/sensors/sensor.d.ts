export type SensorTag =
    'maison' |
    'chambre' |
    'exterieur' |
    'cabanon' |
    'congelateur' |
    'garage' |
    'cuisine' |
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