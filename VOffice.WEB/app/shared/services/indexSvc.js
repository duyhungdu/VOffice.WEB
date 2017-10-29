(function (app) {
    app.factory('indexSvc', indexSvc);
    indexSvc.$inject = ['$http', '$q'];
    function indexSvc($http, $q) {
        return ({
            getData: getData
        });
        function getData(searchKey, pageNumber, urlBase) {
            var deferred = $q.defer();
            var request = $http({
                method: "get",
                url: urlBase,
                params: { searchKey: searchKey, PageNumber: pageNumber }
            });
            return (request.then(handleSuccess, handleError));
        }

        function handleError(response) {
            if (
                !angular.isObject(response.data) ||
                !response.data.message
                ) {
                return ($q.reject("An unknown error occurred."));
            }
            return ($q.reject(response.data.message));
        }
        function handleSuccess(response) {
            console.log(response.data);
            return (response.data);
        }
    }
})(angular.module('VOfficeApp.common'));