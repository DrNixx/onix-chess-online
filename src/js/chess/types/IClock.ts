export interface IClock {
    limit?: string,
    can_pause?: boolean,
    initial?: number,
    increment?: number,
    totalTime?: number
}