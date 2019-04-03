type TypeSensor = 'radio-temperature-humidity' | 'radio-temperature' | 'wired-temperature';

export interface ISensor {
    id: string;
    label: string;
    type: TypeSensor;
    path?: string;
    radio: boolean;
}