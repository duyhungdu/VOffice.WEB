(function (app) {
    'use strict';
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})(angular.module('VOfficeApp.common'));

(function (app) {
    app.directive('enforceMaxTags', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngCtrl) {
                var maxTags = attrs.maxTags ? parseInt(attrs.maxTags, '10') : null;

                ngCtrl.$parsers.push(function (value) {
                    if (value && maxTags && value.length > maxTags) {
                        value.splice(value.length - 1, 1);
                    }
                    return value;
                });
            }
        };
    });
})(angular.module('VOfficeApp.common'));

(function (app) {
    app.directive("datepicker", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, elem, attrs, ngModelCtrl) {
                var updateModel = function (dateText) {
                    scope.$apply(function () {                        
                        if (dateText != "") {
                            ngModelCtrl.$setViewValue(dateText);
                        }                        
                    });
                };
                var options = {
                    format: 'dd/mm/yyyy',
                    todayBtn: "linked",
                    forceParse: false,
                    todayHighlight: true,
                    calendarWeeks: true,
                    autoclose: true,
                    onSelect: function (dateText) {                        
                        updateModel(dateText);
                    }
                };
                elem.datepicker(options);
            }
        }
    });

})(angular.module('VOfficeApp.common'));

(function (app) {
    app.directive("compareTo", function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });

})(angular.module('VOfficeApp.common'));