(function (app) {
    'use strict';
    app.factory('focus', function ($timeout, $window) {
        return function (id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            }, 750);
        };
    });
    app.factory('fogLoading', function ($timeout, $window) {
        return function (id, type) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.style.display = type;
            }, 10);
        };
    });

    app.directive('autofocus', function ($timeout) {
        return function (scope, element, attrs) {
            var input = element.find('input');
            $timeout(function () {
                if (input.length > 0) {
                    input[0].focus();
                }
            }, 100);
        };
    });

})(angular.module('VOfficeApp.common'));