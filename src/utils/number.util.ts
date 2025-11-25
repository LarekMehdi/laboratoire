export abstract class UtilNumber {

    static roundOneDecimal(value: number): number {
        return parseFloat((value).toFixed(1));
    }
}