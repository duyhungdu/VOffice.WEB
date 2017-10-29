(function (app) {
    app.controller('departmentListController', departmentListController);
    app.controller('updateDepartmentForStaffController', updateDepartmentForStaffController);
    app.controller('setMainDepartmentController', setMainDepartmentController);
    updateDepartmentForStaffController.$inject = ['$uibModalInstance',
                                                  '$rootScope',
                                                  'apiService',
                                                  '$ngBootbox',
                                                   'notificationService',
                                                   '$stateParams',
                                                   'dateformatService',
                                                   'staffId',
                                                   'userId',
                                                   'departmentSelectedId',
                                                   'departmentIdUser',
                                                   'departmentRoot'];
    setMainDepartmentController.$inject = ['$uibModalInstance',
                                                 '$rootScope',
                                                 'apiService',
                                                 '$ngBootbox',
                                                  'notificationService',
                                                  '$stateParams',
                                                  'dateformatService',
                                                  '$http',
                                                  'userId',
                                                  'departmentSelectedId'];
    departmentListController.$inject = ['$scope',
       'apiService',
       'notificationService',
       'focus',
       '$ngBootbox',
       '$stateParams',
       '$uibModal',
       '$rootScope',
        '$state', '$injector'];
    function departmentListController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope, $state, $injector) {
        $(document.body).addClass('body-small');
        $(document.body).removeClass('mini-navbar');
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;
        var treePhongban = [];
        $scope.departmentSelected = {};
        if ($scope.keyword == undefined) {
            $scope.keyword = '';
        }
        if ($stateParams.departmentSelectedId != undefined && $stateParams.departmentSelectedId != '') {
            $scope.departmentSelected.idData = $stateParams.departmentSelectedId;
        }
        //type=0 get all department in system
        //type=1 get department of user
        var type = 1;
        var adminSystem = false;
        $scope.CheckPermission = CheckPermission;
        $scope.getDepartment = getDepartment;
        lstDepartment = [];
        function CheckPermission() {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                if (result.data.value == true) {
                    type = 0;
                    adminSystem = true;
                }
                getDepartment();
                if ($stateParams.departmentSelectedId != '' && $stateParams.departmentSelectedId != undefined) {
                    departmentId = $stateParams.departmentSelectedId;
                }
                if ($stateParams.keyword != '' && $stateParams.keyword != undefined) {
                    $scope.keyword = $stateParams.keyword;
                    $stateParams.keyword = null;
                }

                //load default list staff of department of user
                apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + departmentId + '&parentId=' + departmentId + '&keyword=' + $scope.keyword + '&active=null', null, function (result) {
                    $scope.listItems = result.data.data;
                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
        }
        $scope.CheckPermission();
        function getDepartment() {
            var configDepartment = {
                params: {
                    departmentId: departmentId,
                    type: type,
                    keyword: ''
                }
            }
            apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?', configDepartment,
                  function (result) {
                      if (result.data.data.length > 0) {
                          $scope.department = result.data.data;
                          angular.forEach($scope.department, function (value, key) {
                              if (type == 0) {
                                  if (value.parentId == 0) {
                                      treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, state: { opened: true } });
                                  }
                                  else {
                                      treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, state: { opened: false } });
                                  }
                              }
                              else {
                                  if (value.root == 1) {
                                      treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, state: { opened: true } });
                                  }
                                  else {
                                      treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, state: { opened: false } });
                                  }
                              }
                          });
                          var parentDepartmentSelectedId = '';
                          angular.forEach(treePhongban, function (val, key) {
                              if (val.id == $stateParams.departmentSelectedId) {
                                  parentDepartmentSelectedId = val.parent;
                                  val.state.selected = true;
                              }
                          });
                          angular.forEach(treePhongban, function (val, key) {
                              if (val.id == parentDepartmentSelectedId) {
                                  val.state.opened = true;
                              }
                          });
                          $('#treeViewDiv').jstree({
                              'core': {
                                  'data': treePhongban,
                                  "themes": {
                                      "variant": "large"
                                  },
                                  'check_callback': true,
                                  "multiple": false,
                                  "draggable": false,
                                  "animation": 0
                              },
                              "search": {
                                  "case_insensitive": false,
                                  "show_only_matches": true,
                              },
                              "types": {
                                  "default": {
                                      "icon": "glyphicon glyphicon-folder-open"
                                  },
                              },
                              "plugins": ["wholerow", "search", "types", "changed"]
                          }).bind("select_node.jstree", function (event, data) {
                              $scope.departmentSelected = data.node.data;
                              var parentId = 0;
                              if ($scope.departmentSelected.root > 0) {
                                  parentId = $scope.departmentSelected.idData;
                              }
                              apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + $scope.departmentSelected.idData + '&parentId=' + parentId + '&keyword=' + $scope.keyword + '&active=null', null, function (result) {
                                  $scope.listItems = result.data.data;
                              }, function (error) {
                                  console.log(error);
                              });
                          });
                          $("#treeViewDiv").on('changed.jstree', function (e, data) {
                              var objselected = '';
                              var objselectedId = new Array();
                              var i, j, r = [];
                              for (i = 0, j = data.selected.length; i < j; i++) {
                                  var nodeSelected = data.instance.get_node(data.selected[i]);
                                  r.push(nodeSelected);
                              }
                              // build text 
                              var arrayParentIdSelect = [];
                              //r.sort(function (a, b) {
                              //    return a.data.root - b.data.root;
                              //});
                              angular.forEach(r, function (value, key) {
                                  if (value.data.root == 1) {
                                      objselectedId.push({ id: value.id });
                                      arrayParentIdSelect.push(value.id);
                                      angular.forEach(treePhongban, function (val, key) {
                                          if (val.parent == value.id) {
                                              arrayParentIdSelect.push(val.id);
                                          }
                                      });
                                  }
                                  else if (value.data.root == 2) {
                                      if ($.inArray(value.parent, arrayParentIdSelect) == -1) {
                                          var found = treePhongban.filter(function (item) { return item.id === value.parent; });
                                          objselectedId.push({ id: value.id });
                                          arrayParentIdSelect.push(value.id);
                                          angular.forEach(treePhongban, function (val, key) {
                                              if (val.parent == value.id) {
                                                  arrayParentIdSelect.push(val.id);
                                              }
                                          });
                                      }
                                  }
                                  else if (value.data.root == 3) {
                                      if ($.inArray(value.parent, arrayParentIdSelect) == -1) {
                                          objselectedId.push({ id: value.id });
                                          arrayParentIdSelect.push(value.id);
                                          angular.forEach(treePhongban, function (val, key) {
                                              if (val.parent == value.id) {
                                                  arrayParentIdSelect.push(val.id);
                                              }
                                          });
                                      }
                                  }
                              });
                          })
                      }
                  }, function (error) {
                      console.log(error);
                  });
        }
        $scope.searchDepartment = searchDepartment;
        function searchDepartment() {
            $('#treeViewDiv').jstree('search', $scope.keywordDepartment);
        }
        $scope.deleteDepartment = deleteDepartment;
        function deleteDepartment() {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                               .then(function () {
                                   if ($scope.departmentSelected == '' || $scope.departmentSelected == null) {
                                       notificationService.displayError('Chọn đơn vị trước khi xóa');
                                   }
                                   else {
                                       apiService.put($rootScope.baseUrl + 'api/Department/DeleteLogical/' + $scope.departmentSelected.idData, null, function (result) {
                                           if (!result.data.isSuccess) {
                                               notificationService.displayError(result.data.message);
                                               return;
                                           }
                                           else {
                                               var instance = $("#treeViewDiv").jstree(true);
                                               instance.delete_node(instance.get_selected());
                                               notificationService.displaySuccess('Xóa thành công');
                                           }
                                       }, function (error) {
                                           notificationService.displayError('Không có dữ liệu')
                                       })
                                   }
                               });
        }

        $scope.addOrEditDepartment = addOrEditDepartment;
        function addOrEditDepartment(action) {
            if ($scope.departmentSelected.idData == undefined) {
                notificationService.displayError('Vui lòng chọn đơn vị');
            }
            else {
                if (action == 1) {
                    $state.go('add_edit_department', { id: $scope.departmentSelected.idData, action: 'edit', root: $scope.departmentSelected.root });
                }
                else {
                    $state.go('add_edit_department', { id: $scope.departmentSelected.idData, action: 'add', root: $scope.departmentSelected.root });
                }
            }
        }

        $scope.addOrRemoveAccount = addOrRemoveAccount;
        function addOrRemoveAccount(item) {
            var stateService = $injector.get('$state');
            stateService.go('add_edit_user', { id: 0, groupId: null, keyword: '', currentPage: null, staffId: item.id });
        }
        $scope.managerAccount = managerAccount;
        function managerAccount(item) {
            var stateService = $injector.get('$state');
            stateService.go('user', { currentPage: 1, keyword: item.userName, groupId: null });
        }

        $scope.addOrEditStaff = addOrEditStaff;
        function addOrEditStaff() {
            if ($scope.departmentSelected.idData == undefined || $scope.departmentSelected.idData == '') {
                notificationService.displayError('Chọn đơn vị trước khi thêm cán bộ');
            }
            else if ($scope.departmentSelected.root < 2) {
                notificationService.displayError('Chọn phòng ban trước khi thêm cán bộ');
            }
            else {
                $state.go('add_edit_staff', { id: 0, departmentId: $scope.departmentSelected.idData, keyword: $scope.keyword });
            }
        }
        $scope.editStaff = editStaff;
        function editStaff(item) {
            $state.go('add_edit_staff', { id: item.id, position: item.position, shortPosition: item.shortPosition, departmentId: $scope.departmentSelected.idData, keyword: $scope.keyword });
        }
        $scope.deleteStaff = deleteStaff;
        function deleteStaff(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                               .then(function () {
                                   apiService.put($rootScope.baseUrl + 'api/Staff/DeleteLogical/' + id, null, function (result) {
                                       if (result.data.isSuccess) {
                                           //xóa xong load lại danh sách cán bộ
                                           search();
                                           notificationService.displaySuccess('Xóa thành công');
                                       }
                                       else {
                                           notificationService.displayError(result.data.message);
                                       }
                                   },
                                    function () {
                                        notificationService.displayError('Xóa không thành công');
                                    })
                               });
        }

        $scope.removeDepartmentForStaff = function (staff) {
            $ngBootbox.confirm('Bạn chắc chắn muốn loại cán bộ khỏi đơn vị không?')
                            .then(function () {
                                var complexDepartmentOfStaff = [{ staffId: staff.staffId, departmentId: staff.departmentId, createdBy: userId }];
                                apiService.put($rootScope.baseUrl + 'api/DepartmentStaff/DeleteDepartmentsStaff', complexDepartmentOfStaff, function (result) {
                                    if (result.data.isSuccess) {
                                        search();
                                        notificationService.displaySuccess('Loại bỏ thành công');
                                    }
                                    else {
                                        notificationService.displayError(result.data.message);
                                    }
                                },
                                 function () {
                                     notificationService.displayError('Loại bỏ không thành công');
                                 })
                            });
        }

        $scope.search = search;
        function search() {
            if ($scope.departmentSelected.idData == undefined) {
                apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + departmentId + '&parentId=' + departmentId + '&keyword=' + $scope.keyword + '&active=null', null, function (result) {
                    $scope.listItems = result.data.data;
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                var parentId = 0;
                if ($scope.departmentSelected.root > 0) {
                    parentId = $scope.departmentSelected.idData;
                }
                apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + $scope.departmentSelected.idData + '&parentId=' + parentId + '&keyword=' + $scope.keyword + '&active=null', null, function (result) {
                    $scope.listItems = result.data.data;
                }, function (error) {
                    console.log(error);
                });
            }
        }
        $scope.updateDepartmentForStaff = function (staffId) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'updateDepartmentForStaff.html',
                controller: 'updateDepartmentForStaffController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    staffId: function () {
                        return staffId;
                    },
                    userId: function () {
                        return userId;
                    },
                    departmentSelectedId: function () {
                        return $scope.departmentSelected.idData;
                    },
                    departmentIdUser: function () {
                        return departmentId;
                    },
                    departmentRoot: function () {
                        return $scope.departmentSelected.root;
                    }
                }
            })
        }
        $scope.setMainDepartment = function () {
            if ($scope.departmentSelected.idData == undefined || $scope.departmentSelected.idData == '') {
                notificationService.displayError('Chọn đơn vị trước khi cập nhật cán bộ');
            }
            else if ($scope.departmentSelected.root < 2) {
                notificationService.displayError('Chọn phòng ban trước khi cập nhật cán bộ');
            }
            else {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'setMainDepartment.html',
                    controller: 'setMainDepartmentController',
                    controllerAs: '$ctr',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        userId: function () {
                            return userId;
                        },
                        departmentSelectedId: function () {
                            return $scope.departmentSelected.idData;
                        }
                    }
                })
                modalInstance.result.then(function () {
                    //console.log(selectedItem.departmentSelectedId);
                }, function () {
                    $scope.search();
                });
            }
        }
    }
    function updateDepartmentForStaffController($uibModalInstance,
                                      $rootScope, apiService, $ngBootbox,
                                      notificationService, $stateParams,
                                      dateformatService,
                                      staffId,
                                      userId,
                                      departmentSelectedId,
                                      departmentIdUser,
                                      departmentRoot) {

        var $ctr = this;
        $ctr.lstDepartmentOfStaff = [];
        $ctr.lstDepartmentEnd = [];
        $ctr.listItems = [];
        var departmentSelect = 0;
        var sysAdmin = false;
        $ctr.getAllDepartment = getAllDepartment;
        function getAllDepartment() {
            apiService.get($rootScope.baseUrl + 'api/DepartmentStaff/GetDepartmentStaff?type=3&departmentId=0&staffId=' + staffId.staffId, null, function (result) {
                angular.forEach(result.data.data, function (val, key) {
                    $ctr.obj = {
                        departmentId: val.id,
                        staffId: staffId.staffId,
                        position: val.position,
                        mainDepartment: val.mainDepartment,
                        createdOn: new Date(),
                        createdBy: userId,
                        editedOn: new Date(),
                        editedBy: userId,
                    };
                    $ctr.lstDepartmentOfStaff.push($ctr.obj);
                });
                console.log($ctr.lstDepartmentOfStaff);
            }, function (error) {
            });
        }
        $ctr.getAllDepartment();
        $ctr.CheckPermission = CheckPermission;
        $ctr.CheckPermission();
        function CheckPermission() {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                if (result.data.value == true) {
                    sysAdmin = true;
                    loadDepartment(4, 0);
                }
                else {
                    loadDepartment(1, departmentIdUser);
                }
                checkAdmin();
            })
        };
        $ctr.checkAdmin = checkAdmin;
        function checkAdmin() {
            if (sysAdmin == false)
                return false;
            else
                return true;
        }
        function getDepartmentSelected(departmentStaff) {
            var id = 0;
            if (departmentStaff != null && departmentStaff != undefined) {
                $ctr.obj = departmentStaff.originalObject;
                id = $ctr.obj.id;
                if (id == departmentSelectedId) {
                    apiService.get($rootScope.baseUrl + 'api/DepartmentStaff/GetDepartmentStaff?type=1&departmentId=' + departmentSelectedId + '&staffId=' + staffId.staffId, null, function (result) {
                        $ctr.listDepartments = result.data.data;
                    }, function (error) {
                    });
                }
                else {
                    apiService.get($rootScope.baseUrl + 'api/DepartmentStaff/GetDepartmentStaff?type=1&departmentId=' + id + '&staffId=' + staffId.staffId, null, function (result) {
                        $ctr.listDepartments = result.data.data;
                    }, function (error) { });
                }
            }
        }
        $ctr.initDepartmentSelect = initDepartmentSelect;
        function initDepartmentSelect(id) {
            angular.forEach($ctr.departmentOfStaff, function (val, key) {
                if (val.id == id) {
                    $ctr.intialDepartment = val.name;
                }
            });
        }
        $ctr.selectedDepartment = getDepartmentSelected;
        $ctr.loadDepartment = loadDepartment;
        function loadDepartment(type, departmentId) {
            apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?type=' + type + '&departmentId=' + departmentId + '&keyword=', null,
               function (result) {
                   $ctr.departmentOfStaff = result.data.data;
                   if (sysAdmin == false || departmentSelectedId == undefined || departmentRoot == undefined) {
                       initDepartmentSelect(departmentIdUser);
                   }
                   else {
                       if (departmentRoot == 1) {
                           initDepartmentSelect(departmentSelectedId);
                       }
                       else if (departmentRoot > 1) {
                           //Nếu click vào phòng ban thì phải get ra đơn vị cha
                           apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?type=5&departmentId=' + departmentSelectedId + '&keyword=', null, function (result) {
                               angular.forEach($ctr.departmentOfStaff, function (val, key) {
                                   angular.forEach(result.data.data, function (val1, key) {
                                       if (val.id == val1.id) {
                                           initDepartmentSelect(val1.id);
                                       }
                                   });
                               });
                           }, function (error) {
                               console.log(error);
                           });
                       }
                   }
               },
               function (error) {
                   console.log(error);
               });
        }
        $ctr.loadDefault = loadDefault;
        $ctr.loadDefault();
        function loadDefault() {
            if (departmentSelectedId == undefined && sysAdmin == false) {
                departmentSelectedId = departmentIdUser;
            }
            apiService.get($rootScope.baseUrl + 'api/DepartmentStaff/GetDepartmentStaff?type=1&departmentId=' + departmentSelectedId + '&staffId=' + staffId.staffId, null, function (result) {
                $ctr.listDepartments = result.data.data;
            }, function (error) {
                console.log(error);
            });
        }
        $ctr.checkDepartment = function (item) {
            if (item.active == true) {
                var count = 0;
                angular.forEach($ctr.lstDepartmentOfStaff, function (val, key) {
                    if (item.id == val.departmentId) {
                        if (item.mainDepartment == true) {
                            angular.forEach($ctr.lstDepartmentOfStaff, function (val1, key) {
                                if (val1.mainDepartment == true) {
                                    $ctr.lstDepartmentOfStaff.splice(key, 1);
                                }
                            });
                        }
                        $ctr.lstDepartmentOfStaff.splice(key, 1);
                        count += 1;
                    }
                });
                if (count == 0) {
                    if (item.mainDepartment == true) {
                        angular.forEach($ctr.lstDepartmentOfStaff, function (val, key) {
                            if (val.mainDepartment == true) {
                                $ctr.lstDepartmentOfStaff.splice(key, 1);
                            }
                        });
                    }
                }
                $ctr.obj = {
                    departmentId: item.id,
                    staffId: staffId.staffId,
                    position: item.position,
                    mainDepartment: item.mainDepartment,
                    createdOn: new Date(),
                    createdBy: userId,
                    editedOn: new Date(),
                    editedBy: userId,
                };
                $ctr.lstDepartmentOfStaff.push($ctr.obj);
            }
            else {
                angular.forEach($ctr.lstDepartmentOfStaff, function (val, key) {
                    if (item.id == val.departmentId) {
                        $ctr.lstDepartmentOfStaff.splice(key, 1);
                    }
                });
            }
        };
        $ctr.lstDepartmentStaff = [];
        $ctr.ok = function () {
            if (sysAdmin == false) {
                var count = 0;
                angular.forEach($ctr.listDepartments, function (val, key) {
                    if (val.active == true) {
                        if (val.mainDepartment == true) {
                            count = count + 1;
                        }
                    }
                });
                if (count == 0) {
                    notificationService.displayError('Vui lòng chọn đơn vị chính');
                }
                else if (count > 1) {
                    notificationService.displayError('Chỉ được chọn một đơn vị chính');
                }
                else {
                    angular.forEach($ctr.listDepartments, function (val, key) {
                        if (val.active == true) {
                            $ctr.obj = {
                                departmentId: val.id,
                                staffId: staffId.staffId,
                                position: val.position,
                                mainDepartment: val.mainDepartment,
                                createdOn: new Date(),
                                createdBy: userId,
                                editedOn: new Date(),
                                editedBy: userId,
                            };
                            $ctr.lstDepartmentStaff.push($ctr.obj);
                        }
                    });
                    apiService.post($rootScope.baseUrl + 'api/DepartmentStaff/AddDepartmentStaffs', $ctr.lstDepartmentStaff, function (result) {
                        notificationService.displaySuccess('Cập nhật đơn vị thành công ');
                        $uibModalInstance.dismiss('cancel');
                    },
                   function (error) {
                       console.log(error);
                   });
                }
            }
            else {
                var count = 0;
                if ($ctr.lstDepartmentOfStaff.length > 0) {
                    angular.forEach($ctr.lstDepartmentOfStaff, function (val, key) {
                        if (val.mainDepartment == true) {
                            count += 1;
                        }
                    });
                    if (count == 0) {
                        notificationService.displayError('Vui lòng chọn đơn vị chính');
                    }
                    else if (count > 1) {
                        notificationService.displayError('Vui lòng chọn 1 đơn vị chính');
                    }
                    else {
                        apiService.post($rootScope.baseUrl + 'api/DepartmentStaff/AddDepartmentStaffs', $ctr.lstDepartmentOfStaff, function (result) {
                            if (!result.data.isValid) {
                                angular.forEach(result.data.brokenRules, function (value, key) {
                                    notificationService.displayError(value.rule);
                                });
                                return;
                            }
                            notificationService.displaySuccess('Cập nhật đơn vị thành công ');
                            $uibModalInstance.dismiss('cancel');
                        }, function (error) { });
                    }
                }
                else {
                    notificationService.displayError('Vui lòng chọn đơn vị');
                }
            }
        };
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    function setMainDepartmentController($uibModalInstance,
                                     $rootScope, apiService, $ngBootbox,
                                     notificationService, $stateParams,
                                     dateformatService,
                                     $http,
                                     userId,
                                     departmentSelectedId) {
        var $ctr = this;
        $ctr.search = function () {
            apiService.get($rootScope.baseUrl + 'api/Staff/SearchStaff?departmentId=' + departmentSelectedId + '&parentId=' + departmentSelectedId + '&keyword=&active=null', null, function (result) {
                $ctr.listItems = result.data.data;
            }, function (error) {
                console.log(error);
            });
        }
        $ctr.search();

        $ctr.loadStaff = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/Staff/GetStaffNonOrExtraDepartment', { cache: true }).then(function (response) {
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
        }
        $ctr.loadStaff();
        $ctr.listStaffs = [];
        var userUpdate = {};
        $ctr.forceOneTag = function (tags) {
            if ($ctr.staff != null) {
                var array = $ctr.staff;
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
                    $ctr.staff = array;
                }
            }
            var count = 0;
            if ($ctr.listStaffs.length > 0) {
                angular.forEach($ctr.listStaffs, function (value, key) {
                    if (value.staffId == tags.id)
                    {
                        count += 1;
                    }
                });
            }
            if (count==0)
            {
                userUpdate = {
                    departmentId: departmentSelectedId,
                    staffId: tags.id,
                    position: tags.position,
                    editedBy: userId,
                    fullName: tags.fullName,
                    avatar: tags.avatar
                };
                $ctr.listStaffs.push(userUpdate);
            }
        }
        $ctr.removeStaff = function (id) {
            for (var i = 0; i < $ctr.listStaffs.length; i++) {
                if ($ctr.listStaffs[i].staffId == id) {
                    objRemove = $ctr.listStaffs[i];
                    $ctr.listStaffs.splice(i, 1);
                }
            }
        }
        $ctr.ok = function () {
            apiService.post($rootScope.baseUrl + 'api/DepartmentStaff/AddStaffsDepartment', $ctr.listStaffs, function (result) {
                notificationService.displaySuccess('Cập nhật đơn vị thành công ');
                $uibModalInstance.dismiss('cancel');
            }, function (error) {
                console.log(error);
            });
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
})(angular.module('VOfficeApp.department'));