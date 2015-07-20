/***
 *
 * Simple date format
 *
 *  @author : Ferron Hanse
 *  @date : 10/11/2010
 *  @lincense : do no evil!
         
        //default
        console.log((new Date()).format('yyyy'));
        // returns 2011
        
        //standard
        console.log((new Date()).format('mmm dd yy hh:nn:ss a/p'));
        //returns Nov 02 11 11:23:16 am

        //short date
        console.log((new Date()).format('mm/dd/yy'));
        //returns 11/02/11
        
        //medium date
        console.log((new Date()).format('mmm dd, yyyy'));
        //returns Nov 02, 2011
        
        //medium date
        console.log((new Date()).format('mmmm dd, yyyy'));
        //returns November 02, 2011
        
        //full date
        console.log((new Date()).format('dddd, mmmm dd, yyyy'));
        //returns Wednesday, November 02, 2011
        
        //shortTime
        console.log((new Date()).format('hh:nn a/p'));
        //returns 11:23 am
        
        //mediumTime
        console.log((new Date()).format('hh:nn:ss a/p'));
        //returns 11:23:16 am
        
        //isoDate
        console.log((new Date()).format('yyyy-mm-dd'));
        //returns 2011-11-02
        
        // parse date in 2012/2/2 format
        console.log(("2012/2/2").parse('/').format('dddd, mmmm dd, yyyy'));
        
        // Year - Month - Day
        console.log(("2012-2-2").parse('-').format('dddd, mmmm dd, yyyy'));
 *
 */

define(function(require, exports, module) {
    // a global month names array
    var gsMonthNames = new Array(
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    );


    // a global day names array
    var gsDayNames = new Array(
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    );


    // the date format prototype
    Date.prototype.format = function(f) {
        if (!this.valueOf())
            return ' ';

        var d = this;

        return f.replace(/(yyyy|yy|mmmm|mmm|mm|dddd|ddd|dd|hh|HH|nn|ss|a\/p)/gi,
            function(val) {
                switch (val) {
                    case 'yy':
                        return d.getFullYear().substr(2);
                    case 'yyyy':
                        return d.getFullYear();
                    case 'mmmm':
                        return gsMonthNames[d.getMonth()];
                    case 'mmm':
                        return gsMonthNames[d.getMonth()].substr(0, 3);
                    case 'mm':
                        return (d.getMonth() + 1).zf(2);
                    case 'dddd':
                        return gsDayNames[d.getDay()];
                    case 'ddd':
                        return gsDayNames[d.getDay()].substr(0, 3);
                    case 'dd':
                        return d.getDate().zf(2);
                    case 'hh':
                        return ((h = d.getHours() % 12) ? h : 12).zf(2);//12小时格式
                    case 'HH':
                        return d.getHours();//24小时格式
                    case 'nn':
                        return d.getMinutes().zf(2);
                    case 'ss':
                        return d.getSeconds().zf(2);
                    case 'a/p':
                        return d.getHours() < 12 ? 'am' : 'pm';
                }
            }
        );
    }

    // string date parse function
    String.prototype.parse = function(delim) {
        var parts = this.split(delim);
        if (parts.length == 3) {
            return new Date(
                parseInt(parts[0], 10), // year
                parseInt(parts[1] ? parts[1] - 1 : 0, 10), // month
                parseInt(parts[2], 10), // date
                0, // hours
                0, // mins
                0, // secs
                0 // millisec
            );
        }

    }

    // Zero-Fill
    Number.prototype.zf = function(l) {
        return '0'.string(l - this.toString().length) + this;
    }

    //return the sub of an integer
    Number.prototype.substr = function(l) {
        return this.toString().substr(l);
    }

    // VB-like string
    String.prototype.string = function(l) {
        var s = '',
            i = 0;
        while (i++ < l) {
            s += this;
        }
        return s;
    }
})