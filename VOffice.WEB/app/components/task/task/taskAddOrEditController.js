
(function (app) {
    app.controller('taskAddOrEditController', taskAddOrEditController);

    taskAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      'fogLoading',
                                      '$state',
                                      '$stateParams',
                                      '$http',
                                      '$rootScope',
                                      '$timeout',
                                      '$ngBootbox',
                                        'dateformatService'];

    function taskAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    fogLoading,
                                    $state,
                                    $stateParams,
                                    $http,
                                    $rootScope,
                                    $timeout,
                                    $ngBootbox, dateformatService) {
        //Focus on loaded
        $timeout(function () {
            var searchInput = document.getElementById('title');
            searchInput.focus();
        }, 0);
        //End focus on loaded
        //Global Declare
        var departmentId = $scope.authentication.departmentId;
        var userId = $scope.authentication.userId;
        var listSubDepartmentId = $scope.authentication.ListSubDepartmentId;
        var shortDepartmentName = $scope.authentication.departmentShortName;
        $scope.listTaskAttachment = [];

        var assignee = { userId: '', assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, fullName: '' };
        $scope.assignee = assignee;
        var listAssignee = [];
        var listCoprocessor = [];
        var listSupervisor = [];
        $scope.listDocument = [];
        $scope.listPriorities = [
          { name: 'Thấp', id: 0 },
          { name: 'Trung bình', id: 1 },
          { name: 'Cao', id: 2 }
        ];

        var id = 0;

        if ($stateParams.id != null) {
            id = $stateParams.id;
        }
        getTask(id, function taskLoaded(result) {
            $scope.task = result.data.value;
            if ($scope.task.description != null && $scope.task.description != '') {
                $scope.task.description = $scope.task.description.replace(/<br\s*\/?>/gi, '\n');
            }
            loadTaskDetail($scope.task);
           
        });
        //Form init
        //Task Model
        function loadTaskDetail(task) {

            if (id == 0 || id == null) {
                var currentDate = new Date();
                task.startDate = dateformatService.formatToDDMMYY(currentDate);
            }
            else {
                if (task.startDate != null) {
                    task.startDate = dateformatService.formatToDDMMYY(new Date(task.startDate));
                }
            }

            loadTaskPriority(task);

            $scope.generateTaskCode = generateTaskCode;
            $scope.generateTaskCode(task);

            $scope.getTaskTypes = getTaskTypes;
            $scope.getTaskTypes(task);

            $scope.getProjects = getProjects;
            $scope.getProjects(task);
            if (task.dueDate != null) {
                task.dueDate = dateformatService.formatToDDMMYY(new Date(task.dueDate));
            }

            $scope.getStaffs = getStaffs;
            $scope.getStaffs(task);

            $scope.getCustomers = getCustomers;
            $scope.getCustomers(task);

            $scope.getTaskAssigneeByTaskId = getTaskAssigneeByTaskId;
            $scope.getTaskAssigneeByTaskId(task);

            loadTaskDocuments(task);
            loadTaskAttachment(task);
            
        }

        function getTask(taskId, callback) {
            if (taskId == 0) {
                var newTask = { id: 0, title: '', description: '', departmentId: departmentId, projectId: null, taskTypeId: null, statusId: 0, order: 0, priority: 1, dueDate: null, startDate: new Date(), estimated: 0, timeSpend: 0, endDate: null, customerId: null, contactInformation: '', rating: 0, result: '', active: true, deleted: false, createdOn: null, createdBy: userId, editedOn: null, editedBy: userId };

                var result = { data: { value: {} } };
                result.data.value = newTask;
                callback(result);
            }
            else {
                apiService.get($rootScope.baseUrl + 'api/Task/get/' + taskId, null,
                    function (result) {
                        callback(result);
                    },
                    function (error) {
                        notificationService.displayError('Không tìm thấy bản ghi khả dụng')

                        $scope.BindList(0);
                    })
            }
        }

        //End Task Model
        //TaskCode
        function generateTaskCode(task) {
            if (task.id == 0) {
                apiService.get($rootScope.baseUrl + 'api/Task/GetTaskCode?departmentId=' + departmentId, null,
                    function (result) {
                        $scope.task.code = result.data.value;
                    },
                    function (error) {
                        console.log(error);
                    });
            }
        }
        //End TaskCode

        //Mảng công việc
        function getTaskTypes(task) {
            apiService.get($rootScope.baseUrl + 'api/TaskType/GetByDepartment?departmentId=' + departmentId + '&keyword=', null,
                function (result) {
                    $scope.taskTypes = result.data.data;
                    if (task.taskTypeId != 0 && task.taskTypeId != null) {
                        var arraytaskTypes = $scope.taskTypes.filter(function (obj) {
                            if (obj.id == task.taskTypeId) {
                                return obj;
                            }
                        });
                        $scope.initialTaskType = arraytaskTypes[0].title;
                    }
                    else {
                        $scope.initialTaskType = '';
                    }
                },
                null);
        }
        var taskType = {};
        function getTaskTypeSelected(obj) {
            if (obj != null) {
                taskType = obj.originalObject;
                $scope.task.taskTypeId = taskType.id;
            }
            else {
                taskType = {};
                $scope.task.taskTypeId = null;
            }
        }
        $scope.selectedTaskType = getTaskTypeSelected;

        //Dự án
        function getProjects(task) {
            apiService.get($rootScope.baseUrl + 'api/Project/GetByDepartment?departmentId=' + departmentId + '&keyword=', null,
                function (result) {
                    $scope.projects = result.data.data;
                    if (task.projectId != 0 && task.projectId != null) {
                        var arrayProjects = $scope.projects.filter(function (obj) {
                            if (obj.id == task.projectId) {
                                return obj;
                            }
                        });
                        $scope.initialProject = arrayProjects[0].title;
                    }
                    else {
                        $scope.initialProject = '';
                    }
                },
                function (error) {
                    console.log(error);
                });
        }
        var project = {};
        function getProjectSelected(obj) {
            if (obj != null) {
                project = obj.originalObject;
                $scope.task.projectId = project.id;
            }
            else {
                project = {};
                $scope.task.projectId = null;
            }
        }
        $scope.selectedProject = getProjectSelected;

        //Độ ưu tiên
        function loadTaskPriority(task) {
            if (task.id == 0) {
                $scope.selectedPriority = $scope.listPriorities[1];
            }
            else {
                var arrayPriorities = $scope.listPriorities.filter(function (obj) {
                    if (obj.id == task.priority) {
                        return obj;
                    }
                });
                $scope.selectedPriority = arrayPriorities[0];
            }
        }

        //Xử lý chính

        function getStaffs(task) {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + departmentId, null,
                function (result) {
                    $scope.staffs = result.data.data;
                },
                function (error) {
                    console.log(error);
                });
        }

        function getTaskAssigneeByTaskId(task) {
            if (task.id != 0) {
                listTempCoprocessor = [];
                listtempSupervisor = [];
                listtempAssignee = [];
                apiService.get($rootScope.baseUrl + 'api/TaskAssignee/GetByTask?taskId=' + task.id, null,
                   function (result) {
                       $scope.allTaskAssignees = result.data.data;

                       for (var i = 0; i < $scope.allTaskAssignees.length; i++) {
                           if ($scope.allTaskAssignees[i].assignee) {
                               listtempAssignee.push($scope.allTaskAssignees[i]);
                           }
                           if ($scope.allTaskAssignees[i].coprocessor) {
                               listTempCoprocessor.push($scope.allTaskAssignees[i]);
                           }
                           if ($scope.allTaskAssignees[i].supervisor) {
                               listtempSupervisor.push($scope.allTaskAssignees[i]);
                           }
                       }
                       //$scope.intialAssigneeFullName = $scope.assignee.fullName;
                       angular.forEach(listTempCoprocessor, function (value, key) {
                           if (value.avatar != null && value.avatar != '') {
                               value.avatar = $rootScope.baseUrl + value.avatar;
                           }
                           else {
                               value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                           }
                       });
                       angular.forEach(listtempSupervisor, function (value, key) {
                           if (value.avatar != null && value.avatar != '') {
                               value.avatar = $rootScope.baseUrl + value.avatar;
                           }
                           else {
                               value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                           }
                       });
                       angular.forEach(listtempAssignee, function (value, key) {
                           if (value.avatar != null && value.avatar != '') {
                               value.avatar = $rootScope.baseUrl + value.avatar;
                           }
                           else {
                               value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                           }
                       });
                       $scope.coprocessors = listTempCoprocessor;
                       $scope.supervisors = listtempSupervisor;
                       $scope.mainAssignees = listtempAssignee;
                   },
                   function (error) {
                       console.log(error);
                   });
            }
        }
        //Đồng xử lý, giám sát
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

        //Khách hàng
        function getCustomers(task) {
            apiService.get($rootScope.baseUrl + 'api/Customer/GetByDepartment?departmentId=' + departmentId + '&keyword=', null,
                function (result) {
                    $scope.customers = result.data.data;

                    if (task.customerId != 0 && task.customerId != null) {
                        var arrayCustomers = $scope.customers.filter(function (obj) {
                            if (obj.id == task.customerId) {
                                return obj;
                            }
                        });
                        $scope.initialCustomer = arrayCustomers[0].title;
                    }
                    else {
                        $scope.initialCustomer = '';
                    }
                },
                function (error) {
                    console.log(error);
                });
        }
        var customer = {};
        function getCustomerSelected(obj) {
            if (obj != null) {
                customer = obj.originalObject;
                $scope.task.customerId = customer.id;
            }
            else {
                customer = {};
                $scope.task.customerId = null;
            }
        }
        $scope.selectedCustomer = getCustomerSelected;



        //Văn bản
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        $scope.startDate = dateformatService.formatToDDMMYY(firstDay);
        $scope.endDate = dateformatService.formatToDDMMYY(lastDay);


        $scope.getDocumentReceiveds = getDocumentReceiveds;
        $scope.getDocumentReceiveds();
        function getDocumentReceiveds() {
            var config = {
                params: {
                    keyword: '',
                    startDate: $scope.startDate.split("/").reverse().join("-"),
                    endDate: $scope.endDate.split("/").reverse().join("-"),
                    UserId: userId,
                    ListSubDepartmentId: listSubDepartmentId,
                    departmentId: departmentId
                }
            };
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/SearchListDocument?', config,
                function (result) {
                    $scope.documentReceiveds = result.data.data;
                },
                function (error) {
                    console.log(error);
                });
        }
        var documentReceived = {};
        function getDocumentReceivedSelected(documentReceived) {
            if (documentReceived != null) {
                documentReceived = documentReceived.originalObject;
                $scope.$broadcast('angucomplete-alt:clearInput', 'txtDocumentSearch');
                document.getElementById('txtDocumentSearch_value').focus();
                bindListDocument(documentReceived);
            }
            else {
                documentReceived = {
                    id: 0,
                    receivedDocument: 0,
                    receivedNumber: '',
                    documentNumber: '',
                    title: '',
                    documentDate: '',
                    attachmentName: '',
                    attachmentPath: '',
                    documentInfo: '',
                    signedBy: '',
                    externalFromDivision: '',
                    historyId: null,
                };
            }
        }
        $scope.selectedDocumentReceived = getDocumentReceivedSelected;

        function bindListDocument(dr) {
            var existed = false;
            angular.forEach($scope.listDocument, function (value, key) {
                if (value.id == dr.id && value.receivedDocument == dr.receivedDocument) {
                    existed = true;
                }
            });
            if (!existed) {
                $scope.listDocument.push(dr);
            }
        }

        $scope.removeSelectedDocument = removeSelectedDocument;

        function removeSelectedDocument(id, receivedDocument) {
            var tempList = $scope.listDocument;
            angular.forEach(tempList, function (value, key) {
                if (value.id == id && value.receivedDocument == receivedDocument) {
                    var i = $scope.listDocument.indexOf(value);
                    if (i != -1) {
                        $scope.listDocument.splice(i, 1);
                    }
                }
            });
        }

        function loadTaskDocuments(task) {
            if (task.id != 0) {
                apiService.get($rootScope.baseUrl + 'api/TaskDocuments/GetByTask?taskId=' + task.id, null,
               function (result) {
                   angular.forEach(result.data.data, function (value, key) {
                       bindListDocument({
                           id: value.id,
                           receivedDocument: value.receivedDocument,
                           receivedNumber: value.receivedNumber,
                           documentNumber: value.documentNumber,
                           title: value.title,
                           documentDate: value.documentDate,
                           attachmentName: value.attachmentName,
                           attachmentPath: value.attachmentPath,
                           documentInfo: value.documentInfo,
                           signedBy: '',
                           externalFromDivision: '',
                           historyId: null,
                       });
                   });
               },
               function (error) {
                   console.log(error);
               });
            }
        }
        function loadTaskAttachment(task) {
            if (task.id != 0) {
                apiService.get($rootScope.baseUrl + 'api/TaskAttachment/GetByTask?type=1&recordId=' + task.id, null,
               function (result) {
                   $scope.listAttachment = result.data.data;
               },
               function (error) {
                   console.log(error);
               });
            }
        }
        $scope.removeTaskAttachment = removeTaskAttachment;
        function removeTaskAttachment(taskAttachmentId) {
            var tempList = $scope.listAttachment;
            angular.forEach(tempList, function (value, key) {
                if (value.id == taskAttachmentId) {
                    var i = $scope.listAttachment.indexOf(value);
                    if (i != -1) {
                        $scope.listAttachment.splice(i, 1);
                    }
                }
            });
        }
        //End form init
        if ($stateParams.id == null)
            $stateParams.id = 0
        if ($stateParams.id == 0) {
            $scope.titleForm = "Thêm mới công việc";
        }
        else {
            $scope.titleForm = "Cập nhật công việc";
        }

        $scope.checkStartDate = function () {
            if ($scope.task.startDate != null && $scope.task.startDate != '' && $scope.task.dueDate != null && $scope.task.dueDate != '') {
                var result = dateformatService.compareTwoDate($scope.task.startDate, $scope.task.dueDate);
                if (result == -1) {
                    notificationService.displayError('Ngày bắt đầu phải trước ngày hết hạn');
                    $scope.task.startDate = '';
                    document.getElementById("txtStartDate").focus();
                }
                else {

                }
            }
        }

        $scope.checkDueDate = function () {
            if ($scope.task.startDate != null && $scope.task.startDate != '' && $scope.task.dueDate != null && $scope.task.dueDate != '') {
                var result = dateformatService.compareTwoDate($scope.task.startDate, $scope.task.dueDate);
                if (result == -1) {
                    notificationService.displayError('Ngày hết hạn phải sau ngày bắt đầu');
                    $scope.task.dueDate = '';
                    document.getElementById("txtDueDate").focus();
                }
                else {

                }
            }
        }



        $scope.save = save;
        function save() {
           
            var listSelectedfiles = $("#fileAttachment").get(0).files;
            if (listSelectedfiles.length > 0) {
                for (i = 0; i < listSelectedfiles.length; i++) {
                    if (listSelectedfiles[i].size > 4194304) {
                        notificationService.displayError('Dung lượng tệp đính kèm vượt quá 4MB');
                        return;
                    }
                    var filename = listSelectedfiles[i].name.split('.').pop();
                    if (filename == 'ppt' || filename == 'pptx' || filename == 'xls' || filename == 'xlsx' || filename == 'doc' || filename == 'docx' || filename == 'rar' || filename == 'zip' || filename == 'pdf' || filename == 'jpg' || filename == 'jpeg' || filename == 'png' || filename == 'gif') {
                        allowfileType = true;
                    }
                    else {
                        notificationService.displayError('Định dạng tệp tin không hợp lệ');
                        return;
                    }
                }
            }

            $scope.task.priority = $scope.selectedPriority.id;
            if ($scope.task.dueDate != '' && $scope.task.dueDate != null) {
                $scope.task.dueDate = $scope.task.dueDate.split("/").reverse().join("-");
            }
            if ($scope.task.startDate != '' && $scope.task.startDate != null) {
                $scope.task.startDate = $scope.task.startDate.split("/").reverse().join("-");
            }
           
            fetchSelectedAssignee($scope.mainAssignees);
            fetchSelectedCoprocessor($scope.coprocessors);
            fetchSelectedSupervisor($scope.supervisors);
            var listTaskAssinee = [];
            if (listAssignee != null && listAssignee.length > 0) {
                listTaskAssinee = applyTaskIdToListAssignee(listAssignee[0], listCoprocessor, listSupervisor, listTaskAssinee);
            }
            else {
                notificationService.displayError('Chọn người xử lý chính');
                return;
            }

            $scope.task.taskAssignees = listTaskAssinee;
            $scope.task.taskDocuments = $scope.listDocument;
            if ($scope.task.description != null && $scope.task.description != '') {
                $scope.task.description = $scope.task.description.replace(/\n\r?/g, '<br />');
            }

            if (id != 0) {

                // $scope.task.taskAttachments = $scope.listAttachment;
                $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật công việc này?')
                         .then(function () {
                             $scope.task.editedBy = userId;                             
                             apiService.put($rootScope.baseUrl + 'api/Task/UpdateSetOfTask', $scope.task,
                           function (result) {
                               if (!result.data.isValid) {
                                   angular.forEach(result.data.brokenRules, function (value, key) {
                                       notificationService.displayError(value.rule);
                                   });
                                   return;
                               }
                               var files = $("#fileAttachment").get(0).files;
                               if (files.length > 0) {
                                   $scope.uploadFile(function sunShine(data) {
                                       
                                       //input[file] has file(s)
                                       if ($scope.listAttachment.length == 0) {
                                           //each file
                                           angular.forEach(data.data, function (value, key) {
                                               //define taskAttachment item
                                               var taskAttachment = { id: 0, fileName: value.fileName, filePath: value.filePath, recordId: result.data.value.id, type: 1, active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: result.data.value.createdBy, editedOn: dateformatService.addMoreHours(new Date()), editedBy: result.data.value.editedBy };
                                               //push to list-taskAttachment
                                               $scope.listAttachment.push(taskAttachment);
                                           });
                                           //Start update TaskAttachments
                                           apiService.post($rootScope.baseUrl + 'api/TaskAttachment/AddListAttachment', $scope.listAttachment,
                                               function (result) {
                                                   if (!result.data.isValid) {
                                                       angular.forEach(result.data.brokenRules, function (value, key) {
                                                           notificationService.displayError(value.rule);
                                                       });
                                                       return;
                                                   }
                                                   notificationService.displaySuccess('Cập nhật công việc thành công!');
                                                   $scope.BindList(0);


                                               }, function (error) {
                                                   notificationService.displayError('Cập nhật công việc thất bại!');
                                               });
                                           //End add TaskAttachments
                                       }
                                       else {
                                           angular.forEach(data.data, function (value, key) {
                                               //define taskAttachment item
                                               var taskAttachment = { id: 0, fileName: value.fileName, filePath: value.filePath, recordId: result.data.value.id, type: 1, active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: result.data.value.createdBy, editedOn: dateformatService.addMoreHours(new Date()), editedBy: result.data.value.editedBy };
                                               //push to list-taskAttachment
                                               $scope.listAttachment.push(taskAttachment);
                                           });
                                           //Start update TaskAttachments
                                           apiService.put($rootScope.baseUrl + 'api/TaskAttachment/UpdateListAttachment', $scope.listAttachment,
                                               function (result) {
                                                   if (!result.data.isValid) {
                                                       angular.forEach(result.data.brokenRules, function (value, key) {
                                                           notificationService.displayError(value.rule);
                                                       });
                                                       return;
                                                   }
                                                   notificationService.displaySuccess('Cập nhật công việc thành công!');
                                                   $scope.BindList(0);


                                               }, function (error) {
                                                   notificationService.displayError('Cập nhật công việc thất bại!');
                                               });
                                       }

                                   }, function wannaCry() {

                                   });
                               }
                               else {
                                   apiService.put($rootScope.baseUrl + 'api/TaskAttachment/UpdateListAttachment', $scope.listAttachment,
                                               function (result) {
                                                   if (!result.data.isValid) {
                                                       angular.forEach(result.data.brokenRules, function (value, key) {
                                                           notificationService.displayError(value.rule);
                                                       });
                                                       return;
                                                   }
                                                   notificationService.displaySuccess('Cập nhật công việc thành công!');
                                                   $scope.BindList(0);


                                               }, function (error) {
                                                   notificationService.displayError('Cập nhật công việc thất bại!');
                                               });
                               }

                           }, function (error) {
                               notificationService.displayError('Cập nhật công việc thất bại!');
                           });
                         });

            }
            else {
                var files = $("#fileAttachment").get(0).files;
                if (files.length > 0) {
                    if (files.length > 3) {
                        notificationService.displayError('Bạn chỉ có thể tải tối đa 03 tệp đính kèm.');
                        return;
                    }
                    var bigsize = false;
                    angular.forEach(files, function (value, key) {
                        if (value.size > 4194304) {
                            bigsize = true;
                        }
                    });
                    if (bigsize) {
                        notificationService.displayError('Dung lượng tệp đính kèm vượt quá 4MB.');
                        return;
                    }
                }


                $ngBootbox.confirm('Bạn chắc chắn muốn tạo mới công việc này?').then(function () {

                    apiService.post($rootScope.baseUrl + 'api/Task/AddSetOfTask', $scope.task,
                         function (result) {
                             console.log(result);
                             if (!result.data.isValid) {
                                 angular.forEach(result.data.brokenRules, function (value, key) {
                                     notificationService.displayError(value.rule);
                                 });
                                 return;
                             }
                             var files = $("#fileAttachment").get(0).files;
                             if (files.length > 0) {
                                 $scope.uploadFile(function sunShine(data) {
                                     //input[file] has file(s)
                                     if ($scope.listTaskAttachment.length == 0) {
                                         //each file

                                         angular.forEach(data.data, function (value, key) {
                                             //define taskAttachment item
                                             var taskAttachment = { id: 0, fileName: value.fileName, filePath: value.filePath, recordId: result.data.value.id, type: 1, active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: result.data.value.createdBy, editedOn: dateformatService.addMoreHours(new Date()), editedBy: result.data.value.editedBy };
                                             //push to list-taskAttachment
                                             $scope.listTaskAttachment.push(taskAttachment);
                                         });
                                         console.log($scope.listTaskAttachment);
                                         //Start add TaskAttachments
                                         apiService.post($rootScope.baseUrl + 'api/TaskAttachment/AddListAttachment', $scope.listTaskAttachment,
                                             function (result) {
                                                 if (!result.data.isValid) {
                                                     angular.forEach(result.data.brokenRules, function (value, key) {
                                                         notificationService.displayError(value.rule);
                                                     });
                                                     return;
                                                 }
                                                 notificationService.displaySuccess('Tạo mới công việc thành công!');
                                                 $scope.BindList(0);


                                             }, function (error) {
                                                 notificationService.displayError('Tạo mới công việc thất bại!');
                                             });
                                         //End add TaskAttachments
                                     }

                                 }, function wannaCry() {

                                 });
                             }
                             else {
                                 notificationService.displaySuccess('Tạo mới công việc thành công!');
                                 $scope.BindList(0);

                             }

                         }, function (error) {
                             notificationService.displayError('Tạo mới công việc thất bại!');
                         });

                });


            }


        }

        //Fetching TaskAssignee

        function getAssigneeSelected(assignee) {

            if (assignee != null) {
                $scope.assignee.userId = assignee.originalObject.userId;
            }
            else {
                $scope.assignee = { userId: '', assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, fullName: '' };
            }

        }
        $scope.selectedAssignee = getAssigneeSelected;


        function fetchSelectedAssignee(assg) {
            listAssignee = [];
            angular.forEach(assg, function (value, key) {
                var assignee = { userId: value.userId, assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, fullName: '' };
                var existed = false;
                angular.forEach(listAssignee, function (_val, _key) {
                    if (_val.userId == assignee.userId) {
                        existed = true;
                    }
                });
                if (existed == false && assignee.userId != null && assignee.userId != '') {
                    listAssignee.push(assignee);
                }

            });
        }

        function fetchSelectedCoprocessor(copr) {
            listCoprocessor = [];
            angular.forEach(copr, function (value, key) {
                var coprocessor = { userId: value.userId, assignee: 0, coprocessor: 1, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, fullName: '' };
                var existed = false;
                angular.forEach(listCoprocessor, function (_val, _key) {
                    if (_val.userId == coprocessor.userId) {
                        existed = true;
                    }
                });
                if (existed == false && coprocessor.userId != null && coprocessor.userId != '') {
                    listCoprocessor.push(coprocessor);
                }

            });
        }
        function fetchSelectedSupervisor(spv) {
            listSupervisor = [];
            angular.forEach(spv, function (value, key) {
                //mới bỏ 2 trường documentId: 0, receivedDocument: 0 
                var supervisor = { userId: value.userId, assignee: 0, coprocessor: 0, supervisor: 1, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, fullName: '' }

                var existed = false;
                angular.forEach(listSupervisor, function (_val, _key) {
                    if (_val.userId == supervisor.userId) {
                        existed = true;
                    }
                });
                if (existed == false && supervisor.userId != null && supervisor.userId != '') {
                    listSupervisor.push(supervisor);
                }
            });

            $scope.listSupervisor = listSupervisor;
        }
        function applyTaskIdToListAssignee(assignee, listCoprocessor, listSupervisor, listTaskAssignee) {
            if (assignee.userId != null && assignee.userId != '') {
                listTaskAssignee.push(assignee);
            }
            var countCoprocessor = 0;
            angular.forEach(listCoprocessor, function (value, key) {
                value.order = countCoprocessor;
                listTaskAssignee.push(value);
                countCoprocessor++;
            });
            var countSupervisor = 0;
            angular.forEach(listSupervisor, function (value, key) {
                value.order = countSupervisor;
                listTaskAssignee.push(value);
                countSupervisor++;
            });
            return listTaskAssignee;
        }
        //Fetching TaskAssignee

        //Upload
        $scope.uploadFile = function (sunShine, wannaCry) {
            var files = $("#fileAttachment").get(0).files;
            if (files.length > 0) {
                var data = new FormData();
                for (i = 0; i < files.length; i++) {

                    data.append(shortDepartmentName + "/Task-" + i, files[i]);
                }
                $.ajax({
                    type: "POST",
                    url: $rootScope.baseUrl + "api/FileUpload/PostAsyncTaskAttachment",
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (response) {
                        if (typeof sunShine == 'function') {
                            sunShine(response);
                        }
                    },
                    error: function () {
                        wannaCry();
                    }
                });
            }
        }
        //EndUpload
        $scope.BindList = function (type) {
            if (type == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?')
                            .then(function () {
                                $state.go('task', { statusId: $stateParams.statusId, fromDate: $stateParams.fromDate, toDate: $stateParams.toDate, currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, assignToMe: $stateParams.assignToMe, relativeToMe: $stateParams.relativeToMe });
                            });
            }
            else {
                $state.go('task', { statusId: $stateParams.statusId, fromDate: $stateParams.fromDate, toDate: $stateParams.toDate, currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, assignToMe: $stateParams.assignToMe, relativeToMe: $stateParams.relativeToMe });
            }
        }
    }
})(angular.module('VOfficeApp.task'));