(function (app) {
    'use strict';
    app.service('authenticationService', ['$http', '$q', '$window', 'localStorageService', 'authData',
    function ($http, $q, $window, localStorageService, authData) {
        var tokenInfo;

        this.setTokenInfo = function (data) {
            tokenInfo = data;
            localStorageService.set("TokenInfo", JSON.stringify(tokenInfo));
        }

        this.getTokenInfo = function () {
            return tokenInfo;
        }

        this.removeToken = function () {
            tokenInfo = null;
            localStorageService.set("TokenInfo", null);
        }

        this.init = function () {
            
            var tokenInfo = localStorageService.get("TokenInfo");
            if (tokenInfo) {
                tokenInfo = JSON.parse(tokenInfo);
                authData.authenticationData.IsAuthenticated = true;
                authData.authenticationData.userName = tokenInfo.userName;
                authData.authenticationData.fullName = tokenInfo.fullName;
                authData.authenticationData.firstName = tokenInfo.firstName;
                authData.authenticationData.email = tokenInfo.email;
                authData.authenticationData.userId = tokenInfo.userId;
                authData.authenticationData.position = tokenInfo.position;
                authData.authenticationData.staffCode = tokenInfo.staffCode;
                authData.authenticationData.phoneNumber = tokenInfo.phoneNumber;
                authData.authenticationData.dateOfBirth = tokenInfo.dateOfBirth;
                authData.authenticationData.gender = tokenInfo.gender;
                authData.authenticationData.avatar = tokenInfo.avatar;
                authData.authenticationData.leader = tokenInfo.leader;
                authData.authenticationData.seniorLeader = tokenInfo.seniorLeader;
                authData.authenticationData.superLeader = tokenInfo.superLeader;
                authData.authenticationData.signedBy = tokenInfo.signedBy;
                authData.authenticationData.googleAccount = tokenInfo.googleAccount;
                authData.authenticationData.departmentId = tokenInfo.departmentId;
                authData.authenticationData.parentDepartmentId = tokenInfo.parentDepartmentId;
                authData.authenticationData.office = tokenInfo.office;
                authData.authenticationData.subDepartmentId = tokenInfo.subDepartmentId;
                authData.authenticationData.listSubDepartmentId = tokenInfo.listSubDepartmentId;
                authData.authenticationData.accessToken = tokenInfo.accessToken;
                authData.authenticationData.departmentShortName = tokenInfo.departmentShortName;
                authData.authenticationData.departmentName = tokenInfo.departmentName
            }
        }
        this.setHeader = function () {
            delete $http.defaults.headers.common['X-Requested-With'];
            if ((authData.authenticationData != undefined) && (authData.authenticationData.accessToken != undefined) && (authData.authenticationData.accessToken != null) && (authData.authenticationData.accessToken != "")) {
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + authData.authenticationData.accessToken;
                $http.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            }
        }

        //this.validateRequest = function () {
        //    var url = 'api/home/TestMethod';
        //    var deferred = $q.defer();
        //    $http.get(url).then(function () {
        //        deferred.resolve(null);
        //    }, function (error) {
        //        deferred.reject(error);
        //    });
        //    return deferred.promise;
        //}

        this.init();
    }
    ]);
})(angular.module('VOfficeApp.common'));