import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { HasId } from "../interfaces/has-id.interface";

export class Equipment implements HasId{
    id: string;
    name?: string;
    type: SAMPLE_TYPE;
    available?: boolean;

    compatibleTypes?: string[];
    capacity?: number;
    maintenanceWindow?: Date;
    cleaningTime?: number;

    constructor(id: string, type: SAMPLE_TYPE, name?: string, available?: boolean) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.available = available;
    }
}