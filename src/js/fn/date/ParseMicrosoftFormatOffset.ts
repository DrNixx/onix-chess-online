import toSafeInteger from 'lodash/toSafeInteger';

export const parseMicrosoftFormatOffset = (offset: string) => {
    var sign = offset.substr(0, 1) === "-" ? -1 : 1;

    offset = offset.substring(1);
    const result = (toSafeInteger(offset.substr(0, 2)) * 60) + toSafeInteger(offset.substring(2));

    return sign * result;
}