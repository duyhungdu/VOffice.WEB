/// <reference path="/assets/admin/libs/angular/angular.js" />
(function (app) {
    app.factory('apiService', apiService);

    apiService.$inject = ['$http', 'notificationService', 'authenticationService', 'fogLoading'];

    function apiService($http, notificationService, authenticationService, fogLoading) {
        return {
            get: get,
            post: post,
            put: put,
            del: del
        }
        function del(url, data, success, failure) {
            authenticationService.setHeader();
            $http.delete(url, data).then(function (result) {
                success(result);
            }, function (error) {
                console.log(error.status)
                if (error.status === 401) {
                    
                }
                else if (failure != null) {
                    failure(error);
                }
            });
        }

        function put(url, data, success, failure) {
            authenticationService.setHeader();
            fogLoading('fog-modal', 'block');
            $http.put(url, data).then(function (result) {
                success(result);
                fogLoading('fog-modal', 'none');
            }, function (error) {
                console.log(error.status)
                
                if (error.status === 401) {
                   
                }
                else if (failure != null) {
                    failure(error);
                }
            });
        }

        function post(url, data, success, failure) {
            authenticationService.setHeader();
            fogLoading('fog-modal', 'block');
            $http.post(url, data).then(function (result) {
                success(result);
                fogLoading('fog-modal', 'none');
            }, function (error) {
                console.log(error.status);
               
                if (error.status === 401) {
                    
                }
                else if (failure != null) {
                    failure(error);
                }
            });
        }
        function get(url, params, success, failure) {
            authenticationService.setHeader();
            $http.get(url, params).then(function (result) {
                success(result);
            }, function (error) {
                if (error.status == 401) {
                    
                }
                failure(error);
            });
        }
    }
})(angular.module('VOfficeApp.common'));