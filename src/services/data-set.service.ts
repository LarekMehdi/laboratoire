import { InputData } from "../classes/input-data.class";
import { OutputData } from "../classes/output-data.class";
import { inputSimple1, inputSimple2, inputSimple3, inputSimple4, inputSimple5, inputSimple6, inputSimple7, inputSimple8 } from "../inputs/simple.input";
import { UtilMapper } from "../utils/mapper.util";
import { LabService } from "./lab.service";

export abstract class DatasetService {

    static testDataset(): void {
        // jeux de test
        // TODO: for each
        const simpleInput1: InputData = UtilMapper.mapInputData(inputSimple1);
        const simpleInput2: InputData = UtilMapper.mapInputData(inputSimple2);
        const simpleInput3: InputData = UtilMapper.mapInputData(inputSimple3);
        const simpleInput4: InputData = UtilMapper.mapInputData(inputSimple4);
        const simpleInput5: InputData = UtilMapper.mapInputData(inputSimple5);
        const simpleInput6: InputData = UtilMapper.mapInputData(inputSimple6);
        const simpleInput7: InputData = UtilMapper.mapInputData(inputSimple7);
        const simpleInput8: InputData = UtilMapper.mapInputData(inputSimple8);

        const result1: OutputData = LabService.planifyLab(simpleInput1);
        const result2: OutputData = LabService.planifyLab(simpleInput2);
        const result3: OutputData = LabService.planifyLab(simpleInput3);
        const result4: OutputData = LabService.planifyLab(simpleInput4);
        const result5: OutputData = LabService.planifyLab(simpleInput5);
        const result6: OutputData = LabService.planifyLab(simpleInput6);
        const result7: OutputData = LabService.planifyLab(simpleInput7);
        const result8: OutputData = LabService.planifyLab(simpleInput8);

        console.log('result 1 => ', result1);
        console.log('result 2 => ', result2);
        console.log('result 3 => ', result3);
        console.log('result 4 => ', result4);
        console.log('result 5 => ', result5);
        console.log('result 6 => ', result6);
        console.log('result 7 => ', result7);
        console.log('result 8 => ', result8);
    }
}