(function (app) {
    app.controller('electronicContactListController', electronicContactListController);
    app.controller('electronicContactDetailController', electronicContactDetailController);
    electronicContactListController.$inject = ['$scope',
       'apiService',
       'notificationService',
       'focus',
       '$ngBootbox',
       '$stateParams',
       '$uibModal',
       '$rootScope'];
    electronicContactDetailController.$inject = ['$uibModalInstance',
      'apiService',
      'notificationService',
      'focus',
      '$ngBootbox',
      '$stateParams',
      '$uibModal',
      '$rootScope', 'staff'];
    function electronicContactListController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope) {

        $(document.body).addClass('body-small');
        $(document.body).removeClass('mini-navbar');
        $scope.focusKeyword = function () {
            focus('keyword');
        }
        //Get list departments when load form
        $scope.getDepartments = getDepartments;
        $scope.getDepartments();
        $scope.department = {};
        $scope.departmentRoot = {};
        $scope.departmentOfStaff = {};
        $scope.listsubs = [];
        var departmentId = $scope.authentication.departmentId;
        function getDepartments() {
            var config = {
                params: {
                    keyword: '',
                    parentId: 0,
                    active: true
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Department/Search?', config,
                function (result) {
                    $scope.departments = result.data.data;
                    $scope.search();
                    angular.forEach($scope.departments, function (value, key) {
                        if (value.parentId == 0) {
                            //$scope.intialDepartment = value.name;
                            // $scope.department = value;
                            $scope.departmentSelected = [];
                            $scope.departmentSelected.push(value);
                        }
                        else if (value.id == departmentId) {
                            $scope.departmentOfStaff = value;
                        }
                    });
                    var config = {
                        params: {
                            keyword: '',
                            parentId: $scope.department.id,
                            active: true
                        }
                    }
                    apiService.get($rootScope.baseUrl + 'api/Department/GetSubDepartmentNonSeft?', config,
                   function (result) {
                       $scope.listsubs = result.data.data;
                       //angular.forEach(result.data.data, function (value, key) {
                       //    if (value.id == departmentId) {
                       //        result.data.data.splice(key, 1);
                       //        $scope.departmentOfStaff = value;
                       //    }
                       //});
                       //$scope.listsubs = result.data.data;
                       //$scope.listsubs.unshift($scope.departmentOfStaff);
                       // setDepartment($scope.departmentOfStaff);
                       //angular.forEach($scope.listsubs, function (value, key) {
                       //    if (value.id == $scope.departmentOfStaff.id) {
                       //        value.isFocus = true;
                       //    } else {
                       //        value.isFocus = false;
                       //    }
                       //});
                       //$scope.search();
                       $scope.department.id = $scope.departmentOfStaff.id;
                       $scope.department.parentId = $scope.departmentOfStaff.id;
                       apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + $scope.departmentOfStaff.id + '&parentId=' + $scope.departmentOfStaff.parentId + '&keyword=' + $scope.keyword + '&active=' + true, null,
               function (result) {
                   $scope.listItems = result.data.data;
               },
                   function (error) {
                       console.log(error);
                   });
                   },
                   function (error) {
                       console.log(error);
                   });
                },
                function (error) {
                    console.log(error);
                });
        }
        // $scope.selectedDepartment = getDepartmentSelected;
        //function getDepartmentSelected(department) {
        //    if (department != undefined) {
        //        $scope.department = department.originalObject;
        //        var config = {
        //            params: {
        //                keyword: '',
        //                parentId: $scope.department.id,
        //                active: true
        //            }
        //        }
        //        apiService.get($rootScope.baseUrl + 'api/Department/GetSubDepartmentNonSeft?', config,
        //            function (result) {
        //                console.log(result.data.data);
        //                $scope.listsubs = result.data.data;
        //                $scope.search();
        //            },
        //            function (error) {
        //                console.log(error);
        //            });
        //    }
        //    else {
        //        $scope.department = null;
        //    }
        //}

        $scope.setDepartment = setDepartment;
        function setDepartment(subDepartment) {
            if (subDepartment != null) {
                $scope.department = subDepartment;
                $scope.search();
                $scope.listItems = null;
                //angular.forEach($scope.listsubs, function (value, key) {
                //    if (value.id == $scope.departmentOfStaff.id) {

                //        value.isFocus = false;
                //    }
                //});
            }
        }
        $scope.search = search;
        function search() {
            if ($scope.keyword == null || $scope.keyword == '' || $scope.keyword == undefined) {
                $scope.keyword = '';
            }
            if ($scope.department == null) {
                notificationService.displayError("Chọn đơn vị trước khi tìm kiếm");
            }
            else {
                if ($scope.department.id != null || $scope.department.id != undefined) {
                    apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + $scope.department.id + '&parentId=' + $scope.department.parentId + '&keyword=' + $scope.keyword + '&active=' + true, null,
                function (result) {
                    $scope.listItems = result.data.data;
                },
                    function (error) {
                        console.log(error);
                    });
                }
                else {
                }
            }
        }

        $scope.loadDepartment = function ($query) {
            var listDepartment = $scope.departments;
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
                $scope.getSub = getSub($scope.departmentSelected);
            }
            else {
                $scope.getSub = getSub(tags);
            }
        }
        function getSub(department) {
            var config = {
                params: {
                    keyword: '',
                    parentId: department.id,
                    active: true
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Department/GetSubDepartmentNonSeft?', config,
                function (result) {
                    $scope.listsubs = result.data.data;
                    $scope.department = department;
                    $scope.search();
                },
                function (error) {
                    console.log(error);
                });
        }
        //open modal
        $scope.viewDetailStaff = function (staff) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'electronicContactDetail.html',
                controller: 'electronicContactDetailController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    staff: function () {
                        return staff;
                    }
                }
            })
        }

    }
    function electronicContactDetailController($uibModalInstance,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope,
                                    staff) {
        var $ctr = this;
        $ctr.initStaff = initStaff;
        $ctr.staffInfo = {};
        function initStaff() {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffProfile?userId=' + staff.userId, null,
               function (result) {
                   $ctr.staffInfo = result.data.value;
               },
               function (error) {
                   console.log(error);
               });
        }
        $ctr.initStaff();
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})(angular.module('VOfficeApp.electronicContact'));




