
angular.module('VOfficeApp.documentReiceived').controller('documentAssignController', documentAssignController);

documentAssignController.$inject = ['$scope',
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
'fogLoading'];

function documentAssignController($scope,
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
                                    fogLoading) {
    $timeout(function () {
        var searchInput = document.getElementById('txtAssigne_value');
        searchInput.focus();
    }, 0);

    $scope.taskId = $stateParams.taskId;
    $scope.documentId = $stateParams.documentId;
    $scope.receivedDocument = $stateParams.receivedDocument;
    var departmentId = $scope.authentication.departmentId;
    var userId = $scope.authentication.userId;
    $scope.assignee = {};
    $scope.statusId = 0;

    //Init Form
    $scope.initDocumentDetail = initDocumentDetail;
    $scope.initDocumentDetail($scope.documentId, $scope.receivedDocument);

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

    $scope.initTaskStatus = initTaskStatus;
    $scope.initTaskStatus();
    function initTaskStatus() {
        var config = {
            params: {
                type: 'TASK',
                code: 'DEFAULT'
            }
        }
        apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
            if (result.data.isSuccess == false)
                notificationService.displayError(result.message);
            if (result.data.totalItems == 0)
                notificationService.displayError("Không tìm thấy bản ghi khả dụng");
            $scope.status = result.data.value;
        }, null);
    }

    $scope.getStaffs = getStaffs;
    $scope.getStaffs();
    function getStaffs() {
        apiService.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + departmentId, null,
            function (result) {
                $scope.staffs = result.data.data;
            },
            function (error) {
                console.log(error);
            });
    }

    var departmentIdQueryStaffs = departmentId;
    if ($scope.authentication.superLeader == "True") {
        departmentIdQueryStaffs = 0;
    }
    $scope.loadStaff = function ($query) {
        return $http.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + departmentIdQueryStaffs, { cache: true }).then(function (response) {
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

    $scope.forceOneTag = function (tags) {
        if ($scope.mainAssignees != null) {
            var array = $scope.mainAssignees;
            if (array.length > 1) {
                var objRemove = {};
                for (var i = 0; i < array.length; i++) {
                    if (array[i].aspNetUserId == tags.aspNetUserId) {
                        objRemove = array[i];
                        array.splice(i, 1);
                    }
                }
            }
            else {
                $scope.mainAssignees = array;
            }
        }
        else {

        }
    }
    //End init form

    //Save
    var task = {};
    $scope.task = task;
    $scope.save = save;
    function save() {

        if ($scope.taskId == 0) {
            $scope.task = {
                code: 'auto_generate',
                title: $scope.documentInfo.title,
                departmentId: departmentId,
                description: $scope.description,
                statusId: $scope.status.id,
                order: 0,
                priority: 1,
                deleted: false,
                startDate: dateformatService.addMoreHours(new Date()),
                estimate: 0,
                timeSpent: 0,
                contactInformation: '',
                rating: 1,
                result: '',
                active: 1,
                deleted: 0,
                createdOn: dateformatService.addMoreHours(new Date()),
                createdBy: userId,
                editedOn: dateformatService.addMoreHours(new Date()),
                editedBy: userId,
            };
            addTask();
        }
        else {
            updateTask();
        }
    }
    function addTask() {
       
        
        $scope.task.assign = true;
        if ($scope.mainAssignees != null && $scope.mainAssignees.length > 0) {
            var mainAssigneeFullName = $scope.mainAssignees[0].fullName;
            $ngBootbox.confirm('Bạn chắc chắn muốn giao xử lý văn bản này?')
                           .then(function () {
                               fogLoading('fog-modal-small', 'block');
                               fetchSelectedMainAssignee($scope.mainAssignees);
                               fetchSelectedCoprocessor($scope.coprocessors);
                               fetchSelectedSupervisor($scope.supervisors);
                               apiService.post($rootScope.baseUrl + 'api/Task/Add', $scope.task,
                                   function (result) {
                                       if (!result.data.isValid) {
                                           angular.forEach(result.data.brokenRules, function (value, key) {
                                               notificationService.displayError(value.rule);
                                           });
                                           return;
                                       }                                       
                                       //Done POST Task
                                       $scope.taskAddedId = result.data.value.id;
                                       $scope.taskAddedDescription = result.data.value.description;
                                       $scope.taskAddedTitle = result.data.value.title;
                                       var listTaskAssinee = [];
                                       listTaskAssinee = applyTaskIdToListAssignee(listMainAssignee, listCoprocessor, listSupervisor, listTaskAssinee, result.data.value.id);

                                       angular.forEach(listTaskAssinee, function (value, key) {
                                           value.documentId = $scope.documentInfo.id;
                                           value.receivedDocument = $scope.receivedDocument;
                                       });

                                       apiService.post($rootScope.baseUrl + 'api/TaskAssignee/Add', listTaskAssinee, function (result) {
                                           //Start refrence Task - Documents
                                           var taskDocuments = {
                                               taskId: $scope.taskAddedId,
                                               documentId: $scope.documentInfo.id,
                                               receivedDocument: $scope.receivedDocument != 1 ? false : true,
                                               createdOn: dateformatService.addMoreHours(new Date()),
                                               createdBy: userId
                                           };
                                          
                                           apiService.post($rootScope.baseUrl + 'api/TaskDocuments/Add', taskDocuments, function (result) {
                                               var newDueDateTaskActivity = {};
                                               if ($scope.taskAddedDescription != null && $scope.taskAddedDescription != '') {
                                                   newDueDateTaskActivity = { id: null, recordId: $scope.taskAddedId, action: 'ASSIGN', type: 1, display: true, flowDescription: 'giao xử lý văn bản', description: 'giao xử lý văn bản: ' + $scope.taskAddedTitle, taskfield: 'Description', oldValue: mainAssigneeFullName, newValue: 'Nội dung: ' + $scope.taskAddedDescription, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                               }
                                               else {
                                                   newDueDateTaskActivity = { id: null, recordId: $scope.taskAddedId, action: 'ASSIGN', type: 1, display: true, flowDescription: 'giao xử lý văn bản', description: 'giao xử lý văn bản: ' + $scope.taskAddedTitle, taskfield: '', oldValue: mainAssigneeFullName, newValue: '', createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                               }
                                                
                                               apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newDueDateTaskActivity,
                                     function (result) {
                                         fogLoading('fog-modal-small', 'none');
                                         console.log('newDueDateTaskActivity');
                                         console.log(newDueDateTaskActivity);
                                         notificationService.displaySuccess('Giao xử lý văn bản <b>' + $scope.documentInfo.title + " - " + $scope.documentInfo.title + '</b> thành công');
                                         var stateService = $injector.get('$state');
                                         stateService.go('task');
                                     }, function (error) { });
                                           }, null);
                                       }, null);

                                   }, function (error) {
                                       notificationService.displayError('Giao xử lý không thành công');
                                   });
                           });
        }
        else {
            notificationService.displayError('Chọn người xử lý chính');
            document.getElementById('abc').focus();
        }

    }
    function updateTask() {

    }
    //End Save
    //Fetching data
    var assignee = { userId: '', assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, documentId: 0, receivedDocument: 0 };
    $scope.assignee = assignee;
    function getAssigneeSelected(assignee) {

        if (assignee != null) {
            $scope.assignee.userId = assignee.originalObject.userId;
        }
        else {
            $scope.assignee = { userId: '', assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, documentId: 0, receivedDocument: 0 };
        }

    }
    $scope.selectedAssignee = getAssigneeSelected;


    var listMainAssignee = [];
    function fetchSelectedMainAssignee(copr) {
        angular.forEach(copr, function (value, key) {
            var mainassignee = { userId: value.aspNetUserId, assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, documentId: 0, receivedDocument: 0 }
            listMainAssignee.push(mainassignee);
        });
        $scope.listMainAssignee = listMainAssignee;
    }

    var listCoprocessor = [];
    function fetchSelectedCoprocessor(copr) {
        angular.forEach(copr, function (value, key) {
            var coprocessor = { userId: value.aspNetUserId, assignee: 0, coprocessor: 1, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, documentId: 0, receivedDocument: 0 }
            listCoprocessor.push(coprocessor);
        });
        $scope.listCoprocessor = listCoprocessor;
    }

    var listSupervisor = [];
    function fetchSelectedSupervisor(spv) {
        angular.forEach(spv, function (value, key) {
            var supervisor = { userId: value.aspNetUserId, assignee: 0, coprocessor: 0, supervisor: 1, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, documentId: 0, receivedDocument: 0 }
            listSupervisor.push(supervisor);
        });
        $scope.listSupervisor = listSupervisor;
    }


    function applyTaskIdToListAssignee(listMainAssignee, listCoprocessor, listSupervisor, listTaskAssignee, taskId) {

        var countMainAssignee = 0;
        angular.forEach(listMainAssignee, function (value, key) {
            value.taskId = taskId;
            value.order = countMainAssignee;
            listTaskAssignee.push(value);
            countMainAssignee++;
        });


        var countCoprocessor = 0;
        angular.forEach(listCoprocessor, function (value, key) {
            value.taskId = taskId;
            value.order = countCoprocessor;
            listTaskAssignee.push(value);
            countCoprocessor++;
        });


        var countSupervisor = 0;
        angular.forEach(listSupervisor, function (value, key) {
            value.taskId = taskId;
            value.order = countSupervisor;
            listTaskAssignee.push(value);
            countSupervisor++;
        });
        return listTaskAssignee;
    }
    //End fetching data

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

