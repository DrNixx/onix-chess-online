export const pluralize = (num: number, strOne: string, strTwo: string, strFive: string) => {
    strFive = strFive || strTwo;

    if ((strTwo === strFive) && (num > 1)) {
        return strTwo;
    }

    if ((num > 10) && (num < 20)) {
        return strFive;
    }

    var d = num % 10;
    if (d === 1) {
        return strOne;
    } else if ((d < 5) && (d !== 0)) {
        return strTwo;
    } else {
        return strFive;
    }
}