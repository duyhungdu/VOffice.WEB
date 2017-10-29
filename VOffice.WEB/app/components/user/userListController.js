(function (app) {
    app.controller('userListController', userListController);
    app.controller('assignGroupForUserController', assignGroupForUserController);
    app.controller('resetPasswordUserController', resetPasswordUserController);
    app.controller('setRolesForGroupController', setRolesForGroupController);
    app.controller('setRolesForUserController', setRolesForUserController);
    userListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        '$state',
        '$uibModal'];
    assignGroupForUserController.$inject = ['$uibModalInstance',
                                                 '$rootScope',
                                                 'apiService',
                                                 '$ngBootbox',
                                                  'notificationService',
                                                  '$stateParams',
                                                  'dateformatService',
                                                  'user',
                                                  'sysAdmin',
                                                  'createdBy'];

    setRolesForGroupController.$inject = ['$uibModalInstance',
                                                 '$rootScope',
                                                 'apiService',
                                                 '$ngBootbox',
                                                 'notificationService',
                                                 '$stateParams',
                                                 'dateformatService',
                                                 'groupId',
                                                 'userId', '$compile', '$sce'];
    setRolesForUserController.$inject = ['$uibModalInstance',
                                                '$rootScope',
                                                'apiService',
                                                '$ngBootbox',
                                                'notificationService',
                                                '$stateParams',
                                                'dateformatService',
                                                'user', 'createdBy', '$compile', '$sce'];
    resetPasswordUserController.$inject = ['$uibModalInstance',
                                                '$rootScope',
                                                'apiService',
                                                '$ngBootbox',
                                                 'notificationService',
                                                 '$stateParams',
                                                 'dateformatService',
                                                 'userId'];
    function userListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    $state,
                                    $uibModal) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;
        $scope.sysAdmin = false;
        $scope.CheckPermission = function () {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                if (result.data.value == true) {
                    $scope.sysAdmin = true;
                }
                else {
                    $scope.sysAdmin = false;
                }
                $scope.getListGroups();
                $scope.getListUsers();

            }, function (error) {
                console.log(error);
            });
        }
        $scope.CheckPermission();
        $scope.getListGroups = getListGroups;
        function getListGroups() {
            apiService.get($rootScope.baseUrl + 'api/AspNetGroup/Search?sysAdmin=' + $scope.sysAdmin, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.listGroups = result.data.data;
            }, function () {
                console.log('Loading failure');
            });
        }

        $scope.selectGroup = function (groupId) {
            $scope.groupId = groupId;
            getListUsers();
        }

        $scope.keyword = '';
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.groupId = '';
        $scope.getListUsers = getListUsers;
        $scope.search = search;
        function search(page) {
            getListUsers(page);
        }
        function getListUsers(page) {
            page = page || 0;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    groupId: $scope.groupId,
                    departmentId: departmentId,
                    pageNumber: page,
                    pageSize: 15
                }
            }

            if ($scope.sysAdmin == true) {
                config.params.departmentId = null;
            }
            if ($stateParams.currentPage != null) {
                config.params.pageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                config.params.keyword = $stateParams.keyword;
                $stateParams.keyword = null;
                $scope.keyword = config.params.keyword;
            }
            if ($stateParams.groupId != null) {
                config.params.groupId = $stateParams.groupId;
                $stateParams.groupId = null;
                $scope.groupId = config.params.groupId;
            }

            apiService.get($rootScope.baseUrl + 'api/AspNetUser/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.listUsers = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Loading failure');
            });
        }



        $scope.deleteAspNetUser = function (id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa tài khoản này?')
                         .then(function () {
                             apiService.put($rootScope.baseUrl + 'api/AspNetUser/DeleteAspNetUser?userId=' + id, null, function (result) {
                                 if (result.data.isSuccess == false)
                                     notificationService.displayError(result.message);
                                 else {
                                     notificationService.displaySuccess('Xóa tài khoản thành công');
                                     getListUsers();
                                 }
                             }, function (error) { });
                         });
        }
        $scope.clearSelectedGroup = function () {
            $scope.groupId = '';
            getListUsers();
        }
        $scope.addOrEditUser = addOrEditUser;
        function addOrEditUser(id) {
            $state.go('add_edit_user', { id: id, groupId: $scope.groupId, keyword: $scope.keyword, currentPage: $scope.curentpage });
        }
        $scope.lockOrUnlockUser = lockOrUnlockUser;
        function lockOrUnlockUser(id, locked) {
            var textNotify = 'ngừng hoạt động';
            if (locked == true)
                textNotify = 'kích hoạt';
            $ngBootbox.confirm('Bạn chắc chắn muốn ' + textNotify.toLowerCase() + ' tài khoản này?')
                         .then(function () {
                             apiService.put($rootScope.baseUrl + 'api/AspNetUser/LockOrUnlockUser?userId=' + id, null, function (result) {
                                 if (result.data.isSuccess == false)
                                     notificationService.displayError(result.message);
                                 else {
                                         notificationService.displaySuccess(textNotify+' tài khoản thành công');
                                     getListUsers();
                                 }
                             }, function (error) { });
                         });
        }
        $scope.setRolesForGroup = function (groupId) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'setRolesForGroup.html',
                controller: 'setRolesForGroupController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    groupId: function () {
                        return groupId;
                    },
                    userId: function () {
                        return userId;
                    }
                }
            })
        }
        $scope.assignGroupForUser = function (user) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'assignGroupForUser.html',
                controller: 'assignGroupForUserController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: function () {
                        return user;
                    },
                    sysAdmin: function () {
                        return $scope.sysAdmin;
                    },
                    createdBy: function () {
                        return $scope.authentication.userId;
                    }
                }
            })
        }
        $scope.setRolesForUser = function (user) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'setRolesForUser.html',
                controller: 'setRolesForUserController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: function () {
                        return user;
                    },
                    createdBy: function () {
                        return userId;
                    }
                }
            })
        }
        $scope.resetPassword = function (userId) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'resetPassword.html',
                controller: 'resetPasswordUserController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    userId: function () {
                        return userId;
                    }
                }
            })
        }

    }
    function setRolesForGroupController(
                                    $uibModalInstance,
                                    $rootScope,
                                    apiService,
                                    $ngBootbox,
                                    notificationService,
                                    $stateParams,
                                    dateformatService,
                                    groupId,
                                    userId,
                                    $compile,
                                    $sce) {
        var $ctr = this;
        $ctr.listRoles = [];
        $ctr.departmentSelectedId = new Array();
        $ctr.departmentSelected = [];
        $ctr.getRoles = getRoles;
        var str = '';
        function getRoles() {
            apiService.get($rootScope.baseUrl + 'api/AspNetGroup/GetRolesOfGroup?groupId=' + groupId, null,
                  function (result) {
                      if (result.data.data.length > 0) {
                          $ctr.listRoles = result.data.data;
                          //var $el = $(str).appendTo('#newCheck');
                          //$compile($el)($ctr);
                          //var $el = $('hello Word').appendTo('#treeRole');
                          //$compile($el)($ctr);
                          //angular.forEach($ctr.listRoles, function (value, key) {
                          //    if (value.active == true) {
                          //        treeRole.push({ id: value.id.toString(), data: { code: value.code }, parent: value.parentId.toString(), text: value.description, icon: '/', state: { opened: true, selected: true } });
                          //    }
                          //    else {
                          //        treeRole.push({ id: value.id.toString(), data: { code: value.code }, parent: value.parentId.toString(), text: value.description, icon: '/', state: { opened: false,selected:false } });
                          //    }
                          //});
                          //$('#treeViewDiv').jstree({
                          //    'core': {
                          //        'data': treeRole,
                          //        "themes": {
                          //            "variant": "large"
                          //        },
                          //        'check_callback': true,
                          //        "multiple": true,
                          //        "draggable": false,
                          //        "animation": 0
                          //    },
                          //    "checkbox": {
                          //        "keep_selected_style": false
                          //    },
                          //    "plugins": ["wholerow", "search", "checkbox", "changed"]
                          //}).bind("select_node.jstree", function (event, data) {
                          //    $ctr.roleSelected = data.node;
                          //    var parentId = 0;
                          //    if ($ctr.roleSelected.root > 0) {
                          //        parentId = $ctr.roleSelected.id;
                          //    }
                          //});
                          //$("#treeViewDiv").on('changed.jstree', function (e, data) {
                          //    var objselected = '';
                          //    var objselectedText = '';
                          //    var objselectedId = new Array();
                          //    var i, j, r = [];
                          //    for (i = 0, j = data.selected.length; i < j; i++) {
                          //        var nodeSelected = data.instance.get_node(data.selected[i]);
                          //        r.push(nodeSelected);
                          //    }
                          //    // build text 
                          //    var arrayParentIdSelect = [];
                          //    r.sort(function (a, b) {
                          //        return a.data.root - b.data.root;
                          //    });
                          //    //console.log(r);
                          //    angular.forEach(r, function (value, key) {
                          //        arrayParentIdSelect.push(value.id);
                          //        angular.forEach(treeRole, function (val, key) {
                          //            if (val.parent == value.id) {
                          //                arrayParentIdSelect.push(val.id);
                          //            }
                          //        });
                          //    });
                          //    $ctr.departmentSelected = r;
                          //    $ctr.departmentSelectedId = objselectedId;
                          //})
                      }
                  }, function (error) {
                      console.log(error);
                  });
        }
        $ctr.getRoles();
        $ctr.ok = function () {
            $ctr.obj = {
                groupId: groupId,
                createdBy: userId
            }
            apiService.put($rootScope.baseUrl + 'api/AspNetGroup/DeleteRolesOfGroup', $ctr.obj, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.isSuccess == true) {
                    var lstRoleOfGroups = [];
                    angular.forEach($ctr.listRoles, function (value, key) {
                        if (value.active == true) {
                            var role =
                        {
                            createdBy: userId,
                            groupId: groupId,
                            roleId: value.id
                        };
                            lstRoleOfGroups.push(role);
                        }
                    });
                    apiService.post($rootScope.baseUrl + 'api/AspNetGroup/AddRolesForGroup', lstRoleOfGroups, function (result) {
                        if (result.data.isSuccess == true) {
                            $uibModalInstance.dismiss('cancel');
                            notificationService.displaySuccess('Cập nhật quyền thành công ');
                        }
                    });
                }
            }, function () {
                console.log('Loading failure');
            });
            $uibModalInstance.dismiss('cancel');
        };
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function assignGroupForUserController(
                                     $uibModalInstance,
                                     $rootScope,
                                     apiService,
                                     $ngBootbox,
                                     notificationService,
                                     $stateParams,
                                     dateformatService,
                                     user,
                                     sysAdmin,
                                     createdBy) {
        var $ctr = this;
        $ctr.listGroup = [];
        $ctr.getListGroups = getListGroups;
        function getListGroups() {
            apiService.get($rootScope.baseUrl + 'api/AspNetGroup/GetGroupsForUser?userId=' + user.user + '&sysAdmin=' + sysAdmin, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $ctr.listGropRole = result.data.data;
            }, function () {
                console.log('Loading failure');
            });
        }
        $ctr.getListGroups();
        var count = 0;
        $ctr.ok = function () {
            angular.forEach($ctr.listGropRole, function (val, key) {
                if (val.hasRole == true) {
                    var group = {
                        createdBy: createdBy,
                        groupId: val.id,
                        userId: user.user
                    }
                    $ctr.listGroup.push(group);
                    count = count + 1;
                }
            });
            if (count == 0) {
                var group = {
                    createdBy: createdBy,
                    groupId: '',
                    userId: user.user
                }
                $ctr.listGroup.push(group);
            }
            apiService.post($rootScope.baseUrl + 'api/AspNetGroup/AddGroupsForUser', $ctr.listGroup, function (result) {
                $uibModalInstance.dismiss('cancel');
            }, function () {
                console.log('Loading failure');
            });
        };
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    function resetPasswordUserController(
                                    $uibModalInstance,
                                    $rootScope,
                                    apiService,
                                    $ngBootbox,
                                    notificationService,
                                    $stateParams,
                                    dateformatService,
                                    userId) {
        var $ctr = this;
        $ctr.ok = function () {
            resetPassword();
        };
        $ctr.resetPassword = resetPassword;
        function resetPassword() {
            var obj = {
                userId: userId,
                newPassword: $ctr.newPassword,
                confirmPassword: $ctr.confirmPassword
            };
            apiService.post($rootScope.baseUrl + 'api/Account/ResetPassword', obj, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                $uibModalInstance.dismiss('cancel');
                notificationService.displaySuccess('Cập nhật mật khẩu thành công ');
            }, function () {
                console.log('Loading failure');
            });
        }
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    function setRolesForUserController(
                                  $uibModalInstance,
                                  $rootScope,
                                  apiService,
                                  $ngBootbox,
                                  notificationService,
                                  $stateParams,
                                  dateformatService,
                                  user,
                                  createdBy,
                                  $compile,
                                  $sce) {
        var $ctr = this;
        $ctr.listRoles = [];
        $ctr.departmentSelectedId = new Array();
        $ctr.departmentSelected = [];
        $ctr.getRoles = getRoles;
        var str = '';
        function getRoles() {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/GetRolesOfUser?userId=' + user.userId, null,
                  function (result) {
                      if (result.data.data.length > 0) {
                          $ctr.listRoles = result.data.data;
                      }
                  }, function (error) {
                      console.log(error);
                  });
        }
        $ctr.getRoles();
        $ctr.ok = function () {
            $ctr.obj = {
                userId: user.userId,
                createdBy: createdBy
            }
            apiService.put($rootScope.baseUrl + 'api/AspNetUser/DeleteRolesOfUser', $ctr.obj, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.isSuccess == true) {
                    var lstRoleOfGroups = [];
                    angular.forEach($ctr.listRoles, function (value, key) {
                        if (value.active == true) {
                            var role =
                        {
                            userId: user.userId,
                            roleId: value.id,
                            grant: true
                        };
                            lstRoleOfGroups.push(role);
                        }
                    });
                    apiService.post($rootScope.baseUrl + 'api/AspNetUser/AddRolesForUser', lstRoleOfGroups, function (result) {
                        if (result.data.isSuccess == true) {
                            $uibModalInstance.dismiss('cancel');
                            notificationService.displaySuccess('Cập nhật quyền thành công ');
                        }
                    });
                }
            }, function () {
                console.log('Loading failure');
            });
            $uibModalInstance.dismiss('cancel');
        };
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})(angular.module('VOfficeApp.user'));