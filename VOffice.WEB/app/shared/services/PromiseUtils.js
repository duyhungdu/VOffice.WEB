(function (app) {
    app.factory('promiseUtils', promiseUtils);

    promiseUtils.$inject = ['$q'];

    function promiseUtils($q) {
        return {
            getPromiseHttpResult: function (httpPromise) {
                var deferred = $q.defer();
                httpPromise.then(function (data) {
                    deferred.resolve(data);
                },function () {
                    deferred.reject(arguments);
                });
                return deferred.promise;
            }
        }
    }
    
})(angular.module('VOfficeApp.common'));