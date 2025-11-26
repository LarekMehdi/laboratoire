import { Constraint } from "./constraint.class";
import { Equipment } from "./equipment.class";
import { Laboratory } from "./laboratory.class";
import { Sample } from "./sample.class";
import { Technician } from "./technician.class";

export class InputData {

    constructor(public samples: Sample[], public technicians: Technician[], public equipment: Equipment[], public laboratory?: Laboratory, public constraints?: Constraint){}
    
}