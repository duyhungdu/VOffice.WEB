(function (app) {
    app.controller('roleListController', roleListController);

    roleListController.$inject = ['$scope',
       'apiService',
       'notificationService',
       'focus',
       '$ngBootbox',
       '$stateParams',
       '$uibModal',
       '$rootScope',
        '$state'];
    function roleListController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope, $state) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;
        var treeRole = [];
        $scope.roleSelected = {};
        if ($scope.keyword == undefined) {
            $scope.keyword = '';
        }
        //type=0 get all department in system
        //type=1 get department of user
        var type = 1;
        var adminSystem = false;
        $scope.CheckPermission = CheckPermission;
        $scope.getRoles = getRoles;
        lstDepartment = [];
        function CheckPermission() {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                if (result.data.value == true) {
                    type = 0;
                    adminSystem = true;
                }
                getRoles();
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
        function getRoles() {            
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/GetAll', null,
                  function (result) {
                      if (result.data.data.length > 0) {
                          treeRole = [];
                          $scope.department = result.data.data;
                          angular.forEach($scope.department, function (value, key) {

                              treeRole.push({ id: value.id.toString(), data: { code: value.code, idData: value.id.toString() }, parent: value.parentId.toString(), text: value.description, state: { opened: false } });

                          });
                          var parentDepartmentSelectedId = '';
                          angular.forEach(treeRole, function (val, key) {
                              if (val.id == $stateParams.departmentSelectedId) {
                                  parentDepartmentSelectedId = val.parent;
                                  val.state.selected = true;
                              }
                          });
                          angular.forEach(treeRole, function (val, key) {
                              if (val.id == parentDepartmentSelectedId) {
                                  val.state.opened = true;
                              }
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
                              $scope.roleSelected = data.node;
                              var parentId = 0;
                              if ($scope.roleSelected.root > 0) {
                                  parentId = $scope.roleSelected.idData;
                              }
                          });
                          $("#treeViewDiv").on('changed.jstree', function (e, data) {
                              var objselected = '';
                              var objselectedId = new Array();
                              var i, j, r = [];
                              for (i = 0, j = data.selected.length; i < j; i++) {
                                  var nodeSelected = data.instance.get_node(data.selected[i]);
                                  r.push(nodeSelected);
                              }
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
     
        $scope.addOrEditRole = addOrEditRole;
        function addOrEditRole(action) {
            if (action == 'add') {
                $state.go('add_edit_role', { parentId: $scope.roleSelected.id, action: action, keyword: $scope.keyword });
            } else if(action == 'edit') {
                $state.go('add_edit_role', {id:$scope.roleSelected.id, parentId: $scope.roleSelected.parent, action: action, keyword: $scope.keyword });
            }
            
        }
        $scope.addOrEditStaff = addOrEditStaff;
        function addOrEditStaff() {
            if ($scope.roleSelected.idData == undefined || $scope.roleSelected.idData == '') {
                notificationService.displayError('Chọn đơn vị trước khi thêm cán bộ');
            }
            else if ($scope.roleSelected.root < 2) {
                notificationService.displayError('Chọn phòng ban trước khi thêm cán bộ');
            }
            else {
                $state.go('add_edit_staff', { id: 0, departmentId: $scope.roleSelected.idData, keyword: $scope.keyword });
            }
        }
        
        $scope.deleteRole = function () {
            if ($scope.roleSelected.id != null) {
                $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                               .then(function () {
                                   apiService.put($rootScope.baseUrl + 'api/AspNetRole/DeleteAspNetRole?roleId=' + $scope.roleSelected.id, null, function (result) {
                                       if (result.data.isSuccess) {                                          
                                           //getRoles();
                                           var instance = $("#treeViewDiv").jstree(true);
                                           instance.delete_node(instance.get_selected());
                                           $scope.roleSelected = {};
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
            
        }

 
    }

})(angular.module('VOfficeApp.department'));