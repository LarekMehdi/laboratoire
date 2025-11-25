import { SAMPLE_TYPE } from "../constantes/sample-type.constante";

export class Equipment {
    id: string;
    name: string;
    type: SAMPLE_TYPE;
    available: boolean;

    constructor(id: string, name: string, type: SAMPLE_TYPE, available: boolean) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.available = available;
    }
}