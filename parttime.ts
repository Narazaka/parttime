/* (C) 2019 Narazaka : Licensed under The MIT License - https://narazaka.net/license/Zlib?2019 */

/** Creates a "PartTime" instance that represents a single moment in time with placeholder that is useful for compareing repeating moment. Currently, PartTime objects does not support timezones. */
class PartTime implements PartTime.TimeProps, PartTime.DateLike {
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
	constructor(time?: string | PartTime.TimeProps) {
		if (time) {
			if (typeof time === "string") time = PartTime.parse(time);
			for (const name of Object.keys(time) as Array<keyof PartTime.TimeProps>) {
				this[name] = time[name];
			}
		}
	}
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
	private static _levels: Array<keyof PartTime.TimeProps> = ["millisecond", "second", "minute", "hour", "date", "month", "year"];
	/**
	 * get parttime data from parttime string
	 * @param timeString String value representing a parttime. The string should be in a format yyyy-mm-ddT00:00:00.000.
	 * @return Hash data representing parttime.
	 */
	static parse(timeString: string) {
		let date = null;
		let time = null;
		// separate date and time
		let result: RegExpMatchArray | null = null;
		if (result = timeString.match(/^([\d\-*]+)T([\d:*.]+)$/)) {
			date = result[1]
			time = result[2]
		} else if (result = timeString.match(/^([\d\-*]+)$/)) {
			date = result[1]
		} else if (result = timeString.match(/^T?([\d:*.]+)$/)) {
			time = result[1]
		} else {
			throw "Invalid Time"
		}
		// parse date and time
		const parttime: PartTime.TimeProps = {}
		if (date) {
			result = null;
			if (result = date.match(/^(?:([\d]+|\*)-)?([\d]+|\*)-([\d]+|\*)$/)) {
				if (result[1] != null && result[1] != "*") parttime.year = Math.floor(Number(result[1]));
				if (result[2] != "*") parttime.month = Math.floor(Number(result[2]));
				if (result[3] != "*") parttime.date = Math.floor(Number(result[3]));
			} else {
				throw "Invalid Time";
			}
		}
		if (time) {
			result = null;
			if (result = time.match(/^([\d]+|\*):([\d]+|\*)(?::([\d]+|\*)(?:\.([\d]+|\*))?)?$/)) {
				if (result[1] != "*") parttime.hour = Math.floor(Number(result[1]));
				if (result[2] != "*") parttime.minute = Math.floor(Number(result[2]));
				if (result[3] != null && result[3] != "*") parttime.second = Math.floor(Number(result[3]));
				if (result[4] != null && result[4] != "*") parttime.millisecond = Math.floor(Number(result[4]));
			} else {
				throw "Invalid Time";
			}
		}
		// validate if it is one part
		// set defined range
		let part_state = 0;
		for (let index = 0; index < this._levels.length; ++index) {
			const name = this._levels[index];
			if ((part_state % 2) == 0) {
				if (parttime[name] != null) {
					part_state++
				}
			} else {
				if (parttime[name] == null) {
					part_state++;
				}
			}
		}
		if (part_state > 2) {
			throw "Invalid PartTime : two part (such as 2014-*-12) is not allowed.";
		}

		return parttime;
	}
	/** the year */
	getFullYear() { return this.year; }
	/** the month (0-11) */
	getMonth() { return this.month == null ? undefined : this.month - 1; }
	/** the date */
	getDate() { return this.date; }
	/** the hour */
	getHours() { return this.hour; }
	/** the minutes */
	getMinutes() { return this.minute; }
	/** the seconds */
	getSeconds() { return this.second; }
	/** the milliseconds */
	getMilliseconds() { return this.millisecond; }
	/**
	 * compare with DateLike
	 *
	 * if this < date then negative else if this > date then positive else 0
	 * @param date_c Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
	 */
	compare(date_c: PartTime.DateLike | PartTime.TimeProps) {
		return PartTime.compare(this, date_c);
	}
	/**
	 * compare with DateLike
	 *
	 * if date1 < date2 then negative else if date1 > date2 then positive else 0
	 * @param date1 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
	 * @param date2 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
	 */
	static compare(date1: PartTime.DateLike | PartTime.TimeProps, date2: PartTime.DateLike | PartTime.TimeProps) {
        const year = "getFullYear" in date1 ? date1.getFullYear() : date1.year;
        const year_cmp = "getFullYear" in date2 ? date2.getFullYear() : date2.year;
        if ((year != null) && (year_cmp != null)) {
            const diff = year - year_cmp;
            if (diff) {
                return diff;
            }
        }
        const month = "getMonth" in date1 ? date1.getMonth() : (date1.month ? date1.month - 1 : date1.month);
        const month_cmp = "getMonth" in date2 ? date2.getMonth() : (date2.month ? date2.month - 1 : date2.month);
        if ((month != null) && (month_cmp != null)) {
            const diff = month - month_cmp;
            if (diff) {
                return diff;
            }
        }
        const date = "getDate" in date1 ? date1.getDate() : date1.date;
        const date_cmp = "getDate" in date2 ? date2.getDate() : date2.date;
        if ((date != null) && (date_cmp != null)) {
            const diff = date - date_cmp;
            if (diff) {
                return diff;
            }
        }
        const hour = "getHours" in date1 ? date1.getHours() : date1.hour;
        const hour_cmp = "getHours" in date2 ? date2.getHours() : date2.hour;
        if ((hour != null) && (hour_cmp != null)) {
            const diff = hour - hour_cmp;
            if (diff) {
                return diff;
            }
        }
        const minute = "getMinutes" in date1 ? date1.getMinutes() : date1.minute;
        const minute_cmp = "getMinutes" in date2 ? date2.getMinutes() : date2.minute;
        if ((minute != null) && (minute_cmp != null)) {
            const diff = minute - minute_cmp;
            if (diff) {
                return diff;
            }
        }
        const second = "getSeconds" in date1 ? date1.getSeconds() : date1.second;
        const second_cmp = "getSeconds" in date2 ? date2.getSeconds() : date2.second;
        if ((second != null) && (second_cmp != null)) {
            const diff = second - second_cmp;
            if (diff) {
                return diff;
            }
        }
        const millisecond = "getMilliseconds" in date1 ? date1.getMilliseconds() : date1.millisecond;
        const millisecond_cmp = "getMilliseconds" in date2 ? date2.getMilliseconds() : date2.millisecond;
        if ((millisecond != null) && (millisecond_cmp != null)) {
            const diff = millisecond - millisecond_cmp;
            if (diff) {
                return diff;
            }
        }
        return 0;
    }
	private elementToString(element?: number, padding = 0) { return element != null ? (Array(padding + 1).join("0") + element).slice(-padding) : "*" }
	/** @return yyyy-mm-ddT00:00:00.000. */
	toString() {
		return `${this.toDateString()}T${this.toTimeString()}`;
	}
	/** @return yyyy-mm-dd. */
	toDateString() {
		return `${this.elementToString(this.year)}-${this.elementToString(this.month, 2)}-${this.elementToString(this.date, 2)}`;
	}
	/** @return 00:00:00.000. */
	toTimeString() {
		return `${this.elementToString(this.hour, 2)}:${this.elementToString(this.minute, 2)}:${this.elementToString(this.second, 2)}.${this.elementToString(this.millisecond, 3)}`;
	}
}

namespace PartTime {
	export interface TimeProps {
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

	export interface DateLike {
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
