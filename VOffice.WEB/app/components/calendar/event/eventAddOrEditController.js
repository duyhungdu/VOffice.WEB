(function (app) {
    app.controller('eventAddOrEditController', eventAddOrEditController);
    eventAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$http',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      '$rootScope',
                                      'dateformatService', 'actionOfEvent', 'fogLoading']
    function eventAddOrEditController($scope,
                                      apiService,
                                      notificationService,
                                      focus,
                                      $http,
                                      $state,
                                      $stateParams,
                                      $ngBootbox,
                                      $rootScope,
                                      dateformatService, actionOfEvent, fogLoading) {

        var CLIENT_ID = '818191161289-bcdp0v3vf355ekvnof0h87n8p7cf973b.apps.googleusercontent.com';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar";

        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');


        handleClientLoad();
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
            var noticeTimeSpan = document.getElementById("div-notify-time-span");
            var noticeTo = document.getElementById("div-notify-to");



            if (isSignedIn) {

                noticeTimeSpan.style.display = 'block';
                noticeTo.style.display = 'block';
                noticeGoogleSpan.style.display = 'none';
                authorizeButton.style.display = 'none';
                signoutButton.style.display = 'inline-block';
                if ($scope.action == "EDIT") {
                    apiService.get($rootScope.baseUrl + 'api/Event/get/' + $stateParams.id, null,
                         function (result) {
                             if (result.data.isSuccess == true) {
                                 if (result.data.value.googleEvent != null) {
                                     var request = gapi.client.calendar.events.get({
                                         'calendarId': 'primary',
                                         'eventId': result.data.value.googleEvent.googleEventId
                                     });
                                     request.execute(function (event) {
                                         $scope.googleEventEdit = event;
                                         console.log($scope.googleEventEdit);
                                     });
                                 }

                             }
                         }, null);
                }
            } else {
                noticeTimeSpan.style.display = 'none';
                noticeTo.style.display = 'none';
                noticeGoogleSpan.style.display = 'inline-block';
                authorizeButton.style.display = 'inline-block';
                signoutButton.style.display = 'none';
            }

        }






        $scope.listOptionHours = [];
        $scope.listOptionMinutes = [];
        $scope.listTypeTimeSpan = [{ id: 1, name: "Phút" }, { id: 2, name: "Giờ" }]

        var initOptionHour = function () {
            for (i = 0; i <= 24; i++) {
                if (i < 10) {
                    $scope.listOptionHours.push({ id: i, name: "0" + i.toString() });
                } else {
                    $scope.listOptionHours.push({ id: i, name: i.toString() });
                }
            }
        }

        var initOptionMinute = function () {
            for (i = 0; i <= 60; i += 5) {
                if (i < 10) {
                    $scope.listOptionMinutes.push({ id: i, name: "0" + i.toString() });
                } else {
                    $scope.listOptionMinutes.push({ id: i, name: i.toString() });
                }
            }
        }

        var initMeetingRooms = function (callback) {
            apiService.get($rootScope.baseUrl + 'api/MeetingRoom/GetAll', null, function (result) {
                if (result.data.isSuccess == true) {
                    $scope.meetingRooms = result.data.data;
                    if (callback) callback(result);
                }
            }, null);
        }

        var saveData = function (type) {
            if ($scope.action == "ADD") {
                $scope.events.departmentId = parseInt($scope.authentication.departmentId);
                $scope.events.occurDate = $scope.occurDateString.split("/").reverse().join("-");
                if ($scope.selectedMeettingRoomValue != null) {
                    $scope.events.meetingRoomId = $scope.selectedMeettingRoomValue.id;
                }
                if ($scope.checkTimeUnKown == false) {
                    var d = new Date($scope.events.occurDate);
                    d.setHours(d.getHours() + $scope.selectedHourStart.id);
                    d.setMinutes(d.getMinutes() + $scope.selectedMinuteStart.id);
                    $scope.events.startTime = d;
                    $scope.events.startTimeUnderfined = true;
                } else {
                    $scope.events.startTime = null;
                    $scope.events.startTimeUnderfined = true;
                }
                $scope.events.startTimeUnderfined = false;
                $scope.events.endTimeUndefined = true;
                if ($scope.checkNotTimeEnd == false) {
                    var d2 = new Date($scope.events.occurDate);
                    d2.setHours(d2.getHours() + $scope.selectedHourEnd.id);
                    d2.setMinutes(d2.getMinutes() + $scope.selectedMinuteEnd.id);
                    $scope.events.endTime = d2;
                    $scope.events.endTimeUndefined = true;
                }
                $scope.events.morning = ($scope.statusDay == "Sang");
                $scope.events.public = !$scope.public;

                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    $scope.events.eventUserNotifys = [];

                    if ($scope.staffSendNotify != null && $scope.staffSendNotify.length > 0) {
                        if ($scope.selelctTypeTimeSpan.id == 1) {
                            $scope.events.notificationTimeSpan = $scope.notificationTimeSpan;
                        } else {
                            $scope.events.notificationTimeSpan = $scope.notificationTimeSpan * 60;
                        }
                        if ($scope.staffSendNotify.length > 0) {
                            angular.forEach($scope.staffSendNotify, function (value, key) {
                                $scope.events.eventUserNotifys.push(
                                    {
                                        userId: value.userId,
                                        email: value.email,
                                        createdOn: dateformatService.addMoreHours(new Date()),
                                        createdBy: $scope.authentication.userId
                                    });
                            });
                        }
                    } else {
                        $scope.events.notificationTimeSpan = null;
                    }
                }


                if ($scope.seniorLeaderNotify != null) {
                    if ($scope.seniorLeaderNotify != null && $scope.seniorLeaderNotify.length > 0) {
                        $scope.events.leaderEvents = [];
                        angular.forEach($scope.seniorLeaderNotify, function (value, key) {
                            $scope.events.leaderEvents.push(
                                {
                                    leaderId: value.userId,
                                    createdOn: dateformatService.addMoreHours(new Date()),
                                    createdBy: $scope.authentication.userId
                                });
                        });
                    }
                    else {
                        $scope.events.leaderEvents = null;
                        $scope.seniorLeaderNotify = null;
                    }
                }
                else {
                    $scope.events.leaderEvents = null;
                    $scope.seniorLeaderNotify = null;
                }

                switch ($scope.actionOfEvent) {
                    case actionOfEvent.REGISTER_EVENT:
                        $scope.events.accepted = false;
                        break;
                    case actionOfEvent.ADD_NEW_EVENT:
                        $scope.events.accepted = true;
                        break;
                    case actionOfEvent.ADD_NEW_EVENT_PERSIONAL:
                        $scope.events.persional = true;
                        break;
                }

                $scope.events.active = true;
                $scope.events.deleted = false;
                $scope.events.createdOn = dateformatService.addMoreHours(new Date());
                $scope.events.createdBy = $scope.authentication.userId;
                $scope.events.editedBy = $scope.authentication.userId;
                $scope.events.editedOn = dateformatService.addMoreHours(new Date());
                // save to data base 
                fogLoading('fog-modal-small', 'block');
                apiService.post($rootScope.baseUrl + 'api/Event/AddComplexEvent', $scope.events,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Tạo mới sự kiện thành công");
                            //add Google calendar
                            if ($scope.events.eventUserNotifys == null) {
                                $state.go('event_list');
                                return;
                            }
                            if ($scope.events.accepted == true) {

                                if ($scope.events.eventUserNotifys != null && result.data.value.startTime != null) {
                                    if ($scope.actionOfEvent == actionOfEvent.ADD_NEW_EVENT) {
                                        var listUserReminder = [];
                                        angular.forEach($scope.events.eventUserNotifys, function (value, key) {
                                            listUserReminder.push({
                                                'email': value.email
                                            });
                                        });
                                        var event = {
                                            "summary": result.data.value.content,
                                            "location": result.data.value.place,
                                            "description": result.data.value.content,
                                            "start": {
                                                "dateTime": result.data.value.startTime.replace('Z', '')
                                                , "timeZone": "(GMT+07:00) Hanoi"
                                            },
                                            "end": {
                                                "dateTime": result.data.value.startTime.replace('Z', '')
                                                , "timeZone": "(GMT+07:00) Hanoi"
                                            },
                                            "attendees": listUserReminder,
                                            "reminders": {
                                                "useDefault": false,
                                                "overrides": [
                                                {
                                                    "method": "email",
                                                    "minutes": result.data.value.notificationTimeSpan != null ? result.data.value.notificationTimeSpan : 60
                                                },
                                                          {
                                                              "method": "popup",
                                                              "minutes": result.data.value.notificationTimeSpan != null ? result.data.value.notificationTimeSpan : 60
                                                          }
                                                ]
                                            }
                                        };
                                        var request = gapi.client.calendar.events.insert({
                                            'calendarId': 'primary',
                                            'resource': event
                                        });
                                        request.execute(function (event) {
                                            //console.log(event);
                                            // $state.go('event_list');
                                            // save event to db
                                            var eventGoogle = {
                                                googleEventId: event.id,
                                                eventId: result.data.value.id,
                                                createdOn: new Date(),
                                                createdBy: $scope.authentication.userId
                                            }
                                            apiService.post($rootScope.baseUrl + 'api/Event/AddEventGoogle', eventGoogle,
                                                function (result) {
                                                    if (result.data.isSuccess == true) {
                                                        $state.go('event_list');
                                                        fogLoading('fog-modal-small', 'none');
                                                    }
                                                },
                                                function (error) {
                                                    console.log(error);
                                                });
                                        });
                                    }
                                    else {
                                        $scope.bindList();
                                    }
                                } else {
                                    $scope.bindList();
                                }
                            }
                            else {
                                $scope.bindList();
                            }
                        } else {
                            notificationService.displayError(result.data.message);
                        }
                    },
                    function (error) {
                        notificationService.displayError(error);
                    });

            } else if ($scope.action == "EDIT") {
                $scope.events.departmentId = parseInt($scope.authentication.departmentId);
                $scope.events.occurDate = $scope.occurDateString.split("/").reverse().join("-");
                if ($scope.selectedMeettingRoomValue != null) {
                    $scope.events.meetingRoomId = $scope.selectedMeettingRoomValue.id;
                }
                if ($scope.checkTimeUnKown == false) {
                    var d = new Date($scope.events.occurDate);
                    d.setHours(d.getHours() + $scope.selectedHourStart.id);
                    d.setMinutes(d.getMinutes() + $scope.selectedMinuteStart.id);
                    $scope.events.startTime = d;
                    $scope.events.startTimeUnderfined = false;
                } else {
                    $scope.events.startTime = null;
                    $scope.events.startTimeUnderfined = true;
                }
                $scope.events.startTimeUnderfined = false;
                $scope.events.endTimeUndefined = true;
                if ($scope.checkNotTimeEnd == false) {
                    var d2 = new Date($scope.events.occurDate);
                    d2.setHours(d2.getHours() + $scope.selectedHourEnd.id);
                    d2.setMinutes(d2.getMinutes() + $scope.selectedMinuteEnd.id);
                    $scope.events.endTime = d2;
                    $scope.events.endTimeUndefined = true;
                } else {
                    $scope.events.endTime = null;
                    $scope.events.endTimeUndefined = false;
                }
                $scope.events.morning = ($scope.statusDay == "Sang");
                $scope.events.public = !$scope.public;

                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {

                    $scope.events.eventUserNotifys = [];
                    if ($scope.staffSendNotify != null && $scope.staffSendNotify.length > 0) {
                        if ($scope.selelctTypeTimeSpan.id == 1) {
                            $scope.events.notificationTimeSpan = $scope.notificationTimeSpan;
                        } else {
                            $scope.events.notificationTimeSpan = $scope.notificationTimeSpan * 60;
                        }
                        if ($scope.staffSendNotify.length > 0) {
                            angular.forEach($scope.staffSendNotify, function (value, key) {
                                $scope.events.eventUserNotifys.push(
                                    {
                                        userId: value.userId,
                                        email: value.email,
                                        createdOn: dateformatService.addMoreHours(new Date()),
                                        createdBy: $scope.authentication.userId
                                    });
                            });
                        }
                    } else {
                        $scope.events.notificationTimeSpan = null;
                    }
                }


                if ($scope.seniorLeaderNotify != null) {
                    if ($scope.seniorLeaderNotify.length > 0) {
                        $scope.events.leaderEvents = [];
                        angular.forEach($scope.seniorLeaderNotify, function (value, key) {
                            $scope.events.leaderEvents.push(
                                {
                                    leaderId: value.userId,
                                    createdOn: dateformatService.addMoreHours(new Date()),
                                    createdBy: $scope.authentication.userId
                                });
                        });
                    }
                    else {
                        $scope.events.leaderEvents = null;
                        $scope.seniorLeaderNotify = null;
                    }
                }
                else {
                    $scope.events.leaderEvents = null;
                    $scope.seniorLeaderNotify = null;
                }
                $scope.events.active = true;
                $scope.events.deleted = false;
                $scope.events.editedBy = $scope.authentication.userId;
                $scope.events.editedOn = dateformatService.addMoreHours(new Date());

                fogLoading('fog-modal-small', 'block');
                if ($scope.events.createdBy == $scope.authentication.userId && $scope.events.accepted == false) {
                    apiService.put($rootScope.baseUrl + 'api/Event/UpdateNonAuthorizeComplexEvent', $scope.events,
                   function (result) {
                       if (result.data.isSuccess == true) {
                           notificationService.displaySuccess("Cập nhật sự kiện thành công");
                           fogLoading('fog-modal-small', 'none');
                           $scope.bindList();
                       } else {
                           notificationService.displayError(result.data.message);
                       }
                   },
                   function (error) {
                       console.log("Error update event: " + error);
                   });
                }
                else {
                    apiService.put($rootScope.baseUrl + 'api/Event/UpdateComplexEvent', $scope.events,
                     function (result) {
                         if (result.data.isSuccess == true) {
                             notificationService.displaySuccess("Cập nhật sự kiện thành công");
                             fogLoading('fog-modal-small', 'none');
                             //$scope.bindList();

                             /// update calendar
                             if ($scope.events.accepted == true) {
                                 var listUserReminder = [];
                                 angular.forEach($scope.events.eventUserNotifys, function (value, key) {
                                     listUserReminder.push({
                                         'email': value.email
                                     });
                                 });
                                 if (listUserReminder.length > 0 && result.data.value.startTime != null) {
                                     if ($scope.googleEventEdit != null) {
                                         $scope.googleEventEdit.summary = result.data.value.content;
                                         $scope.googleEventEdit.location = result.data.value.place;
                                         $scope.googleEventEdit.description = result.data.value.content;
                                         $scope.googleEventEdit.start.dateTime = result.data.value.startTime.replace('Z', '');
                                         $scope.googleEventEdit.start.timeZone = "(GMT+07:00) Hanoi";

                                         $scope.googleEventEdit.end.dateTime = result.data.value.startTime.replace('Z', '');
                                         $scope.googleEventEdit.end.timeZone = "(GMT+07:00) Hanoi";

                                         $scope.googleEventEdit.attendees = listUserReminder;
                                         $scope.googleEventEdit.reminders.useDefault = false;
                                         $scope.googleEventEdit.reminders.overrides = [
                                                                                         {
                                                                                             "method": "email",
                                                                                             "minutes": result.data.value.notificationTimeSpan != null ? result.data.value.notificationTimeSpan : 60
                                                                                         },
                                                                                          {
                                                                                              "method": "popup",
                                                                                              "minutes": result.data.value.notificationTimeSpan != null ? result.data.value.notificationTimeSpan : 60
                                                                                          }
                                         ];

                                         var request = gapi.client.calendar.events.update({
                                             'calendarId': 'primary',
                                             'eventId': $scope.googleEventEdit.id,
                                             'resource': $scope.googleEventEdit
                                         });

                                         request.execute(function (event) {
                                             //alert('Event updated successfully');
                                             $scope.bindList();
                                         });
                                     }
                                     else {
                                         $scope.bindList();
                                     }
                                 } else {
                                     $scope.bindList();
                                 }
                             }
                             else {
                                 $scope.bindList();
                             }
                         } else {
                             notificationService.displayError(result.data.message);
                         }
                     },
                   function (error) {
                       console.log("Error update event: " + error);
                   });
                }

            }
        }

        var loadEventToEdit = function (eventId) {
            $scope.staffSendNotify = [];
            $scope.seniorLeaderNotify = [];
            apiService.get($rootScope.baseUrl + 'api/Event/Get/' + eventId, null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.events = result.data.value;
                        $scope.occurDateString = dateformatService.formatToDDMMYY(new Date($scope.events.occurDate));
                        $scope.public = !$scope.events.public;
                        $scope.notificationTimeSpan = $scope.events.notificationTimeSpan;
                        if ($scope.notificationTimeSpan != null) {
                            if ($scope.notificationTimeSpan <= 60) {
                                $scope.selelctTypeTimeSpan = $scope.listTypeTimeSpan[0];
                            } else {
                                $scope.selelctTypeTimeSpan = $scope.listTypeTimeSpan[1];
                                $scope.notificationTimeSpan = $scope.events.notificationTimeSpan / 60;
                            }
                        }
                        if ($scope.events.startTime != null) {
                            var dateStart = new Date($scope.events.startTime);
                            var hourStart = $scope.listOptionHours.filter(function (item) {
                                return item.id == $scope.events.startHour;
                            });
                            var minuStart = $scope.listOptionMinutes.filter(function (item) {
                                return item.id == dateStart.getMinutes();
                            });
                            if (hourStart.length > 0) $scope.selectedHourStart = hourStart[0];
                            if (minuStart.length > 0) $scope.selectedMinuteStart = minuStart[0];
                            $scope.checkTimeUnKown = false;
                        }
                        else {
                            $scope.checkTimeUnKown = true;
                            $scope.statusDay = $scope.events.morning ? "Sang" : "Chieu";
                        }

                        if ($scope.events.endTime != null) {
                            var dateEnd = new Date($scope.events.endTime);
                            var hourEnd = $scope.listOptionHours.filter(function (item) {
                                return item.id == $scope.events.endHour;
                            });
                            var minuEnd = $scope.listOptionMinutes.filter(function (item) {
                                return item.id == dateEnd.getMinutes();
                            });
                            if (hourEnd.length > 0) $scope.selectedHourEnd = hourEnd[0];
                            if (minuEnd.length > 0) $scope.selectedMinuteEnd = minuEnd[0];
                            $scope.checkNotTimeEnd = false;
                        } else {
                            $scope.checkNotTimeEnd = true;
                        }

                        if ($scope.events.leaderEvents.length > 0) {
                            angular.forEach($scope.events.leaderEvents, function (value, key) {
                                angular.forEach($scope.seniorLeaderStaffs, function (staff, key) {
                                    if (staff.userId == value.leaderId) {
                                        $scope.seniorLeaderNotify.push(staff);
                                    }
                                });
                            });
                        }

                        if ($scope.events.eventUserNotifys.length > 0) {
                            angular.forEach($scope.events.eventUserNotifys, function (value, key) {
                                angular.forEach($scope.staffSendNotifys, function (staff, key) {
                                    if (staff.userId == value.userId) {
                                        $scope.staffSendNotify.push(staff);
                                    }
                                });
                            });
                        }

                        if ($scope.events.meetingRoomId != null) {
                            var focusMeetingRoom = $scope.meetingRooms.filter(function (item) {
                                return item.id == $scope.events.meetingRoomId;
                            });
                            if (focusMeetingRoom.length > 0) {
                                $scope.selectedMeettingRoomValue = focusMeetingRoom[0]
                            }
                        }
                        /// load event google to edit
                    }
                },
                function (error) {
                    console.log(error);
                });
        }

        var checkSave = function () {
            if ($scope.selectedHourStart != null && $scope.selectedHourEnd != null) {
                if ($scope.selectedHourStart.id > $scope.selectedHourEnd.id) {
                    focus('id_selectedHourStart');
                    return "Thời gian bắt đầu không được lớn hơn thời gian kết thúc";
                }
            }
            if ($scope.checkTimeUnKown != true) {
                if ($scope.selectedHourStart == null) {
                    focus('id_selectedHourStart');
                    return "Bạn chưa cập nhật giờ bắt đầu";
                }
                if ($scope.selectedMinuteStart == null) {
                    focus('id_selectedMiniusStart');
                    return "Bạn chưa cập nhật phút bắt đầu";
                }
            }
        }

        var save = function (type) {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu?').then(
                function () {
                    var message = checkSave();
                    if (message) {
                        notificationService.displayError(message);
                        return;
                    }
                    saveData(type);
                });

        }

        $scope.selectedMeettingRoom = function (selected) {
            if (selected) {
                $scope.selectedMeettingRoomValue = selected.originalObject;
            } else {
                $scope.selectedMeettingRoomValue = null;
            }
        }

        $scope.loadStaffSendNotify = function ($query) {
            return $scope.staffSendNotifys.filter(function (field) {
                if ($query != null) {
                    return field.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $scope.loadStaffSendNotifys = function (callback) {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetAll', null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.staffSendNotifys = result.data.data;
                        angular.forEach($scope.staffSendNotifys, function (value, key) {
                            if (value.avatar != null) {
                                value.avatar = $rootScope.baseUrl + value.avatar;
                            } else {
                                value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg';
                            }

                        });
                        if (callback) callback(result);
                    }
                }, null);
        }

        $scope.loadSeniorLeaderSendNotify = function ($query) {
            return $scope.seniorLeaderStaffs.filter(function (field) {
                if ($query != null) {
                    return field.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };

        $scope.loadSeniorLeaderStaffs = function (callback) {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetSeniorLeaderStaff?deparmentId=' + parseInt($scope.authentication.departmentId), null,
               function (result) {
                   if (result.data.isSuccess == true) {
                       $scope.seniorLeaderStaffs = result.data.data;
                       angular.forEach($scope.seniorLeaderStaffs, function (value, key) {
                           if (value.avatar == '' || value.avatar == null) {
                               value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg';
                           }
                           else
                               value.avatar = $rootScope.baseUrl + value.avatar;
                       });

                       if (callback) callback(result);
                   }
               }, null);
        }

        $scope.addTagsSeniorStaff = function (tag) {
            //console.log($scope.documentFields);
            if ($scope.seniorLeaderNotify != null) {
                if ($scope.seniorLeaderNotify.length > 0) {
                    if (tag.id == null) {
                        $scope.seniorLeaderNotify.splice($scope.seniorLeaderNotify.indexOf(tag), 1);
                    }
                }
            }
            else {
                if (tag.id == null) {
                    $scope.seniorLeaderNotify = [];
                }
            }
        }

        $scope.addTagsSendNotifyStaff = function (tag) {
            //console.log($scope.documentFields);
            if ($scope.staffSendNotify != null) {
                if ($scope.staffSendNotify.length > 0) {
                    if (tag.id == null) {
                        $scope.staffSendNotify.splice($scope.staffSendNotify.indexOf(tag), 1);
                    }
                }
            }
            else {
                if (tag.id == null) {
                    $scope.staffSendNotify = [];
                }
            }
        }

        $scope.funcChangedTimeUnKown = function () {
            if ($scope.checkTimeUnKown == false) {
                if ($scope.selectedHourStart == null) {
                    $scope.selectedHourStart = $scope.listOptionHours[8];
                    $scope.selectedMinuteStart = $scope.listOptionMinutes[0];
                }
            }
            else {
                $scope.selectedHourStart = null;
                $scope.selectedMinuteStart = null;
            }
        }

        $scope.funcCheckNotTimeEnd = function () {
            if ($scope.checkNotTimeEnd == false) {
                if ($scope.selectedHourEnd == null) {
                    $scope.selectedHourEnd = $scope.listOptionHours[8];
                    $scope.selectedMinuteEnd = $scope.listOptionMinutes[0];
                }
            }
            else {
                $scope.selectedHourEnd = null;
                $scope.selectedMinuteEnd = null;
            }
        }

        $scope.save = save;

        $scope.initData = function () {

            $scope.action = "ADD";
            if ($stateParams.id != null) {
                $scope.action = "EDIT";
            }
            initOptionHour();
            initOptionMinute();

            $scope.notificationTimeSpan = 60;
            $scope.selelctTypeTimeSpan = $scope.listTypeTimeSpan[0];


            $scope.statusDay = "Sang";
            //$scope.selelctTypeTimeSpan = "Phút"
            $scope.actionOfEvent = $stateParams.actionOfEvent;

            if ($scope.action == "ADD") {
                initMeetingRooms();
                $scope.loadStaffSendNotifys(function loadStaff(result) {

                });
                $scope.loadSeniorLeaderStaffs(function loadStaff(moreResult) {
                });
                focus('content');
                //$scope.selectedHourStart = $scope.listOptionHours[8];
                //$scope.selectedMinuteStart = $scope.listOptionHours[0];
               // $scope.occurDateString = dateformatService.formatToDDMMYY(new Date());
                $scope.events = {};
            } else if ($scope.action == "EDIT") {

                initMeetingRooms(function loadMeetingRoom(result) {
                    $scope.loadStaffSendNotifys(function loadStaff(result) {
                        $scope.loadSeniorLeaderStaffs(function loadStaff(moreResult) {
                            loadEventToEdit($stateParams.id);
                        });
                    });
                });

            }
        }

        $scope.initData();

        $scope.bindList = function () {
            $state.go('event_list');
        }
    }
})(angular.module('VOfficeApp.event'));