(function (app) {
    app.controller('documentStatisticsSendReceivedController', documentStatisticsSendReceivedController);
    app.controller('modelDepartmentStatisticController', modelDepartmentStatisticController);
    modelDepartmentStatisticController.$inject = ['$uibModalInstance', 'apiService', '$rootScope', 'dateformatService', 'functionDepartmentSelected']
    documentStatisticsSendReceivedController.$inject = ['$uibModal', '$rootScope',
                '$scope', 'apiService', 'notificationService', 'dateformatService'];
    function modelDepartmentStatisticController($uibModalInstance, apiService, $rootScope, dateformatService, functionDepartmentSelected) {
        var $ctrl = this;
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        $ctrl.downloaded = false;
        $ctrl.startDate = dateformatService.formatToDDMMYY(firstDay);
        $ctrl.endDate = dateformatService.formatToDDMMYY(lastDay);
        var treePhongban = [];
        function getDepartment() {
            apiService.get($rootScope.baseUrl + 'api/Department/GetAll', null,
               function (result) {
                   $ctrl.department = result.data.data;
                   angular.forEach($ctrl.department, function (value, key) {
                       if (value.root == 0 || value.root == 1) {
                           if (functionDepartmentSelected != undefined) {
                               var exsit = functionDepartmentSelected.filter(function (item) {
                                   return value.id == item.id;
                               });
                               if (exsit.length > 0) {
                                   if (value.parentId == 0) {
                                       treePhongban.push({ id: value.id.toString(), root: value.root, parent: "#", text: value.name, icon: "/", state: { opened: true, selected: true } });
                                   } else {
                                       treePhongban.push({ id: value.id.toString(), root: value.root, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false, selected: true } });
                                   }
                               }
                               else {
                                   if (value.parentId == 0) {
                                       treePhongban.push({ id: value.id.toString(), root: value.root, parent: "#", text: value.name, icon: "/", state: { opened: true, selected: false } });
                                   } else {
                                       treePhongban.push({ id: value.id.toString(), root: value.root, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                                   }
                               }
                           }
                           else {
                               if (value.parentId == 0) {
                                   treePhongban.push({ id: value.id.toString(), root: value.root, parent: "#", text: value.name, icon: "/", state: { opened: true, selected: false } });
                               } else {
                                   treePhongban.push({ id: value.id.toString(), root: value.root, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                               }
                           }
                       }
                   });

                   $('#treeViewDiv').jstree({
                       'core': {
                           'data': treePhongban,
                           "themes": {
                               "variant": "large"
                           },
                           "multiple": true,
                           "draggable": false,
                           "animation": 0
                       },
                       "checkbox": {
                           "keep_selected_style": false
                       },
                       "plugins": ["wholerow", "checkbox"]
                   });
                   $("#treeViewDiv").on('changed.jstree', function (e, data) {
                       var objselected = '';
                       var objselectedText = '';
                       var objselectedId = new Array();
                       var i, j, r = [];
                       for (i = 0, j = data.selected.length; i < j; i++) {
                           var nodeSelected = data.instance.get_node(data.selected[i]);
                           r.push(nodeSelected);
                       }
                       // build text 
                       var arrayParentIdSelect = [];
                       r.sort(function (a, b) {
                           return a.root - b.root;
                       });
                       console.log(r);
                       $ctrl.departmentSelected = r;
                       //$ctrl.departmentSelectedText = objselectedText;
                       $ctrl.departmentSelectedId = objselectedId;
                       angular.forEach(r, function (value, key) {
                           $ctrl.departmentSelectedId.push(value.id);
                       });
                   })
               },
               function (error) {
               });
        }
        getDepartment();
        $ctrl.ok = function () {
            $uibModalInstance.close({
                departmentSelected: $ctrl.departmentSelected, departmentSelectedId: $ctrl.departmentSelectedId, startDate: $ctrl.startDate, endDate: $ctrl.endDate
            });
        };
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function documentStatisticsSendReceivedController($uibModal, $rootScope, $scope, apiService, notificationService, dateformatService) {
        $scope.openModalDepartment = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalDepartment.html',
                controller: 'modelDepartmentStatisticController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                windowClass: 'app-modal-window',
                keyboard: false,
                resolve: {
                    functionDepartmentSelected: function () {
                        return $scope.departmentSelected;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.listDepartmentId = selectedItem.departmentSelectedId != undefined ? selectedItem.departmentSelectedId.join() : '';
                $scope.departmentSelected = selectedItem.departmentSelected;
                $scope.startDate = selectedItem.startDate;
                $scope.endDate = selectedItem.endDate;
                $scope.displayText = '';
                //angular.forEach($scope.departmentSelected, function (value, key) {
                //    if (value.parent != '#') {
                //        if ($scope.displayText == '') {
                //            $scope.displayText = value.text;
                //        } else {
                //            $scope.displayText += ',' + value.text;
                //        }
                //    }
                //});
                $scope.showlistResult();
                $scope.downloaded = true;
            }, function () {
            });
        }
        var downloadFile = function (downloadPath) {
            window.open(downloadPath, '_blank', '');
        }

        $scope.showlistResult = function (page) {
            page = page || 0;
            var config = {
                params: {
                    startDate: $scope.startDate.split("/").reverse().join("-"),
                    endDate: $scope.endDate.split("/").reverse().join("/"),
                    listSubDepartmentId: $scope.listDepartmentId,
                    departmentId: $scope.authentication.departmentId,
                    pageNumber: page,
                    pageSize: 10
                }
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/DownloadTotalDocumentList', config,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.listItem = result.data.data;
                        $scope.page = result.data.pageNumber;
                        $scope.pagesCount = result.data.pagesCount;
                        $scope.totalCount = result.data.totalItems;
                        $scope.totalItems = result.data.totalItems;
                        $scope.currentPage = result.data.pageNumber;
                        $scope.recordsPerPage = config.params.pageSize;
                    }
                }, null)
        }
        $scope.downloadTotalDocument = function () {
            var config = {
                params: {
                    fromDate: $scope.startDate.split("/").reverse().join("-"),
                    toDate: $scope.endDate.split("/").reverse().join("/"),
                    listDepartmentId: $scope.listDepartmentId,
                    departmentId: $scope.authentication.departmentId
                }
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/DownloadTotalDocument', config
              , function (result) {
                  if (result.data.isSuccess == true) {
                      downloadFile($rootScope.baseUrl + result.data.value);
                  }
              }, null);
        }
    }
})(angular.module('VOfficeApp.documentReiceived'));