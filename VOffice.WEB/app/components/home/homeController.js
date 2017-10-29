(function (app) {
    app.controller('homeController', homeController);
    app.controller('viewDetailHomeEventController', viewDetailHomeEventController);
    homeController.$inject = ['authData', '$state', '$rootScope', '$scope', 'localStorageService', 'apiService', 'dateformatService', '$uibModal', '$interval', '$timeout'];
    viewDetailHomeEventController.$inject = ['$uibModalInstance',
                                       '$rootScope',
                                       'apiService',
                                       '$ngBootbox',
                                       'notificationService',
                                       '$stateParams',
                                       'dateformatService',
                                       'item'];
    function homeController(authData, $state, $rootScope, $scope, localStorageService, apiService, dateformatService, $uibModal, $interval, $timeout) {
        if (authData.authenticationData.IsAuthenticated == false) {
            $state.go('login');
        }
        else {

        }

        $scope.$on('$routeChangeStart', function (scope, next, current) {
            var permission = next.$$route.permission;
            if (_.isString(permission) && !permissions.hasPermission(permission)) {
                $state.go('login');
            }
        });

        ///
        var toDate = new Date();
        var fromDate = new Date(toDate - 1000 * 60 * 60 * 24 * 60); // lay trong khoang 60 ngay;
        var configGetDocument = {
            params: {
                type: 0,
                keyword: "",
                startDate: fromDate,
                endDate: toDate,
                userId: $scope.authentication.userId,
                listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                departmentId: $scope.authentication.departmentId,
                pageNumber: 1,
                pageSize: 100
            }
        }

        $scope.documentHistory = {};
        $scope.document = new Array();
        $scope.numberOfDocumentDisplay = 10;
        $scope.numberOfTaskInprocess = 5;
        function compareDESC(docA, docB) {
            return new Date(docB.createdOn) - new Date(docA.createdOn);
        }


        $scope.buildDocumentChart = function () {
            var numberofMonthToCount = 6;
            var configGetReceivedDocument = {
                params: {
                    type: "",
                    keyword: "",
                    startDate: null,
                    endDate: null,
                    userId: $scope.authentication.userId,
                    listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                    departmentId: $scope.authentication.departmentId,
                    pageNumber: 1,
                    pageSize: 1000,
                    numberOfMonths: numberofMonthToCount
                }
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/CountUserDocument', configGetReceivedDocument
              , function (result) {
                  var countDocuments = result.data.value;

                  $scope.options = { legend: { display: true } };
                  $scope.series = ['Văn bản đến', 'Văn bản đi'];
                  $scope.labels = [];
                  var currentMoth = (new Date().getMonth()) + 1;
                  for (var i = currentMoth - (numberofMonthToCount - 1) ; i <= currentMoth; i++) {
                      $scope.labels.push('Tháng ' + i.toString());
                  }
                  var listCountReceivedDocument = countDocuments.numberDocumentReceived;
                  var listCountDeliveredDocument = countDocuments.numberDocumentDelivered;

                  $scope.data = [];
                  $scope.data.push(listCountReceivedDocument);

                  $scope.data.push(listCountDeliveredDocument);

                  //$scope.data = [
                  //  [65, 59, 80, 81, 56, 55],
                  //  [28, 48, 40, 19, 86, 27]
                  //];
              }, function (error) { });
        }
        $scope.buildDocumentChart();


        var departmentId = $scope.authentication.departmentId;
        var userId = $scope.authentication.userId;

        $scope.timeType = false;

        $scope.index = 1;
        $scope.index_a = 1;

        $scope.getRelative = true;
        $scope.getAssign = true;

        $scope.getAssignToMe = function () {
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
            $scope.buildPieChart($scope.getAssign, $scope.getRelative, $scope.timeType);
        }
        $scope.getRelativeToMe = function () {
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
            $scope.buildPieChart($scope.getAssign, $scope.getRelative, $scope.timeType);
        }
        $scope.selectedTaskChartTimeType = function () {
            $scope.buildPieChart($scope.getAssign, $scope.getRelative, $scope.timeType);
        }
        $scope.buildPieChart = function (assignMe, relateMe, timeType) {

            var typeOfTime = 'MONTH';
            if (timeType == true) {
                typeOfTime = 'WEEK';
            }

            if (assignMe == true && relateMe == true) {
                var type = '0';
            }
            else {
                if (assignMe == true) {
                    type = '1';
                }
                else {
                    type = '2';
                }
            }
            var configCountDocument = {
                params: {
                    type: type,
                    timeType: typeOfTime,
                    keyword: "",
                    fromDate: null,
                    toDate: null,
                    userId: $scope.authentication.userId,
                    pageNumber: 1,
                    pageSize: 1000,
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Task/CountUserTask', configCountDocument
             , function (result) {

                 var userTasksAnalystic = result.data.value;
                 $scope.pie_options = {
                     legend: {
                         display: true, position: 'left', labels: {
                             fontSize: 10,
                             boxWidth: 20
                         }
                     }
                 };

                 $scope.pie_labels = ['Chưa xử lý', 'Đang xử lý', 'Đã hoàn thành', 'Đã đóng', 'Mở lại', 'Quá hạn'];
                 $scope.pie_colours = ["#ba84bb", "#0784cb", "#23c6c8", "#1ab394", "#f8ac59", "#f7464a"];
                 if (userTasksAnalystic.defaultNumber == 0 && userTasksAnalystic.inprocessNumber == 0 && userTasksAnalystic.resolvedNumber == 0 && userTasksAnalystic.closedNumber == 0 && userTasksAnalystic.reopenNumber == 0 && userTasksAnalystic.expriedNumber == 0) {
                     $scope.pie_data = [1];
                     $scope.pie_labels = ['Danh sách công việc'];
                     $scope.pie_colours = ["#dcdcdc"];
                     $scope.pie_options = {
                         tooltips: { enabled: false },
                         legend: {
                             display: true, position: 'left', labels: {
                                 fontSize: 10,
                                 boxWidth: 20
                             }
                         }
                     };
                     //document.getElementById("doughnut").style.display = "none";
                     //document.getElementById("fake-legend").style.display = "inline-block";
                     //document.getElementById("fake-chart").style.display = "inline-block";
                 }
                 else {
                     $timeout(function () {
                         $scope.pie_data = [userTasksAnalystic.defaultNumber, userTasksAnalystic.inprocessNumber, userTasksAnalystic.resolvedNumber, userTasksAnalystic.closedNumber, userTasksAnalystic.reopenNumber, userTasksAnalystic.expriedNumber];
                     }, 500);
                     //document.getElementById("doughnut").style.display = "block";
                     //document.getElementById("fake-legend").style.display = "none";
                     //document.getElementById("fake-chart").style.display = "none";

                     //doughnut
                 }


             }, function (error) { });

        }
        $scope.buildPieChart(true, true, false);

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
        $scope.setToUper = function (item) {
            return item.capitalize();
        }

        $scope.loadTaskActivity = function () {

            apiService.get($rootScope.baseUrl + 'api/TaskActivity/GetTaskOpinionAndActivityByUserId?userId=' + $scope.authentication.userId + '&count=1000', null
            , function (result) {
                $scope.listTackActivityOpinion = result.data.data;
            }, function (error) { });
        }
        $scope.loadTaskActivity();
        $scope.checkOpinionOrActivity = function (model) {
            if (model == 'ACTIVITY') { return true; } else { return false; }
        }
        $scope.checkActivityOrOpinion = function (model, action) {
            if (model == 'OPINION') {
                return true;
            }
            else {
                if (action == 'ADD' || action == 'ASSIGN') {
                    return true;
                }
                else {
                    return false;
                }
            }
        }



        $scope.countComplex = function () {
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/GetComplexCount?userId=' + $scope.authentication.userId + '&departmentId=' + $scope.authentication.departmentId, null
          , function (result) {
              $scope.countVanBanChuaVaoSo = result.data.value.totalDocumentNotAddedBook;
              $scope.countEventRelate = result.data.value.totalEventNotify;
          }, function (error) { });
        }
        $scope.countComplex();

        $scope.indexcv_a = 1;
        $scope.indexcv = 0;

        $scope.getPersonal = true;
        $scope.getDepartment = null;

        $scope.getDocumentCaNhan = function () {
            $scope.indexcv_a = $scope.indexcv_a + 1;
            if ($scope.indexcv_a % 2 == 0) {
                $scope.getPersonal = null;
                if ($scope.getDepartment == null) {
                    $scope.getDepartment = true;
                    $scope.indexcv += 1;
                }
            }
            else {
                if ($scope.getDepartment == true) {
                    $scope.getDepartment = null;
                    $scope.indexcv += 1;
                }
                $scope.getPersonal = true;
            }
            $scope.buildComplexDocumentChart($scope.getPersonal, $scope.getDepartment, $scope.documentTimeType);
        }
        $scope.getDocumentDonVi = function () {
            $scope.indexcv = $scope.indexcv + 1;
            if ($scope.indexcv % 2 == 0) {
                $scope.getDepartment = null;
                if ($scope.getPersonal == null) {
                    $scope.getPersonal = true;
                    $scope.indexcv_a += 1;
                }
            }
            else {
                if ($scope.getPersonal == true) {
                    $scope.getPersonal = null;
                    $scope.indexcv_a += 1;
                }
                $scope.getDepartment = true;
            }
            $scope.buildComplexDocumentChart($scope.getPersonal, $scope.getDepartment, $scope.documentTimeType);
        }


        $scope.selectedDocumentChartTimeType = function () {
            $scope.buildComplexDocumentChart($scope.getPersonal, $scope.getDepartment, $scope.documentTimeType);
        }

        $scope.buildComplexDocumentChart = function (getPersonal, getDepartment, timeType) {
            $scope.mixcolors = ['#f7464a', '#0784cb', '#007822', '#845108'];
            var numberofMonthOrWeekToCount = 6;
            $scope.mixlabels = [];
            var typeOfTime = 'MONTH';

            var currentMoth = (new Date().getMonth()) + 1;
            $scope.mixlabels = [];
            for (var i = currentMoth - (numberofMonthOrWeekToCount - 1) ; i <= currentMoth; i++) {
                if (currentMoth > 0) {
                    $scope.mixlabels.push('Tháng ' + i.toString());
                }
                else {
                    $scope.mixlabels.push('Tháng ' + (i + 12).toString());
                }
            }

            var currentday = new Date();
            var mondayThisWeek = currentday.startOfWeek(1);
            var sundayThisWeek = mondayThisWeek.addDays(6);

            if (timeType == true) {
                $scope.mixlabels = [];
                typeOfTime = 'WEEK';
                for (var i = numberofMonthOrWeekToCount - 1; i >= 1; i--) {
                    $scope.mixlabels.push(dateformatService.formatToDDMMYY(sundayThisWeek.addDays(0 - (i * 7))));
                }
                $scope.mixlabels.push(dateformatService.formatToDDMMYY(currentday));
            }
            var scopeType = '1';
            if (getPersonal == true) {
                scopeType = '1';
            }
            else {
                if (getDepartment == true) {
                    scopeType = '2';
                }
            }


            var configGetReceivedDocument = {
                params: {
                    scopeType: scopeType,
                    typeOfTime: typeOfTime,
                    type: "",
                    keyword: "",
                    startDate: null,
                    endDate: null,
                    userId: $scope.authentication.userId,
                    listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                    departmentId: $scope.authentication.departmentId,
                    pageNumber: 1,
                    pageSize: 1000,
                    numberOfMonthsOrWeeks: numberofMonthOrWeekToCount
                }
            }

            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/CountUserDocument', configGetReceivedDocument
             , function (result) {
                 var countDocuments = result.data.value;


                 var listCountReceivedDocument = countDocuments.numberDocumentReceived;
                 var listCountDeliveredDocument = countDocuments.numberDocumentDelivered;
                 var listCountHaventAddedDocumentBook = countDocuments.numberDocumentHaventAddedDocumentBook;
                 var listCountHaventReadDocument = countDocuments.numberDocumentHaveNotRead;

                 $scope.mixdata = [];

                 var bigdata = false;
                 angular.forEach(listCountReceivedDocument, function (value, key) {
                     if (value > 10) {
                         bigdata = true;
                     }
                 });
                 angular.forEach(listCountDeliveredDocument, function (value, key) {
                     if (value > 10) {
                         bigdata = true;
                     }
                 });
                 angular.forEach(listCountHaventAddedDocumentBook, function (value, key) {
                     if (value > 10) {
                         bigdata = true;
                     }
                 });
                 angular.forEach(listCountHaventReadDocument, function (value, key) {
                     if (value > 10) {
                         bigdata = true;
                     }
                 });


                 $scope.mixdata.push(listCountHaventAddedDocumentBook);
                 $scope.mixdata.push(listCountReceivedDocument);
                 $scope.mixdata.push(listCountDeliveredDocument);
                 $scope.mixdata.push(listCountHaventReadDocument);

                 if (bigdata) {
                     $scope.mixoptions = {
                         legend: {
                             display: true, position: 'top', labels: {
                                 fontSize: 10,
                                 boxWidth: 20
                             }
                         }
                     };
                 }
                 else {
                     $scope.mixoptions = {
                         legend: {
                             display: true, position: 'top', labels: {
                                 fontSize: 10,
                                 boxWidth: 20
                             }
                         },
                         scales: {
                             yAxes: [{
                                 ticks: {
                                          fixedStepSize: 1
                                 }
                             }],
                         }
                     };
                 }
                 $scope.mixdatasetOverride = [
                {
                    label: "Chưa vào sổ",
                    borderWidth: 1,
                    type: 'bar'
                },
                   {
                       label: "VB đến",
                       borderWidth: 1,
                       type: 'bar'
                   },
                   {
                       label: "VB đi",
                       borderWidth: 1,
                       type: 'bar'
                   },

                   {
                       label: "Chưa đọc",
                       borderWidth: 1,
                       hoverBackgroundColor: "#39a858",
                       hoverBorderColor: "rgba(255,99,132,1)",
                       type: 'line'
                   }
                 ];

             }, function (error) { });










        }
        $scope.buildComplexDocumentChart($scope.getPersonal, $scope.getDepartment, $scope.documentTimeType);


        $scope.loadDocument = function () {

            var paramGetConfig = {
                params: {
                    keyword: "",
                    departmentId: $scope.authentication.departmentId,
                    title: 'DESK_NUMBER_OF_DOCUMENT',
                    defaultValue: $scope.numberOfDocumentDisplay
                }
            }
            // get config 
            apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/GetValue', paramGetConfig
                , function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.numberOfDocumentDisplay = parseInt(result.data.value.value);

                        apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Search?', configGetDocument
                             , function (result) {
                                 if (result.data.isSuccess == true) {
                                     result.data.data.sort(compareDESC);
                                     if ($scope.numberOfDocumentDisplay > result.data.data.length) {
                                         $scope.document = result.data.data;
                                     } else {
                                         for (i = 0; i < $scope.numberOfDocumentDisplay; i++) {
                                             $scope.document.push(result.data.data[i]);
                                         }
                                     }
                                     angular.forEach($scope.document, function (value, key) {
                                         if (value.historyId == null) {
                                             value.read = false;
                                         } else {
                                             value.read = true;
                                         }
                                         if (value.documentNumber == null || value.documentNumber == "") {
                                             value.titleShow = value.title;
                                         } else {
                                             value.titleShow = '[' + value.documentNumber + '] - ' + value.title;
                                         }
                                     });
                                 } else {
                                     console.log('Không tìm thấy văn bản nào');
                                 }
                             }
                , null);
                    }
                }, function (error) {
                    console.log(error);
                });
        }

        $scope.saveDocumentHistory = function (historyId, documentId, receivedDocument) {
            if (historyId == null) {
                $scope.documentHistory.documentId = documentId;
                $scope.documentHistory.receivedDocument = receivedDocument;
                $scope.documentHistory.userId = $scope.authentication.userId;
                $scope.documentHistory.attempOn = new Date();

                apiService.post($rootScope.baseUrl + 'api/DocumentHistory/Add', $scope.documentHistory
                    , function (result) {
                        if (result.isSuccess == true) {

                        }
                        else {
                            console.log(result.message);
                        }
                    }
                    , function (error) {
                        console.log(error);
                    }
                );
            }
            angular.forEach($scope.document, function (value, key) {
                if (value.id == documentId) {
                    value.read = true;
                }
            });
        }

        $scope.loadTaskInprocess = function () {
            var config = {
                params: {
                    type: 'TASK',
                    code: 'INPROCESS'
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
                $scope.taskInprocessId = result.data.value.id;

                // get config recode
                var paramGetConfig = {
                    params: {
                        keyword: "",
                        departmentId: $scope.authentication.departmentId,
                        title: 'DESK_NUMBER_OF_INPROCESS_TASK',
                        defaultValue: $scope.numberOfTaskInprocess
                    }
                }

                apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/GetValue', paramGetConfig
                , function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.numberOfTaskInprocess = parseInt(result.data.value.value);

                        var configTask = {
                            params: {
                                keyword: "",
                                userId: $scope.authentication.userId,
                                fromDate: fromDate,
                                toDate: toDate,
                                statusId: $scope.taskInprocessId,
                                pageNumber: 1,
                                pageSize: $scope.numberOfTaskInprocess
                            }
                        }
                        apiService.get($rootScope.baseUrl + 'api/Task/Search?', configTask, function (result) {
                            if (result.data.isSuccess == true) {
                                $scope.tasks = result.data.data;
                            }
                        }, null);
                    }
                }, null)
                // get task inprocess

            }, null);
        }

        $scope.loadBirthDay = function () {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetBirthDayByDeparmentId?deparmentId=' + $scope.authentication.departmentId, null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.birthDay = result.data.data;
                    }
                }, null);
        }

        $scope.loadTaskDefault = function () {
            var config = {
                params: {
                    type: 'TASK',
                    code: 'DEFAULT'
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Status/GetByCode/', config, function (result) {
                $scope.taskDefaultId = result.data.value.id;

                // get config recode
                var paramGetConfig = {
                    params: {
                        keyword: "",
                        departmentId: $scope.authentication.departmentId,
                        title: 'DESK_NUMBER_OF_DEFAULT_TASK',
                        defaultValue: $scope.numberOfTaskInprocess
                    }
                }

                apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/GetValue', paramGetConfig
                , function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.numberOfTaskInprocess = parseInt(result.data.value.value);

                        var configTask = {
                            params: {
                                keyword: "",
                                userId: $scope.authentication.userId,
                                fromDate: fromDate,
                                toDate: toDate,
                                statusId: $scope.taskDefaultId,
                                pageNumber: 1,
                                pageSize: $scope.numberOfTaskInprocess
                            }
                        }
                        apiService.get($rootScope.baseUrl + 'api/Task/Search?', configTask, function (result) {
                            if (result.data.isSuccess == true) {
                                $scope.tasksDefaults = result.data.data;
                            }
                        }, null);
                    }
                }, null)
                // get task inprocess

            }, null);
        }

        $scope.viewDetailTaskDefault = function (id) {

            $state.go('task_detail', { id: id, currentPage: 0, keyword: $scope.keyword });

        }

        $scope.viewDetailTaskInprocess = function (id) {

            $state.go('task_detail', { id: id, currentPage: 0, keyword: $scope.keyword });

        }

        //  $scope.loadDocument();
        //  $scope.loadTaskDefault();
        //  $scope.loadTaskInprocess();
        //   $scope.loadBirthDay();
        $interval(function () {
            $scope.buildComplexDocumentChart($scope.getPersonal, $scope.getDepartment, $scope.documentTimeType);
            $scope.loadTaskActivity();
            $scope.buildPieChart($scope.getAssign, $scope.getRelative, $scope.timeType);
            //   $scope.document = [];
            //   $scope.loadDocument();
            //    $scope.tasksDefaults = [];
            //    $scope.loadTaskDefault();
            //     $scope.tasks = [];
            //    $scope.loadTaskInprocess();
            //     $scope.birthDay = [];
            //    $scope.loadBirthDay();
        }, 600000);
        $scope.eventsToday = [];
        $scope.eventsTommorow = [];
        $scope.loadEvent = function () {
            var config = {
                params: {
                    type: 0,
                    departmentId: $scope.authentication.departmentId,
                    userId: $scope.authentication.userId,
                    morning: true,
                    date: new Date()
                }
            }
            //Get event in today
            apiService.get($rootScope.baseUrl + 'api/Event/GetEventAcceptedOfDepartment?', config,
                function (result) {

                    if (result.data.isSuccess == true) {
                        $scope.eventsToday = result.data.data;

                        if (result.data.data.length == 0) {
                            $scope.notify = "Không có sự kiện trong ngày.";
                        } else {
                            angular.forEach($scope.eventsToday, function (value, key) {
                                if (value.createdOn != value.editedOn) {
                                    value.blue = true;
                                } else {
                                    value.blue = false;
                                }
                            });
                        }
                    }
                }, null);
        }
        $scope.checkNA = function (time) {
            if (time != null)
            { return false; }
            return true;
        }
        $scope.loadEvent();
        $scope.loadEventTo = function () {
            $scope.dateNow = new Date();
            $scope.newdate = $scope.dateNow.setDate($scope.dateNow.getDate() + 1);
            var configTo = {
                params: {
                    type: 0,
                    departmentId: $scope.authentication.departmentId,
                    userId: $scope.authentication.userId,
                    morning: true,
                    date: $scope.dateNow
                }
            }
            //Get event in tomorrow
            apiService.get($rootScope.baseUrl + 'api/Event/GetEventAcceptedOfDepartment?', configTo,
               function (result) {
                   if (result.data.isSuccess == true) {
                       $scope.eventsTommorow = result.data.data;
                       if (result.data.data.length == 0) {
                           $scope.notifyTo = "Không có sự kiện trong ngày.";
                       } else {
                           angular.forEach($scope.eventsTommorow, function (value, key) {
                               if (value.createdOn != value.editedOn) {
                                   value.blue = true;
                               } else {
                                   value.blue = false;
                               }
                           });
                       }
                   }
               }, null);
        }
        $scope.loadEventTo();
        $scope.viewEvent = function (item) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'viewDetailHomeEvent.html',
                controller: 'viewDetailHomeEventController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            })
        }
    }
    function viewDetailHomeEventController($uibModalInstance, $rootScope, apiService, $ngBootbox,
                                        notificationService, $stateParams, dateformatService,
                                       item) {
        var $ctr = this;
        $ctr.today = new Date(item.occurDate);
        var weekday = [];
        weekday[0] = "Chủ nhật";
        weekday[1] = "Thứ hai";
        weekday[2] = "Thứ ba";
        weekday[3] = "Thứ tư";
        weekday[4] = "Thứ năm";
        weekday[5] = "Thứ sáu";
        weekday[6] = "Thứ bảy";

        $ctr.day = weekday[$ctr.today.getDay()];
        $ctr.event = item;
        checkNotify();
        $ctr.checkNotify = checkNotify;
        function checkNotify() {
            if (item.notificationTimeSpan != null)
                return true;
            else
                return false;
        }
        $ctr.checkTime = function () {
            if (item.startTime != null)
                return true;
            else return false;
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})(angular.module('VOfficeApp'));