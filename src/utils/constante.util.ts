import { SAMPLE_TYPE } from "../constantes/sample-type.constante";
import { SPECIALITY } from "../constantes/speciality.constante";

export abstract class UtilConstante {

    // retourne SPECIALITY adapté a SAMPLE_TYPE
    static findTechnicianSpecialityForSampleType(sampleType: SAMPLE_TYPE) {
        switch(sampleType) {
            case SAMPLE_TYPE.BLOOD: return SPECIALITY.BLOOD;
            case SAMPLE_TYPE.TISSUE: return SPECIALITY.TISSUE;
            case SAMPLE_TYPE.URINE: return SPECIALITY.URINE;
            default: return SPECIALITY.GENERAL;
        }
    }
}