/* (C) 2014 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2014 */

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
class PartTime implements TimeProps, DateLike {
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
	constructor(timeString?: string) {
		if (timeString) {
			const time = PartTime.parse(timeString);
			for (const name of Object.keys(time) as Array<keyof TimeProps>) {
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
	private static _levels: Array<keyof TimeProps> = ["millisecond", "second", "minute", "hour", "date", "month", "year"];
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
		const parttime: TimeProps = {}
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
	 * @param date_c Date or DateLike (has getFullYear, getMonth, ... getMilliseconds)
	 */
	compare(date_c: DateLike) {
        const year = this.getFullYear();
        const year_cmp = date_c.getFullYear();
        if ((year != null) && (year_cmp != null)) {
            const diff = year - year_cmp;
            if (diff) {
                return diff;
            }
        }
        const month = this.getMonth();
        const month_cmp = date_c.getMonth();
        if ((month != null) && (month_cmp != null)) {
            const diff = month - month_cmp;
            if (diff) {
                return diff;
            }
        }
        const date = this.getDate();
        const date_cmp = date_c.getDate();
        if ((date != null) && (date_cmp != null)) {
            const diff = date - date_cmp;
            if (diff) {
                return diff;
            }
        }
        const hour = this.getHours();
        const hour_cmp = date_c.getHours();
        if ((hour != null) && (hour_cmp != null)) {
            const diff = hour - hour_cmp;
            if (diff) {
                return diff;
            }
        }
        const minute = this.getMinutes();
        const minute_cmp = date_c.getMinutes();
        if ((minute != null) && (minute_cmp != null)) {
            const diff = minute - minute_cmp;
            if (diff) {
                return diff;
            }
        }
        const second = this.getSeconds();
        const second_cmp = date_c.getSeconds();
        if ((second != null) && (second_cmp != null)) {
            const diff = second - second_cmp;
            if (diff) {
                return diff;
            }
        }
        const millisecond = this.getMilliseconds();
        const millisecond_cmp = date_c.getMilliseconds();
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
		return `${this.elementToString(this.year)}-${this.elementToString(this.month, 2)}-${this.elementToString(this.date, 2)}T${this.elementToString(this.hour, 2)}:${this.elementToString(this.minute, 2)}:${this.elementToString(this.second, 2)}.${this.elementToString(this.millisecond, 3)}`;
	}
}

export = PartTime;