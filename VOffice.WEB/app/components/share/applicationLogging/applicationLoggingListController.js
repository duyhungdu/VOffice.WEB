(function (app) {
    app.controller('applicationLoggingListController', applicationLoggingListController);
    app.controller('viewApplicationController', viewApplicationController);
    viewApplicationController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                        'notificationService', '$stateParams', 'dateformatService', 'typeAction',
                                        'typeActionText', 'id', 'createdBy', 'createdOn', 'modelName','userName'];
    applicationLoggingListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        'focus',
        '$ngBootbox',
        '$stateParams',
        '$uibModal',
        '$rootScope',
        'dateformatService'];
    function applicationLoggingListController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope,
                                    dateformatService) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var dayOne = new Date(y, m, 1);
        var firstDay = new Date(dayOne.getFullYear(), dayOne.getMonth(), 1);
        var lastDay = new Date(y, m + 1, 0);
        $scope.fromDate = dateformatService.formatToDDMMYY(firstDay);
        $scope.toDate = dateformatService.formatToDDMMYY(lastDay);
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.module = '';
        $scope.getList = getList;
        $scope.search = search;
        $scope.deleteApplication = deleteApplication;
        $scope.complexApplicationLogging = {};
        $scope.listModules =
           [{ name: 'Quản lý văn bản', value: 'DocumentDelivered,DocumentReceived,DocumentField,DocumentFieldDepartment,DocumentType,DocumentSignedBy,DocumentRecipent,ExternalSendReceiveDivision,DocumentDocumentField' },
           { name: 'Quản lý công việc', value: 'Task,Project,TaskAssignee,TaskActivity,TaskAttachment,TaskDocuments,TaskOpinion,TaskType,Customer' },
           { name: 'Lịch công tác', value: 'Event,ImportantJob,LeaderEvents,MeetingRoom,EventGoogleEvent' },
           { name: 'Cơ cấu tổ chức', value: 'Department,Staff,DepartmentStaff' },
           { name: 'Quản trị hệ thống', value: 'SystemConfig,SystemConfigDepartment,Function,ApplicationLogging,AspNetGroupRoles,AspNetGroups,AspNetGroupUsers,AspNetRoles,AspNetUsers,AspNetUserRole' }];
        function deleteApplication() {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa nhật ký hệ thống?')
                                .then(function () {
                                    if ($scope.fromDate == undefined || $scope.fromDate == null || $scope.toDate == undefined || $scope.toDate == null) {
                                        notificationService.displayError("Không để trống thời gian");
                                    }
                                    else {
                                        $scope.complexApplicationLogging = { fromDate: $scope.fromDate.split("/").reverse().join("-"), toDate: $scope.toDate.split("/").reverse().join("-"), type: $scope.module };
                                        console.log($scope.complexApplicationLogging);
                                        apiService.put($rootScope.baseUrl + 'api/ApplicationLogging/Delete', $scope.complexApplicationLogging, function (result) {
                                            if (result.data.isSuccess) {
                                                notificationService.displaySuccess('Xóa nhật ký thành công');
                                                search();
                                            }
                                            else {
                                                notificationService.displayError(result.data.message);
                                            }
                                        }, function () {
                                            notificationService.displayError('Xóa không thành công');
                                        })
                                    }

                                });
        }
        function search(page) {
            getList(page);
        }
        $scope.filter = function (value) {
            $scope.module = value;
            if ($scope.fromDate == null || $scope.fromDate == undefined || $scope.toDate == null || $scope.toDate == undefined) {
                notificationService.displayError("Không để trống thời gian");
            }
            else {
                search();
            }
        }
        function getList(page) {
            page = page || 0;
            var config = {
                params: {
                    fromDate: $scope.fromDate.split("/").reverse().join("-"),
                    toDate: $scope.toDate.split("/").reverse().join("-"),
                    module: $scope.module,
                    keyword: $scope.keyword,
                    pageSize: 100,
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
            apiService.get($rootScope.baseUrl + 'api/ApplicationLogging/Search?', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                $scope.listItem = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Load ApplicationLogging Failed');
            });
        }
        $scope.getList();
        $scope.viewApplication = function (typeAction, typeActionText, id, createdBy, createdOn, modelName, userName) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'viewApplication.html',
                controller: 'viewApplicationController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    typeAction: function () {
                        return typeAction;
                    },
                    typeActionText: function () {
                        return typeActionText;
                    },
                    id: function () {
                        return id;
                    },
                    createdBy: function () {
                        return createdBy;
                    },
                    createdOn: function () {
                        return createdOn;
                    },
                    modelName:function () {
                        return modelName;
                    },
                    userName: function () {
                        return userName;
                    },
                }
            })
            //modalInstance.result.then(function (selected) {
            //    $scope.search();
            //}, function (dis) {
            //    $scope.search();
            //});
        };
    }
    function viewApplicationController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                     typeAction, typeActionText, id, createdBy, createdOn, modelName, userName) {
        var $ctr = this;
        $ctr.applicationLogging = {};
        $ctr.createdBy = createdBy;
        $ctr.createdOn = createdOn;
        $ctr.typeActionText = typeActionText;
        $ctr.modelName = modelName;
        $ctr.userName = userName;
        $ctr.temp = [];
        apiService.get($rootScope.baseUrl + 'api/ApplicationLogging/Get/' + id, null,
               function (result) {
                   $ctr.item = result.data.value;
                   $ctr.temp = angular.fromJson($ctr.item.newValue);
               },
               function (error) {
                   notificationService.displayError('Không tìm thấy bản ghi khả dụng');
               })

        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
})(angular.module('VOfficeApp.applicationLogging'));




