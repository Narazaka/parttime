/** Creates a "PartTime" instance that represents a single moment in time with placeholder that is useful for compareing repeating moment. Currently, PartTime objects does not support timezones. */
declare class PartTime implements PartTime.TimeProps, PartTime.DateLike {
    /**
     * make a parttime
     * ```typescript
     * new PartTime()
     * new PartTime("*-10-12")
     * new PartTime("1970-1-1")
     * new PartTime("1970-1-1T00:*")
     * new PartTime("*:00:00.000")
     * new PartTime("*:*:30")
     * new PartTime("1970-1-1T00:00:00.000")
     * ```
     * @param time String value representing a parttime. The string should be in a format recognized by the PartTime.parse() method (yyyy-mm-ddT00:00:00.000).
     */
    constructor(time?: string | PartTime.TimeProps);
    /** such as 2014 */
    year?: number;
    /** 1-12 (not 0-11) */
    month?: number;
    /** 1-31 */
    date?: number;
    /** 0-24 */
    hour?: number;
    /** 0-59 */
    minute?: number;
    /** 0-59 */
    second?: number;
    /** 0-999 */
    millisecond?: number;
    private static _levels;
    /**
     * get parttime data from parttime string
     * @param timeString String value representing a parttime. The string should be in a format yyyy-mm-ddT00:00:00.000.
     * @return Hash data representing parttime.
     */
    static parse(timeString: string): PartTime.TimeProps;
    /** the year */
    getFullYear(): number | undefined;
    /** the month (0-11) */
    getMonth(): number | undefined;
    /** the date */
    getDate(): number | undefined;
    /** the hour */
    getHours(): number | undefined;
    /** the minutes */
    getMinutes(): number | undefined;
    /** the seconds */
    getSeconds(): number | undefined;
    /** the milliseconds */
    getMilliseconds(): number | undefined;
    /**
     * compare with DateLike
     *
     * if this < date then negative else if this > date then positive else 0
     * @param date_c Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     */
    compare(date_c: PartTime.DateLike | PartTime.TimeProps): number;
    /**
     * compare with DateLike
     *
     * if date1 < date2 then negative else if date1 > date2 then positive else 0
     * @param date1 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     * @param date2 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     */
    static compare(date1: PartTime.DateLike | PartTime.TimeProps, date2: PartTime.DateLike | PartTime.TimeProps): number;
    private elementToString;
    /** @return yyyy-mm-ddT00:00:00.000. */
    toString(): string;
    /** @return yyyy-mm-dd. */
    toDateString(): string;
    /** @return 00:00:00.000. */
    toTimeString(): string;
}
declare namespace PartTime {
    interface TimeProps {
        /** such as 2014 */
        year?: number;
        /** 1-12 (not 0-11) */
        month?: number;
        /** 1-31 */
        date?: number;
        /** 0-24 */
        hour?: number;
        /** 0-59 */
        minute?: number;
        /** 0-59 */
        second?: number;
        /** 0-999 */
        millisecond?: number;
    }
    interface DateLike {
        /** the year */
        getFullYear(): number | undefined;
        /** the month (0-11) */
        getMonth(): number | undefined;
        /** the date */
        getDate(): number | undefined;
        /** the hour */
        getHours(): number | undefined;
        /** the minutes */
        getMinutes(): number | undefined;
        /** the seconds */
        getSeconds(): number | undefined;
        /** the milliseconds */
        getMilliseconds(): number | undefined;
    }
}
export = PartTime;
