(function (app) {
    app.controller('systemConfigListController', systemConfigListController);
    app.controller('cloneSystemConfigController', cloneSystemConfigController);
    cloneSystemConfigController.$inject = ['$uibModalInstance', '$rootScope', 'apiService',
                                        'notificationService', '$ngBootbox'];
    systemConfigListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        'focus',
        '$ngBootbox',
        '$stateParams',
        '$uibModal',
        '$rootScope'];

    function systemConfigListController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');

        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListSystemConfig = getListSystemConfig;
        $scope.search = search;
        $scope.deleteSystemConfig = deleteSystemConfig;
        $scope.systemConfig = {};

        function deleteSystemConfig(id) {
            $ngBootbox.confirm('Bạn có muốn xóa bản ghi này không')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/SystemConfig/DeleteLogical/' + id, null, function (result) {
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
            getListSystemConfig(page);
        }

        function getListSystemConfig(page) {
            var config = {
                params: {
                    keyword: $scope.keyword,
                    pageSize: 10,
                    pageNumber: page,
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
            apiService.get($rootScope.baseUrl + 'api/SystemConfig/Search?', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi nào");
                //console.log($scope.listItem);
                $scope.listItem = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Load systemconfig Failed');
            });
        }
        $scope.getListSystemConfig();
        function cloneSystemConfig() {
            $('#modal-modalcloneSystemConfig').modal({ backdrop: 'static' });
        }
        $scope.cloneSystemConfig = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalcloneSystemConfig.html',
                controller: 'cloneSystemConfigController',
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
    function cloneSystemConfigController($uibModalInstance, $rootScope, apiService, notificationService, $ngBootbox) {
        var $ctrl = this;
        $ctrl.listDepartments = [];
        $ctrl.getListDepartment = getListDepartment;
        $ctrl.cloneSystemConfigForDepartment = cloneSystemConfigForDepartment;
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
        function cloneSystemConfigForDepartment() {
            $ngBootbox.confirm('Bạn có chắc chắn nhân bản không')
                               .then(function () {
                                   var strDepartmentId = ",";
                                   angular.forEach($ctrl.listChecked, function (item) {
                                       strDepartmentId += item + ',';
                                   });
                                   apiService.put($rootScope.baseUrl + 'api/SystemConfig/CloneSystemConfig?ListDepartmentId=' + strDepartmentId, null, function (result) {
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
})(angular.module('VOfficeApp.systemConfig'));




