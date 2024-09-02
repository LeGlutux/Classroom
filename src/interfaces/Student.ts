export interface StudentInterface {
    id: string;
    name: string;
    surname: string;
    classes: string[];
    highlight: boolean;
    selected: boolean;
    comment?: string;
    crosses?: string[];
}