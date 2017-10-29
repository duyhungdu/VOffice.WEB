(function (app) {
    app.controller('documentDetailController', documentDetailController);
    app.controller('historyDocumentController', historyDocumentController);
    app.controller('historyAddedBookDocumentController', historyAddedBookDocumentController);
    documentDetailController.$inject = ['$scope',
           'apiService',
           'notificationService',
           '$ngBootbox',
           '$http',
           '$state',
           '$timeout',
           '$stateParams',
           '$injector',
           '$rootScope',
           '$uibModal',
    '$document'];
    historyDocumentController.$inject = ['$uibModalInstance',
                                         '$rootScope',
                                         'apiService',
                                         '$ngBootbox',
                                         'notificationService',
                                         '$stateParams',
                                         'dateformatService',
                                         'id',
                                         'departmentId',
                                         'userId',
                                         'listSubDepartmentId',
                                          'documentDetail'];
    historyAddedBookDocumentController.$inject = ['$uibModalInstance',
                                                  '$rootScope',
                                                  'apiService',
                                                  '$ngBootbox',
                                                   'notificationService',
                                                   '$stateParams',
                                                   'dateformatService',
                                                   'id',
                                                   'departmentId',
                                                   'userId',
                                                   'listSubDepartmentId',
                                                   'documentDetail'];

    function documentDetailController($scope,
                                        apiService,
                                        notificationService,
                                        $ngBootbox,
                                        $http,
                                        $state,
                                        $timeout,
                                        $stateParams,
                                        $injector,
                                        $rootScope,
                                        $uibModal, $document) {
        if ($stateParams.receivedDocument == 1) {
            $scope.receivedDocument = true;
            type = 'received';
        }
        else {
            $scope.receivedDocument = false;
            type = 'delivered';
        }
        $scope.deliveredDocument = function () {
            if ($stateParams.receivedDocument == 1)
                return false
            else return true;
        }
        $scope.userId = $scope.authentication.userId;
        $scope.departmentId = $scope.authentication.departmentId;
        $scope.listSubDepartmentId = $scope.authentication.listSubDepartmentId;
        $scope.id = $stateParams.id
        $scope.documentInfo = {};

        $scope.checkPermissionUserDocument = checkPermissionUserDocument;
        $scope.checkPermissionUserDocument();
        function checkPermissionUserDocument() {
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/CheckPermissionUserDocument?userId=' + $scope.userId + '&documentId=' + $scope.id + '&receivedDocument=' + $scope.receivedDocument + '&listDepartment=' + $scope.departmentId + ',' + $scope.listSubDepartmentId + '', null, function (result) {
                if (result.data.value == true) {

                }
                else {
                    var stateService = $injector.get('$state');
                    stateService.go('home');
                    return;
                }
            },
            function (error) {
                console.log(error);
            });
        }
        $scope.initDocument = initDocument;
        function initDocument() {
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/GetDocumentDetail/' + $scope.id + '?type=' + type, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError("Loading failure: " + result.message);
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
            }, function (result) {
            });
        }
        $scope.initDocument();
        $scope.countDoc = countDoc;
        $scope.countDoc();
        function countDoc() {
            apiService.get($rootScope.baseUrl + 'api/DocumentHistory/GetHistoryDocument?documentId=' + $scope.id + '&receivedDocument=' + $scope.receivedDocument, null,
              function (result) {
                  $scope.countReadDoc = 0;
                  angular.forEach(result.data.data, function (value, key) {
                      if (value.state == true) {
                          $scope.countReadDoc = $scope.countReadDoc + 1;
                      }
                  });
                  $scope.countReadDoc = $scope.countReadDoc > 0 ? $scope.countReadDoc + ' người đã đọc văn bản' : 'Chưa có người nào đọc văn bản này';
              },
              function (error) {
                  console.log(error);
              });
        }
        $scope.documentField = [];
        $scope.checkHistoryAddDoc = checkHistoryAddDoc;
        function checkHistoryAddDoc() {
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/CheckHistoryAddedBookDoc?documentId=' + $scope.id + '&receivedDocument=' + $scope.receivedDocument, null, function (result) {
                if (result.data.isSuccess == true) {
                    $scope.checkHistory = result.data.value;
                }
                else {
                }
            }, function (result) {
            });
        }
        $scope.checkHistoryAddDoc();
        $scope.GetDocumentFieldDepartment = GetDocumentFieldDepartment;
        function GetDocumentFieldDepartment() {
            apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/GetDocFieldDeaprtmentByDocIdAndReceivedDoc?documentId=' + $scope.id + '&receivedDocument=' + $scope.receivedDocument, null, function (result) {
                if (result.data.isSuccess == true) {
                    $scope.documentField = result.data.data;
                }
                else {
                }
            }, function (result) {
            });
        }
        $scope.GetDocumentFieldDepartment();
        $scope.task = [];
        $scope.GetTask = GetTask;
        $scope.totalItems = 0;
        function GetTask() {
            apiService.get($rootScope.baseUrl + 'api/Task/GetTaskByDocumentId?docId=' + $scope.id + '&receivedDoc=' + $scope.receivedDocument + '&userId=' + $scope.userId, null, function (result) {
                if (result.data.isSuccess == true) {
                    $scope.task = result.data.data;
                    $scope.totalItems = result.data.totalItems;
                }
                else {
                }
            }, function (result) {
            });
        }
        $scope.countTask = function () {
            if ($scope.totalItems > 0) {
                return false;
            }
            return true;
        };
        $scope.GetTask();
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
        $scope.assignDocument = assignDocument;
        function assignDocument() {
            $state.go('assign_document', {
                taskId: 0,
                documentId: $stateParams.id,
                typeOfDocument: $stateParams.typeOfDocument,
                receivedDocument: $stateParams.receivedDocument,
                currentPage: $stateParams.currentPage,
                keyword: $stateParams.keyword,
                startDate: $stateParams.startDate,
                endDate: $stateParams.endDate
            });
        }
        $scope.forwardDocument = forwardDocument;
        function forwardDocument() {
            $state.go('forward_document', {
                documentId: $stateParams.id,
                receivedDocument: $stateParams.receivedDocument,
                typeOfDocument: $stateParams.typeOfDocument,
                currentPage: $stateParams.currentPage,
                keyword: $stateParams.keyword,
                startDate: $stateParams.startDate,
                endDate: $stateParams.endDate
            });
        }
        $scope.taskDocument = taskDocument;
        function taskDocument(id) {
            $state.go('task_detail', {
                id: id,
            });
        }
        $scope.historyDocument = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'historyDocument.html',
                controller: 'historyDocumentController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.id;
                    },
                    departmentId: function () {
                        return $scope.departmentId;
                    },
                    userId: function () {
                        return $scope.userId;
                    },
                    listSubDepartmentId: function () {
                        return $scope.listSubDepartmentId;
                    },
                    documentDetail: function () {
                        return $scope.documentInfo;
                    }
                }
            })
            //modalInstance.result.then(function (selected) {
            //    // $scope.search();
            //    //console.log(selected);
            //}, function (dis) {
            //    //console.log(dis);
            //    //$scope.search();
            //});
        };
        $scope.historyAddedBookDocument = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'historyAddedBookDocument.html',
                controller: 'historyAddedBookDocumentController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.id;
                    },
                    departmentId: function () {
                        return $scope.departmentId;
                    },
                    userId: function () {
                        return $scope.userId;
                    },
                    listSubDepartmentId: function () {
                        return $scope.listSubDepartmentId;
                    },
                    documentDetail: function () {
                        return $scope.documentInfo;
                    }
                }
            })
        }
    }
    function historyDocumentController($uibModalInstance, $rootScope, apiService, $ngBootbox,
                                        notificationService, $stateParams, dateformatService,
                                        id, departmentId, userId, listSubDepartmentId, documentDetail) {
        var $ctr = this;
        $ctr.loadDefault = loadDefault;
        $ctr.loadDefault();
        function loadDefault() {
            if (documentDetail != null) {
                var checkReceived = false;
                if (documentDetail.receivedDocument == 1)
                    checkReceived = true;
                apiService.get($rootScope.baseUrl + 'api/DocumentHistory/GetHistoryDocument?documentId=' + documentDetail.id + '&receivedDocument=' + checkReceived, null,
                function (result) {
                    $ctr.listItems = result.data.data;
                },
                function (error) {
                    console.log(error);
                });
            }
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function historyAddedBookDocumentController($uibModalInstance, $rootScope, apiService, $ngBootbox,
                                        notificationService, $stateParams, dateformatService,
                                        id, departmentId, userId, listSubDepartmentId, documentDetail) {

        var $ctr = this;
        $ctr.titleDoc = documentDetail.title;
        //Use when first load modal
        $ctr.loadDefault = loadDefault;
        $ctr.loadDefault();
        function loadDefault() {
            if (documentDetail != null) {
                var checkReceived = false;
                if (documentDetail.receivedDocument == 1)
                    checkReceived = true;
                apiService.get($rootScope.baseUrl + 'api/DocumentReceived/GetHistoryAddedBookDocument?documentId=' + documentDetail.id + '&receivedDocument=' + checkReceived, null,
                function (result) {
                    console.log(result.data.data);
                    $ctr.listAddedBook = result.data.data;
                },
                function (error) {
                    console.log(error);
                });
            }
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})(angular.module('VOfficeApp.documentReiceived'));