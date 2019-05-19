(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PartTime = f()}})(function(){var define,module,exports;module={exports:(exports={})};
"use strict";
/* (C) 2019 Narazaka : Licensed under The MIT License - https://narazaka.net/license/Zlib?2019 */
/** Creates a "PartTime" instance that represents a single moment in time with placeholder that is useful for compareing repeating moment. Currently, PartTime objects does not support timezones. */
var PartTime = /** @class */ (function () {
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
    function PartTime(time) {
        if (time) {
            if (typeof time === "string")
                time = PartTime.parse(time);
            for (var _i = 0, _a = Object.keys(time); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                this[name_1] = time[name_1];
            }
        }
    }
    /**
     * get parttime data from parttime string
     * @param timeString String value representing a parttime. The string should be in a format yyyy-mm-ddT00:00:00.000.
     * @return Hash data representing parttime.
     */
    PartTime.parse = function (timeString) {
        var date = null;
        var time = null;
        // separate date and time
        var result = null;
        if (result = timeString.match(/^([\d\-*]+)T([\d:*.]+)$/)) {
            date = result[1];
            time = result[2];
        }
        else if (result = timeString.match(/^([\d\-*]+)$/)) {
            date = result[1];
        }
        else if (result = timeString.match(/^T?([\d:*.]+)$/)) {
            time = result[1];
        }
        else {
            throw "Invalid Time";
        }
        // parse date and time
        var parttime = {};
        if (date) {
            result = null;
            if (result = date.match(/^(?:([\d]+|\*)-)?([\d]+|\*)-([\d]+|\*)$/)) {
                if (result[1] != null && result[1] != "*")
                    parttime.year = Math.floor(Number(result[1]));
                if (result[2] != "*")
                    parttime.month = Math.floor(Number(result[2]));
                if (result[3] != "*")
                    parttime.date = Math.floor(Number(result[3]));
            }
            else {
                throw "Invalid Time";
            }
        }
        if (time) {
            result = null;
            if (result = time.match(/^([\d]+|\*):([\d]+|\*)(?::([\d]+|\*)(?:\.([\d]+|\*))?)?$/)) {
                if (result[1] != "*")
                    parttime.hour = Math.floor(Number(result[1]));
                if (result[2] != "*")
                    parttime.minute = Math.floor(Number(result[2]));
                if (result[3] != null && result[3] != "*")
                    parttime.second = Math.floor(Number(result[3]));
                if (result[4] != null && result[4] != "*")
                    parttime.millisecond = Math.floor(Number(result[4]));
            }
            else {
                throw "Invalid Time";
            }
        }
        // validate if it is one part
        // set defined range
        var part_state = 0;
        for (var index = 0; index < this._levels.length; ++index) {
            var name_2 = this._levels[index];
            if ((part_state % 2) == 0) {
                if (parttime[name_2] != null) {
                    part_state++;
                }
            }
            else {
                if (parttime[name_2] == null) {
                    part_state++;
                }
            }
        }
        if (part_state > 2) {
            throw "Invalid PartTime : two part (such as 2014-*-12) is not allowed.";
        }
        return parttime;
    };
    /** the year */
    PartTime.prototype.getFullYear = function () { return this.year; };
    /** the month (0-11) */
    PartTime.prototype.getMonth = function () { return this.month == null ? undefined : this.month - 1; };
    /** the date */
    PartTime.prototype.getDate = function () { return this.date; };
    /** the hour */
    PartTime.prototype.getHours = function () { return this.hour; };
    /** the minutes */
    PartTime.prototype.getMinutes = function () { return this.minute; };
    /** the seconds */
    PartTime.prototype.getSeconds = function () { return this.second; };
    /** the milliseconds */
    PartTime.prototype.getMilliseconds = function () { return this.millisecond; };
    /**
     * compare with DateLike
     *
     * if this < date then negative else if this > date then positive else 0
     * @param date_c Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     */
    PartTime.prototype.compare = function (date_c) {
        return PartTime.compare(this, date_c);
    };
    /**
     * equals with DateLike
     *
     * @param date_c Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     */
    PartTime.prototype.equals = function (date_c) {
        return PartTime.equals(this, date_c);
    };
    /**
     * compare with DateLike
     *
     * if date1 < date2 then negative else if date1 > date2 then positive else 0
     * @param date1 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     * @param date2 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     */
    PartTime.compare = function (date1, date2) {
        var year = "getFullYear" in date1 ? date1.getFullYear() : date1.year;
        var year_cmp = "getFullYear" in date2 ? date2.getFullYear() : date2.year;
        if ((year != null) && (year_cmp != null)) {
            var diff = year - year_cmp;
            if (diff) {
                return diff;
            }
        }
        var month = "getMonth" in date1 ? date1.getMonth() : (date1.month ? date1.month - 1 : date1.month);
        var month_cmp = "getMonth" in date2 ? date2.getMonth() : (date2.month ? date2.month - 1 : date2.month);
        if ((month != null) && (month_cmp != null)) {
            var diff = month - month_cmp;
            if (diff) {
                return diff;
            }
        }
        var date = "getDate" in date1 ? date1.getDate() : date1.date;
        var date_cmp = "getDate" in date2 ? date2.getDate() : date2.date;
        if ((date != null) && (date_cmp != null)) {
            var diff = date - date_cmp;
            if (diff) {
                return diff;
            }
        }
        var hour = "getHours" in date1 ? date1.getHours() : date1.hour;
        var hour_cmp = "getHours" in date2 ? date2.getHours() : date2.hour;
        if ((hour != null) && (hour_cmp != null)) {
            var diff = hour - hour_cmp;
            if (diff) {
                return diff;
            }
        }
        var minute = "getMinutes" in date1 ? date1.getMinutes() : date1.minute;
        var minute_cmp = "getMinutes" in date2 ? date2.getMinutes() : date2.minute;
        if ((minute != null) && (minute_cmp != null)) {
            var diff = minute - minute_cmp;
            if (diff) {
                return diff;
            }
        }
        var second = "getSeconds" in date1 ? date1.getSeconds() : date1.second;
        var second_cmp = "getSeconds" in date2 ? date2.getSeconds() : date2.second;
        if ((second != null) && (second_cmp != null)) {
            var diff = second - second_cmp;
            if (diff) {
                return diff;
            }
        }
        var millisecond = "getMilliseconds" in date1 ? date1.getMilliseconds() : date1.millisecond;
        var millisecond_cmp = "getMilliseconds" in date2 ? date2.getMilliseconds() : date2.millisecond;
        if ((millisecond != null) && (millisecond_cmp != null)) {
            var diff = millisecond - millisecond_cmp;
            if (diff) {
                return diff;
            }
        }
        return 0;
    };
    /**
     * equals with DateLike
     *
     * @param date1 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     * @param date2 Date, DateLike (has getFullYear, getMonth, ... getMilliseconds) or TimeProps
     */
    PartTime.equals = function (date1, date2) {
        var year = "getFullYear" in date1 ? date1.getFullYear() : date1.year;
        var year_cmp = "getFullYear" in date2 ? date2.getFullYear() : date2.year;
        if (!valueEquals(year, year_cmp))
            return false;
        var month = "getMonth" in date1 ? date1.getMonth() : (date1.month ? date1.month - 1 : date1.month);
        var month_cmp = "getMonth" in date2 ? date2.getMonth() : (date2.month ? date2.month - 1 : date2.month);
        if (!valueEquals(month, month_cmp))
            return false;
        var date = "getDate" in date1 ? date1.getDate() : date1.date;
        var date_cmp = "getDate" in date2 ? date2.getDate() : date2.date;
        if (!valueEquals(date, date_cmp))
            return false;
        var hour = "getHours" in date1 ? date1.getHours() : date1.hour;
        var hour_cmp = "getHours" in date2 ? date2.getHours() : date2.hour;
        if (!valueEquals(hour, hour_cmp))
            return false;
        var minute = "getMinutes" in date1 ? date1.getMinutes() : date1.minute;
        var minute_cmp = "getMinutes" in date2 ? date2.getMinutes() : date2.minute;
        if (!valueEquals(minute, minute_cmp))
            return false;
        var second = "getSeconds" in date1 ? date1.getSeconds() : date1.second;
        var second_cmp = "getSeconds" in date2 ? date2.getSeconds() : date2.second;
        if (!valueEquals(second, second_cmp))
            return false;
        var millisecond = "getMilliseconds" in date1 ? date1.getMilliseconds() : date1.millisecond;
        var millisecond_cmp = "getMilliseconds" in date2 ? date2.getMilliseconds() : date2.millisecond;
        if (!valueEquals(millisecond, millisecond_cmp))
            return false;
        return true;
    };
    PartTime.prototype.elementToString = function (element, padding) {
        if (padding === void 0) { padding = 0; }
        return element != null ? (Array(padding + 1).join("0") + element).slice(-padding) : "*";
    };
    /** @return yyyy-mm-ddT00:00:00.000. */
    PartTime.prototype.toString = function () {
        return this.toDateString() + "T" + this.toTimeString();
    };
    /** @return yyyy-mm-dd. */
    PartTime.prototype.toDateString = function () {
        return this.elementToString(this.year) + "-" + this.elementToString(this.month, 2) + "-" + this.elementToString(this.date, 2);
    };
    /** @return 00:00:00.000. */
    PartTime.prototype.toTimeString = function () {
        return this.elementToString(this.hour, 2) + ":" + this.elementToString(this.minute, 2) + ":" + this.elementToString(this.second, 2) + "." + this.elementToString(this.millisecond, 3);
    };
    PartTime._levels = ["millisecond", "second", "minute", "hour", "date", "month", "year"];
    return PartTime;
}());
function valueEquals(value1, value2) {
    var n1 = value1 == null;
    var n2 = value2 == null;
    if (n1 !== n2)
        return false; // single null
    if (n1)
        return true; // both null
    return value1 === value2; // both not null
}
module.exports = PartTime;

return module.exports;});

