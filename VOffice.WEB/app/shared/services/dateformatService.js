(function (app) {
    app.factory('dateformatService', dateformatService);

    function dateformatService() {

        Date.prototype.addDays = function (days) {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        }

        Date.prototype.startOfWeek = function (pStartOfWeek) {
            var mDifference = this.getDay() - pStartOfWeek;

            if (mDifference < 0) {
                mDifference += 7;
            }
            return new Date(this.addDays(mDifference * -1));
        };

        Date.prototype.getWeekNumber = function () {
            var d = new Date(+this);
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
            return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
        };


        function addMoreHours(date) {
            date.setHours(date.getHours() + 7);
            return date;
        }
        function compareCurrentDate(date) {
            var selectedDate = new Date(date.split('/')[2], (date.split('/')[1] - 1), date.split('/')[0]);
            var thisTime = new Date();
            var currentDate = new Date(thisTime.getFullYear(), (thisTime.getMonth()), thisTime.getDate());
            if (selectedDate < currentDate) {
                return -1;
            }
            else {
                if (selectedDate == currentDate) {
                    return 0;
                }
                else {
                    return 2;
                }
            }
        }

        function compareTwoDate(startDate, dueDate) {
            if (startDate.split('/').length < 2)
            { return 1; }
            if (dueDate.split('/').length < 2)
            { return 1; }
            var smallDate = new Date(startDate.split('/')[2], (startDate.split('/')[1] - 1), startDate.split('/')[0]);
            var bigDate = new Date(dueDate.split('/')[2], (dueDate.split('/')[1] - 1), dueDate.split('/')[0]);

            if (smallDate > bigDate) {
                return -1;
            }
            else {
                if (smallDate == bigDate) {
                    return 0;
                }
                else {
                    return 2;
                }
            }
        }


        function formatToDDMMYY(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return day + '/' + month + '/' + year;
        }
        function formatToDDMMYYhhmm(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            var hour = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            return day + '/' + month + '/' + year + ' ' + formatZeroPadding(hour, 2) + ':' + formatZeroPadding(minutes, 2);
        }


        function formatZeroPadding(number, size) {
            var s = number.toString();
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
        }

        return {
            formatToDDMMYY: formatToDDMMYY,
            addMoreHours: addMoreHours,
            compareCurrentDate: compareCurrentDate,
            compareTwoDate: compareTwoDate,
            formatToDDMMYYhhmm: formatToDDMMYYhhmm,
            formatZeroPadding: formatZeroPadding
        };
    }
})(angular.module('VOfficeApp.common'));