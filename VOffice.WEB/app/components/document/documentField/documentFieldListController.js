(function (app) {
    app.controller('documentFieldListController', documentFieldListController);
    app.controller('selectDepartmentController', selectDepartmentController);
    selectDepartmentController.$inject = ['$uibModalInstance', '$rootScope', 'apiService',
                                        'notificationService', '$ngBootbox'];
    documentFieldListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        '$uibModal'];
    function selectDepartmentController($uibModalInstance, $rootScope, apiService, notificationService, $ngBootbox) {
        var $ctrl = this;
        $ctrl.listDepartments = [];
        $ctrl.getListDepartment = getListDepartment;
        $ctrl.cloneDocumentFieldForDepartment = cloneDocumentFieldForDepartment;
        function getListDepartment() {
            var config = {
                params: {
                    keyword: '',
                    parentId: 0,
                    active: true
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Department/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                $ctrl.listDepartments = result.data.data;
            }, function () {
                console.log('Load document Failed');
            });
        }
        $ctrl.getListDepartment();
        $ctrl.listChecked = [];
        $ctrl.checkAll = function () {
            if ($ctrl.selectedAll) {
                $ctrl.selectedAll = true;
                angular.forEach($ctrl.listDepartments, function (item) {
                    if (item.id != 3) {
                        if ($ctrl.listChecked.indexOf(item.id) == -1) {
                            $ctrl.listChecked.push(item.id);
                        }
                    }
                });
            } else {
                $ctrl.selectedAll = false;
                $ctrl.listChecked = [];
            }
            angular.forEach($ctrl.listDepartments, function (item) {
                item.Selected = $ctrl.selectedAll;
            });
        };
        $ctrl.setCheckAll = function (item) {
            // Check if checkAll should be unchecked
            if ($ctrl.selectedAll && !item.Selected) {
                $ctrl.selectedAll = false;
            }
            var index = $ctrl.listChecked.indexOf(item.id);
            if (item.Selected == false) {
                if (index != -1) {
                    $ctrl.listChecked.splice(index, 1);
                }
            }
            else {
                if (index == -1) {
                    $ctrl.listChecked.push(item.id);
                }
            }
        }
        //Nhân bản lĩnh vực
        function cloneDocumentFieldForDepartment() {
            $ngBootbox.confirm('Bạn có chắc chắn nhân bản không')
                               .then(function () {
                                   var strDepartmentId = ",";
                                   angular.forEach($ctrl.listChecked, function (item) {
                                       strDepartmentId += item + ',';
                                   });
                                   apiService.put($rootScope.baseUrl + 'api/DocumentField/CloneDocumentFieldSystem?ListDepartmentId=' + strDepartmentId, null, function (result) {
                                       if (result.data.isSuccess == false) {
                                           notificationService.displayError(result.message);
                                       }
                                       $uibModalInstance.dismiss('cancel');
                                   }, function (error) {
                                       notificationService.displayError(error);
                                   });
                               });
        }
        //Nhân bản lĩnh vực
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    function documentFieldListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    $uibModal) {
        //Form Search
        $scope.docFileds = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListDocumentField = getListDocumentField;
        $scope.search = search;
        $scope.deleteDocumentField = deleteDocumentField;
        function deleteDocumentField(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/DocumentField/DeleteLogical/' + id, null, function (result) {
                                        if (result.data.isSuccess) {
                                            notificationService.displaySuccess('Xóa thành công');
                                            search();
                                        }
                                        else {
                                            notificationService.displayError(result.data.message);
                                        }
                                    },
                                     function () {
                                         notificationService.displayError('Xóa không thành công');
                                     })
                                });
        }
        function search(page) {
            getListDocumentField(page);
        }
        function getListDocumentField(page) {
            var config = {
                params: {
                    keyword: $scope.keyword,
                    pageSize: 10,
                    pageNumber: page
                }
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
            apiService.get($rootScope.baseUrl + 'api/DocumentField/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.docFileds = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Load document Failed');
            });
        }
        $scope.getListDocumentField();
       
        function viewDepartment() {
            $('#modal-modalDepartment').modal({ backdrop: 'static' });
        }
        $scope.viewDepartment = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalDepartment.html',
                controller: 'selectDepartmentController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                windowClass: 'app-modal-window',
                keyboard: false,
                resolve: {
                }
            })
            //modalInstance.result.then(function (selectedItem) {
            //}, function () {
            //    //$log.info('Modal dismissed at: ' + new Date());
            //});
        };
    }
})(angular.module('VOfficeApp.documentField'));