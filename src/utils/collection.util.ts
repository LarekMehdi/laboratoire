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
}