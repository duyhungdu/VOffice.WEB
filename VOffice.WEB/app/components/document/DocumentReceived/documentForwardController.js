angular.module('VOfficeApp.documentReiceived').controller('documentForwardController', documentForwardController);
documentForwardController.$inject = ['$scope',
       'apiService',
       'notificationService',
       '$ngBootbox',
       '$http',
       '$state',
       '$timeout',
       '$stateParams',
       '$injector',
       '$rootScope',
       'fogLoading'];

function documentForwardController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $http,
                                    $state,
                                    $timeout,
                                    $stateParams,
                                    $injector,
                                    $rootScope,
                                    fogLoading) {

    //Init Form
    var departmentId = $scope.authentication.departmentId;
    var userId = $scope.authentication.userId;
    $scope.initDocumentDetail = initDocumentDetail;
    $scope.initDocumentDetail($stateParams.documentId, $stateParams.receivedDocument);
    function initDocumentDetail(id, receivedDocument) {
        if (receivedDocument == 0) {
            apiService.get($rootScope.baseUrl + 'api/DocumentDelivered/Get/' + id, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.documentInfo = result.data.value;
                checkNumber();
                $scope.checkNumber = checkNumber;
                function checkNumber() {
                    if ($scope.documentInfo.documentNumber == null || $scope.documentInfo.documentNumber == '')
                        return true;
                    else
                        return false;
                }
            }, null);
        }
        else {
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Get/' + id, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.documentInfo = result.data.value;
                checkNumber();
                $scope.checkNumber = checkNumber;
                function checkNumber() {
                    if ($scope.documentInfo.documentNumber == null || $scope.documentInfo.documentNumber == '')
                        return true;
                    else
                        return false;
                }

            }, null);
        }
    }
    $scope.loadStaff = function ($query) {
        return $http.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + departmentId, { cache: true }).then(function (response) {
            var listStaff = response.data.data;
            return listStaff.filter(function (staff) {
                return staff.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        });
    };
    //End Init form
    //Forward
    $scope.save = save;
    function save() {
        addRecipent();
    }
    $scope.listRecipent = [];
    function addRecipent() {
        $ngBootbox.confirm('Bạn chắc chắn muốn chuyển tiếp văn bản này?')
                           .then(function () {
                               angular.forEach($scope.forwarders, function (item) {
                                   var recipent = {
                                       "documentId": $stateParams.documentId,
                                       "userId": item.userId,
                                       "departmentId": departmentId,
                                       "receivedDocument": $stateParams.receivedDocument,
                                       "forwarded": true,
                                       "assigned": false,
                                       "addedDocumentBook": true,
                                       "createdOn": new Date(),
                                       "createdBy": userId,
                                       "forSending": false
                                   };
                                   $scope.listRecipent.push(recipent);
                               });
                               if ($scope.listRecipent.length > 0) {
                                   apiService.put($rootScope.baseUrl + 'api/DocumentReceived/ForwardDocument', $scope.listRecipent, function (result) {
                                       if (!result.data.isValid) {
                                           angular.forEach(result.data.brokenRules, function (value, key) {
                                               notificationService.displayError(value.rule);
                                           });
                                           return;
                                       }
                                       else {
                                           fogLoading('fog-modal', 'none');
                                           notificationService.displaySuccess('Chuyển tiếp thành công.');
                                           BindList();
                                       }
                                   }, function (error) {
                                       notificationService.displayError('Chuyển tiếp không thành công');
                                   });
                               }
                               else {
                                   notificationService.displayError('Bạn chưa chọn người chuyển tiếp.');
                               }
                           });
    }
    //End forward
    $scope.BindList = BindList;
    function BindList() {
        $state.go('documentReceived', {
            typeOfDocument: $stateParams.typeOfDocument.id,
            currentPage: $stateParams.currentPage,
            keyword: $stateParams.keyword,
            startDate: $stateParams.startDate,
            endDate: $stateParams.endDate
        });
    }
}