import mean from 'lodash/mean';

export const stdDeviation = (arr: number[]) => {
    const avg = mean(arr);
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        sum += Math.pow(arr[i] - avg, 2);
    }

    return Math.sqrt(sum / (arr.length - 1));
}