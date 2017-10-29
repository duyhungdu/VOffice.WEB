(function (app) {
    app.controller('taskreportListController', taskreportListController);
    app.controller('taskreportController', taskreportController);
    taskreportListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        '$state',
        'dateformatService',
        '$uibModal'
    ];
    taskreportController.$inject = ['$scope',
      'apiService',
      'notificationService',
      '$ngBootbox',
      '$stateParams',
      '$rootScope',
      '$state',
      'dateformatService',
      '$uibModalInstance',
      '$http',
      'focus',
      'departmentId',
      'keyword',
      'status',
      'fromDate',
      'toDate',
      'startFromDate',
      'startToDate',
      'dueFromDate',
      'dueToDate',
      'taskType',
      'project',
      'assignee',
      'coprocessor',
      'supervisor',
      'customer',
      'taskAssignee',
      'keywordDoc',
      'listStatus',
      'listAssignee',
      'listcoprocessor',
      'listsupervisor',
      'listProject',
      'listTaskType',
      'listCustomer'
    ];

    function taskreportListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    $state,
                                    dateformatService,
                                    $uibModal) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');

        var departmentId = $scope.authentication.departmentId;
        var userId = $scope.authentication.userId;
        $scope.listItems = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.transit = {};
        $scope.getListTask = getListTask;
        function getListTask(page) {
            page = page || 0;
            var config = {
                params: {
                    departmentId: departmentId,
                    userId: userId,
                    status: $scope.transit.status,
                    keyword: $scope.transit.keyword,
                    fromDate: $scope.transit.fromDate == null ? null : $scope.transit.fromDate.split("/").reverse().join("-"),
                    toDate: $scope.transit.toDate == null ? null : $scope.transit.toDate.split("/").reverse().join("-"),
                    startFromDate: $scope.transit.startFromDate == null ? null : $scope.transit.startFromDate.split("/").reverse().join("-"),
                    startToDate: $scope.transit.startToDate == null ? null : $scope.transit.startToDate.split("/").reverse().join("-"),
                    dueFromDate: $scope.transit.dueFromDate == null ? null : $scope.transit.dueFromDate.split("/").reverse().join("-"),
                    dueToDate: $scope.transit.dueToDate == null ? null : $scope.transit.dueToDate.split("/").reverse().join("-"),
                    taskType: $scope.transit.taskType,
                    project: $scope.transit.project,
                    assignee: $scope.transit.assignee,
                    coprocessor: $scope.transit.coprocessor,
                    supervisor: $scope.transit.supervisor,
                    customer: $scope.transit.customer,
                    taskAssignee: $scope.transit.taskAssignee,
                    keywordDoc: $scope.transit.keywordDoc,
                    pageSize: 10,
                    pageNumber: page,
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Task/GetTaskAdvance?', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
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
        var downloadFile = function (downloadPath) {
            window.open(downloadPath, '_blank', '');
        }
        var lstTask = [];
        $scope.getTaskReport = getTaskReport;
        function getTaskReport() {
            var config = {
                params: {
                    departmentId: departmentId,
                    userId: userId,
                    status: $scope.transit.status,
                    keyword: $scope.transit.keyword,
                    fromDate: $scope.transit.fromDate == null ? null : $scope.transit.fromDate.split("/").reverse().join("-"),
                    toDate: $scope.transit.toDate == null ? null : $scope.transit.toDate.split("/").reverse().join("-"),
                    startFromDate: $scope.transit.startFromDate == null ? null : $scope.transit.startFromDate.split("/").reverse().join("-"),
                    startToDate: $scope.transit.startToDate == null ? null : $scope.transit.startToDate.split("/").reverse().join("-"),
                    dueFromDate: $scope.transit.dueFromDate == null ? null : $scope.transit.dueFromDate.split("/").reverse().join("-"),
                    dueToDate: $scope.transit.dueToDate == null ? null : $scope.transit.dueToDate.split("/").reverse().join("-"),
                    taskType: $scope.transit.taskType,
                    project: $scope.transit.project,
                    assignee: $scope.transit.assignee,
                    coprocessor: $scope.transit.coprocessor,
                    supervisor: $scope.transit.supervisor,
                    customer: $scope.transit.customer,
                    taskAssignee: $scope.transit.taskAssignee,
                    keywordDoc: $scope.transit.keywordDoc
                }
            }
            console.log(config);
            apiService.get($rootScope.baseUrl + 'api/Task/DownloadTaskAdvance?', config
                , function (result) {
                    if (result.data.isSuccess == true) {
                        lstTask = result.data.value;
                        console.log(lstTask);
                       downloadFile($rootScope.baseUrl + lstTask);
                    }
                }, null);
        }
        $scope.downloadTaskReport = function () {
            getTaskReport();
        }
        $scope.viewDetail = function (id) {
            $state.go('task_detail', { id: id, statusId: $stateParams.statusId, fromDate: $stateParams.fromDate, toDate: $stateParams.toDate, currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, assignToMe: $stateParams.assignToMe, relativeToMe: $stateParams.relativeToMe });
        }
        $scope.returnListTask = function () {
            $state.go('task', { statusId: $stateParams.statusId, fromDate: $stateParams.fromDate, toDate: $stateParams.toDate, currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, assignToMe: $stateParams.assignToMe, relativeToMe: $stateParams.relativeToMe });
        }
        $scope.viewTaskReport = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'taskReport.html',
                controller: 'taskreportController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    departmentId: function () {
                        return departmentId;
                    },
                    keyword: function () {
                        return $scope.transit.keyword
                    },
                    status: function () {
                        return $scope.transit.status
                    },
                    fromDate: function () {
                        return $scope.transit.fromDate
                    },
                    toDate: function () {
                        return $scope.transit.toDate
                    },
                    startFromDate: function () {
                        return $scope.transit.startFromDate
                    },
                    startToDate: function () {
                        return $scope.transit.startToDate
                    },
                    dueFromDate: function () {
                        return $scope.transit.dueFromDate
                    },
                    dueToDate: function () {
                        return $scope.transit.dueToDate
                    },
                    taskType: function () {
                        return $scope.transit.taskType
                    },
                    project: function () {
                        return $scope.transit.project
                    },
                    assignee: function () {
                        return $scope.transit.assignee
                    },
                    coprocessor: function () {
                        return $scope.transit.coprocessor
                    },
                    supervisor: function () {
                        return $scope.transit.supervisor
                    },
                    customer: function () {
                        return $scope.transit.customer
                    },
                    taskAssignee: function () {
                        return $scope.transit.taskAssignee
                    },
                    keywordDoc: function () {
                        return $scope.transit.keywordDoc
                    },
                    listStatus: function () {
                        return $scope.transit.listStatus
                    },
                    listAssignee: function () {
                        return $scope.transit.listAssignee
                    },
                    listcoprocessor: function () {
                        return $scope.transit.listcoprocessor
                    },
                    listsupervisor: function () {
                        return $scope.transit.listsupervisor
                    },
                    listCustomer: function () {
                        return $scope.transit.listCustomer
                    },
                    listTaskType: function () {
                        return $scope.transit.listTaskType
                    },
                    listProject: function () {
                        return $scope.transit.listProject
                    }
                }
            })
            modalInstance.result.then(function (result) {
                $scope.transit = result;
                $scope.getListTask();
            }, function (dis) {
            });
        };
        $scope.viewTaskReport();
    }
    function taskreportController($scope,
                                  apiService,
                                  notificationService,
                                   $ngBootbox,
                                   $stateParams,
                                   $rootScope,
                                   $state,
                                   dateformatService,
                                   $uibModalInstance,
                                   $http,
                                   focus,
                                   departmentId,
                                   keyword,
                                   status,
                                   fromDate,
                                   toDate,
                                   startFromDate,
                                   startToDate,
                                   dueFromDate,
                                   dueToDate,
                                   taskType,
                                   project,
                                   assignee,
                                   coprocessor,
                                   supervisor,
                                   customer,
                                   taskAssignee,
                                   keywordDoc,
                                   listStatus,
                                   listAssignee,
                                   listcoprocessor,
                                   listsupervisor,
                                   listProject,
                                   listTaskType,
                                   listCustomer
                                  ) {
        var $ctr = this;
        //Trạng thái
        $ctr.loadStatus = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/Status/GetByType?type=TASK', { cache: true }).then(function (response) {
                var status = response.data.data;
                return status.filter(function (obj) {
                    return obj.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }
        // Mảng công việc
        $ctr.loadTaskType = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/TaskType/GetByDepartment?departmentId=' + departmentId + '&keyword=', { cache: true }).then(function (response) {
                var taskType = response.data.data;
                return taskType.filter(function (obj) {
                    return obj.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }
        // Người xử lý
        $ctr.loadStaff = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + departmentId, { cache: true }).then(function (response) {
                var listStaff = response.data.data;
                angular.forEach(listStaff, function (value, key) {
                    if (value.avatar != null && value.avatar != '') {
                        value.avatar = $rootScope.baseUrl + value.avatar;
                    }
                    else {
                        value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                    }
                });
                return listStaff.filter(function (staff) {
                    return staff.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        };
        //Mảng công việc
        $ctr.loadProject = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/Project/GetByDepartment?departmentId=' + departmentId + '&keyword=', { cache: true }).then(function (response) {
                var projects = response.data.data;
                return projects.filter(function (obj) {
                    return obj.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }
        //Khách hàng
        $ctr.loadCustomer = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/Customer/GetByDepartment?departmentId=' + departmentId + '&keyword=', { cache: true }).then(function (response) {
                var customers = response.data.data;
                return customers.filter(function (obj) {
                    return obj.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }
        $ctr.checkFromToDate = function (type) {
            if ($ctr.fromDate != null && $ctr.fromDate != '' && $ctr.toDate != null && $ctr.toDate != '') {
                var result = dateformatService.compareTwoDate($ctr.fromDate, $ctr.toDate);
                if (result == -1) {
                    if (type == 1) {
                        notificationService.displayError('Từ ngày phải trước đến ngày');
                        $ctr.fromDate = null;
                        focus("txtFromDate");
                        return;
                    }
                    else if(type==0){
                        notificationService.displayError('Đến ngày phải sau từ ngày');
                        $ctr.toDate = null;
                        focus('txtToDate');
                        return;
                    }
                }
                else {
                }
            }
        }
        $ctr.checkStartFromToDate = function (type) {
            if ($ctr.startFromDate != null && $ctr.startFromDate != '' && $ctr.startToDate != null && $ctr.startToDate != '') {
                var result = dateformatService.compareTwoDate($ctr.startFromDate, $ctr.startToDate);
                if (result == -1) {
                    if (type == 1) {
                        notificationService.displayError('Ngày bắt đầu từ phải trước ngày bắt đầu đến');
                        $ctr.startFromDate = null;
                        focus("txtStartFromDate");
                        return;
                    }
                    else if (type == 0) {
                        notificationService.displayError('Ngày bắt đầu đến phải sau ngày bắt đầu từ');
                        $ctr.startToDate = null;
                        focus('txtStartDueDate');
                        return;
                    }
                }
                else {
                }
            }
        }
        $ctr.checkDueFromToDate = function (type) {
            if ($ctr.dueFromDate != null && $ctr.dueFromDate != '' && $ctr.dueToDate != null && $ctr.dueToDate != '') {
                var result = dateformatService.compareTwoDate($ctr.dueFromDate, $ctr.dueToDate);
                if (result == -1) {
                    if (type == 1) {
                        notificationService.displayError('Hết hạn từ phải trước hết hạn đến');
                        $ctr.dueFromDate = null;
                        focus("txtDueFromDate");
                        return;
                    }
                    else if (type == 0) {
                        notificationService.displayError('Hết hạn đến phải sau hết hạn từ');
                        $ctr.dueToDate = null;
                        focus('txtDueToDate');
                        return;
                    }
                }
                else {
                }
            }
        }
        $ctr.ok = function () {
            var lstCoprocessor = '';
            var lstSupervisors = '';
            var lstMainAssignee = '';
            var lstCustomer = '';
            var lstProject = '';
            var lstTaskType = '';
            var lstStatus = '';
            if ($ctr.coprocessor != null) {
                angular.forEach($ctr.coprocessor, function (value, key) {
                    lstCoprocessor += ',' + value.id;
                });
            }
            if ($ctr.status != null) {
                angular.forEach($ctr.status, function (value, key) {
                    lstStatus += ',' + value.id;
                });
            }
            if ($ctr.supervisors != null) {
                angular.forEach($ctr.supervisors, function (value, key) {
                    lstSupervisors += ',' + value.id;
                });
            }
            if ($ctr.mainAssignees != null) {
                angular.forEach($ctr.mainAssignees, function (value, key) {
                    lstMainAssignee += ',' + value.id;
                });
            }
            if ($ctr.projects != null) {
                angular.forEach($ctr.projects, function (value, key) {
                    lstProject += ',' + value.id;
                });
            }
            if ($ctr.customers != null) {
                angular.forEach($ctr.customers, function (value, key) {
                    lstCustomer += ',' + value.id;
                });
            }
            if ($ctr.taskTypes != null) {
                angular.forEach($ctr.taskTypes, function (value, key) {
                    lstTaskType += ',' + value.id;
                });
            }
            var obj = {
                customer: lstCustomer,
                status: lstStatus,
                keyword: $ctr.keyword == undefined ? '' : $ctr.keyword,
                fromDate: $ctr.fromDate == undefined ? null : $ctr.fromDate,
                toDate: $ctr.toDate == undefined ? null : $ctr.toDate,
                startFromDate: $ctr.startFromDate == undefined ? null : $ctr.startFromDate,
                startToDate: $ctr.startToDate == undefined ? null : $ctr.startToDate,
                dueFromDate: $ctr.dueFromDate == undefined ? null : $ctr.dueFromDate,
                dueToDate: $ctr.dueToDate == undefined ? null : $ctr.dueToDate,
                taskType: lstTaskType,
                project: lstProject,
                assignee: lstMainAssignee,
                coprocessor: lstCoprocessor,
                supervisor: lstSupervisors,
                taskAssignee: $ctr.taskAssignee == undefined ? false : $ctr.taskAssignee,
                keywordDoc: $ctr.keywordDoc == undefined ? '' : $ctr.keywordDoc,
                listStatus: $ctr.status,
                listAssignee: $ctr.mainAssignees,
                listcoprocessor: $ctr.coprocessor,
                listsupervisor: $ctr.supervisors,
                listProject: $ctr.projects,
                listTaskType: $ctr.taskTypes,
                listCustomer: $ctr.customers,
            }
            $uibModalInstance.close(obj);
        }
        $ctr.loadDefault = loadDefault;
        function loadDefault() {
            $ctr.keyword = keyword;
            $ctr.fromDate = fromDate;
            $ctr.toDate = toDate;
            $ctr.startFromDate = startFromDate;
            $ctr.startToDate = startToDate;
            $ctr.dueFromDate = dueFromDate;
            $ctr.dueToDate = dueToDate;
            $ctr.taskAssignee = taskAssignee;
            $ctr.keywordDoc = keywordDoc;
            $ctr.coprocessor = listcoprocessor;
            $ctr.supervisors = listsupervisor;
            $ctr.mainAssignees = listAssignee;
            $ctr.projects = listProject;
            $ctr.taskTypes = listTaskType;
            $ctr.customers = listCustomer;
            $ctr.status = listStatus;

        }
        $ctr.loadDefault();
        $ctr.reset = function () {
            $ctr.keyword = '';
            $ctr.fromDate = null;
            $ctr.toDate = null;
            $ctr.startFromDate = null;
            $ctr.startToDate = null;
            $ctr.dueFromDate = null;
            $ctr.dueToDate = null;
            $ctr.customers = null;
            $ctr.taskTypes = null;
            $ctr.projects = null;
            $ctr.supervisors = null;
            $ctr.coprocessor = null;
            $ctr.mainAssignees = null;
            $ctr.status = null;
            $ctr.taskAssignee = false;
            $ctr.keywordDoc = null;
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})(angular.module('VOfficeApp.taskreport'));