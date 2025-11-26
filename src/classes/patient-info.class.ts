export class PatientInfo {

    age: number;
    service: string;
    diagnosis: string;

    constructor(age: number, service: string, diagnosis: string) {
        this.age = age;
        this.service = service;
        this.diagnosis = diagnosis;
    }
}