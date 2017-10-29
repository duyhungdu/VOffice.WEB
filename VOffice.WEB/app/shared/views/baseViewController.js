
(function (app) {
    app.controller('baseViewController', ['localStorageService', '$scope', '$rootScope', '$http', 'apiService', '$compile', '$sce', '$interval', '$window', 'authData', '$timeout', '$state',
    function (localStorageService, $scope, $rootScope, $http, apiService, $compile, $sce, $interval, $window, authData, $timeout, $state) {
        $scope.categories = [];
        $scope.initData = function () {
            var avatar = localStorageService.get("avatar");
            var fullName = localStorageService.get("fullName");
            if (avatar == null) {
                avatar = $scope.authentication.avatar;
            }
            if (fullName == null) {
                fullName = $scope.authentication.fullName;
            }
            apiService.get($rootScope.baseUrl + 'api/AspNetUser/GetTreeMenu?userId=' + $scope.authentication.userId + '&menu=true', null,
            function (result) {
                if (result.data.isSuccess == true) {
                    var jsonTree = result.data.value;
                    $scope.categories = JSON.parse(jsonTree.replace('\r\n', ''));
                    var menu1 = $scope.categories.filter(function (item) {
                        return item.parentId == "#";
                    });
                    $scope.rootHtml = '<nav class="navbar-default navbar-static-side" role="navigation">';
                    $scope.rootHtml += '<div class="sidebar-collapse">';
                    $scope.rootHtml += ' <ul class="nav metismenu" id="side-menu">';
                    $scope.rootHtml += '<li class="nav-header">';
                    $scope.rootHtml += '<div class="dropdown profile-element">';
                    $scope.rootHtml += ' <span>';
                    if (avatar != null & avatar != '') {
                        $scope.rootHtml += ' <img alt="image" class="img-circle avatar-img" src="' + $rootScope.baseUrl + avatar + '" />';
                    }
                    else {
                        $scope.rootHtml += ' <img alt="image" class="img-circle avatar-img" src="' + $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg" />';
                    }
                    $scope.rootHtml += ' </span>';
                    $scope.rootHtml += '<a data-toggle="dropdown" class="dropdown-toggle" href="javascript:void(0);">';
                    $scope.rootHtml += '<span class="clear">';
                    $scope.rootHtml += ' <span class="block m-t-xs">';
                    $scope.rootHtml += fullName;
                    $scope.rootHtml += ' </span> ';
                    $scope.rootHtml += ' <span class="block m-t-xs">';
                    $scope.rootHtml += '[' + $scope.authentication.position + ']';
                    $scope.rootHtml += ' </span>';
                    $scope.rootHtml += '</span>';
                    $scope.rootHtml += ' </a>';
                    $scope.rootHtml += '<ul class="dropdown-menu animated fadeInRight m-t-xs">';
                    $scope.rootHtml += '<li><a ui-sref="staffProfile">Thông tin cá nhân</a></li>';
                    $scope.rootHtml += '<li><a ui-sref="login_history">Lịch sử truy cập</a></li>';
                    //$scope.rootHtml += '<li><a ng-click="logOut()">Thoát</a></li>';
                    $scope.rootHtml += ' </ul>';
                    $scope.rootHtml += '</div>';
                    $scope.rootHtml += '<div class="logo-element">';




                    if (avatar != null & avatar != '') {
                        $scope.rootHtml += ' <img alt="image" style="width:40px;height:40px;" class="img-circle avatar-img" src="' + $rootScope.baseUrl + avatar + '" />';
                    }
                    else {
                        $scope.rootHtml += ' <img alt="image" class="img-circle avatar-img" src="' + $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg" />';
                    }
                    //$scope.rootHtml += '{{authentication.departmentShortName}}';

                    $scope.rootHtml += '</div>';
                    $scope.rootHtml += '</li>';
                    $scope.rootHtml += '<li>';
                    $scope.rootHtml += '<a href="#"><i class="fa fa-home"></i> <span class="nav-label">Trang chủ</span></a>';
                    $scope.rootHtml += '</li>';

                    angular.forEach(menu1, function (value, key) {
                        var htmlMenu = '';
                        htmlMenu = htmlMenu.concat('<li id=mnp_' + value.code + '>');
                        if (value.href != null) {
                            htmlMenu = htmlMenu.concat('<a ui-sref="' + value.href + '" ng-init="isCollapsed' + value.code + '=true" ng-click="isCollapsed' + value.code + ' = !isCollapsed' + value.code + '" ><i class="' + value.icon + '"></i> <span class="nav-label"  >' + value.title + '</span></a>')
                        } else {
                            htmlMenu = htmlMenu.concat('<a href="javascript:void(0);" ng-init="isCollapsed' + value.code + '=true" ng-click="isCollapsed' + value.code + ' = !isCollapsed' + value.code + '" ><i class="' + value.icon + '"></i> <span class="nav-label"  >' + value.title + '</span><span class="fa arrow"></span></a>')
                        }
                        htmlMenu = htmlMenu.concat('<ul class="nav nav-second-level collapse"  uib-collapse="isCollapsed' + value.code + '"  >')
                        if (value.categories.length > 0) {
                            angular.forEach(value.categories, function (value1, key) {
                                if (value1.categories.length == 0) {
                                    htmlMenu = htmlMenu.concat('<li><a ui-sref="' + value1.href + '">' + value1.title + '</a></li>')
                                } else {
                                    htmlMenu = htmlMenu.concat('<li class="">');
                                    htmlMenu = htmlMenu.concat('<a href="javascript:void(0);" ng-init="isCollapsed' + value1.code + '= true " ng-click="isCollapsed' + value1.code + ' = !isCollapsed' + value1.code + '"> ' + value1.title + '<span class="fa arrow"></span></a>')
                                    htmlMenu = htmlMenu.concat('<ul class="nav nav-third-level collapse" uib-collapse="isCollapsed' + value1.code + '" style="height: 0px;">');
                                    angular.forEach(value1.categories, function (value2, key) {
                                        htmlMenu = htmlMenu.concat('<li><a ui-sref="' + value2.href + '">' + value2.title + '</a></li>');
                                    });
                                    htmlMenu = htmlMenu.concat('</ul>');
                                    htmlMenu = htmlMenu.concat('</li>');
                                }
                            });
                        }
                        htmlMenu = htmlMenu.concat('</ul>')
                        htmlMenu = htmlMenu.concat('</li>')
                        $scope.rootHtml = $scope.rootHtml.concat(htmlMenu);

                    });
                    $scope.rootHtml += '</ul>';
                    $scope.rootHtml += '</div>';
                    $scope.rootHtml += '</nav>';

                    //$scope.rootHtml = "<h1> xin chao cac ban </h1>";
                    //  $scope.rootHtml = $sce.trustAsHtml($scope.rootHtml);
                    //console.log($scope.rootHtml);

                    var $el = $($scope.rootHtml).appendTo('#newNavigationMenu');
                    $compile($el)($scope);


                }
            },
            function () { });
            //Get information footer
            apiService.get($rootScope.baseUrl + 'api/SystemConfig/GetSystemConfigByCode?code=TEL_HELP&systemConfig=true', null
                            , function (result) {
                                if (result.data.isSuccess == true) {
                                    $scope.infor_help = result.data.value.value;
                                }
                            }
               , null);
        }
        $scope.initData();
        $scope.listNotice = [];
        $scope.viewNotice = function () {
            apiService.get($rootScope.baseUrl + 'api/Notice/NoticesInTop', null, function (result) {
                if (result.data.isSuccess == true) {
                    $scope.listNotice = result.data.data;
                }
            }, null);
        }
        $scope.viewNotice();

        var count_document = 0;
        var count_document_old = 0;
        var toDate = new Date();
        var fromDate = new Date(toDate - 1000 * 60 * 60 * 24 * 150); // lay trong khoang 60 ngay;

        $scope.getDocumentUnRead = function () {
            var configGetDocument = {
                params: {
                    type: 0,
                    keyword: "",
                    startDate: fromDate,
                    endDate: toDate,
                    userId: $scope.authentication.userId,
                    listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                    departmentId: $scope.authentication.departmentId,
                    pageNumber: 0,
                    pageSize: 1000
                }
            }

            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/GetDocumentUnRead?', configGetDocument
                             , function (result) {
                                 if (result.data.isSuccess == true) {
                                     $scope.listDocumentUnRead = result.data.data;
                                 }
                             }
                , null);
        }
        $scope.getDocumentUnRead();
        $scope.documentHistory = {};
        $scope.saveDocumentHistory = function (historyId, documentId, receivedDocument) {

            if (historyId == null) {
                $scope.documentHistory.documentId = documentId;
                $scope.documentHistory.receivedDocument = receivedDocument;
                $scope.documentHistory.userId = $scope.authentication.userId;
                $scope.documentHistory.attempOn = new Date();

                apiService.post($rootScope.baseUrl + 'api/DocumentHistory/Add', $scope.documentHistory
                    , function (result) {
                        if (result.data.isSuccess == true) {
                            $scope.getDocumentUnRead();
                            $scope.countItem();
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
                    code: 'DEFAULT'
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

                        apiService.get($rootScope.baseUrl + 'api/Staff/GetAll', null,
                            function (result) {
                                $scope.staffs = result.data.data;
                                var configTask = {
                                    params: {
                                        keyword: "",
                                        assignToMe: true,
                                        relativeToMe: true,
                                        userId: $scope.authentication.userId,
                                        fromDate: fromDate,
                                        toDate: toDate,
                                        statusId: $scope.taskInprocessId,
                                        pageNumber: 1,
                                        pageSize: 5
                                    }
                                }
                                apiService.get($rootScope.baseUrl + 'api/Task/Search?', configTask, function (result) {
                                    if (result.data.isSuccess == true) {
                                        $scope.tasks = result.data.data;
                                        angular.forEach($scope.tasks, function (value, key) {
                                            var staffuser = $scope.staffs.filter(function (item) {
                                                return item.userId == value.createdBy
                                            });
                                            if (staffuser.length > 0) {
                                                value.avatar = $rootScope.baseUrl + staffuser[0].avatar;
                                                value.fullName = staffuser[0].fullName;
                                            } else {
                                                value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg';
                                            }
                                        });
                                    }
                                }, null);
                            },
                            function (error) {
                                console.log(error);
                            });
                    }
                }, null)
                // get task inprocess

            }, null);
        }

        $scope.loadTaskInprocess();
        $scope.viewDetail = function (id) {
            $state.go('task_detail', { id: id, fromDate: null, toDate: null, statusId: $scope.statusId, currentPage: $scope.currentPage, keyword: $scope.keyword, assignToMe: $scope.getAssign, relativeToMe: $scope.getRelative });
        }
        $scope.countItem = function () {
            var config = {
                params: {
                    type: '0',
                    keyword: '',
                    startDate: '',
                    endDate: '',
                    userId: $scope.authentication.userId,
                    listSubDepartmentId: $scope.authentication.listSubDepartmentId,
                    departmentId: $scope.authentication.departmentId,
                    pageNumber: -1,
                    pageSize: -1
                }
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/CountNewDocument/', config,
        function (result) {
            if (result.data.value > 0) {
                if (result.data.value > $scope.numberOfNewDocument) {
                    Push.create("Thông báo", {
                        body: "Bạn đã nhận được 1 văn bản mới.",
                        icon: 'assets/admin/img/icon.png',
                        timeout: 5000,
                        onClick: function () {
                            window.focus();
                            this.close();
                        }
                    });
                }
                $scope.numberOfNewDocument = result.data.value.toString();

            }
            else { $scope.numberOfNewDocument = ""; }

            var taskConfig = {
                params: {
                    userId: $scope.authentication.userId,
                    statusId: 1,
                    fromDate: '',
                    toDate: '',
                    keyword: '',
                    pageSize: -1,
                    pageNumber: -1
                }
            }


            apiService.get($rootScope.baseUrl + 'api/Task/CountNewTask/', taskConfig,
      function (result) {
          if (result.data.value > 0) {
              $scope.numberOfNewTask = result.data.value.toString();
          }
          else { $scope.numberOfNewTask = ""; }
      }, function () { });



        }, function () { });
        }
        try {
            $scope.countItem();
        }
        catch (err) { }
        $interval(function () {
            $scope.countItem();
        }, 60000);

        //$timeout(function () {
        //    var notice = document.getElementById("notice-content");
        //    notice.classList.add('notice-content');
        //    notice.classList.remove('notice-content-orange');
        //}, 7000);

        $scope.getListDepartmentByUserId = function () {
            var userId = $scope.authentication.userId;
            apiService.get($rootScope.baseUrl + 'api/Department/GetListDepartmentByUserId?userId=' + userId, null,
      function (result) {
          if (result.data.totalItems > 1) {
              $scope.listUserDepartments = result.data.data;
              var arrayMainDepartment = result.data.data.filter(function (obj) {
                  if (obj.id == $scope.authentication.departmentId) {
                      return obj;
                  }
              });
              if (arrayMainDepartment.length > 0) {
                  $scope.selectedDepartment = arrayMainDepartment[0];
              }
              $scope.hideText = true;
              $scope.hideDrop = false;
          }
          else {
              $scope.hideText = false;
              $scope.hideDrop = true;
          }
      }, function () { });
        }
        $scope.getListDepartmentByUserId();
        $scope.selectDepartment = function (objDepartment) {
            tokenInfo = localStorageService.get("TokenInfo");
            var userInfo = JSON.parse(tokenInfo);
            userInfo.departmentId = objDepartment.id;
            localStorageService.set("TokenInfo", JSON.stringify(userInfo));
            authData.authenticationData.departmentId = objDepartment.id;
            localStorageService.set("departmentId", objDepartment.id);
            $window.location.reload();
        }
    }]);
})(angular.module('VOfficeApp'));