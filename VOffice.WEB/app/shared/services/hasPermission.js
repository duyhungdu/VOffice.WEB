angular.module('VOfficeApp.common').directive('hasPermission', function (permissions) {
    return {
        link: function (scope, element, attrs) {
            if (!_.isString(attrs.hasPermission)) {
                throw 'hasPermission value must be a string'
            }
            var value = attrs.hasPermission.trim();
            var notPermissionFlag = value[0] === '!';
            if (notPermissionFlag) {
                value = value.slice(1).trim();
            }

            function toggleVisibilityBasedOnPermission() {
                var hasPermission = permissions.hasPermission(value);
                if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                    element[0].style.display = 'inline-block';
                }
                else {
                    element[0].style.display = 'none';
                }
            }

            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
        }
    };
});