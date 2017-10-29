(function (app) {
    app.controller('documentReceivedListController', documentReceivedListController);
    app.controller('retriveDocumentController', retriveDocumentController);
    app.controller('deleteDocumentController', deleteDocumentController);

    documentReceivedListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        'dateformatService',
        '$uibModal'
    ];

    retriveDocumentController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                         'notificationService', '$stateParams', 'id',
                                         'receivedDocument', 'typeOfDocument', 'currentPage', 'keyword', 'startDate', 'endDate', 'focus'];
    deleteDocumentController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                         'notificationService', '$stateParams', 'id',
                                         'receivedDocument', 'typeOfDocument', 'currentPage', 'keyword', 'startDate', 'endDate', 'focus'];
    function retriveDocumentController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams,
                                       id, receivedDocument, typeOfDocument, currentPage, keyword, startDate, endDate, focus) {
        var $ctr = this;
        function initDocumentDetail() {
            if (receivedDocument == 0) {
                apiService.get($rootScope.baseUrl + 'api/DocumentDelivered/Get/' + id, null, function (result) {
                    if (result.data.isSuccess == false)
                        notificationService.displayError(result.message);
                    else {
                        $ctr.documentInfo = result.data.value;
                        if ($ctr.documentInfo.retrieveText == null)
                            $ctr.documentInfo.retrieveText = '';
                    }
                    if (result.data.totalItems == 0)
                        notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                }, function (result) {
                    console.log('Loading failure' + result.data.value);
                });
            }
            else {
                apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Get/' + id, null, function (result) {
                    if (result.data.isSuccess == false)
                        notificationService.displayError(result.message);
                    else {
                        $ctr.documentInfo = result.data.value;
                    }
                    if (result.data.totalItems == 0)
                        notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                }, function (result) {
                    console.log('Loading failure' + result.data.value);
                });
            }
        }
        $ctr.initDocumentDetail = initDocumentDetail;
        $ctr.initDocumentDetail();
        $ctr.retrieveCurrentDocument = retrieveCurrentDocument;

        function retrieveCurrentDocument() {
            $ngBootbox.confirm('Bạn chắc chắn muốn thu hồi văn bản này?')
                               .then(function () {
                                   if ($ctr.documentInfo.retrieveText == '' || $ctr.documentInfo.retrieveText == null || $ctr.documentInfo.retrieveText == undefined) {
                                       notificationService.displayError('Lý do thu hồi không được trống');
                                       focus('txtContent');
                                   }
                                   else {
                                       var isReceived = receivedDocument ? 'true' : 'false';
                                       apiService.put($rootScope.baseUrl + 'api/DocumentReceived/RetrieveDocument/' + id + '?retrieveText=' + $ctr.documentInfo.retrieveText + '&receivedDocument=' + isReceived, null, function (result) {
                                           if (result.data.isSuccess) {
                                               notificationService.displaySuccess('Thu hồi văn bản thành công');
                                               $uibModalInstance.dismiss('cancel');
                                           }
                                           else {
                                               notificationService.displayError(result.data.message);
                                           }
                                       },
                                         function () {
                                             notificationService.displayError('Thu hồi văn bản không thành công');
                                         })
                                   }

                               });
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function deleteDocumentController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams,
                                      id, receivedDocument, typeOfDocument, currentPage, keyword, startDate, endDate, focus) {
        var $ctr = this;
        function initDocumentDetail() {
            if (receivedDocument == 0) {
                apiService.get($rootScope.baseUrl + 'api/DocumentDelivered/Get/' + id, null, function (result) {
                    if (result.data.isSuccess == false)
                        notificationService.displayError(result.message);
                    else {
                        $ctr.documentInfo = result.data.value;
                        if ($ctr.documentInfo.retrieveText == null)
                            $ctr.documentInfo.retrieveText = '';
                    }
                    if (result.data.totalItems == 0)
                        notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                }, function (result) {
                    console.log('Loading failure' + result.data.value);
                });
            }
            else {
                apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Get/' + id, null, function (result) {
                    if (result.data.isSuccess == false)
                        notificationService.displayError(result.message);
                    else {
                        $ctr.documentInfo = result.data.value;
                    }
                    if (result.data.totalItems == 0)
                        notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                }, function (result) {
                    console.log('Loading failure' + result.data.value);
                });
            }
        }
        $ctr.initDocumentDetail = initDocumentDetail;
        $ctr.initDocumentDetail();
        $ctr.deleteCurrentDocument = deleteCurrentDocument;

        function deleteCurrentDocument() {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa văn bản này?')
                               .then(function () {
                                   if ($ctr.documentInfo.retrieveText == '' || $ctr.documentInfo.retrieveText == null || $ctr.documentInfo.retrieveText == undefined) {
                                       notificationService.displayError('Lý do không được trống');
                                       focus('txtContent');
                                   }
                                   else {
                                       var isReceived = receivedDocument ? 'true' : 'false';
                                       apiService.put($rootScope.baseUrl + 'api/DocumentReceived/DeleteLogical/' + id + '?receivedDocument=' + isReceived + '&retrievedText=' + $ctr.documentInfo.retrieveText, null, function (result) {
                                           if (result.data.isSuccess) {
                                               notificationService.displaySuccess('Xóa văn bản thành công');
                                               $uibModalInstance.dismiss('cancel');
                                           }
                                           else {
                                               notificationService.displayError(result.data.message);
                                           }
                                       },
                                    function () {
                                        notificationService.displayError('Xóa văn bản không thành công');

                                    });
                                   }
                               });
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function documentReceivedListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    dateformatService,
                                    $uibModal
                                    ) {
        $(document.body).addClass('body-small');
        $(document.body).removeClass('mini-navbar');
        if (!$scope.index) $scope.index = 1;
        if (!$scope.index_a) $scope.index_a = 1;
        $scope.DocumentHistory = {};
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.endDate = date;
        $scope.listTypeOfDocument = [
           { name: 'Tất cả', id: 0 },
           { name: 'Văn bản đến', id: 1 },
           { name: 'Văn bản đi', id: 2 }
        ];
        $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[0];

        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var dayOne = new Date(y, m, 1);
        var firstDay = new Date(dayOne.getFullYear(), dayOne.getMonth(), 1);
        var lastDay = new Date(y, m + 1, 0);
        $scope.startDate = dateformatService.formatToDDMMYY(firstDay);
        $scope.endDate = dateformatService.formatToDDMMYY(lastDay);

        $scope.documentFormat = { 'id': 0, 'value': 'Tất cả' };
        $scope.pagesCount = 0;
        $scope.getListDocumentReceived = getListDocumentReceived;
        $scope.search = search;
        $scope.saveDocumentHistory = saveDocumentHistory;
        function retrieveDocument(id, receivedDocument) {
            var isReceived = receivedDocument ? 'true' : 'false';
            $scope.retrieveDocumentId = id;
            $scope.retrieveTypeOfDocument = isReceived;
            $scope.initDocumentDetail(id, receivedDocument);
            $('#modal-retriveDocument').modal({ backdrop: 'static' });
        }
        function retrieveCurrentDocument(id, receivedDocument) {
            $ngBootbox.confirm('Bạn chắc chắn muốn thu hồi văn bản này?')
                               .then(function () {
                                   apiService.put($rootScope.baseUrl + 'api/DocumentReceived/RetrieveDocument/' + id + '?receivedDocument=' + receivedDocument, null, function (result) {
                                       if (result.data.isSuccess) {
                                           notificationService.displaySuccess('Thu hồi văn bản thành công');
                                           $('#modal-retriveDocument').modal('hide');
                                           getListDocumentReceived();
                                       }
                                       else {
                                           notificationService.displayError(result.data.message);
                                       }
                                   },
                                     function () {
                                         notificationService.displayError('Thu hồi văn bản không thành công');
                                     })
                               });
        }

        function search() {
            getListDocumentReceived();
        }

        function pageChanged() {
            getListDocumentReceived();
        }
        function checkDate() {
            if ($scope.startDate == null || $scope.startDate == '') {
                return false;
            }
            else if ($scope.endDate == null || $scope.endDate == '') {
                return false;
            }
            return true;
        }
        function getListDocumentReceived(page) {
            $scope.listItem = [];

            page = page || 0;
            var receivedDocument;
            if ($scope.documentFormat.id == '1') {
                receivedDocument = true;
            }
            else {
                if ($scope.documentFormat.id == '2') {
                    receivedDocument = false;
                }
                else {
                    receivedDocument = null;
                }
            }
            if (checkDate() == true) {
                var config = {
                    params: {
                        type: $scope.selectedTypeOfDocument.id,
                        keyword: $scope.keyword,
                        startDate: $scope.startDate.split("/").reverse().join("-"),
                        endDate: $scope.endDate.split("/").reverse().join("-"),
                        userId: $scope.authentication.userId,
                        listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                        departmentId: $scope.authentication.departmentId,
                        pageNumber: page,
                        pageSize: 10
                    }
                }

                if ($stateParams.typeOfDocument != null) {
                    config.params.type = $stateParams.typeOfDocument;
                    if ($stateParams.typeOfDocument == 0) {
                        $scope.selectedTypeOfDocument = { name: 'Tất cả', id: 0 }
                        $scope.index = 1;
                        $scope.index_a = 1;
                    }
                    else {
                        if ($stateParams.typeOfDocument == 1) {
                            $scope.selectedTypeOfDocument = { name: 'Văn bản đến', id: 1 };
                            $scope.index = 0;
                            $scope.index_a = 1;
                        }
                        else {
                            $scope.selectedTypeOfDocument = { name: 'Văn bản đi', id: 2 };
                            $scope.index = 1;
                            $scope.index_a = 0;
                        }
                    }

                    $stateParams.typeOfDocument = null;
                }
                if ($stateParams.currentPage != null) {
                    config.params.pageNumber = $stateParams.currentPage;
                    $stateParams.currentPage = null;
                }
                if ($stateParams.keyword != null) {
                    config.params.keyword = $stateParams.keyword;
                    $stateParams.keyword = null;
                    $scope.keyword = config.params.keyword;
                }
                if ($stateParams.startDate != null) {
                    config.params.startDate = $stateParams.startDate.split("/").reverse().join("-");
                    $scope.startDate = $stateParams.startDate;
                    $stateParams.startDate = null;

                }
                if ($stateParams.endDate != null) {
                    config.params.endDate = $stateParams.endDate.split("/").reverse().join("-");
                    $scope.endDate = $stateParams.endDate;
                    $stateParams.endDate = null;
                }
               
                apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Search?', config, function (result) {
                    if (result.data.isSuccess == false)
                        notificationService.displayError(result.message);
                    if (result.data.totalItems == 0)
                        notificationService.displayError("Không tìm thấy bản ghi khả dụng");

                    $scope.listItem = result.data.data;
                    console.log($scope.listItem);
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

                }, function () {
                    console.log('Loading failure');
                });
            }
            else {
                notificationService.displayError('Không để trống thời gian');
            }
        }

        function saveDocumentHistory(historyId, documentId, receivedDocument) {
            var found = $scope.listItem.filter(function (item) {
                return item.id == documentId && item.isBold == true;
            });
            if (found.length > 0) {
                $scope.DocumentHistory.documentId = documentId;
                $scope.DocumentHistory.receivedDocument = receivedDocument;
                $scope.DocumentHistory.userId = $scope.authentication.userId;
                $scope.DocumentHistory.attempOn = dateformatService.addMoreHours(new Date());

                apiService.post($rootScope.baseUrl + 'api/DocumentHistory/Add', $scope.DocumentHistory
                    , function (result) {
                        if (result.isSuccess == true) {
                            console.log("Cập nhật trạng thái thành công");
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
            angular.forEach($scope.listItem, function (value, key) {
                if (value.id == documentId) {
                    value.isBold = false;
                }
            });
        }
        $scope.getListDocumentReceived();

        $scope.viewDocument = function (id, receivedDocument) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalDocument.html',
                controller: 'selectDocumentController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return id;
                    },
                    receivedDocument: function () {
                        return receivedDocument;
                    }
                }
            })

        };

        $scope.retrieveDocument = function (id, receivedDocument, typeOfDocument, currentPage, keyword, startDate, endDate) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'retrieveDocument.html',
                controller: 'retriveDocumentController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return id;
                    },
                    receivedDocument: function () {
                        return receivedDocument;
                    },
                    typeOfDocument: function () {
                        return typeOfDocument;
                    },
                    currentPage: function () {
                        return currentPage;
                    },
                    keyword: function () {
                        return keyword;
                    },
                    startDate: function () {
                        return startDate;
                    },
                    endDate: function () {
                        return endDate;
                    }
                }
            })
            modalInstance.result.then(function (selected) {
                $scope.search();
            }, function (dis) {
                $scope.search();
            });
        };
        $scope.deleteDocument = function (id, receivedDocument, typeOfDocument, currentPage, keyword, startDate, endDate) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'deleteDocument.html',
                controller: 'deleteDocumentController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return id;
                    },
                    receivedDocument: function () {
                        return receivedDocument;
                    },
                    typeOfDocument: function () {
                        return typeOfDocument;
                    },
                    currentPage: function () {
                        return currentPage;
                    },
                    keyword: function () {
                        return keyword;
                    },
                    startDate: function () {
                        return startDate;
                    },
                    endDate: function () {
                        return endDate;
                    }
                }
            })
            modalInstance.result.then(function (selected) {
                $scope.search();
            }, function (dis) {
                $scope.search();
            });
        };
        $scope.editDocument = function (id, receivedDocument, typeOfDocument, currentPage, keyword, startDate, endDate) {

        }

        $scope.startDateBlur = function () {
            if ($scope.startDate == null) {
                $scope.startDate = dateformatService.formatToDDMMYY(firstDay);
            }
        }
        $scope.endDateBlur = function () {
            if ($scope.endDate == null) {
                $scope.endDate = dateformatService.formatToDDMMYY(lastDay);
            }
        }


        $scope.getDocumentReceived = function () {
            $scope.index_a = $scope.index_a + 1;

            if (($scope.index_a + $scope.index) % 2 == 0) {
                $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[0];
                if ($scope.index_a % 2 == 0 && $scope.index % 2 == 0) {
                    $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[2];
                    $scope.index = $scope.index + 1;
                }

            } else {
                if ($scope.index_a % 2 != 0) {
                    $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[1];
                } else {
                    $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[2];
                }
            }


            search();
        }
        $scope.getDocumentDelivered = function () {
            $scope.index = $scope.index + 1;
            if (($scope.index_a + $scope.index) % 2 == 0) {
                $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[0];
                if ($scope.index_a % 2 == 0 && $scope.index % 2 == 0) {
                    $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[1];
                    $scope.index_a = $scope.index_a + 1;
                }
            }
            else {
                if ($scope.index % 2 != 0) {
                    $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[2];
                } else {
                    $scope.selectedTypeOfDocument = $scope.listTypeOfDocument[1];
                }
            }


            search();
        }
    }
})(angular.module('VOfficeApp.documentReiceived'));