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
/** Creates a "PartTime" instance that represents a single moment in time with placeholder that is useful for compareing repeating moment. Currently, PartTime objects does not support timezones. */
declare class PartTime implements TimeProps, DateLike {
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
     * @param timeString String value representing a parttime. The string should be in a format recognized by the PartTime.parse() method (yyyy-mm-ddT00:00:00.000).
     */
    constructor(timeString?: string);
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
    static parse(timeString: string): TimeProps;
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
     * @param date_c Date or DateLike (has getFullYear, getMonth, ... getMilliseconds)
     */
    compare(date_c: DateLike): number;
    private elementToString;
    /** @return yyyy-mm-ddT00:00:00.000. */
    toString(): string;
}
export = PartTime;
