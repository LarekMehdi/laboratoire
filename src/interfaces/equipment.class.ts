import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { HasId } from "./has-id.class";

export class Equipment implements HasId{
    id: string;
    name?: string;
    type: SAMPLE_TYPE;
    available: boolean;

    constructor(id: string, type: SAMPLE_TYPE, available: boolean, name?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.available = available;
    }
}