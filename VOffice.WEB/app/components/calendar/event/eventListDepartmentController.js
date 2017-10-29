(function (app) {
    app.controller('eventListDepartmentController', eventListDepartmentController);
    app.controller('viewDetailEventController', viewDetailEventController);
    app.controller('addOrEditImportantJobController', addOrEditImportantJobController);

    addOrEditImportantJobController.$inject = ['$uibModalInstance',
                                       '$rootScope',
                                       'apiService',
                                       '$ngBootbox',
                                       'notificationService',
                                       '$stateParams',
                                       'dateformatService', 'data', 'focus'];

    viewDetailEventController.$inject = ['$uibModalInstance',
                                       '$rootScope',
                                       'apiService',
                                       '$ngBootbox',
                                       'notificationService',
                                       '$stateParams',
                                       'dateformatService',
                                       'item'];

    eventListDepartmentController.$inject = ['$scope',
      'apiService',
      'notificationService',
      'dateformatService',
      'focus',
      '$ngBootbox',
      '$stateParams',
      '$uibModal',
      '$rootScope', 'actionOfEvent'];

    function addOrEditImportantJobController($uibModalInstance, $rootScope, apiService,
                                             $ngBootbox, notificationService,
                                             $stateParams, dateformatService, data, focus) {
        var $ctr = this;
        var currentDate = new Date();
        focus('id_content')
        $ctr.jobs = {};
        $ctr.jobs.id = data.importantJobId;
        $ctr.selectTime = "currentWeek";
        $ctr.startDate = currentDate.startOfWeek(1);
        $ctr.endDate = $ctr.startDate.addDays(6);
        if (data.note == true) {
            $ctr.titleModal = 'CẬP NHẬT CÔNG TÁC TRONG TÂM';
        }
        else {
            $ctr.titleModal = 'CẬP NHẬT GHI CHÚ';
        }
        $ctr.changedSelectedTime = function () {
            if ($ctr.selectTime == "currentWeek") {
                $ctr.startDate = currentDate.startOfWeek(1);
                $ctr.endDate = $ctr.startDate.addDays(6);
            } else {
                $ctr.startDate = currentDate.startOfWeek(1).addDays(7);
                $ctr.endDate = $ctr.startDate.addDays(6);
            }
        }

        var save = function () {

            $ctr.jobs.startDate = $ctr.startDate;
            $ctr.jobs.endDate = $ctr.endDate;
            $ctr.jobs.departmentId = parseInt(data.departmentId);
            $ctr.jobs.note = data.note;
            $ctr.jobs.active = true;
            $ctr.jobs.deleted = false;
            $ctr.jobs.createdOn = new Date();
            $ctr.jobs.createdBy = data.userId;
            $ctr.jobs.editedBy = data.userId;
            $ctr.jobs.editedOn = new Date();
            $ctr.jobs.content = $ctr.jobs.content.replace(/\n\r?/g, '<br />');

            if ($ctr.jobs.id == null || $ctr.jobs.id == 0) {
                // kiem tra dung trong tuan hien tai thi 
                apiService.post($rootScope.baseUrl + 'api/ImportantJob/Add', $ctr.jobs,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Thêm mới sự kiện thành công");
                            $uibModalInstance.close();
                        }
                    }, function (error) {

                    });
            } else {
                $ctr.jobs.editedBy = data.userId;
                apiService.put($rootScope.baseUrl + 'api/ImportantJob/Edit', $ctr.jobs,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Cập nhật sự kiện thành công")
                            $uibModalInstance.close();
                        }
                    },
                    function (error) {
                    });
            }
        }

        var loadimportantJob = function () {
            apiService.get($rootScope.baseUrl + 'api/ImportantJob/Get/' + data.importantJobId, null,
            function (result) {
                if (result.data.isSuccess == true) {
                    $ctr.jobs = result.data.value;
                    $ctr.jobs.content = $ctr.jobs.content.replace(/<br\s*\/?>/gi, '\n');
                }
            }, function (error) {

            });
        }


        $ctr.initForm = function () {
            if ($ctr.jobs.id > 0) {
                loadimportantJob();
            }

        }
        $ctr.initForm();


        $ctr.save = function () {
            $ngBootbox.confirm("Bạn có muốn cập nhật dữ liệu").then(function (result) {
                if ($ctr.jobs.content != '' && $ctr.jobs.content != null && $ctr.jobs.content != undefined) {
                    save();
                }
                else {
                    notificationService.displayError("Không để trống nội dung")
                    focus('id_content');
                }
            });
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function viewDetailEventController($uibModalInstance, $rootScope, apiService,
                                        $ngBootbox, notificationService, $stateParams,
                                        dateformatService, item) {
      
        var $ctr = this;

        var CLIENT_ID = '818191161289-bcdp0v3vf355ekvnof0h87n8p7cf973b.apps.googleusercontent.com';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar";

        var authorizeButton;// = document.getElementById('authorize-button');
        var signoutButton;//= document.getElementById('signout-button');

        // handleClientLoad();
        function handleClientLoad() {

            authorizeButton = document.getElementById('authorize-button');
            signoutButton = document.getElementById('signout-button');
            gapi.load('client:auth2', initClient);

            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + item.userId + '&roleName=acceptevent', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $ctr.showSave = result.data.value;
                    }
                },
                function () {
                });
        }
        function initClient() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {

                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
            });
        }

        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
        }

        /**
         *  Sign out the user upon button click.
         */
        function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        }
        function updateSigninStatus(isSignedIn) {
            var checkThongBao = document.getElementById("chkNotice");
            var noticeGoogleSpan = document.getElementById("login-google-notice");
            if (isSignedIn) {
                noticeGoogleSpan.style.display = 'none';
                authorizeButton.style.display = 'none';
                signoutButton.style.display = 'inline-block';

                apiService.get($rootScope.baseUrl + 'api/Event/get/' + item.item.id, null,
                     function (result) {
                         if (result.data.isSuccess == true) {
                             if (result.data.value.googleEvent != null) {
                                 var request = gapi.client.calendar.events.get({
                                     'calendarId': 'primary',
                                     'eventId': result.data.value.googleEvent.googleEventId
                                 });
                                 request.execute(function (event) {
                                     $ctr.googleEventEdit = event;
                                 });
                             }

                         }
                     }, null);

            } else {

                noticeGoogleSpan.style.display = 'inline-block';
                authorizeButton.style.display = 'inline-block';
                signoutButton.style.display = 'none';
            }

        }
        $ctr.handleClientLoad = handleClientLoad;



        $ctr.title = item.title.substring(0, item.title.indexOf("<br") - 1);
        if (item.item.startTime != null) {
            $ctr.title = $ctr.title + ", ngày " + dateformatService.formatToDDMMYY(new Date(item.item.startTime));
        } else {
            $ctr.title = $ctr.title + ", ngày " + dateformatService.formatToDDMMYY(new Date(item.item.occurDate));
        }
        $ctr.event = item.item;
        $ctr.checkTime = function () {
            if ($ctr.event.startTime == null) {
                return false;
            }
            else
                return true;
        }
        $ctr.accepted = item.item.accepted;
        $ctr.canceled = item.item.canceled;
        var getAllStaff = function () {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetAll', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $ctr.allStaffs = result.data.data;
                        getStaffNotify();

                    }
                }
                , null);
        }
        var getStaffNotify = function () {
            apiService.get($rootScope.baseUrl + 'api/Event/Get/' + item.item.id, null
                , function (result) {
                    if (result.data.isSuccess == true) {
                        $ctr.staffNotify = "";
                        $ctr.eventEdit = result.data.value;
                        if ($ctr.allStaffs.length > 0) {

                            var staffs = result.data.value.eventUserNotifys;

                            if ($ctr.eventEdit.eventUserNotifys.length > 0) {
                                angular.forEach($ctr.eventEdit.eventUserNotifys, function (value, key) {
                                    var lead = $ctr.allStaffs.filter(function (item) {
                                        return item.userId == value.userId;
                                    });

                                    value.email = lead[0].email;

                                    if (lead.length > 0) {
                                        if ($ctr.staffNotify == "") {
                                            $ctr.staffNotify = $ctr.staffNotify + lead[0].fullName;
                                        } else {
                                            $ctr.staffNotify += ", " + lead[0].fullName;
                                        }
                                    }

                                });
                            }

                        }
                    }
                }
                , null);
        }
        var deleteGoogleEvent = function (googleEvent) {
            var request = gapi.client.calendar.events.delete({
                'calendarId': 'primary',
                'eventId': googleEvent.googleEventId
            });
            request.execute(function (event) {
                console.log('xoa google event thanh cong');
            });
        }

        var saveEventToGoogleCalendar = function () {
            if ($ctr.eventEdit.googleEvent != null && $ctr.accepted == true) {
                var listUserReminder = [];
                angular.forEach($ctr.eventEdit.eventUserNotifys, function (value, key) {
                    listUserReminder.push({
                        'email': value.email
                    });
                });
                if (listUserReminder.length > 0 && $ctr.eventEdit.startTime != null) {
                    if ($ctr.googleEventEdit != null) {
                        $ctr.googleEventEdit.summary = $ctr.eventEdit.content;
                        $ctr.googleEventEdit.location = $ctr.eventEdit.place;
                        $ctr.googleEventEdit.description = $ctr.eventEdit.content;
                        $ctr.googleEventEdit.start.dateTime = $ctr.eventEdit.startTime.replace('Z', '');
                        $ctr.googleEventEdit.start.timeZone = "(GMT+07:00) Hanoi";

                        $ctr.googleEventEdit.end.dateTime = $ctr.eventEdit.startTime.replace('Z', '');
                        $ctr.googleEventEdit.end.timeZone = "(GMT+07:00) Hanoi";

                        $ctr.googleEventEdit.attendees = listUserReminder;
                        $ctr.googleEventEdit.reminders.useDefault = false;
                        $ctr.googleEventEdit.reminders.overrides = [
                                                                        {
                                                                            "method": "email",
                                                                            "minutes": $ctr.eventEdit.notificationTimeSpan != null ? $ctr.eventEdit.notificationTimeSpan : 60
                                                                        },
                                                                         {
                                                                             "method": "popup",
                                                                             "minutes": $ctr.eventEdit.notificationTimeSpan != null ? $ctr.eventEdit.notificationTimeSpan : 60
                                                                         }
                        ];

                        var request = gapi.client.calendar.events.update({
                            'calendarId': 'primary',
                            'eventId': $ctr.googleEventEdit.id,
                            'resource': $ctr.googleEventEdit
                        });

                        request.execute(function (event) {
                            //alert('Event updated successfully');
                            //$scope.bindList();
                        });
                    }
                }
            } else if ($ctr.accepted == true && $ctr.eventEdit.startTime != null) {
                // create google event;
                var listUserReminder = [];
                angular.forEach($ctr.eventEdit.eventUserNotifys, function (value, key) {
                    if (value.email != null) {
                        listUserReminder.push({
                            'email': value.email
                        });
                    }
                });
                var event = {
                    "summary": $ctr.eventEdit.content,
                    "location": $ctr.eventEdit.place,
                    "description": $ctr.eventEdit.content,
                    "start": {
                        "dateTime": $ctr.eventEdit.startTime.replace('Z', '')
                        , "timeZone": "(GMT+07:00) Hanoi"
                    },
                    "end": {
                        "dateTime": $ctr.eventEdit.startTime.replace('Z', '')
                        , "timeZone": "(GMT+07:00) Hanoi"
                    },
                    "attendees": listUserReminder,
                    "reminders": {
                        "useDefault": false,
                        "overrides": [
                        {
                            "method": "email",
                            "minutes": $ctr.eventEdit.notificationTimeSpan != null ? $ctr.eventEdit.notificationTimeSpan : 60
                        },
                                  {
                                      "method": "popup",
                                      "minutes": $ctr.eventEdit.notificationTimeSpan != null ? $ctr.eventEdit.notificationTimeSpan : 60
                                  }
                        ]
                    }
                };
                var request = gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });
                request.execute(function (event) {
                    var eventGoogle = {
                        googleEventId: event.id,
                        eventId: $ctr.eventEdit.id,
                        createdOn: new Date(),
                        createdBy: item.userId
                    }
                    apiService.post($rootScope.baseUrl + 'api/Event/AddEventGoogle', eventGoogle,
                        function (result) {
                            if (result.data.isSuccess == true) {
                                // $state.go('event_list');
                            }
                        },
                        function (error) {
                            console.log(error);
                        });
                });

            }
            if ($ctr.canceled == true) {
                if ($ctr.eventEdit.googleEvent != null) {
                    deleteGoogleEvent($ctr.eventEdit.googleEvent);
                }
            }
        }

        var save = function () {
            var dataAccepted = {
                eventId: item.item.id,
                userId: item.userId,
                accepted: $ctr.accepted
            }
            var dataCanceled = {
                eventId: item.item.id,
                userId: item.userId,
                canceled: $ctr.canceled
            }
            apiService.put($rootScope.baseUrl + 'api/Event/AcceptedEvent', dataAccepted,
                function (result) {

                    apiService.put($rootScope.baseUrl + 'api/Event/DeferredEvent', dataCanceled,
                         function (result) {
                             $uibModalInstance.close();
                         }, function (error) { });

                    if (dataAccepted.accepted) {
                        saveEventToGoogleCalendar();
                    }
                }, function (error) { });
        }
        getAllStaff();
        $ctr.save = function () {
            $ngBootbox.confirm("Bạn có muốn cập nhật dữ liệu").then(function (result) {
                save();

            });
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function eventListDepartmentController($scope,
                                   apiService,
                                   notificationService,
                                   dateformatService,
                                   focus,
                                   $ngBootbox,
                                   $stateParams,
                                   $uibModal,
                                   $rootScope,
                                   actionOfEvent) {
                                       $(document.body).addClass('body-small');
                                       $(document.body).removeClass('mini-navbar');
        $scope.currentDate = new Date();
        var userId = $scope.authentication.userId;
        var getDepartmentOfWeek = function (date) {
            var datestring = dateformatService.formatToDDMMYY($scope.currentDate);
            apiService.get($rootScope.baseUrl + 'api/Event/GetDeparmentEventOfWeek?departmentId=' + $scope.departmentIdSelected + '&date=' + datestring.split("/").reverse().join("-"), null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.events = result.data.data;
                        angular.forEach($scope.events, function (value, key) {
                            if (dateformatService.formatToDDMMYY(new Date(value.occurDate)) == datestring) {
                                value.red = true;
                            } else {
                                value.red = false;
                            }
                            if ($scope.departmentIdSelected != parseInt($scope.authentication.departmentId)) {
                                if (value.contentMornings.length > 0) {
                                    value.contentMornings = value.contentMornings.filter(function (item) {
                                        return item.public == true;
                                    });
                                }
                                if (value.contentAfternoons.length > 0) {
                                    value.contentAfternoons = value.contentAfternoons.filter(function (item) {
                                        return item.public == true;
                                    });
                                }
                            }
                            angular.forEach(value.contentMornings, function (val, key) {
                                if (val.createdBy == $scope.authentication.userId && val.accepted == false) {
                                    val.edit = true;
                                    val.showEventNotAccept = true;
                                } else {
                                    val.edit = false;
                                    if ($scope.acceptEventPermission) {
                                        val.showEventNotAccept = true;
                                    } else {
                                        val.showEventNotAccept = val.accepted;
                                    }
                                }

                            });
                            angular.forEach(value.contentAfternoons, function (val, key) {
                                if (val.createdBy == $scope.authentication.userId && val.accepted == false) {
                                    val.edit = true;
                                    val.showEventNotAccept = true;
                                } else {
                                    val.edit = false;
                                    if ($scope.acceptEventPermission) {
                                        val.showEventNotAccept = true;
                                    } else {
                                        val.showEventNotAccept = val.accepted;
                                    }

                                }
                            });
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
        }
        var getAllDepartmnet = function () {
            apiService.get($rootScope.baseUrl + 'api/Department/GetAll', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.allDepartments = result.data.data.filter(function (item) {
                            return item.root == 1;
                        });

                        var currentDepartment = $scope.allDepartments.filter(function (item) {
                            return item.id == parseInt($scope.authentication.departmentId);
                        });
                        if (currentDepartment.length > 0) {
                            $scope.initialDepartment = currentDepartment[0].name;
                            $scope.departmentIdSelected = currentDepartment[0].id;
                        } else {
                            $scope.departmentIdSelected = parseInt($scope.authentication.departmentId);
                        }
                        getDepartmentOfWeek($scope.currentDate);
                        $scope.departmentSelected = []
                        $scope.departmentSelected.push(currentDepartment[0]);

                    }
                }
                , function (error) {

                });
        }

        $scope.selectedDeparmentChanged = function (selected) {
            if (selected != null) {
                $scope.departmentIdSelected = selected.id;
                if (selected.id != parseInt($scope.authentication.departmentId)) {
                    $scope.allowUpdateEvent = false;
                } else {
                    $scope.allowUpdateEvent = true;
                }
                getDepartmentOfWeek($scope.currentDate);
            } else {
                $scope.departmentIdSelected = parseInt($scope.authentication.departmentId);
                $scope.allowUpdateEvent = true;
            }
        }

        $scope.next = function () {
            $scope.currentDate = $scope.currentDate.addDays(7);
            getDepartmentOfWeek($scope.currentDate);
        }

        $scope.back = function () {
            $scope.currentDate = $scope.currentDate.addDays(-7);
            getDepartmentOfWeek($scope.currentDate);
        }

        $scope.backHome = function () {
            $scope.currentDate = new Date();
            getDepartmentOfWeek($scope.currentDate);
        }

        $scope.deleteImportantJob = function (id) {
            $ngBootbox.confirm("Bạn có muốn xóa công tác trọng tâm này không?").then(function (result) {
                apiService.put($rootScope.baseUrl + 'api/ImportantJob/DeleteLogicalImportantJob/' + id, null,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Xóa nội dung công tác trọng tâm thành công");
                            getAllDepartmnet();
                        }
                    },
                    function (error) {
                    });
            });
        }

        var downloadFile = function (downloadPath) {
            window.open(downloadPath, '_blank', '');
        }

        $scope.getEventDocFile = function (accepted) {
            var dateParam = dateformatService.formatToDDMMYY($scope.currentDate).split("/").reverse().join("-");
            apiService.get($rootScope.baseUrl + 'api/Event/GetEventFile?departmentId=' + $scope.departmentIdSelected + '&date=' + dateParam + '&accepted=' + accepted + '&userId=' + userId, null
                , function (result) {
                    if (result.data.isSuccess == true) {
                        downloadFile($rootScope.baseUrl + result.data.value);
                    }
                }, null);
        }
        $scope.deleteEvent = function (id, edit, googleEvent) {
            //console.log(id);

            if (edit == true) {
                $ngBootbox.confirm("Bạn có muốn xóa sự kiện này không?").then(function (result) {

                    apiService.put($rootScope.baseUrl + 'api/Event/DeleteLogicalNonAuthorize?eventId=' + id, null, function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Xóa sự kiện thành công");
                            getDepartmentOfWeek($scope.currentDate);
                            if (!$scope.isSignedIn && googleEvent != null) {
                                handleAuthClick(googleEvent);
                            } else if ($scope.isSignedIn && googleEvent != null) {
                                deleteGoogleEvent(googleEvent)
                            }
                        }
                        else {
                            notificationService.displayError("Xóa sự kiện không thành công");
                        }
                    }, null);
                });
            } else {
                $ngBootbox.confirm("Bạn có muốn xóa sự kiện này không?").then(function (result) {

                    apiService.put($rootScope.baseUrl + 'api/Event/DeleteLogical?eventId=' + id, null, function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Xóa sự kiện thành công");
                            getDepartmentOfWeek($scope.currentDate);
                            if (!$scope.isSignedIn && googleEvent != null) {
                                handleAuthClick(googleEvent);
                            } else if ($scope.isSignedIn && googleEvent != null) {
                                deleteGoogleEvent(googleEvent)
                            }
                        }
                        else {
                            notificationService.displayError("Xóa sự kiện không thành công");
                        }
                    }, null);
                });
            }

        }

        $scope.initData = function () {
            $scope.allowUpdateEvent = true;
            $scope.addNewEvent = actionOfEvent.ADD_NEW_EVENT;
            $scope.registerEvent = actionOfEvent.REGISTER_EVENT;
            $scope.addPersional = actionOfEvent.ADD_NEW_EVENT_PERSIONAL;
            getAllDepartmnet();
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + $scope.authentication.userId + '&roleName=acceptevent', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.acceptEventPermission = result.data.value;
                    }
                },
                null);
        }

        $scope.initData();

        $scope.viewEventDetail = function (item, title) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'viewDetailEvent.html',
                controller: 'viewDetailEventController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    item: function () {
                        return {
                            item: item,
                            title: title,
                            userId: $scope.authentication.userId
                        }
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $scope.initData();
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.addImportantJob = function (note, importantJobId) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addOrEditImportantJob.html',
                controller: 'addOrEditImportantJobController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    data: function () {
                        return {
                            note: note,
                            departmentId: $scope.authentication.departmentId,
                            userId: $scope.authentication.userId,
                            importantJobId: importantJobId
                        }
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $scope.initData();
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }


        var deleteGoogleEvent = function (googleEvent) {
            var request = gapi.client.calendar.events.delete({
                'calendarId': 'primary',
                'eventId': googleEvent.googleEventId
            });
            request.execute(function (event) {
                console.log('xoa google event thanh cong');
            });
        }

        $scope.loadDepartment = function ($query) {
            var listDepartment = $scope.allDepartments;
            return listDepartment.filter(function (depart) {
                return depart.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });

        };

        $scope.forceOneTag = function (tags) {
            if ($scope.departmentSelected != null) {
                var array = $scope.departmentSelected;
                if (array.length > 1) {
                    var objRemove = {};
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].id == tags.id) {
                            objRemove = array[i];
                            array.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.departmentSelected = array;
                }
                $scope.selectedDeparmentChanged($scope.departmentSelected);
            }
            else {
                $scope.selectedDeparmentChanged(tags);
            }

        }

























        /// delete google event 
        var CLIENT_ID = '818191161289-bcdp0v3vf355ekvnof0h87n8p7cf973b.apps.googleusercontent.com';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar";


        function handleClientLoad() {

            gapi.load('client:auth2', initClient);


        }
        function initClient() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {

                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            });
        }

        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
            gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => {
                if (signedIn == true) {
                    deleteGoogleEvent(event);
                }
            });
        }

        function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        }

        function updateSigninStatus(isSignedIn) {
            $scope.isSignedIn = isSignedIn;
        }
        $scope.handleClientLoad = handleClientLoad;

        $scope.handleClientLoad();



    }
})(angular.module('VOfficeApp.event'));