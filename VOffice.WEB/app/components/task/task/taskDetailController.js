(function (app) {
    app.controller('taskDetailController', taskDetailController);
    app.controller('startTaskController', startTaskController);
    app.controller('forwardTaskController', forwardTaskController);
    app.controller('finishTaskController', finishTaskController);
    app.controller('closeTaskController', closeTaskController);
    app.controller('reopenTaskController', reopenTaskController);
    app.controller('documentHistoryController', documentHistoryController);
    app.controller('addMoreDongXuLyController', addMoreDongXuLyController);
    app.controller('countViewTaskDetailController', countViewTaskDetailController);

    countViewTaskDetailController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                       'notificationService', '$stateParams', 'dateformatService', 'id', 'fogLoading'];
    taskDetailController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$http',
                                      '$rootScope',
                                      '$timeout',
                                      '$sce',
                                      '$compile',
                                      '$ngBootbox',
                                        'dateformatService', '$uibModal', 'fogLoading',
    '$window', '$injector'];
    startTaskController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                        'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'fogLoading'];
    forwardTaskController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                        'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'assignee', 'fogLoading', '$http', 'superLeader'];
    finishTaskController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                        'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'fogLoading'];
    closeTaskController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                        'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'fogLoading'];
    reopenTaskController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                    'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'fogLoading'];
    documentHistoryController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                       'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'documentId', 'documentReceived', 'fogLoading'];
    addMoreDongXuLyController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', '$ngBootbox',
                                      'notificationService', '$stateParams', 'dateformatService', 'id', 'departmentId', 'userId', 'superLeader', 'fogLoading', '$http'];

    function addMoreDongXuLyController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                      id, departmentId, userId, superLeader, fogLoading, $http) {
        var $ctr = this;
        var departmentIdQueryStaffs = departmentId;
        if (superLeader == 'True' || superLeader == 'true') {
            departmentIdQueryStaffs = 0;
        }
        $ctr.loadStaff = function ($query) {
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
        $ctr.addMoreDongXuLy = function () {
            var listTemp = $ctr.corprocessors;
            var listAssigneeSendToServer = [];
            angular.forEach(listTemp, function (value, key) {
                if (value != null) {
                    value.taskId = id;
                    value.id = null;
                    value.coprocessor = true;
                    value.assignee = false;
                    value.supervisor = false;
                    value.createdOn = new Date();
                    value.createdBy = userId;
                    value.viewDetail = false;
                    value.viewOn = null;
                    listAssigneeSendToServer.push(value);
                }
            });
            fogLoading('fog-modal-small', 'block');
            apiService.put($rootScope.baseUrl + 'api/TaskAssignee/AddMoreTaskAssignee', listAssigneeSendToServer,
                                             function (result) {

                                                 if (result.data.isSuccess != true) {
                                                     notificationService.displayError(result.data.message);
                                                     fogLoading('fog-modal-small', 'none');
                                                     return;
                                                 }
                                                 else {
                                                     fogLoading('fog-modal-small', 'none');
                                                     notificationService.displaySuccess('Cập nhật thành công');
                                                     $uibModalInstance.close();
                                                 }

                                             }, null);
        }

        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


    function documentHistoryController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                      id, departmentId, userId, documentId, documentReceived, fogLoading) {
        var $ctr = this;
        var docReceived = "1";
        if (documentReceived == false) {
            docReceived = "0";
        }
        $ctr.listDocumentHistory = [];
        apiService.get($rootScope.baseUrl + 'api/TaskAssignee/GetTaskDocumentHistory?taskId=' + id + '&documentId=' + documentId + '&documentReceived=' + docReceived, null,
             function (result) {
                 $ctr.listDocumentHistory = result.data.data;
             }, function (error) { });


        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function startTaskController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                       id, departmentId, userId, fogLoading) {
        var $ctr = this;

        $ctr.newOpinion = { id: null, content: '', taskId: id, active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId }
        $ctr.initTaskEstimation = function () {

            apiService.get($rootScope.baseUrl + 'api/Task/Get/' + id, null,
                function (result) {
                    $ctr.item = result.data.value;
                    $ctr.startDate = dateformatService.formatToDDMMYY(new Date($ctr.item.startDate));

                    $ctr.oldStartDateValue = $ctr.startDate;
                    if ($ctr.item.dueDate != null) {
                        $ctr.dueDate = dateformatService.formatToDDMMYY(new Date($ctr.item.dueDate));
                        $ctr.itemHasDueDate = true;
                    }
                },
                function (error) {
                    notificationService.displayError('Không tìm thấy bản ghi khả dụng');
                    $ctr.cancel();
                })
        }
        $ctr.initTaskEstimation();
        $ctr.checkDueDate = function () {
            if ($ctr.itemHasDueDate == true) {
                return true;
            }
            return false;
        }

        $ctr.checkStartDueDate = function (type) {

            if ($ctr.startDate != null && $ctr.startDate != '' && $ctr.dueDate != null && $ctr.dueDate != '') {

                var result = dateformatService.compareTwoDate($ctr.startDate, $ctr.dueDate);
                if (result == -1) {
                    if (type == 1) {
                        notificationService.displayError('Ngày bắt đầu phải trước ngày hết hạn');
                        if ($ctr.item.startDate != null) {
                            $ctr.startDate = dateformatService.formatToDDMMYY(new Date($ctr.item.startDate));
                        }
                        else {
                            $ctr.startDate = '';
                        }
                        document.getElementById("txtStartDateStartTask").focus();
                    }
                    else {
                        notificationService.displayError('Ngày hết hạn phải sau ngày bắt đầu');
                        if ($ctr.item.dueDate) {
                            $ctr.dueDate = dateformatService.formatToDDMMYY(new Date($ctr.item.dueDate));
                        }
                        else {
                            $ctr.dueDate = '';
                        }
                        document.getElementById("txtDueDateStartTask").focus();
                    }
                }
                else {

                }
            }
        }


        $ctr.startTask = function () {
            fogLoading('fog-modal-small', 'block');
            var config = {
                params: {
                    type: 'TASK',
                    code: 'INPROCESS'
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $ctr.item.statusId = result.data.value.id;
                if ($ctr.startDate == '') {
                    $ctr.item.startDate = null;
                }
                else {
                    try {
                        $ctr.item.startDate = $ctr.startDate.split("/").reverse().join("-");
                    }
                    catch (err) {
                        $ctr.item.startDate = null;
                    }
                }
                if ($ctr.dueDate == '') {

                }
                else {
                    try {
                        $ctr.item.dueDate = $ctr.dueDate.split("/").reverse().join("-");
                    }
                    catch (err) {
                        $ctr.item.dueDate = null;
                    }
                }
                apiService.put($rootScope.baseUrl + 'api/Task/Update', $ctr.item,
                                             function (result) {

                                                 if (!result.data.isValid) {
                                                     angular.forEach(result.data.brokenRules, function (value, key) {
                                                         notificationService.displayError(value.rule);
                                                     });
                                                     return;
                                                 }
                                                 if (result.data.isSuccess) {
                                                     var newStartTaskActivity = {};
                                                     if ($ctr.startDate != '' && $ctr.startDate != null) {
                                                         newStartTaskActivity = { id: null, recordId: $ctr.item.id, action: 'START', type: 1, display: true, description: 'bắt đầu thực hiện công việc', taskfield: 'StartDate', oldValue: $ctr.oldStartDateValue, newValue: 'Ngày bắt đầu: ' + $ctr.startDate, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                     }
                                                     else {
                                                         newStartTaskActivity = { id: null, recordId: $ctr.item.id, action: 'START', type: 1, display: true, description: 'bắt đầu thực hiện công việc', taskfield: '', oldValue: '', newValue: '', createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                     }
                                                     apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newStartTaskActivity,
                                                  function (result) {
                                                      if ($ctr.dueDate != '' && $ctr.dueDate != null && $ctr.item.dueDate != $ctr.dueDate.split("/").reverse().join("-")) {
                                                          newDueDateTaskActivity = { id: null, recordId: $ctr.item.id, action: 'UPDATE', type: 1, display: true, description: 'cập nhật thời hạn thực hiện công việc', taskfield: 'DueDate', oldValue: $ctr.oldDueDateValue, newValue: 'Ngày hết hạn: ' + $ctr.dueDate, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                          apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newDueDateTaskActivity,
                                                function (result) {
                                                    if ($ctr.newOpinion.content != '' && $ctr.newOpinion.content != null) {
                                                        apiService.post($rootScope.baseUrl + 'api/TaskOpinion/Add', $ctr.newOpinion,
                                                 function (result) {
                                                     fogLoading('fog-modal-small', 'none');
                                                     notificationService.displaySuccess('Cập nhật thành công');
                                                     $uibModalInstance.close();
                                                 }, function (error) { });
                                                    }
                                                    else {
                                                        fogLoading('fog-modal-small', 'none');
                                                        notificationService.displaySuccess('Cập nhật thành công');
                                                        $uibModalInstance.close();
                                                    }

                                                }, function (error) { });
                                                      }
                                                      else {
                                                          if ($ctr.newOpinion.content != '' && $ctr.newOpinion.content != null) {
                                                              apiService.post($rootScope.baseUrl + 'api/TaskOpinion/Add', $ctr.newOpinion,
                                                       function (result) {
                                                           fogLoading('fog-modal-small', 'none');
                                                           notificationService.displaySuccess('Cập nhật thành công');
                                                           $uibModalInstance.close();
                                                       }, function (error) { });
                                                          }
                                                          else {
                                                              fogLoading('fog-modal-small', 'none');
                                                              notificationService.displaySuccess('Cập nhật thành công');
                                                              $uibModalInstance.close();
                                                          }
                                                      }
                                                  }, function (error) { });
                                                 }
                                                 else {
                                                     notificationService.displayError('Cập nhật thất bại');
                                                 }
                                             }, function (error) { });
            }, null);



        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function forwardTaskController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                       id, departmentId, userId, assignee, fogLoading, $http, superLeader) {
        var $ctr = this;
        var departmentIdQueryStaffs = departmentId;
        if (superLeader == 'true' || superLeader == 'True') {
            departmentIdQueryStaffs = 0;
        }
        $ctr.loadStaff = function ($query) {
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
        var oldAssignee = '';
        $ctr.getTaskAssigneeByTaskId = getTaskAssigneeByTaskId;
        $ctr.getTaskAssigneeByTaskId(id);

        function getTaskAssigneeByTaskId(id) {
            if (id != 0) {

                listtempAssignee = [];
                apiService.get($rootScope.baseUrl + 'api/TaskAssignee/GetByTask?taskId=' + id, null,
                   function (result) {
                       $ctr.allTaskAssignees = result.data.data;

                       for (var i = 0; i < $ctr.allTaskAssignees.length; i++) {

                           if ($ctr.allTaskAssignees[i].assignee) {
                               $ctr.allTaskAssignees[i].avatar = $rootScope.baseUrl + $ctr.allTaskAssignees[i].avatar;
                               listtempAssignee.push($ctr.allTaskAssignees[i]);
                           }
                       }

                       $ctr.mainAssignees = listtempAssignee;
                       if ($ctr.mainAssignees != null && $ctr.mainAssignees.length > 0) {
                           oldAssignee = $ctr.mainAssignees.fullName;
                       }
                   },
                   function (error) {
                       console.log(error);
                   });
            }
        }
        $ctr.forceOneTag = function (tags) {
            if ($ctr.mainAssignees != null) {
                var array = $ctr.mainAssignees;
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
                    $ctr.mainAssignees = array;
                }
            }
            else {

            }
        }
        $ctr.forwardTask = function () {
            if ($ctr.mainAssignees != null && $ctr.mainAssignees.length > 0) {
                fogLoading('fog-modal-small', 'block');
                var newTaskAssignee = {};
                try {
                    newTaskAssignee = { keyword: '', userId: $ctr.mainAssignees[0].userId, taskId: id };
                }
                catch (err) {

                }
                if (newTaskAssignee.userId == null) {
                    fogLoading('fog-modal-small', 'none');
                    notificationService.displayError('Chọn người xử lý chính');
                    return;
                }
                apiService.put($rootScope.baseUrl + 'api/TaskAssignee/UpdateTaskAssigneeAssignee', newTaskAssignee,
                    function (result) {
                        if (!result.data.isValid) {
                            angular.forEach(result.data.brokenRules, function (value, key) {
                                notificationService.displayError(value.rule);
                            });
                            return;
                        }
                        if (result.data.isSuccess) {

                            if (newTaskAssignee.userId != null) {

                                var newFowrardTaskActivity = { id: null, recordId: id, action: 'FORWARD', type: 1, display: true, description: 'chuyển tiếp công việc' + ' tới: ' + $ctr.mainAssignees[0].fullName, taskfield: '', oldValue: 'Xử lý chính: ' + oldAssignee, newValue: 'Xử lý chính: ' + $ctr.mainAssignees[0].fullName, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };

                                apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newFowrardTaskActivity, function (result) {
                                    fogLoading('fog-modal-small', 'none');
                                    notificationService.displaySuccess('Chuyển tiếp công việc thành công!');
                                    $uibModalInstance.close();
                                }, function (error) { });
                            }
                            else {
                                fogLoading('fog-modal-small', 'none');
                                notificationService.displaySuccess('Chuyển tiếp công việc thành công!');
                                $uibModalInstance.close();
                            }

                        }
                    },
                    function (error) {
                        console.log(error);
                    });
            }
            else {
                fogLoading('fog-modal-small', 'none');
                notificationService.displayError('Chọn người xử lý chính');
                return;
            }
        }

        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function finishTaskController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                     id, departmentId, userId, fogLoading) {
        var $ctr = this;

        $ctr.newOpinion = { id: null, content: '', taskId: id, active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId }
        $ctr.initTaskEstimation = function () {
            apiService.get($rootScope.baseUrl + 'api/Task/Get/' + id, null,
                function (result) {
                    $ctr.item = result.data.value;
                    $ctr.startDate = dateformatService.formatToDDMMYY(new Date($ctr.item.startDate));
                    if ($ctr.item.dueDate != null) {
                        $ctr.dueDate = dateformatService.formatToDDMMYY(new Date($ctr.item.dueDate));
                    }
                    else {
                        $ctr.dueDate = '';
                    }
                    if ($ctr.item.endDate != null) {
                        $ctr.endDate = dateformatService.formatToDDMMYY(new Date($ctr.item.endDate));
                        $ctr.oldEndDateValue = $ctr.endDate;
                    }
                    else {
                        $ctr.endDate = '';
                    }
                },
                function (error) {
                    notificationService.displayError('Không tìm thấy bản ghi khả dụng');
                    $ctr.cancel();
                })
        }
        $ctr.initTaskEstimation();
        $ctr.blurEndDate = function () {
            if ($ctr.endDate == '') {
                if ($ctr.item.endDate != null) {
                    $ctr.endDate = dateformatService.formatToDDMMYY(new Date($ctr.item.endDate));
                }
            }
        }
        $ctr.blurDueDate = function () {
            if ($ctr.dueDate == '') {
                if ($ctr.item.dueDate != null) {
                    $ctr.dueDate = dateformatService.formatToDDMMYY(new Date($ctr.item.dueDate));
                }
            }
        }
        $ctr.blurStartDate = function () {
            if ($ctr.startDate == '') {
                if ($ctr.item.startDate != null) {
                    $ctr.startDate = dateformatService.formatToDDMMYY(new Date($ctr.item.startDate));
                }
            }
        }

        $ctr.finishTask = function () {
            fogLoading('fog-modal-small', 'block');
            var config = {
                params: {
                    type: 'TASK',
                    code: 'RESOLVED'
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0) {
                    fogLoading('fog-modal-small', 'none');
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                    return;
                }
                $ctr.item.statusId = result.data.value.id;
                if ($ctr.dueDate == '') {

                }
                else {
                    try {
                        $ctr.item.dueDate = $ctr.dueDate.split("/").reverse().join("-");
                    }
                    catch (err) {
                        $ctr.item.dueDate = null;
                    }
                }

                if ($ctr.endDate == '') {

                }
                else {
                    try {
                        $ctr.item.endDate = $ctr.endDate.split("/").reverse().join("-");
                    }
                    catch (err) {
                        $ctr.item.endDate = null;
                    }
                }
                apiService.put($rootScope.baseUrl + 'api/Task/Update', $ctr.item,
                                             function (result) {
                                                 if (!result.data.isValid) {
                                                     angular.forEach(result.data.brokenRules, function (value, key) {
                                                         notificationService.displayError(value.rule);
                                                     });
                                                     return;
                                                 }
                                                 if (result.data.isSuccess) {

                                                     var newEndTaskActivity = {};
                                                     if ($ctr.endDate != '' && $ctr.endDate != null) {
                                                         newEndTaskActivity = { id: null, recordId: $ctr.item.id, action: 'RESOLVE', type: 1, display: true, description: 'cập nhật tình trạng hoàn thành công việc', taskfield: 'EndDate', oldValue: $ctr.oldEndDateValue, newValue: 'Ngày hoàn thành thực tế: ' + $ctr.endDate, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                     }
                                                     else {
                                                         newEndTaskActivity = { id: null, recordId: $ctr.item.id, action: 'RESOLVE', type: 1, display: true, description: 'cập nhật tình trạng hoàn thành công việc', taskfield: '', oldValue: '', newValue: '', createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                     }
                                                     apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newEndTaskActivity,
                                                 function (result) {
                                                     if ($ctr.newOpinion.content != '' && $ctr.newOpinion.content != null) {
                                                         apiService.post($rootScope.baseUrl + 'api/TaskOpinion/Add', $ctr.newOpinion,
                                                  function (result) {
                                                      fogLoading('fog-modal-small', 'none');
                                                      notificationService.displaySuccess('Cập nhật thành công');
                                                      $uibModalInstance.close();
                                                  }, null);
                                                     }
                                                     else {
                                                         fogLoading('fog-modal-small', 'none');
                                                         notificationService.displaySuccess('Cập nhật thành công');
                                                         $uibModalInstance.close();
                                                     }
                                                 }, null);
                                                 }
                                                 else {
                                                     fogLoading('fog-modal-small', 'none');
                                                     notificationService.displayError('Cập nhật thất bại');
                                                 }
                                             }, null);
            }, null);

        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function closeTaskController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                     id, departmentId, userId, fogLoading) {
        var $ctr = this;

        $ctr.initTaskEstimation = function () {
            apiService.get($rootScope.baseUrl + 'api/Task/Get/' + id, null,
                function (result) {
                    $ctr.item = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không tìm thấy bản ghi khả dụng');
                    $ctr.cancel();
                })
        }
        $ctr.initTaskEstimation();
        $ctr.closeTask = function () {
            fogLoading('fog-modal-small', 'block');
            var config = {
                params: {
                    type: 'TASK',
                    code: 'CLOSED'
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0) {
                    fogLoading('fog-modal-small', 'none');
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                    return;
                }
                $ctr.item.statusId = result.data.value.id;
                apiService.put($rootScope.baseUrl + 'api/Task/Update', $ctr.item,
                                             function (result) {
                                                 if (!result.data.isValid) {
                                                     angular.forEach(result.data.brokenRules, function (value, key) {
                                                         notificationService.displayError(value.rule);
                                                     });
                                                     return;
                                                 }
                                                 if (result.data.isSuccess) {

                                                     var newEndTaskActivity = { id: null, recordId: $ctr.item.id, action: 'CLOSE', type: 1, display: true, description: 'kết thúc công việc', taskfield: '', oldValue: '', newValue: '', createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                     apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newEndTaskActivity,
                                          function (result) {
                                              fogLoading('fog-modal-small', 'none');
                                              notificationService.displaySuccess('Cập nhật thành công');
                                              $uibModalInstance.close();
                                          }, null);
                                                 }
                                                 else {
                                                     fogLoading('fog-modal-small', 'none');
                                                     notificationService.displayError('Cập nhật thất bại');
                                                 }
                                             }, function (error) { });
            }, null);



        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function reopenTaskController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
                                     id, departmentId, userId, fogLoading) {
        var $ctr = this;
        $ctr.newOpinion = { id: null, content: '', taskId: id, active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId }
        $ctr.initTaskEstimation = function () {
            apiService.get($rootScope.baseUrl + 'api/Task/Get/' + id, null,
                function (result) {
                    $ctr.item = result.data.value;
                },
                function (error) {

                    notificationService.displayError('Không tìm thấy bản ghi khả dụng');
                    $ctr.cancel();
                })
        }
        $ctr.initTaskEstimation();
        $ctr.reopenTask = function () {
            fogLoading('fog-modal-small', 'block');
            var config = {
                params: {
                    type: 'TASK',
                    code: 'REOPEN'
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0) {
                    fogLoading('fog-modal-small', 'none');
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                    return;
                }
                $ctr.item.statusId = result.data.value.id;
                apiService.put($rootScope.baseUrl + 'api/Task/Update', $ctr.item,
                                             function (result) {
                                                 if (!result.data.isValid) {
                                                     fogLoading('fog-modal-small', 'none');
                                                     angular.forEach(result.data.brokenRules, function (value, key) {
                                                         notificationService.displayError(value.rule);
                                                     });
                                                     return;
                                                 }
                                                 if (result.data.isSuccess) {

                                                     var newReopenTaskActivity = { id: null, recordId: $ctr.item.id, action: 'REOPEN', type: 1, display: true, description: 'mở lại công việc', taskfield: '', oldValue: '', newValue: '', createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                     apiService.post($rootScope.baseUrl + 'api/TaskActivity/Add', newReopenTaskActivity,
                                          function (result) {
                                              //add comment
                                              if ($ctr.newOpinion.content != '' && $ctr.newOpinion.content != null) {
                                                  apiService.post($rootScope.baseUrl + 'api/TaskOpinion/Add', $ctr.newOpinion,
                                           function (result) {
                                               fogLoading('fog-modal-small', 'none');
                                               notificationService.displaySuccess('Cập nhật thành công');
                                               $uibModalInstance.close();
                                           }, function (error) { });
                                              }
                                              else {
                                                  fogLoading('fog-modal-small', 'none');
                                                  notificationService.displaySuccess('Cập nhật thành công');
                                                  $uibModalInstance.close();
                                              }


                                          }, null);









                                                 }
                                                 else {
                                                     fogLoading('fog-modal-small', 'none');
                                                     notificationService.displayError('Cập nhật thất bại');
                                                 }
                                             }, function (error) { });
            }, null);



        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function countViewTaskDetailController($uibModalInstance, $rootScope, apiService, $ngBootbox, notificationService, $stateParams, dateformatService,
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
    function taskDetailController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $http,
                                    $rootScope,
                                    $timeout,
                                    $sce, $compile,
                                    $ngBootbox, dateformatService, $uibModal, fogLoading, $window, $injector) {
        var departmentId = $scope.authentication.departmentId;
        var userId = $scope.authentication.userId;
        var listSubDepartmentId = $scope.authentication.ListSubDepartmentId;
        var shortDepartmentName = $scope.authentication.departmentShortName;

        $scope.IsXuLyChinh = false;
        //$scope.startTask();

        $scope.checkHideMoreDongXuLy = false;
        $scope.hideStartTask = false;
        $scope.hideForwardTask = false;
        $scope.hideFinishTask = false;
        $scope.hideCloseTask = false;
        $scope.hideReopenTask = false;
        $scope.hideEditTask = false;

        $scope.listTaskAttachment = [];
        $scope.checkPermissionUserByTaskId = checkPermissionUserByTaskId;
        $scope.checkPermissionUserByTaskId();
        
        function checkPermissionUserByTaskId() {
            apiService.get($rootScope.baseUrl + 'api/TaskAssignee/CheckPermissionUserByTaskId?taskId=' + $stateParams.id + "&userId=" + userId, null, function (result) {
                if(!result.data.value)
                {
                    var stateService = $injector.get('$state');
                    stateService.go('home');
                }
                else
                {
                    getTask(id, function taskLoaded(result) {
                        $scope.task = result.data.value;
                        loadTaskDetail($scope.task);
                    });
                }
            });
        }
       

        var assignee = { userId: '', assignee: 1, coprocessor: 0, supervisor: 0, order: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, fullName: '' };
        $scope.assignee = assignee;
        var listCoprocessor = '';
        var listSupervisor = '';
        $scope.listDocument = [];
        $scope.listPriorities = [
          { name: 'Thấp', id: 0 },
          { name: 'Trung bình', id: 1 },
          { name: 'Cao', id: 2 }
        ];
        var id = 0;
        if ($stateParams.id != null && $stateParams.id != 0) {
            id = $stateParams.id;
        }
        else {
            notificationService.displayError('Không tìm thấy bản ghi khả dụng');
        }
        $scope.newOpinion = { id: null, content: '', taskId: id, active: 1, deleted: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
        listOpinion = [];

        

        function loadTaskDetail(task) {
            loadTaskStatus(task);
            loadTaskPriority(task);
            $scope.getTaskAssigneeByTaskId = getTaskAssigneeByTaskId;
            $scope.getTaskAssigneeByTaskId(task);
            loadTaskDocuments(task);
            loadTaskAttachment(task);
            $scope.getTaskOpinion = getTaskOpinion;
            $scope.getTaskOpinion(task);
            $scope.getTaskActivity = getTaskActivity;
            $scope.getTaskActivity(task);

            $scope.getTaskOpiniomActivity = getTaskOpiniomActivity;
            $scope.getTaskOpiniomActivity(task);

            if (userId != task.createdBy) {
                apiService.put($rootScope.baseUrl + 'api/TaskAssignee/ViewTaskDetail?userId=' + userId + '&taskId=' + task.id, null,
                                               function (result) {

                                               }, function (error) { });
            }
            apiService.get($rootScope.baseUrl + 'api/Task/GetComplexTask?id=' + task.id, null, function (result) {
                var countView = 0;
                angular.forEach(result.data.value.responseTaskActivities, function (value, key) {
                    if (value.action == "VIEW") {
                        countView = countView + 1;
                    }
                });
                if (countView == 0) {
                    $scope.countViewTask = 'Chưa có người nào xem thông tin công việc này';
                }
                else {
                    $scope.countViewTask = countView.toString() + ' người đã xem';
                }
            });
        }
        function getTask(taskId, callback) {
            apiService.get($rootScope.baseUrl + 'api/Task/GetTaskDetail/' + taskId, null,
             function (result) {
                 callback(result);
             },
             function (error) {
                 notificationService.displayError('Không tìm thấy bản ghi khả dụng');
             })
        }
        //Write read history
        $scope.DocumentHistory = {};
        $scope.saveDocumentHistory = saveDocumentHistory;
        var count = 0;
        function saveDocumentHistory(documentId, receivedDocument, deleted, attachmentPath) {
            if (deleted == false) {
                $scope.DocumentHistory.documentId = documentId;
                $scope.DocumentHistory.receivedDocument = receivedDocument;
                $scope.DocumentHistory.userId = $scope.authentication.userId;
                $scope.DocumentHistory.attempOn = new Date();
                apiService.post($rootScope.baseUrl + 'api/DocumentHistory/Add', $scope.DocumentHistory
                    , function (result) {
                        if (result.data.isSuccess == true) {
                            loadTaskDocuments($scope.task);
                            redirectFile(attachmentPath, deleted);
                        }
                        else {
                            console.log(result.message);
                        }
                    }, function (error) {
                        console.log(error);
                    }
                );
            }
        }
        //Status

        function loadTaskStatus(task) {

            apiService.get($rootScope.baseUrl + 'api/TaskAssignee/GetByTask?taskId=' + task.id, null,
                function (result) {
                    var IsNguoiGiamSat = false;
                    var isNguoiXuLyChinh = false;
                    var isNguoiTao = false;
                    if (task.createdBy == $scope.authentication.userId) {
                        isNguoiTao = true;
                    }
                    var listNguoiXuLyGiamSat = result.data.data;
                    for (var i = 0; i < listNguoiXuLyGiamSat.length; i++) {
                        if (listNguoiXuLyGiamSat[i].supervisor) {
                            if (listNguoiXuLyGiamSat[i].userId == $scope.authentication.userId) {
                                IsNguoiGiamSat = true;
                            }
                        }
                        if (listNguoiXuLyGiamSat[i].assignee) {
                            if (listNguoiXuLyGiamSat[i].userId == $scope.authentication.userId) {
                                isNguoiXuLyChinh = true;
                            }
                        }
                    }

                    $scope.IsXuLyChinh = isNguoiXuLyChinh;

                    if (task.statusCode == "DEFAULT") {
                        $scope.statusDetail = '&nbsp;&nbsp;<span class="label label-danger label-status"><span class="status-detail-item">Chưa xử lý</span></span>';
                        $scope.hideReopenTask = true;
                        $scope.hideStartTask = false;
                        $scope.hideForwardTask = false;
                        $scope.hideFinishTask = false;
                        $scope.hideCloseTask = false;
                        $scope.hideEditTask = false;
                    }
                    if (task.statusCode == "INPROCESS") {
                        $scope.statusDetail = '&nbsp;&nbsp;<span class="label label-primary  label-status"><span class="status-detail-item">Đang xử lý</span></span>';
                        $scope.hideStartTask = true;
                        $scope.hideReopenTask = true;
                        $scope.hideForwardTask = false;
                        $scope.hideFinishTask = false;
                        $scope.hideCloseTask = false;
                        $scope.hideEditTask = false;
                    }
                    if (task.statusCode == "RESOLVED") {
                        $scope.statusDetail = '&nbsp;&nbsp;<span class="label label-info label-status"><span class="status-detail-item">Hoàn thành</span></span>';
                        $scope.hideStartTask = true;
                        $scope.hideForwardTask = true;
                        $scope.hideReopenTask = false;
                        $scope.hideCloseTask = false;
                        $scope.hideFinishTask = true;
                        $scope.hideEditTask = true;
                    }
                    if (task.statusCode == "CLOSED") {
                        $scope.statusDetail = '&nbsp;&nbsp;<span class="label label-success label-status"><span class="status-detail-item">Đã kết thúc</span></span>';
                        $scope.hideStartTask = true;
                        $scope.hideForwardTask = true;
                        $scope.hideFinishTask = true;
                        $scope.hideCloseTask = true;
                        $scope.hideReopenTask = false;
                        $scope.hideEditTask = true;
                    }
                    if (task.statusCode == "REOPEN") {
                        $scope.statusDetail = '&nbsp;&nbsp;<span class="label label-warning label-status"><span class="status-detail-item">Tiếp tục xử lý</span></span>';
                        $scope.hideStartTask = true;
                        $scope.hideForwardTask = false;
                        $scope.hideFinishTask = false;
                        $scope.hideCloseTask = false;
                        $scope.hideReopenTask = true;
                        $scope.hideEditTask = false;
                    }


                    if (IsNguoiGiamSat == true) {
                    }
                    else {
                    }
                    if (isNguoiXuLyChinh == false && IsNguoiGiamSat == false && isNguoiTao == false) {
                        $scope.hideStartTask = true;
                        $scope.hideForwardTask = true;
                        $scope.hideFinishTask = true;
                        $scope.checkHideMoreDongXuLy = true;
                        $scope.hideEditTask = true;
                        $scope.hideCloseTask = true;
                        $scope.hideReopenTask = true;
                    }

                    if (isNguoiXuLyChinh == true && IsNguoiGiamSat == false && isNguoiTao == false) {

                        $scope.hideCloseTask = true;
                        $scope.hideEditTask = true;
                        $scope.hideReopenTask = true;
                    }

                }, null);

        }
        $scope.renderHtml = function (html_code) {
            return $sce.trustAsHtml(html_code);
        };
        //Độ ưu tiên
        function loadTaskPriority(task) {
            var arrayPriorities = $scope.listPriorities.filter(function (obj) {
                if (obj.id == task.priority) {
                    return obj;
                }
            });
            $scope.selectedPriority = arrayPriorities[0];

        }
        //TaskAssignee
        function getTaskAssigneeByTaskId(task) {
            if (task.id != 0) {
                listCoprocessor = '';
                listSupervisor = '';
                apiService.get($rootScope.baseUrl + 'api/TaskAssignee/GetByTask?taskId=' + task.id, null,
                   function (result) {
                       var laNguoiGiamSat = false;
                       $scope.allTaskAssignees = result.data.data;

                       for (var i = 0; i < $scope.allTaskAssignees.length; i++) {
                           if ($scope.allTaskAssignees[i].assignee) {
                               $scope.assignee = $scope.allTaskAssignees[i];
                           }
                           if ($scope.allTaskAssignees[i].coprocessor) {

                               if (listCoprocessor == '') {
                                   listCoprocessor += $scope.allTaskAssignees[i].fullName;
                               }
                               else {
                                   listCoprocessor += ', ' + $scope.allTaskAssignees[i].fullName;
                               }
                           }
                           if ($scope.allTaskAssignees[i].supervisor) {
                               if ($scope.allTaskAssignees[i].userId == $scope.authentication.userId) {
                                   laNguoiGiamSat = true;
                               }
                               if (listSupervisor == '') {
                                   listSupervisor += $scope.allTaskAssignees[i].fullName;
                               }
                               else {
                                   listSupervisor += ', ' + $scope.allTaskAssignees[i].fullName;
                               }
                           }
                       }
                       $scope.coprocessors = listCoprocessor;
                       $scope.supervisors = listSupervisor;
                   },
                   function (error) {
                       console.log(error);
                   });
            }
        }
        //TaskDocuments
        function loadTaskDocuments(task) {
            if (task.id != 0) {
                apiService.get($rootScope.baseUrl + 'api/TaskDocuments/GetByTask?taskId=' + task.id, null,
               function (result) {
                   angular.forEach(result.data.data, function (value, key) {
                       if (value.deleted == false) {
                           bindListDocument({
                               id: value.id,
                               receivedDocument: value.receivedDocument,
                               receivedNumber: value.receivedNumber,
                               documentNumber: value.documentNumber,
                               title: value.title,
                               documentDate: value.documentDate,
                               attachmentName: value.attachmentName,
                               attachmentPath: $scope.baseUrl + value.attachmentPath,
                               documentInfo: value.documentInfo,
                               signedBy: '',
                               externalFromDivision: '',
                               historyId: null,
                               countRead: value.countRead > 0 ? value.countRead + ' người đã đọc văn bản' : 'Chưa có người nào đọc văn bản này',
                               deleted: value.deleted,
                               retrieved: value.retrieved
                           });
                       }
                       else if (value.retrieved == true) {
                           bindListDocument({
                               id: value.id,
                               receivedDocument: value.receivedDocument,
                               receivedNumber: value.receivedNumber,
                               documentNumber: value.documentNumber,
                               title: value.title,
                               documentDate: value.documentDate,
                               attachmentName: value.attachmentName,
                               attachmentPath: 'javascript:void(0)',
                               documentInfo: value.documentInfo,
                               signedBy: '',
                               externalFromDivision: '',
                               historyId: null,
                               countRead: ' Văn bản đã bị thu hồi',
                               deleted: value.deleted,
                               retrieved: value.retrieved
                           });
                       }
                       else if (value.deleted == true) {
                           bindListDocument({
                               id: value.id,
                               receivedDocument: value.receivedDocument,
                               receivedNumber: value.receivedNumber,
                               documentNumber: value.documentNumber,
                               title: value.title,
                               documentDate: value.documentDate,
                               attachmentName: value.attachmentName,
                               attachmentPath: 'javascript:void(0)',
                               documentInfo: value.documentInfo,
                               signedBy: '',
                               externalFromDivision: '',
                               historyId: null,
                               countRead: ' Văn bản đã bị xóa',
                               deleted: value.deleted,
                               retrieved: value.retrieved
                           });
                       }
                   });
               },
               function (error) {
                   console.log(error);
               });
            }
        }
        function bindListDocument(dr) {
            var existed = false;
            angular.forEach($scope.listDocument, function (value, key) {
                if (value.id == dr.id && value.receivedDocument == dr.receivedDocument) {
                    existed = true;
                    value.countRead = dr.countRead;
                }
            });
            if (!existed) {
                $scope.listDocument.push(dr);
            }
        }
        $scope.redirectFile = redirectFile;
        function redirectFile(file, deleted) {
            if (deleted == false) {
                window.open(file, '_blank');
            }
        }
        $scope.countTaskDocument = function () {
            if ($scope.listDocument.length > 0) {
                return false;
            }
            return true;
        }
        //TaskAttachment
        function loadTaskAttachment(task) {
            if (task.id != 0) {
                apiService.get($rootScope.baseUrl + 'api/TaskAttachment/GetByTask?type=1&recordId=' + task.id, null,
               function (result) {
                   $scope.listTaskAttachment = result.data.data;
               },
               function (error) {
                   console.log(error);
               });
            }
        }
        //TaskOpinion
        function getFolderSaveFile() {
            var directory = $scope.authentication.departmentShortName + "/TaskOpinion-";
            return directory;
        }
        function checkSub(idSub) {
            if ($scope.newOpinion.parentId == idSub || $scope.newOpinionSub.parentId == idSub)
                return true;
            else
                return false;
        }
        $scope.newOpinionSub = {};
        $scope.setParent = function (id) {
            $scope.newOpinion.parentId = id;
            $scope.checkSub = checkSub;
            focus(id);
            $scope.newOpinionSub.contentSub = '';
        }

        function addOpinion(oid, parentId, type) {

            if ($scope.task.statusCode == 'DEFAULT') {
                if ($scope.IsXuLyChinh == true) {
                    notificationService.displayError('Bạn cần bắt đầu công việc trước khi gửi ý kiến');
                    $scope.startTask();
                    return;
                }
            }

            var selectedFile = "";
            if (type == 'sub') {
                $scope.newOpinion.content = $scope.newOpinionSub.contentSub;
                $scope.newOpinionSub.contentSub = '';
                selectedFile = $("#taskOpinionAttachmentSub_" + parentId.toString()).get(0).files;
            }
            else {
                $scope.newOpinion.parentId = 0;
                selectedFile = $("#taskOpinionAttachment").get(0).files;
            }
            var allowfileType = false;
            if (selectedFile.length > 0) {
                if (selectedFile[0] != null) {
                    var filename = selectedFile[0].name.split('.').pop();
                    if (filename == 'ppt' || filename == 'pptx' || filename == 'xls' || filename == 'xlsx' || filename == 'doc' || filename == 'docx' || filename == 'rar' || filename == 'zip' || filename == 'pdf' || filename == 'jpg' || filename == 'jpeg' || filename == 'png' || filename == 'gif') {
                        allowfileType = true;
                    }
                    else {
                        notificationService.displayError('Định dạng tệp tin không hợp lệ');
                        return;
                    }
                }
                if (selectedFile[0].size > 4194304) {
                    notificationService.displayError('Dung lượng tệp đính kèm vượt quá 4MB');
                    return;
                }
            }
            if (oid == null || oid == 0) {
                $scope.newOpinion.content = $scope.newOpinion.content.replace(/\n\r?/g, '<br />');
                apiService.post($rootScope.baseUrl + 'api/TaskOpinion/Add', $scope.newOpinion,
                                                   function (result) {
                                                       if (!result.data.isValid) {
                                                           angular.forEach(result.data.brokenRules, function (value, key) {
                                                               notificationService.displayError(value.rule);
                                                           });
                                                           return;
                                                       }
                                                       $scope.newOpinion.content = '';
                                                       var files = "";
                                                       if (type == 'sub') {
                                                           files = $("#taskOpinionAttachmentSub_" + parentId.toString()).get(0).files;
                                                       }
                                                       else {
                                                           files = $("#taskOpinionAttachment").get(0).files;
                                                       }
                                                       var folderSave = getFolderSaveFile();

                                                       if (files.length > 0) {
                                                           var data = new FormData();
                                                           for (i = 0; i < files.length; i++) {
                                                               data.append(folderSave + i, files[i]);
                                                               if (files[i].size > 4194304) {
                                                                   notificationService.displayError("Dung lượng tệp đính kèm vượt quá 4MB")
                                                                   return;
                                                               }
                                                           }

                                                           $http.post($rootScope.baseUrl + "api/FileUpload/PostAsyncTaskOpinionAttachment", data,
                                                               {
                                                                   headers:
                                                                       { 'Content-Type': undefined }
                                                               }).then(
                                                               function (response) {
                                                                   if (response.data.isSuccess) {
                                                                       if (response.data.data.length > 0) {
                                                                           var listTaskAttachment = [];
                                                                           angular.forEach(response.data.data, function (value, key) {
                                                                               var newTaskAttachment = { id: null, fileName: value.fileName, filePath: value.filePath, recordId: result.data.value.id, type: '2', active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                                               listTaskAttachment.push(newTaskAttachment);
                                                                           });

                                                                           console.log(listTaskAttachment);
                                                                           apiService.post($rootScope.baseUrl + 'api/TaskAttachment/AddListAttachment', listTaskAttachment,
                                                   function (result) {
                                                       document.getElementById("taskOpinionAttachment").value = "";
                                                       notificationService.displaySuccess('Cập nhật ý kiến thành công');
                                                       $scope.getTaskOpinion($scope.task);
                                                       $scope.getTaskOpiniomActivity($scope.task);
                                                   }, function (error) { });
                                                                       }
                                                                   }
                                                                   else {
                                                                       notificationService.displayError(response.data.message);
                                                                       return;
                                                                   }
                                                               },
                                                               function (error) {
                                                                   notificationService.displayError('không thể tải tệp đính kèm.');
                                                                   return;
                                                               });
                                                       }
                                                       else {
                                                           document.getElementById("taskOpinionAttachment").value = "";
                                                           notificationService.displaySuccess('Cập nhật ý kiến thành công');
                                                           $scope.getTaskOpinion($scope.task);
                                                           $scope.getTaskOpiniomActivity($scope.task);
                                                       }



                                                   }, function (error) {
                                                       notificationService.displayError('Cập nhật ý kiến thất bại');
                                                   });
            }
            else {
                $scope.newOpinion.content = $scope.newOpinion.content.replace(/\n\r?/g, '<br />');
                apiService.put($rootScope.baseUrl + 'api/TaskOpinion/Update', $scope.newOpinion,
                                                   function (result) {
                                                       if (!result.data.isValid) {
                                                           angular.forEach(result.data.brokenRules, function (value, key) {
                                                               notificationService.displayError(value.rule);
                                                           });
                                                           return;
                                                       }

                                                       $scope.newOpinion.content = '';
                                                       if (type == 'sub') {
                                                           files = $("#taskOpinionAttachmentSub_" + parentId.toString()).get(0).files;
                                                       }
                                                       else {
                                                           files = $("#taskOpinionAttachment").get(0).files;
                                                       }
                                                       var folderSave = getFolderSaveFile();

                                                       if (files.length > 0) {
                                                           var data = new FormData();
                                                           for (i = 0; i < files.length; i++) {
                                                               data.append(folderSave + i, files[i]);
                                                               if (files[i].size > 4194304) {
                                                                   notificationService.displayError("Dung lượng tệp đính kèm vượt quá 4MB")
                                                                   return;
                                                               }
                                                           }

                                                           $http.post($rootScope.baseUrl + "api/FileUpload/PostAsyncTaskOpinionAttachment", data,
                                                               {
                                                                   headers:
                                                                       { 'Content-Type': undefined }
                                                               }).then(
                                                               function (response) {
                                                                   if (response.data.isSuccess) {
                                                                       if (response.data.data.length > 0) {
                                                                           var listTaskAttachment = [];
                                                                           angular.forEach(response.data.data, function (value, key) {
                                                                               var newTaskAttachment = { id: null, fileName: value.fileName, filePath: value.filePath, recordId: result.data.value.id, type: '2', active: true, deleted: false, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                                               listTaskAttachment.push(newTaskAttachment);
                                                                           });

                                                                           console.log(listTaskAttachment);
                                                                           apiService.post($rootScope.baseUrl + 'api/TaskAttachment/AddListAttachment', listTaskAttachment,
                                                   function (result) {
                                                       document.getElementById("taskOpinionAttachment").value = "";
                                                       notificationService.displaySuccess('Cập nhật ý kiến thành công');
                                                       $scope.newOpinion = { id: null, content: '', taskId: id, active: 1, deleted: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                       $scope.getTaskOpinion($scope.task);
                                                       $scope.getTaskOpiniomActivity($scope.task);
                                                   }, function (error) { });
                                                                       }
                                                                   }
                                                                   else {
                                                                       notificationService.displayError(response.data.message);
                                                                       return;
                                                                   }
                                                               },
                                                               function (error) {
                                                                   notificationService.displayError('không thể tải tệp đính kèm.');
                                                                   return;
                                                               });
                                                       }
                                                       else {
                                                           document.getElementById("taskOpinionAttachment").value = "";
                                                           notificationService.displaySuccess('Cập nhật ý kiến thành công');
                                                           $scope.newOpinion = { id: null, content: '', taskId: id, active: 1, deleted: 0, createdOn: dateformatService.addMoreHours(new Date()), createdBy: userId, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
                                                           $scope.getTaskOpinion($scope.task);
                                                           $scope.getTaskOpiniomActivity($scope.task);
                                                       }


                                                   }, function (error) {
                                                       notificationService.displayError('Cập nhật ý kiến thất bại');
                                                   });
            }
        }
        $scope.addOpinion = addOpinion;
        function getTaskOpinion(task) {
            apiService.get($rootScope.baseUrl + 'api/TaskOpinion/GetByTaskId/' + task.id, null,
              function (result) {
                  $scope.listTaskOpinion = result.data.data;
              },
              function (error) {
                  console.log(error);
              });
        }
        $scope.checkCreatedByOpinion = function (createdBy) {
            if (userId == createdBy) {
                return false;
            }
            return true;
        }
        $scope.checkOpinionAttachment = function (filePath) {
            if (filePath == '' || filePath == null) {
                return true;
            }
            return false;
        }
        $scope.removeTaskOpinion = function (id, content, taskId, parentId, active, deleted, createdOn, createdBy) {
            var updateTaskOpinion = { id: id, content: content, taskId: taskId, parentId: parentId, active: active, deleted: true, createdOn: createdOn, createdBy: createdBy, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa ý kiến này?').then(function () {
                apiService.put($rootScope.baseUrl + 'api/TaskOpinion/Update', updateTaskOpinion,
                                              function (result) {
                                                  if (!result.data.isValid) {
                                                      angular.forEach(result.data.brokenRules, function (value, key) {
                                                          notificationService.displayError(value.rule);
                                                      });
                                                      return;
                                                  }
                                                  if (result.data.isSuccess) {
                                                      notificationService.displaySuccess('Đã xóa ý kiến');
                                                      $scope.getTaskOpinion($scope.task);
                                                      $scope.getTaskOpiniomActivity($scope.task);
                                                  }
                                              }, function (error) { });
            });
        }
        $scope.updateTaskOpinion = function (id, content, taskId, parentId, active, deleted, createdOn, createdBy) {

            $scope.newOpinion = { id: id, content: content.replace(/<br\s*\/?>/gi, '\n'), taskId: taskId, parentId: parentId, active: active, deleted: deleted, createdOn: createdOn, createdBy: createdBy, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
            document.getElementById('content').focus();
        }
        $scope.updateTaskOpinionSub = function (id, content, taskId, parentId, active, deleted, createdOn, createdBy) {
            $scope.newOpinion = { id: id, content: '', taskId: taskId, parentId: parentId, active: active, deleted: deleted, createdOn: createdOn, createdBy: createdBy, editedOn: dateformatService.addMoreHours(new Date()), editedBy: userId };
            $scope.newOpinionSub.contentSub = content;
            $scope.checkSub = checkSub;
            focus(parentId);
        }
        $scope.removeContent = function (type) {
            if (type == 'sub') {
                document.getElementById("taskOpinionAttachmentSub_" + $scope.newOpinion.parentId).value = "";
                $scope.newOpinionSub.contentSub = '';
                focus($scope.newOpinion.parentId);
            }
            else {
                document.getElementById("taskOpinionAttachment").value = "";
                $scope.newOpinion.content = '';
                document.getElementById('content').focus();
            }

        }

        function getTaskActivity(task) {
            apiService.get($rootScope.baseUrl + 'api/TaskActivity/GetByTaskId/' + task.id, null,
              function (result) {
                  $scope.listTackActivity = result.data.data;
              },
              function (error) {
                  console.log(error);
              });
        }
        $scope.checkContent = function (content) {
            if (content == null || content == '') {
                return true;
            }
            return false;
        }


        function getTaskOpiniomActivity(task) {
            apiService.get($rootScope.baseUrl + 'api/TaskActivity/GetTaskOpinionAndActivityByTaskId/' + task.id, null,
              function (result) {
                  $scope.listTackActivityOpinion = result.data.data;
              },
              function (error) {
                  console.log(error);
              });
        }
        $scope.checkOpinionOrActivity = function (model) {
            if (model == 'ACTIVITY') { return true; } else { return false; }
        }
        $scope.checkOpinionAuthor = function (createdBy, model) {
            if (model == "ACTIVITY")
                return true;
            else {
                if (userId == createdBy) {
                    return false;
                }
                return true;
            }
        }
        $scope.checkOpinionAction = function (model) {
            if (model == "ACTIVITY")
                return true;
            else {
                return false;
            }
        }
        $scope.getAvatar = function (avt) {
            if (avt == '') {
                return 'Uploads/Avatar/no-avatar.jpg';
            }
            else {
                return avt;
            }
        }

        //Function
        $scope.showAddMoreDongXuLy = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addMoreDongXuLy.html',
                controller: 'addMoreDongXuLyController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.task.id;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    },
                    userId: function () {
                        return $scope.authentication.userId;
                    },
                    superLeader: function () {
                        return $scope.authentication.superLeader;
                    }
                }
            })
            modalInstance.result.then(function () {
                getTask(id, function taskLoaded(result) {
                    $scope.task = result.data.value;
                    loadTaskDetail($scope.task);
                });

            }, function (dis) {

            });
        }
        $scope.showDocumentHistory = function (documentId, documentReceived, deleted) {
            if (deleted == false) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'viewDocumentHistory.html',
                    controller: 'documentHistoryController',
                    controllerAs: '$ctr',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        id: function () {
                            return $scope.task.id;
                        },
                        departmentId: function () {
                            return $scope.authentication.departmentId;
                        },
                        userId: function () {
                            return $scope.authentication.userId;
                        },
                        documentId: function () {
                            return documentId;
                        },
                        documentReceived: function () {
                            return documentReceived;
                        }
                    }
                })
                modalInstance.result.then(function () {


                }, function (dis) {

                });
            }
        };


        $scope.goUpdate = function () {
            $state.go('add_edit_task', { id: $scope.task.id });
        }

        function startTask() {
            $('#modal-startTaskModal').modal({ backdrop: 'static' });
        }

        $scope.startTask = function () {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'startTask.html',
                controller: 'startTaskController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.task.id;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    },
                    userId: function () {
                        return $scope.authentication.userId;
                    }
                }
            })
            modalInstance.result.then(function () {
                getTask(id, function taskLoaded(result) {
                    $scope.task = result.data.value;
                    loadTaskDetail($scope.task);
                });

            }, function (dis) {

            });
        };

        function forwardTask() {
            $('#modal-forwardTaskModal').modal({ backdrop: 'static' });
        }
        $scope.forwardTask = function () {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'forwardTask.html',
                controller: 'forwardTaskController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.task.id;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    },
                    userId: function () {
                        return $scope.authentication.userId;
                    },
                    assignee: function () {
                        return $scope.assignee;
                    },
                    superLeader: function () {
                        return $scope.authentication.superLeader;
                    }
                }
            })
            modalInstance.result.then(function () {
                getTask(id, function taskLoaded(result) {
                    $scope.task = result.data.value;
                    loadTaskDetail($scope.task);
                });

            }, function (dis) {

            });
        };

        function finishTask() {
            $('#modal-finishTaskModal').modal({ backdrop: 'static' });
        }
        $scope.finishTask = function () {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'finishTask.html',
                controller: 'finishTaskController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.task.id;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    },
                    userId: function () {
                        return $scope.authentication.userId;
                    }
                }
            })
            modalInstance.result.then(function () {
                getTask(id, function taskLoaded(result) {
                    $scope.task = result.data.value;
                    loadTaskDetail($scope.task);
                });

            }, function (dis) {

            });
        };

        function closeTask() {
            $('#modal-closeTaskModal').modal({ backdrop: 'static' });
        }
        $scope.closeTask = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'closeTask.html',
                controller: 'closeTaskController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.task.id;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    },
                    userId: function () {
                        return $scope.authentication.userId;
                    }
                }
            })
            modalInstance.result.then(function () {
                getTask(id, function taskLoaded(result) {
                    $scope.task = result.data.value;
                    loadTaskDetail($scope.task);
                });

            }, function (dis) {

            });
        };

        function reopenTask() {
            $('#modal-closeTaskModal').modal({ backdrop: 'static' });
        }
        $scope.reopenTask = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'reopenTask.html',
                controller: 'reopenTaskController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $scope.task.id;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    },
                    userId: function () {
                        return $scope.authentication.userId;
                    }
                }
            })
            modalInstance.result.then(function () {
                getTask(id, function taskLoaded(result) {
                    $scope.task = result.data.value;
                    loadTaskDetail($scope.task);
                });

            }, function (dis) {

            });
        };
        //END
        $scope.showCountViewTask = function () {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'showCountViewTaskDetail.html',
                controller: 'countViewTaskDetailController',
                controllerAs: '$ctr',
                keyboard: false,
                resolve: {
                    id: function () {
                        return $stateParams.id;
                    }
                }
            })
            modalInstance.result.then(function () {
            }, function (dis) {
            });
        };


        $scope.BindList = function () {
            $state.go('task', { statusId: $stateParams.statusId, fromDate: $stateParams.fromDate, toDate: $stateParams.toDate, currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, assignToMe: $stateParams.assignToMe, relativeToMe: $stateParams.relativeToMe });
        }
    }
})(angular.module('VOfficeApp.task'));