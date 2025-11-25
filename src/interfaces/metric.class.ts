export class Metric {

    totalTime: number;
    efficiency: number;
    conflict: number;

    constructor(totalTime: number, efficiency: number, conflict: number) {
        this.totalTime = totalTime;
        this.efficiency = efficiency;
        this.conflict = conflict;
    }
}