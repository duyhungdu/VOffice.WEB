(function (app) {
    app.controller('eventListMultiDepartmentController', eventListMultiDepartmentController);

    eventListMultiDepartmentController.$inject = ['$scope',
      'apiService',
      'notificationService',
      'dateformatService',
      'focus',
      '$ngBootbox',
      '$stateParams',
      '$uibModal',
      '$rootScope', 'actionOfEvent'];

    function eventListMultiDepartmentController($scope,
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
        $scope.departmentSelected = [];
        var getDepartmentOfWeek = function (date) {

            var datestring = dateformatService.formatToDDMMYY($scope.currentDate);
            apiService.get($rootScope.baseUrl + 'api/Event/GetMultiDeparmentEventOfWeek?listDepartmentId=' + $scope.departmentIdSelectedString + '&date=' + datestring.split("/").reverse().join("-"), null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.events = result.data.data;
                        // save division to user profile                         
                        var staffConfig = {

                            userId: $scope.authentication.userId,
                            generalCalendar: $scope.departmentIdSelectedString

                        }
                        apiService.put($rootScope.baseUrl + 'api/Staff/UpdateStaffGeneralCalendar', staffConfig,
                            function (success) {

                            },
                            function (error) {
                            });
                        angular.forEach($scope.events, function (value, key) {
                            if (dateformatService.formatToDDMMYY(new Date(value.occurDate)) == datestring) {
                                value.red = true;
                            } else {
                                value.red = false;
                            }

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
                        console.log($scope.events);
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
                            $scope.departmentIdSelectedString = currentDepartment[0].id;
                        } else {
                            $scope.departmentIdSelected = parseInt($scope.authentication.departmentId);
                            $scope.departmentIdSelectedString = $scope.authentication.departmentId
                        }
                        apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffGeneralCalendar?userid=' + $scope.authentication.userId, null,
                           function (result) {
                               if (result.data.isSuccess == true) {
                                   getDepartmentOfWeek($scope.currentDate);
                                   if (result.data.value.generalCalendar) {
                                       var arrDepartment = result.data.value.generalCalendar.split(',');
                                       angular.forEach(arrDepartment, function (value, key) {
                                           var objDepartment = $scope.allDepartments.filter(function (item) {
                                               return item.id == parseInt(value);
                                           });
                                           if (objDepartment.length > 0) {
                                               $scope.departmentSelected.push(objDepartment[0]);
                                           }
                                       });
                                       $scope.departmentIdSelectedString = result.data.value.generalCalendar;
                                       getDepartmentOfWeek($scope.currentDate);
                                   }
                               } else {
                                   getDepartmentOfWeek($scope.currentDate);
                                   $scope.departmentSelected.push(currentDepartment[0]);
                               }
                           },
                           function (error) {
                               getDepartmentOfWeek($scope.currentDate);
                               $scope.departmentSelected.push(currentDepartment[0]);
                           });
                    }
                }
                , function (error) {

                });
        }

        $scope.selectedDeparmentChanged = function (selected) {
            if (selected != null || selected.length > 0) {
                $scope.departmentIdSelectedString = '';
                angular.forEach(selected, function (value, key) {
                    $scope.departmentIdSelectedString += ',' + value.id;
                });
                getDepartmentOfWeek($scope.currentDate);
            } else {
                $scope.departmentIdSelectedString = $scope.authentication.departmentId;
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

            apiService.get($rootScope.baseUrl + 'api/Event/GetEventFile?departmentId=' + $scope.departmentIdSelected + '&date=' + dateParam + '&accepted=' + accepted, null
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
            if ($scope.departmentSelected.length == 0) {
                $scope.departmentSelected = [];
                $scope.departmentSelected.push(tags);
            } else {
                $scope.selectedDeparmentChanged($scope.departmentSelected);
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