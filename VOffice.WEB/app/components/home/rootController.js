(function (app) {
    app.controller('rootController', rootController);

    rootController.$inject = ['$rootScope', '$state','$compile', '$sce', 'authData', 'loginService', '$scope', 'authenticationService', 'permissions', 'apiService'];

    function rootController($rootScope, $state, $compile, $sce, authData, loginService, $scope, authenticationService, permissions, apiService) {
     
        $rootScope.strEmpty = 'Không tìm thấy bản ghi khả dụng';
        $rootScope.baseUrl = 'http://localhost:81/';

        $scope.logOut = function () {
            loginService.logOut();
            $state.go('login');
        }
        $scope.authentication = authData.authenticationData;
                
        authenticationService.init();
         
        apiService.get($rootScope.baseUrl + 'api/AspNetUser/GetAllRoleByUserId?userId=' +$scope.authentication.userId, null, function (data) {
            $scope.permissionList = data.data.data;
            //console.log($scope.permissionList);
            permissions.setPermissions($scope.permissionList);
        });            
    }
})(angular.module('VOfficeApp'));