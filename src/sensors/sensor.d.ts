export type TypeSensor = 'radio-temperature-humidity' | 'radio-temperature' | 'wired-temperature';
export type GeoLocation = 'maison' | 'exterieur' | 'cabanon' | 'congelateur';

export interface ISensor {
    id: string;
    label: string;
    type: TypeSensor;
    location: GeoLocation;
    path?: string;
    radio: boolean;
}