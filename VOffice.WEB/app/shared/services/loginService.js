(function (app) {
    'use strict';
    app.service('loginService', ['$rootScope', '$http', '$q', 'authenticationService', 'authData', 'localStorageService', 'apiService',
    function ($rootScope, $http, $q, authenticationService, authData, localStorageService, apiService) {
        var userInfo;
        var deferred;

        this.login = function (userName, password) {
            deferred = $q.defer();
            var data = "grant_type=password&username=" + userName + "&password=" + password;
            $http.post($rootScope.baseUrl + 'token', data, {
                headers:
                   { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                userInfo = {
                    accessToken: response.data.access_token,
                    expires_in: response.data.expires_in,
                    token_type: response.data.token_type,
                    fullName: response.data.fullName,
                    firstName: response.data.firstName,
                    userName: userName,
                    password: password,
                    listSubDepartmentId: response.data.ListSubDepartmentId,
                    email: response.data.email,
                    userId: response.data.userId,
                    position: response.data.position,
                    staffCode: response.data.staffCode,
                    phoneNumber: response.data.phoneNumber,
                    dateOfBirth: response.data.dateOfBirth,
                    gender: response.data.gender,
                    avatar: response.data.avatar,
                    leader: response.data.leader,
                    seniorLeader: response.data.seniorLeader,
                    superLeader: response.data.superLeader,
                    signedBy: response.data.signedBy,
                    googleAccount: response.data.googleAccount,
                    departmentId: response.data.departmentId,
                    parentDepartmentId: response.data.parentDepartmentId,
                    office: response.data.office,
                    subDepartmentId: response.data.subDepartmentId,
                    departmentShortName: response.data.departmentShortName,
                    departmentName: response.data.departmentName

                };
                authenticationService.setTokenInfo(userInfo);
                authData.authenticationData.IsAuthenticated = true;
                authData.authenticationData.accessToken = userInfo.accessToken;
                authData.authenticationData.expires_in = response.data.expires_in;
                authData.authenticationData.token_type = response.data.token_type;
                authData.authenticationData.fullName = response.data.fullName;
                authData.authenticationData.firstName = response.data.firstName;
                authData.authenticationData.userName = userName;
                authData.authenticationData.password = password;
                authData.authenticationData.listSubDepartmentId = response.data.ListSubDepartmentId;
                authData.authenticationData.email = response.data.email;
                authData.authenticationData.userId = response.data.userId;
                authData.authenticationData.position = response.data.position;
                authData.authenticationData.staffCode = response.data.staffCode;
                authData.authenticationData.phoneNumber = response.data.phoneNumber;
                authData.authenticationData.dateOfBirth = response.data.dateOfBirth;
                authData.authenticationData.gender = response.data.gender;
                authData.authenticationData.avatar = response.data.avatar;
                authData.authenticationData.leader = response.data.leader;
                authData.authenticationData.seniorLeader = response.data.seniorLeader;
                authData.authenticationData.superLeader = response.data.superLeader;
                authData.authenticationData.signedBy = response.data.signedBy;
                authData.authenticationData.googleAccount = response.data.googleAccount;
                authData.authenticationData.departmentId = response.data.departmentId;
                authData.authenticationData.parentDepartmentId = response.data.parentDepartmentId;
                authData.authenticationData.office = response.data.office;
                authData.authenticationData.subDepartmentId = response.data.subDepartmentId;
                authData.authenticationData.departmentShortName = response.data.departmentShortName;
                authData.authenticationData.departmentName = response.data.departmentName
                deferred.resolve(null);
            }, function (err, status) {
                authData.authenticationData.IsAuthenticated = false;
                authData.authenticationData.userName = "";
                deferred.resolve(err);
            })
            return deferred.promise;
        }

        this.logOut = function () {
            apiService.post($rootScope.baseUrl + 'api/Account/Logout', null, function (response) {
                authenticationService.removeToken();
                //localStorageService.set("isLoad") = false;
                authData.authenticationData.IsAuthenticated = false;
                authData.authenticationData.userName = "";
                authData.authenticationData.accessToken = "";
            }, null);
        }
    }]);
})(angular.module('VOfficeApp.common'));