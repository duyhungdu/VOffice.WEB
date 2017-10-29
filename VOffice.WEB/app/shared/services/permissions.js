angular.module('VOfficeApp.common')
.factory('permissions', function ($rootScope) {
    var permissionList = [];
    return {
        setPermissions: function (permissions) {
            permissionList = permissions;
            $rootScope.$broadcast('permissionsChanged');
        },
        hasPermission: function (permission) {
            permission = permission.trim();
            return permissionList.some(item => {
                if (typeof item.code !== 'string') { // item.Name is only used because when I called setPermission, I had a Name property
                    return false;
                }
                return item.code.trim() === permission;
            });
        }
    };
});