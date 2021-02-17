export const pushif = (a: any[], cond: boolean, val: any) => {
    if (cond) {
        a.push(val);
    }
}