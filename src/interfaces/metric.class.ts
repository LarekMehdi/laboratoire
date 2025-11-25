export class Metric {

    totalTime: number;
    efficiency: number;
    conflicts: number;

    constructor(totalTime: number, efficiency: number, conflicts: number) {
        this.totalTime = totalTime;
        this.efficiency = efficiency;
        this.conflicts = conflicts;
    }
}