export type SensorType = 'radio-temperature-humidity' | 'radio-temperature' | 'wired-temperature';
export type SensorLocation = 'maison' | 'exterieur' | 'cabanon' | 'congelateur';

export interface ISensor {
    id: string;
    label: string;
    type: SensorType;
    location: SensorLocation;
    path?: string;
    radio: boolean;
}