(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PartTime = f()}})(function(){var define,module,exports;module={exports:(exports={})};
"use strict";
/* (C) 2014 Narazaka : Licensed under The MIT License - http://narazaka.net/license/MIT?2014 */
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
     * @param timeString String value representing a parttime. The string should be in a format recognized by the PartTime.parse() method (yyyy-mm-ddT00:00:00.000).
     */
    function PartTime(timeString) {
        if (timeString) {
            var time = PartTime.parse(timeString);
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
     * @param date_c Date or DateLike (has getFullYear, getMonth, ... getMilliseconds)
     */
    PartTime.prototype.compare = function (date_c) {
        var year = this.getFullYear();
        var year_cmp = date_c.getFullYear();
        if ((year != null) && (year_cmp != null)) {
            var diff = year - year_cmp;
            if (diff) {
                return diff;
            }
        }
        var month = this.getMonth();
        var month_cmp = date_c.getMonth();
        if ((month != null) && (month_cmp != null)) {
            var diff = month - month_cmp;
            if (diff) {
                return diff;
            }
        }
        var date = this.getDate();
        var date_cmp = date_c.getDate();
        if ((date != null) && (date_cmp != null)) {
            var diff = date - date_cmp;
            if (diff) {
                return diff;
            }
        }
        var hour = this.getHours();
        var hour_cmp = date_c.getHours();
        if ((hour != null) && (hour_cmp != null)) {
            var diff = hour - hour_cmp;
            if (diff) {
                return diff;
            }
        }
        var minute = this.getMinutes();
        var minute_cmp = date_c.getMinutes();
        if ((minute != null) && (minute_cmp != null)) {
            var diff = minute - minute_cmp;
            if (diff) {
                return diff;
            }
        }
        var second = this.getSeconds();
        var second_cmp = date_c.getSeconds();
        if ((second != null) && (second_cmp != null)) {
            var diff = second - second_cmp;
            if (diff) {
                return diff;
            }
        }
        var millisecond = this.getMilliseconds();
        var millisecond_cmp = date_c.getMilliseconds();
        if ((millisecond != null) && (millisecond_cmp != null)) {
            var diff = millisecond - millisecond_cmp;
            if (diff) {
                return diff;
            }
        }
        return 0;
    };
    PartTime.prototype.elementToString = function (element, padding) {
        if (padding === void 0) { padding = 0; }
        return element != null ? (Array(padding + 1).join("0") + element).slice(-padding) : "*";
    };
    /** @return yyyy-mm-ddT00:00:00.000. */
    PartTime.prototype.toString = function () {
        return this.elementToString(this.year) + "-" + this.elementToString(this.month, 2) + "-" + this.elementToString(this.date, 2) + "T" + this.elementToString(this.hour, 2) + ":" + this.elementToString(this.minute, 2) + ":" + this.elementToString(this.second, 2) + "." + this.elementToString(this.millisecond, 3);
    };
    PartTime._levels = ["millisecond", "second", "minute", "hour", "date", "month", "year"];
    return PartTime;
}());
module.exports = PartTime;

return module.exports;});

