export function randomInt(_l: number = 0, _h: number = 100) {
    const l = Math.floor(_l);
    const h = Math.floor(_h);
    const n = h - l;
    const r = Math.random();

    const d = Math.floor(n * r);

    return l + d;
}

export function randomPick<T>(set: Iterable<T>) {
    const array = Array.from(set);
    const length = array.length;
    const indx = randomInt(0, length);

    return array[indx];
}
