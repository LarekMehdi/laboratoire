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
    cleaningTime?: 10;

    constructor(id: string, type: SAMPLE_TYPE, available: boolean, name?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.available = available;
    }
}