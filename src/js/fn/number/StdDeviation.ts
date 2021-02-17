import mean from 'lodash/mean';

export const stdDeviation = (arr: number[]) => {
    var avg = mean(arr), sum = 0;

    for (var i = 0; i < arr.length; i++) {
        sum += Math.pow(arr[i] - avg, 2);
    }

    return Math.sqrt(sum / (arr.length - 1));
}