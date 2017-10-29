(function (app) {
    app.controller('taskListController', taskListController);
    app.controller('coutViewTaskController', coutViewTaskController);

    coutViewTaskController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                       'notificationService', '$stateParams', 'dateformatService', 'id', 'fogLoading'];

    taskListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        '$state',
        'dateformatService'
    , '$document', '$uibModal'];
    function coutViewTaskController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                     id, fogLoading) {
        var $ctr = this;
        $ctr.listViewTaskDetail = [];
        apiService.get($rootScope.baseUrl + 'api/TaskAssignee/GetTaskAssigneeViewDetail?taskId=' + id, null,
             function (result) {
                 $ctr.listViewTaskDetail = result.data.data;
             }, function (error) { });

        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function taskListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    $state,
                                    dateformatService,
                                    $document, $uibModal) {

        $(document.body).addClass('body-small');
        $(document.body).removeClass('mini-navbar');

        var departmentId = $scope.authentication.departmentId;
        var userId = $scope.authentication.userId;
        $scope.index = 0;
        $scope.index_a = 0;
        $scope.getAssign = null;
        $scope.getRelative = null;
        $scope.getAssignToMeTask = function () {
            $scope.index_a = $scope.index_a + 1;
            if ($scope.index_a % 2 == 0) {
                $scope.getAssign = null;
                if ($scope.getRelative == null) {
                    $scope.getRelative = true;
                    $scope.index += 1;
                }
            }
            else {
                $scope.getAssign = true;
            }
            search();
        }
        $scope.getRelativeToMeTask = function () {
            $scope.index = $scope.index + 1;
            if ($scope.index % 2 == 0) {
                $scope.getRelative = null;
                if ($scope.getAssign == null) {
                    $scope.getAssign = true;
                    $scope.index_a += 1;
                }
            }
            else {
                $scope.getRelative = true;
            }
            search();
        }
        $scope.getListStatus = getListStatus;
        $scope.getListStatus();
        function getListStatus() {
            if (($stateParams.assignToMe == null && $stateParams.relativeToMe == null) || ($stateParams.assignToMe != null && $stateParams.relativeToMe != null)) {
                $scope.getAssign = true;
                $scope.getRelative = true;
                $scope.index = 1;
                $scope.index_a = 1;
            }
            else if ($stateParams.assignToMe != null && $stateParams.relativeToMe == null) {
                $scope.getAssign = true;
                $scope.index_a = 1;
            }
            else if ($stateParams.assignToMe == null && $stateParams.relativeToMe != null) {
                $scope.getRelative = true;
                $scope.index = 1;
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByType?type=TASK', null, function (result) {
                if (result.data.isSuccess == false) {
                }
                else {
                    var obj = {
                        "id": 0,
                        "code": "KM",
                        "title": "-- Tất cả trạng thái --",
                        "active": true,
                        "deleted": true,
                        "createdOn": new Date(),
                        "createdBy": "sample string 7",
                        "editedOn": new Date(),
                        "editedBy": "sample string 9",
                        "type": "TASK"
                    };
                    $scope.listStatus = result.data.data;
                    $scope.listStatus.push(obj);
                    //$scope.selectedStatus = $scope.listStatus[$scope.listStatus.length - 1];

                    var status = $scope.listStatus.filter(function (item) {
                        return item.id == $scope.statusId;
                    });
                    if (status.length > 0) {
                        $scope.selectedStatus = status[0];
                    }
                    else {
                        $scope.selectedStatus = $scope.listStatus[0];
                    }
                }
            }, function () {
                console.log('Loading failed');
            });
        }
        $scope.listItems = [];
        $scope.selectedTaskId = 0;
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListTask = getListTask;
        $scope.search = search;
        $scope.deleteTask = deleteTask;
        $scope.statusId = 0;
        $scope.change = function (item) {
            $scope.statusId = item.id;
            search();
        }
        $scope.viewDetail = function (id) {
            $state.go('task_detail', { id: id, fromDate: null, toDate: null, statusId: $scope.statusId, currentPage: $scope.currentPage, keyword: $scope.keyword, assignToMe: $scope.getAssign, relativeToMe: $scope.getRelative });
        }
        function deleteTask(id) {
            $ngBootbox.confirm('Bạn có muốn xóa bản ghi này không')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/Task/DeleteLogical/' + id, null, function (result) {
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
            getListTask(page);
        }
        function getListTask(page) {
            page = page || 0;

            var config = {
                params: {
                    userId: userId,
                    statusId: $scope.statusId,
                    fromDate: null,
                    toDate: null,
                    keyword: $scope.keyword,
                    assignToMe: $scope.getAssign,
                    relativeToMe: $scope.getRelative,
                    pageSize: 10,
                    pageNumber: page
                }
            }
            if ($stateParams.statusId != null) {
                config.params.statusId = $stateParams.statusId;
                $scope.statusId = $stateParams.statusId;
                $stateParams.statusId = null;
            }
            if ($stateParams.currentPage != null) {
                config.params.PageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                config.params.keyword = $stateParams.keyword;
                $stateParams.keyword = null;
                $scope.keyword = config.params.keyword;
            }

            if ($stateParams.documentId != null) {
                config.params.documentId = $stateParams.documentId;
                $stateParams.documentId = null;
            }
            if ($stateParams.documentReceived != null) {
                config.params.documentReceived = $stateParams.documentReceived;
                $stateParams.documentReceived = null;
            }
            //if ($stateParams.assignToMe != null) {
            //    config.params.assignToMe = $stateParams.assignToMe;
            //    $stateParams.assignToMe = null;
            //    $scope.getAssign = config.params.assignToMe;
            //}
            //if ($stateParams.relativeToMe != null) {
            //    config.params.relativeToMe = $stateParams.relativeToMe;
            //    $stateParams.relativeToMe = null;
            //    $scope.getRelative = config.params.relativeToMe;
            //}

            apiService.get($rootScope.baseUrl + 'api/Task/Search?', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                //if (result.data.totalItems == 0)
                //notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.listItems = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Loading failed');
            });
        }

        $scope.getListTask();

        $scope.checkCreatedBy = function (createdBy) {
            if (userId == createdBy) {
                return false;
            }
            return true;
        }











        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        var listevents = [];
        $scope.hideActivity = function () {
            $scope.events = [];
            var sidebar = document.getElementById("right-sidebar");
            sidebar.style.display = "none";
        }
        $scope.showActivity = function (taskId) {
            $scope.selectedTaskId = taskId;
            loadTaskActivities(taskId);
        }
        var loadTaskActivities = function (taskId) {
            apiService.get($rootScope.baseUrl + 'api/Task/GetComplexTask?id=' + taskId, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                //Complete select
                $scope.taskInfo = result.data.value.code + ' - ' + result.data.value.title;

                var eventElement = {
                    badgeClass: '',
                    badgeIconClass: '',
                    title: '',
                    when: '',
                    contentHtml: ''
                };
                var countView = 0;
                angular.forEach(result.data.value.responseTaskActivities, function (value, key) {
                    if (value.action == "ADD") {
                        eventElement = {
                            badgeClass: 'info',
                            badgeIconClass: 'glyphicon-plus',
                            //title: value.fullName,
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(result.data.value.createdOn)),
                            contentHtml: '<p style="color:#333;">Tạo công việc</p> Chủ trì: <b>' + value.oldValue + '</b>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    if (value.action == "ASSIGN") {
                        eventElement = {
                            badgeClass: 'info',
                            badgeIconClass: 'glyphicon-plus',
                            //title: value.fullName,
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(result.data.value.createdOn)),
                            contentHtml: '<p style="color:#333;">Giao xử lý văn bản</p> Chủ trì: <b>' + value.oldValue + '</b>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "VIEW") {
                        countView++;
                        eventElement = {
                            badgeClass: 'success',
                            badgeIconClass: 'glyphicon-search',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">Xem chi tiết công việc</p>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "START") {
                        eventElement = {
                            badgeClass: 'warning',
                            badgeIconClass: 'glyphicon-play',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">Bắt đầu thực hiện công việc</p>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "UPDATE") {
                        eventElement = {
                            badgeClass: 'info',
                            badgeIconClass: 'glyphicon-edit',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">' + value.description.capitalize() + '</p>' + value.newValue,
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "FORWARD") {
                        eventElement = {
                            badgeClass: 'warning',
                            badgeIconClass: 'glyphicon-share-alt',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">' + value.description.capitalize() + '</p>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "RESOLVE") {
                        eventElement = {
                            badgeClass: 'info',
                            badgeIconClass: 'glyphicon-ok',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">Hoàn thành công việc</p>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "CLOSE") {
                        eventElement = {
                            badgeClass: 'success',
                            badgeIconClass: 'glyphicon-off',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">' + value.description.capitalize() + '</p>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "REOPEN") {
                        eventElement = {
                            badgeClass: 'warning',
                            badgeIconClass: 'glyphicon-folder-open',
                            titleContentHtml: '<img class=\'small-chat-avatar img-circle\' src=\'' + $rootScope.baseUrl + value.avatar + '\' />' + '<b class=\'activity-fullname\'>' + value.fullName + '</b>',
                            when: dateformatService.formatToDDMMYYhhmm(new Date(value.createdOn)),
                            contentHtml: '<p style="color:#333;">' + value.description.capitalize() + '</p>',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "EXPIRED") {
                        eventElement = {
                            badgeClass: 'danger',
                            badgeIconClass: 'glyphicon-bell',
                            title: '',
                            titleContentHtml: '<h4 class=\'expired-h4\'>QUÁ HẠN XỬ LÝ</h4>',
                            when: '',
                            contentHtml: '',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                    else if (value.action == "DUEDATE") {
                        eventElement = {
                            badgeClass: 'info',
                            badgeIconClass: 'glyphicon-info-sign',
                            title: '',
                            titleContentHtml: '<h4 class=\'duedate-h4\'>THỜI HẠN HOÀN THÀNH</h4><h4 class=\'duedate-h4\'>' + dateformatService.formatToDDMMYY(new Date(value.createdOn)) + '</h4>',
                            when: '',
                            contentHtml: '',
                            createdOn: value.createdOn
                        };
                        listevents.push(eventElement);
                    }
                });
                listevents = listevents.sort(function (a, b) { return new Date(a.createdOn) - new Date(b.createdOn) });
                $scope.events = listevents;
                listevents = [];
                if (countView == 0) {
                    $scope.countViewTask = 'Chưa có người nào xem thông tin công việc này';
                }
                else {
                    $scope.countViewTask = countView.toString() + ' người đã xem';
                }

                countView = 0;
                var sidebar = document.getElementById("right-sidebar");
                sidebar.style.display = "block";
            }, function () {
                console.log('Loading failed');
            });
        }

        var lorem = "";
        $scope.side = '';

        $scope.leftAlign = function () {
            $scope.side = 'left';
        }

        $scope.rightAlign = function () {
            $scope.side = 'right';
        }

        $scope.defaultAlign = function () {
            $scope.side = ''; // or 'alternate'
        }


        $scope.showCountViewTask = function () {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'showCountViewTask.html',
                controller: 'coutViewTaskController',
                controllerAs: '$ctr',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.selectedTaskId;
                    }
                }
            })
            modalInstance.result.then(function () {


            }, function (dis) {

            });
        };


    }
})(angular.module('VOfficeApp.task'));