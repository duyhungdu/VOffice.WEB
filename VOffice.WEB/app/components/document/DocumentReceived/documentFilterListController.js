(function (app) {
    app.controller('documentFilterListController', documentFilterListController);
    app.controller('modalFilterDocumentController', modalFilterDocumentController);

    modalFilterDocumentController.$inject = ['$uibModalInstance', '$rootScope', '$state', 'apiService',
                                             'notificationService', 'data'];

    function modalFilterDocumentController($uibModalInstance, $rootScope, $state, apiService,
                                             notificationService, data) {
        var $ctrl = this;
        $ctrl.allDocumentFields = [];
        $ctrl.allDocumentTypes = [];
        $ctrl.allDocumentSigns = [];
        $ctrl.allDocumentSignsDelivered = [];
        $ctrl.searchInfo = {};
        $ctrl.filter = data.filter;
        if (data.searchInfo != null) {
            $ctrl.searchInfo = data.searchInfo.searchInfo;
        }
        $ctrl.listSecretLevel = [
                { title: 'Thường', id: 0 },
                { title: 'Mật', id: 1 },
                { title: 'Tối mật', id: 2 },
                { title: 'Tuyệt mật', id: 3 }
        ];

        $ctrl.listUrgencyLevel = [
             { title: 'Thường', id: 0 },
             { title: 'Khẩn', id: 1 },
             { title: 'Thượng khẩn', id: 2 },
             { title: 'Hỏa tốc', id: 3 }
        ];

        $ctrl.documentSecretLevel = function ($query) {
            return $ctrl.listSecretLevel.filter(function (field) {
                if ($query != null) {
                    return field.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };
        $ctrl.documentUrgencyLevel = function ($query) {
            return $ctrl.listUrgencyLevel.filter(function (field) {
                if ($query != null) {
                    return field.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $ctrl.documentType = function ($query) {
            return $ctrl.allDocumentTypes.filter(function (field) {
                if ($query != null) {
                    return field.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $ctrl.loadDocumentType = function () {
            apiService.get($rootScope.baseUrl + 'api/DocumentType/getall', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $ctrl.allDocumentTypes = result.data.data;
                    }
                }, function (error) {
                });
        }

        $ctrl.documentField = function ($query) {
            return $ctrl.allDocumentFields.filter(function (field) {
                if ($query != null) {
                    return field.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $ctrl.loadDocumentField = function () {
            apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/Filter?departmentID=' + parseInt(data.departmentId), null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $ctrl.allDocumentFields = result.data.data;
                    }
                }, function (error) {
                });
        }

        $ctrl.documentSign = function ($query) {
            return $ctrl.allDocumentSigns.filter(function (field) {
                if ($query != null) {
                    return field.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $ctrl.documentSignDelivered = function ($query) {
            return $ctrl.allDocumentSignsDelivered.filter(function (field) {
                if ($query != null) {
                    return field.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $ctrl.loadDocumentSign = function () {
            apiService.get($rootScope.baseUrl + 'api/DocumentSignedBy/GetAll', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $ctrl.allDocumentSigns = result.data.data;
                        angular.forEach($ctrl.allDocumentSigns, function (value, key) {
                            if (value.avatar != null && value.avatar != '') {
                                value.avatar = $rootScope.baseUrl + value.avatar;
                            }
                            else {
                                value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                            }
                        });
                    }
                }, function (error) {
                });
        }

        $ctrl.loadDocumentSignDelivered = function () {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + data.departmentId, null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $ctrl.allDocumentSignsDelivered = result.data.data;
                        angular.forEach($ctrl.allDocumentSignsDelivered, function (value, key) {
                            if (value.avatar != null && value.avatar != '') {
                                value.avatar = $rootScope.baseUrl + value.avatar;
                            }
                            else {
                                value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                            }
                        });

                    }
                }, function (error) {
                });
        }
        $ctrl.loadDocumentSignDelivered();
        $ctrl.loadDocumentSign();
        $ctrl.loadDocumentType();
        $ctrl.loadDocumentField();

        $ctrl.initData = function () {
            if ($ctrl.searchInfo) {
                $ctrl.documentSignsDelivered = $ctrl.searchInfo.arrDocumentSignsDelivered;
                $ctrl.documentSigns = $ctrl.searchInfo.arrDocumentSigns;
                $ctrl.documentFields = $ctrl.searchInfo.arrDocumentFields;
                $ctrl.documentTypes = $ctrl.searchInfo.arrDocumentTypes;
                $ctrl.documentTypes = $ctrl.searchInfo.arrDocumentTypes;
                $ctrl.documentSecretLevels = $ctrl.searchInfo.arrDocumentSecretLevels;
                $ctrl.documentUrgencyLevels = $ctrl.searchInfo.arrDocumentUrgencyLevels;
            }
        }
        $ctrl.initData();

        $ctrl.ok = function () {
            $ctrl.filter = true;
            $ctrl.searchInfo.documentSigns = '';
            $ctrl.searchInfo.documentFields = '';
            $ctrl.searchInfo.documentTypes = '';
            $ctrl.searchInfo.documentSecretLevels = '';
            $ctrl.searchInfo.documentUrgencyLevels = '';
            $ctrl.searchInfo.documentSignsDelivered = '';
            if ($ctrl.searchInfo.documentDateStringStart) {
                $ctrl.searchInfo.documentDateStart = new Date($ctrl.searchInfo.documentDateStringStart.split("/").reverse().join("/"));
            } else {
                $ctrl.searchInfo.documentDateStart = null;
            }
            if ($ctrl.searchInfo.documentDateStringEnd) {
                $ctrl.searchInfo.documentDateEnd = new Date($ctrl.searchInfo.documentDateStringEnd.split("/").reverse().join("/"));
            } else {
                $ctrl.searchInfo.documentDateEnd = null;
            }
            if ($ctrl.searchInfo.documentDateRDStringStart) {
                $ctrl.searchInfo.documentDateRDStart = new Date($ctrl.searchInfo.documentDateRDStringStart.split("/").reverse().join("/"));
            } else {
                $ctrl.searchInfo.documentDateRDStart = null;
            }
            if ($ctrl.searchInfo.documentDateRDStringEnd) {
                $ctrl.searchInfo.documentDateRDEnd = new Date($ctrl.searchInfo.documentDateRDStringEnd.split("/").reverse().join("/"));
            } else {
                $ctrl.searchInfo.documentDateRDEnd = null;
            }

            if ($ctrl.documentSigns != null) {
                $ctrl.searchInfo.arrDocumentSigns = $ctrl.documentSigns;
                angular.forEach($ctrl.documentSigns, function (value, key) {
                    if ($ctrl.searchInfo.documentSigns == '') {
                        $ctrl.searchInfo.documentSigns = value.fullName;
                    } else {
                        $ctrl.searchInfo.documentSigns += ',' + value.fullName;
                    }
                });
            }
            if ($ctrl.documentSignsDelivered != null) {
                $ctrl.searchInfo.arrDocumentSignsDelivered = $ctrl.documentSignsDelivered;
                angular.forEach($ctrl.documentSignsDelivered, function (value, key) {
                    if ($ctrl.searchInfo.documentSignsDelivered == '') {
                        $ctrl.searchInfo.documentSignsDelivered = value.id;
                    } else {
                        $ctrl.searchInfo.documentSignsDelivered += ',' + value.id;
                    }
                });
            }


            if ($ctrl.documentFields != null) {
                $ctrl.searchInfo.arrDocumentFields = $ctrl.documentFields;
                angular.forEach($ctrl.documentFields, function (value, key) {
                    if ($ctrl.searchInfo.documentFields == '') {
                        $ctrl.searchInfo.documentFields = value.id;
                    } else {
                        $ctrl.searchInfo.documentFields += ',' + value.id;
                    }
                });
            }
            if ($ctrl.documentTypes != null) {
                $ctrl.searchInfo.arrDocumentTypes = $ctrl.documentTypes;
                angular.forEach($ctrl.documentTypes, function (value, key) {
                    if ($ctrl.searchInfo.documentTypes == '') {
                        $ctrl.searchInfo.documentTypes = value.id;;
                    } else {
                        $ctrl.searchInfo.documentTypes += ',' + value.id;
                    }
                });
            }
            if ($ctrl.documentSecretLevels != null) {
                $ctrl.searchInfo.arrDocumentSecretLevels = $ctrl.documentSecretLevels;
                angular.forEach($ctrl.documentSecretLevels, function (value, key) {
                    if ($ctrl.searchInfo.documentSecretLevels == '') {
                        $ctrl.searchInfo.documentSecretLevels = value.id;
                    } else {
                        $ctrl.searchInfo.documentSecretLevels += ',' + value.id;
                    }
                });
            }
            if ($ctrl.documentUrgencyLevels != null) {
                $ctrl.searchInfo.arrDocumentUrgencyLevels = $ctrl.documentUrgencyLevels;
                angular.forEach($ctrl.documentUrgencyLevels, function (value, key) {
                    if ($ctrl.searchInfo.documentUrgencyLevels == '') {
                        $ctrl.searchInfo.documentUrgencyLevels = value.id;
                    } else {
                        $ctrl.searchInfo.documentUrgencyLevels += ',' + value.id;
                    }
                });
            }
            $uibModalInstance.close({ searchInfo: $ctrl.searchInfo, filter: $ctrl.filter });
        }

        $ctrl.reset = function () {
            $ctrl.searchInfo = {};
            $ctrl.documentSigns = [];
            $ctrl.documentSignsDelivered = [];
            $ctrl.documentFields = [];
            $ctrl.documentTypes = [];
            $ctrl.documentSecretLevels = [];
            $ctrl.documentUrgencyLevels = [];

            //$ctrl.loadDocumentSign();
            //$ctrl.loadDocumentType();
            //$ctrl.loadDocumentField();
        }

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            if ($ctrl.filter) {

            } else {
                $state.go('documentReceived')
            }
        };
    }

    documentFilterListController.$inject = ['$scope',
           'apiService',
           'notificationService',
           '$ngBootbox',
           '$http',
           '$state',
           '$timeout',
           '$stateParams',
           '$injector',
           '$rootScope',
           'dateformatService',
           '$uibModal'];

    function documentFilterListController($scope,
                                        apiService,
                                        notificationService,
                                        $ngBootbox,
                                        $http,
                                        $state,
                                        $timeout,
                                        $stateParams,
                                        $injector,
                                        $rootScope,
                                        dateformatService,
                                        $uibModal) {
        $scope.documentHistory = {};
        $scope.typeOfDocument = $stateParams.typeOfDocument;
        $scope.currentPage = $stateParams.currentPage;
        $scope.keyword = $stateParams.keyword;
        $scope.startDate = $stateParams.startDate;
        $scope.endDate = $stateParams.endDate;
        $scope.openModalFilter = function () {
            //console.log('openModalFilter');
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'documentFilter.html',
                controller: 'modalFilterDocumentController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                windowClass: 'app-modal-window',
                keyboard: false,
                resolve: {
                    data: function () {
                        return {
                            departmentId: $scope.authentication.departmentId,
                            searchInfo: $scope.objParam,
                            filter: $scope.filter
                        }
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.objParam = selectedItem;
                $scope.filter = selectedItem.filter;
                $scope.getListDocumentReceived(0, selectedItem);
            }, function () {

            });
            $scope.getListDocumentReceived = function (page, selectedItem) {
                page = page || 0;
                $scope.listItem = [];
                var config = {
                    params: {
                        documentReceived: selectedItem.searchInfo.documentReceived,
                        documentDelivered: selectedItem.searchInfo.documentDelivered,
                        legalDocument: selectedItem.searchInfo.legalDocument,
                        keyword: selectedItem.searchInfo.keyword,
                        documentDateStart: selectedItem.searchInfo.documentDateStart,
                        documentDateEnd: selectedItem.searchInfo.documentDateEnd,
                        documentDateRDStart: selectedItem.searchInfo.documentDateRDStart,
                        documentDateRDEnd: selectedItem.searchInfo.documentDateRDEnd,
                        documentSigns: selectedItem.searchInfo.documentSigns,
                        documentSignsDelivered: selectedItem.searchInfo.documentSignsDelivered,
                        documentFields: selectedItem.searchInfo.documentFields,
                        documentTypes: selectedItem.searchInfo.documentTypes,
                        documentSecretLevels: selectedItem.searchInfo.documentSecretLevels,
                        documentUrgencyLevels: selectedItem.searchInfo.documentUrgencyLevels,
                        departmentId: $scope.authentication.departmentId,
                        userId: $scope.authentication.userId,
                        listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                        pageNumber: page,
                        pageSize: 10
                    }
                }
                apiService.get($rootScope.baseUrl + 'api/DocumentReceived/SearchDocument', config,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            $scope.listItem = result.data.data;
                            $scope.page = result.data.pageNumber;
                            $scope.pagesCount = result.data.pagesCount;
                            $scope.totalCount = result.data.totalItems;
                            $scope.totalItems = result.data.totalItems;
                            $scope.currentPage = result.data.pageNumber;
                            $scope.recordsPerPage = config.params.pageSize;
                            angular.forEach($scope.listItem, function (value, key) {
                                if (value.historyId == null) {
                                    value.isBold = true;
                                }
                                else {
                                    value.isBold = false;
                                }
                            });
                        }
                    }, function (error) {
                    });
            }
        }
        $scope.saveDocumentHistory = function (historyId, documentId, receivedDocument) {
            var found = $scope.listItem.filter(function (item) {
                return item.id = documentId && item.isBold == true;
            });
            if (found.length > 0) {
                $scope.documentHistory.documentId = documentId;
                $scope.documentHistory.receivedDocument = receivedDocument;
                $scope.documentHistory.userId = $scope.authentication.userId;
                $scope.documentHistory.attempOn = dateformatService.addMoreHours(new Date());

                apiService.post($rootScope.baseUrl + 'api/DocumentHistory/Add', $scope.documentHistory
                    , function (result) {
                        if (result.isSuccess == true) {
                            $state.go('viewDocument', {
                                id: documentId,
                                typeOfDocument: $stateParams.typeOfDocument,
                                receivedDocument: receivedDocument,
                                currentPage: $stateParams.currentPage,
                                keyword: $stateParams.keyword,
                                startDate: $stateParams.startDate,
                                endDate: $stateParams.endDate
                            });
                        }
                        else {
                            console.log(result.message);
                        }
                    }
                    , function (error) {
                        console.log(error);
                    }
                );
            }
            else
            {
                $state.go('viewDocument', {
                    id: documentId,
                    typeOfDocument: $stateParams.typeOfDocument,
                    receivedDocument: receivedDocument,
                    currentPage: $stateParams.currentPage,
                    keyword: $stateParams.keyword,
                    startDate: $stateParams.startDate,
                    endDate: $stateParams.endDate
                });
            }
            angular.forEach($scope.listItem, function (value, key) {
                if (value.id == documentId) {
                    value.isBold = false;
                }
            });
        }

        var downloadFile = function (downloadPath) {
            window.open(downloadPath, '_blank', '');
        }

        $scope.downloadReport = function () {
            var selectedItem = $scope.objParam;
            var config = {
                params: {
                    documentReceived: selectedItem.searchInfo.documentReceived,
                    documentDelivered: selectedItem.searchInfo.documentDelivered,
                    legalDocument: selectedItem.searchInfo.legalDocument,
                    keyword: selectedItem.searchInfo.keyword,
                    documentDateStart: selectedItem.searchInfo.documentDateStart,
                    documentDateEnd: selectedItem.searchInfo.documentDateEnd,
                    documentDateRDStart: selectedItem.searchInfo.documentDateRDStart,
                    documentDateRDEnd: selectedItem.searchInfo.documentDateRDEnd,
                    documentSigns: selectedItem.searchInfo.documentSigns,
                    documentFields: selectedItem.searchInfo.documentFields,
                    documentTypes: selectedItem.searchInfo.documentTypes,
                    documentSecretLevels: selectedItem.searchInfo.documentSecretLevels,
                    documentUrgencyLevels: selectedItem.searchInfo.documentUrgencyLevels,
                    departmentId: $scope.authentication.departmentId,
                    userId: $scope.authentication.userId,
                    listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                    pageNumber: 1,
                    pageSize: 10
                }
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/DownloadDocumentBook', config
                , function (result) {
                    if (result.data.isSuccess == true) {
                        downloadFile($rootScope.baseUrl + result.data.value);
                    }
                }, null);

        }

        $scope.downloadTotalDocument = function () {
            var config = {
                params: {
                    fromDate: '6/1/2017',
                    toDate: '6/30/2017',
                    listDepartmentId: '',
                    departmentId: 15
                }
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/DownloadTotalDocument', config
              , function (result) {
                  if (result.data.isSuccess == true) {
                      downloadFile($rootScope.baseUrl + result.data.value);
                  }
              }, null);
        }
        $scope.openModalFilter();
    }

})(angular.module('VOfficeApp.documentReiceived'));