(function (app) {
    app.controller('roleAddOrEditController', roleAddOrEditController);
    app.controller('modalRoleController', modalRoleController);
    modalRoleController.$inject = ['$uibModalInstance', '$rootScope', 'apiService', 'data'];
    function modalRoleController($uibModalInstance, $rootScope, apiService, data) {
        var $ctr = this;
        var treeRole = [];
        var loadRole = function () {

            apiService.get($rootScope.baseUrl + 'api/AspNetRole/GetAll', null,
                     function (result) {
                         if (result.data.data.length > 0) {
                             $ctr.roles = result.data.data;
                             angular.forEach($ctr.roles, function (value, key) {

                                 treeRole.push({ id: value.id.toString(), data: { code: value.code, idData: value.id.toString() }, parent: value.parentId.toString(), text: value.description, state: { opened: false } });

                             });
                              
                             $('#treeViewDiv').jstree({
                                 'core': {
                                     'data': treeRole,
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
                                 $ctr.roleSelected = data.node;
                                 var parentId = 0;
                                 if ($ctr.roleSelected.root > 0) {
                                     parentId = $ctr.roleSelected.idData;
                                 }
                             });
                             
                         }
                     }, function (error) {
                         console.log(error);
                     });
        }

        loadRole();

        $ctr.ok = function () {
            // alert($ctrl.departmentSelected);
            $uibModalInstance.close({ roleSelected: $ctr.roleSelected });
        };
        $ctr.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    roleAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope', '$uibModal']

    function roleAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    dateformatService,
                                    $rootScope, $uibModal) {
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;


        
        var roleUpdateId = '';
        
        $scope.save = function () {
            $scope.role.code = $scope.role.name;
            $scope.role.parentId = $scope.roleParentId;
            if ($scope.role.parentId == null) {
                $scope.role.parentId = "#";
            }
            if ($stateParams.action == 'add') {
                $scope.role.createdBy = $scope.authentication.userId;
                $scope.role.createdOn = new Date();
                $scope.role.editedBy = $scope.authentication.userId;
                $scope.role.editedOn = new Date();

                console.log($scope.role);
                apiService.post($rootScope.baseUrl + 'api/AspNetRole/AddAspNetRole', $scope.role,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            notificationService.displaySuccess("Thêm quyền thành công");
                            $scope.bindList();
                        } else {
                            notificationService.displayError("Thêm quyền lỗi: " + result.data.message);
                        }
                    },
                    function (error) { });
            }
            else {
                $scope.role.editedBy = $scope.authentication.userId;
                $scope.role.editedOn = new Date();
                apiService.put($rootScope.baseUrl + 'api/AspNetRole/UpdateAspNetRole', $scope.role,
                     function (result) {
                         if (result.data.isSuccess == true) {
                             notificationService.displaySuccess("Cập nhật quyền thành công");
                             $scope.bindList();
                         } else {
                             notificationService.displayError("Cập nhật quyền lỗi: " + result.data.message);
                         }
                     },
                     function (error) {
                     })
            }
        }

        $scope.bindList = bindList;
        function bindList() {
            $state.go('role', { id: $stateParams.id, groupId: $stateParams.groupId, keyword: $stateParams.keyword, currentPage: $stateParams.curentpage });
        }

        $scope.openModelRole = function (id) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalRoleParent.html',
                controller: 'modalRoleController',
                controllerAs: '$ctr',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    data: function () {
                        return {
                            id: id
                        }
                    }
                }
            })
            modalInstance.result.then(function (selected) {
                $scope.roleParentText = selected.roleSelected.text;
                $scope.roleParentId = selected.roleSelected.id;
                console.log(selected);
            }, function (dis) {
                $scope.roleParentText = null;
                $scope.roleParentId = null;
                //$scope.search();
            });           
        };
        
        var loadRoleParent = function (id) {
            if ($stateParams.parentId != null) {
                apiService.get($rootScope.baseUrl + 'api/AspNetRole/GetRoleById/' + $stateParams.parentId, null,
                                    function (result) {
                                        if (result.data.isSuccess == true) {
                                            $scope.role.parentId = result.data.value.id;
                                            $scope.roleParentId = result.data.value.id;
                                            $scope.roleParentText = result.data.value.description;
                                        }
                                    }, null);
            }                         
        }

        $scope.initData = function () {

            $scope.role = {};
            $scope.showPassword = false;
            $scope.disableRoleCode = false;
            focus("roleCode")
            if ($stateParams.action == 'add') {
                $scope.titleForm = "Thêm mới quyền";
                
                $scope.role.deleted= false;
                $scope.role.active = true;
                $scope.role.allowClientAccess = false;
                $scope.role.onMainMenu = false;
                $scope.role.onRightMenu = false;
                $scope.role.onTopMenu = false;
                $scope.role.root = false;
                $scope.role.leaf = false;
                loadRoleParent();
                

            } else {
                $scope.disableRoleCode = true;
                $scope.titleForm = "Cập nhật quyền";                 
                apiService.get($rootScope.baseUrl + 'api/AspNetRole/GetRoleById/' + $stateParams.id, null,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            $scope.role = result.data.value;
                            loadRoleParent(result.data.value.parentId);
                        }
                    },
                    function (error) { });
            }
        }
        $scope.initData();
    }
})(angular.module('VOfficeApp.user'));