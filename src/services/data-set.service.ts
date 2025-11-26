import { InputData } from "../classes/input-data.class";
import { OutputData } from "../classes/output-data.class";
import { intermediary1 } from "../inputs/intermediary.input";
import { inputSimple1, inputSimple2, inputSimple3, inputSimple4, inputSimple5, inputSimple6, inputSimple7, inputSimple8 } from "../inputs/simple.input";
import { RawInputData, RawIntermediaryInputData } from "../interfaces/raw.interface";
import { UtilMapper } from "../utils/mapper.util";
import { LabService } from "./lab.service";

export abstract class DatasetService {

    // SIMPLE

    static testDataset(): void {
        const rawInputs: RawInputData[] = [
            inputSimple1,
            inputSimple2,
            inputSimple3,
            inputSimple4,
            inputSimple5,
            inputSimple6,
            inputSimple7,
            inputSimple8,
        ];

        rawInputs.forEach((rawInput, index) => {
            const mapped: InputData = UtilMapper.mapInputData(rawInput);
            const result: OutputData = LabService.planifyLab(mapped);

            console.log(`result ${index + 1} => `, result);
        });
        
    }

    // INTERMEDAIRE

    static testIntermediaryDataset(): void {
        const rawInputs: RawIntermediaryInputData[] = [
            intermediary1
        ];

        rawInputs.forEach((rawInput, index) => {
            //const mapped: InputData = UtilMapper.mapIntermediaryInputData(rawInput);
        });
    }
}