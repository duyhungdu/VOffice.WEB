(function (app) {
    app.filter('statusFilter', function () {
        return function (input) {
            if (input) {
                return "on"
            }
            else {
                return "off"
            }
        }
    });
    app.filter('statusReceivedFilter', function () {
        return function (input) {
            if (input) {
                return 'Đúng'
            }
            else {
                return 'Sai'
            }
        }
    });
    app.filter('statusNullFilter', function () {
        return function (input) {
            return isEmpty(input) ? 'Chưa xác định' : input;
        };
        function isEmpty(i) {
            return (i === null || i === undefined);
        }
    });
    app.filter('readFilter', function () {
        return function (input) {
            return input === 1 ? 'check text-navy' : 'ban red-color';
        };
    });
    app.filter('addedBookFilter', function () {
        return function (input) {
            if (input)
                return 'check text-navy';
            else
                return 'ban red-color';
        };
    });
    app.filter('filterPhoneNumber', function () {
        return function (input) {
            return input.replace(/\./g, '').replace(/\s/g, '').replace(/,/g, '')
        };
    });
    app.filter('filterType', function () {
        return function (input) {
            if (input == 'TASK') {
                return 'Quản lý công việc'
            }
            else if (input == 'CALENDAR') {
                return 'Quản lý lịch công tác'
            }
            else if (input == 'DOCUMENT') {
                return 'Quản lý văn bản'
            }
        }
    });
    app.filter('filterRole', function () {
        return function (input) {
            if (input == 1)
                return true;
            else
                return false;
        };
    });
})(angular.module('VOfficeApp.common'));


(function (app) {
    app.filter('documentTypeFilter', function () {
        return function (input) {
            if (input) {
                return 'Văn bản đến'
            }
            else {
                return 'Văn bản đi'
            }
        }
    });
})(angular.module('VOfficeApp.common'));

(function (app) {
    app.filter('listDepartmentFilter', function () {
        return function (input) {
            var listDepartment = [
                { "id": "3", "value": "Công ty cổ phần đầu tư & phát triển công nghệ Văn Lang" },
                { "id": "2", "value": "NXBGD Hà Nội" },
            ];
            var ret = "";
            for (var i = 0; i < listDepartment.length; i++) {
                if (input == listDepartment[i].id) {
                    ret = listDepartment[i].value;
                }
            }
            return ret;
        }
    });
})(angular.module('VOfficeApp.common'));

(function (app) {
    app.filter('activeFilter', function () {
        return function (input) {
            if (input) {
                return 'Kích hoạt'
            }
            else {
                return 'Chưa kích hoạt'
            }
        }
    });
})(angular.module('VOfficeApp.common'));
(function (app) {
    app.filter('lockUserFilter', function () {
        return function (input) {
            if (input) {
                return 'Ngừng hoạt động'
            }
            else {
                return ''
            }
        }
    });
})(angular.module('VOfficeApp.common'));
(function (app) {
    app.filter('systemConfigFilter', function () {
        return function (input) {
            if (input) {
                return 'password'
            }
            else {
                return 'Text'
            }
        }
    });
})(angular.module('VOfficeApp.common'));
