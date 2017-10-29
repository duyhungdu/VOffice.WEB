(function (app) {
    app.controller('eventListDepartmentLeaderController', eventListDepartmentLeaderController);
    
    eventListDepartmentLeaderController.$inject = ['$scope',
      'apiService',
      'notificationService',
      'dateformatService',
      'focus',
      '$ngBootbox',
      '$stateParams',
      '$uibModal',
      '$rootScope', 'actionOfEvent'];

      
    function eventListDepartmentLeaderController($scope,
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

        var getDepartmentOfWeek = function (date) {

            var datestring = dateformatService.formatToDDMMYY($scope.currentDate);
            apiService.get($rootScope.baseUrl + 'api/Event/GetDeparmentLeaderEventOfWeek?departmentId=' + $scope.departmentIdSelected + '&date=' + datestring.split("/").reverse().join("-"), null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.events = result.data.data;
                        angular.forEach($scope.events, function (value, key) {
                            if (dateformatService.formatToDDMMYY(new Date(value.occurDate)) == datestring) {
                                value.red = true;
                            } else {
                                value.red = false;
                            }                            
                        });
                        //console.log($scope.events);
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

            //console.log(tags);
        }

        $scope.selectedDeparmentChanged = function (selected) {
            if (selected != null) {
                $scope.departmentIdSelected = selected.id;
                $scope.initialDepartment = selected.name;
                getDepartmentOfWeek($scope.currentDate);
            } else {
                $scope.departmentIdSelected = parseInt($scope.authentication.departmentId);
            }
        }

        $scope.next = function () {
            $scope.currentDate = $scope.currentDate.addDays(7);
            $scope.fromDate = $scope.currentDate.startOfWeek(1);
            $scope.toDate = $scope.fromDate.addDays(6);
            $scope.currentWeek = $scope.currentDate.getWeekNumber();
            $scope.currentYear = $scope.currentDate.getFullYear();
            getDepartmentOfWeek($scope.currentDate);
        }

        $scope.back = function () {
            $scope.currentDate = $scope.currentDate.addDays(-7);
            $scope.fromDate = $scope.currentDate.startOfWeek(1);
            $scope.toDate = $scope.fromDate.addDays(6);
            $scope.currentWeek = $scope.currentDate.getWeekNumber();
            $scope.currentYear = $scope.currentDate.getFullYear();
            getDepartmentOfWeek($scope.currentDate);
        }

        $scope.backHome = function () {
            $scope.currentDate = new Date();
            $scope.fromDate = $scope.currentDate.startOfWeek(1);
            $scope.toDate = $scope.fromDate.addDays(6);
            $scope.currentWeek = $scope.currentDate.getWeekNumber();
            $scope.currentYear = $scope.currentDate.getFullYear();
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

        $scope.deleteEvent = function (id) {
            //console.log(id);
            $ngBootbox.confirm("Bạn có muốn xóa sự kiện này không?").then(function (result) {

                apiService.put($rootScope.baseUrl + 'api/Event/DeleteLogical?eventId=' + id.id, null, function (result) {
                    if (result.data.isSuccess == true) {
                        notificationService.displaySuccess("Xóa sự kiện thành công");
                        getDepartmentOfWeek($scope.currentDate);
                    }
                    else {
                        notificationService.displayError("Xóa sự kiện không thành công");
                    }
                }, null);
            });
        }

        $scope.initData = function () {
            $scope.addNewEvent = actionOfEvent.ADD_NEW_EVENT;
            $scope.registerEvent = actionOfEvent.REGISTER_EVENT;
            $scope.addPersional = actionOfEvent.ADD_NEW_EVENT_PERSIONAL;
            $scope.fromDate = $scope.currentDate.startOfWeek(1);
            $scope.toDate = $scope.fromDate.addDays(6);
            $scope.currentWeek = $scope.currentDate.getWeekNumber();
            $scope.currentYear= $scope.currentDate.getFullYear();
            getAllDepartmnet();
        }

        $scope.initData();

        var downloadFile = function (downloadPath) {
            window.open(downloadPath, '_blank', '');
        }

        $scope.getEventDocFile = function () {
            var dateParam = dateformatService.formatToDDMMYY($scope.currentDate).split("/").reverse().join("-");
            apiService.get($rootScope.baseUrl + 'api/Event/GetLeaderEventFile?departmentId=' + $scope.departmentIdSelected + '&date=' + dateParam, null
                , function (result) {
                    if (result.data.isSuccess == true) {
                        downloadFile($rootScope.baseUrl + result.data.value);
                    }
                }, null);
        }
    }
})(angular.module('VOfficeApp.event'));