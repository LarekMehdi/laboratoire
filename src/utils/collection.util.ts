import { ScheduleSlot } from "../interfaces/schedule-slot.interface";

export abstract class UtilCollection {

    // retourne une map indexée par l'attribut choisi
    static groupBy<T, K>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {

        const map: Map<K, T[]> = new Map<K, T[]>();
        for (const item of items) {
            const key = keyFn(item);
            const itemList = map.get(key) ?? [];
            itemList.push(item);
            map.set(key, itemList);
        }
        return map;
    }

    // tris une list sur l'attribut choisi
    static sortBy<T, K>(items: T[], keyFn: (item: T) => K, asc?: true): T[] {
        const sorted: T[] = items.slice().sort((a, b) => {
            const valA = keyFn(a);
            const valB = keyFn(b);

            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
        });
        return sorted;
    }

    // retourne la premiere ressource dispo sur un slot donné
    static pickResourceForSlot<T extends { id: string }>(resources: T[], slot: ScheduleSlot, occupied: Map<string, ScheduleSlot[]>): T {
        const available: T | undefined = resources.find(r => (occupied.get(r.id) ?? []).every(s => slot.end <= s.start || slot.start >= s.end));
        if (!available) throw new Error(`No resource available for slot ${slot.start.toISOString()} - ${slot.end.toISOString()}`);
        
        return available;
    }
}