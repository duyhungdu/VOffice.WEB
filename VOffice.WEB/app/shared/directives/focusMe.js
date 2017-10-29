(function (app) {
    'use strict';
    app.directive('focusMe', function($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if(value === "true") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });
    app.directive('onFinishRender', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                        if (!!attr.onFinishRender) {
                            $parse(attr.onFinishRender)(scope);
                        }
                    });
                }




                if (!!attr.onStartRender) {
                    if (scope.$first === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatStarted');
                            if (!!attr.onStartRender) {
                                $parse(attr.onStartRender)(scope);
                            }
                        });
                    }
                }
            }
        }
    }]);
    app.directive('clickAnywhereButHere', function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                elem.bind('click', function (e) {
                    // this part keeps it from firing the click on the document.
                    e.stopPropagation();
                });
                $document.bind('click', function () {
                    // magic here.
                    scope.$apply(attr.clickAnywhereButHere);
                })
            }
        }
    });
   

    app.directive('tooltip', function ($document, $compile) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {

                var tip = $compile('<div ng-class="tipClass">{{ text }}<div class="tooltip-arrow"></div></div>')(scope),
                    tipClassName = 'tooltip',
                    tipActiveClassName = 'tooltip-show';

                scope.tipClass = [tipClassName];
                scope.text = attrs.tooltip;

                if (attrs.tooltipPosition) {
                    scope.tipClass.push('tooltip-' + attrs.tooltipPosition);
                }
                else {
                    scope.tipClass.push('tooltip-down');
                }
                $document.find('body').append(tip);

                element.bind('mouseover', function (e) {
                    tip.addClass(tipActiveClassName);

                    var pos = e.target.getBoundingClientRect(),
                        offset = tip.offset(),
                        tipHeight = tip.outerHeight(),
                        tipWidth = tip.outerWidth(),
                        elWidth = pos.width || pos.right - pos.left,
                        elHeight = pos.height || pos.bottom - pos.top,
                        tipOffset = 10;

                    if (tip.hasClass('tooltip-right')) {
                        offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
                        offset.left = pos.right + tipOffset;
                    }
                    else if (tip.hasClass('tooltip-left')) {
                        offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
                        offset.left = pos.left - tipWidth - tipOffset;
                    }
                    else if (tip.hasClass('tooltip-down')) {
                        offset.top = pos.top + elHeight + tipOffset;
                        offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
                    }
                    else {
                        offset.top = pos.top - tipHeight - tipOffset;
                        offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
                    }

                    tip.offset(offset);
                });

                element.bind('mouseout', function () {
                    tip.removeClass(tipActiveClassName);
                });

                tip.bind('mouseover', function () {
                    tip.addClass(tipActiveClassName);
                });

                tip.bind('mouseout', function () {
                    tip.removeClass(tipActiveClassName);
                });


            }
        }
    });
     
})(angular.module('VOfficeApp.common'));