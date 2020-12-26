export namespace TimeSpan {
    export interface ITimeSpan {
        seconds?: number;
        min?: number;
        hours?: number;
        days?: number;
        month?: number;
        years?: number;
    }

    export function toMillieSeconds(timeSpan: ITimeSpan): number {
        return toSeconds(timeSpan) * 1000;
    }
    export function toSeconds(timeSpan: ITimeSpan): number {
        return toMinutes(timeSpan) * 60 + (timeSpan.seconds || 0);
    }
    export function toMinutes(timeSpan: ITimeSpan): number {
        return toHours(timeSpan) * 60 + (timeSpan.min || 0);
    }
    export function toHours(timeSpan: ITimeSpan): number {
        return toDays(timeSpan) * 24 + (timeSpan.hours || 0);
    }
    export function toDays(timeSpan: ITimeSpan): number {
        return toMonth(timeSpan) * 30 + (timeSpan.days || 0);
    }
    export function toMonth(timeSpan: ITimeSpan): number {
        return toYears(timeSpan) * 12 + (timeSpan.month || 0);
    }
    export function toYears(timeSpan: ITimeSpan): number {
        return timeSpan.years || 0;
    }
}