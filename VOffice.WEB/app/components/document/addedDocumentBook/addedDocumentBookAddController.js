(function (app) {
    app.controller('addedDocumentBookAddController', addedDocumentBookAddController);
    app.controller('selectDepartmentBookController', selectDepartmentBookController);
    selectDepartmentBookController.$inject = ['$uibModalInstance',
                                           '$rootScope',
                                           'apiService',
                                           'notificationService',
                                           'functionDepartmentSelected',
                                           'functionDepartmentSelectedText',
                                           'functionDepartmentSelectedId',
                                           'functionDepartmentConfig',
                                           'departmentId'];
    addedDocumentBookAddController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$http',
                                      '$stateParams',
                                      '$ngBootbox',
                                      '$rootScope',
                                      '$uibModal',
                                      'dateformatService',
                                      'authenticationService',
                                      'fogLoading']
    function selectDepartmentBookController($uibModalInstance, $rootScope, apiService, notificationService,
                                       functionDepartmentSelected, functionDepartmentSelectedText,
                                       functionDepartmentSelectedId, functionDepartmentConfig, departmentId) {
        var $ctrl = this;
        var treePhongban = [];
        $ctrl.departmentSelectedId = new Array();
        $ctrl.departmentSelectedText = "";
        function getDepartment() {
            var configDepartment = {
                params: {
                    action: "edit",
                    departmentId: departmentId,
                    type: "received"
                }
            }
            if (functionDepartmentSelected != null) {
                $ctrl.departmentSelected = functionDepartmentSelected;
                angular.forEach(functionDepartmentSelected, function (value, key) {
                    $ctrl.departmentSelectedId.push(value.data.code);
                });
            }
            apiService.get($rootScope.baseUrl + 'api/Department/BuildOrganizationTree?', configDepartment,
               function (result) {
                   $ctrl.department = result.data.data;
                   angular.forEach($ctrl.department, function (value, key) {
                       if (value.idData == departmentId) {
                           treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, icon: "/", state: { open: true } });
                       }
                       else {
                           if ($ctrl.departmentSelected != null) {
                               var exsit = $.inArray(value.code, $ctrl.departmentSelectedId)
                               if (exsit == -1) {
                                   treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { open: false } });
                               }
                               else {
                                   treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { open: false, selected: true } });
                               }
                           }
                           else {
                               treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { open: false } });
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
                           return a.data.root - b.data.root;
                       });
                       angular.forEach(r, function (value, key) {
                           if (value.data.root == 1) {
                               objselected += value.text + "<br>";
                               if (objselectedText == "") {
                                   objselectedText += value.text
                               }
                               else {
                                   objselectedText += ", " + value.text;
                               }
                               objselectedId.push({ isStaff: value.data.isStaff, id: value.id });
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
                                   if (found != null) {
                                       objselected += value.text + " - " + found[0].data.shortName + "<br>";
                                       if (objselectedText == "") {
                                           objselectedText += value.text + " - " + found[0].data.shortName;
                                       }
                                       else {
                                           objselectedText += ', ' + value.text + " - " + found[0].data.shortName;
                                       }

                                       objselectedId.push({ isStaff: value.data.isStaff, id: value.id });
                                   }
                                   else {
                                       objselected += value.text + "<br>";
                                       if (objselectedText == "") {
                                           objselectedText += value.text;
                                       }
                                       else {
                                           objselectedText += ", " + value.text;
                                       }
                                       objselectedId.push({ isStaff: value.data.isStaff, id: value.id });
                                   }

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
                                   objselected += value.text + "<br>";
                                   if (objselectedText == "") {
                                       objselectedText += value.text;
                                   }
                                   else {
                                       objselectedText += ", " + value.text;
                                   }

                                   objselectedId.push({ isStaff: value.data.isStaff, id: value.id });
                                   arrayParentIdSelect.push(value.id);
                                   angular.forEach(treePhongban, function (val, key) {
                                       if (val.parent == value.id) {
                                           arrayParentIdSelect.push(val.id);
                                       }
                                   });
                               }
                           }
                           else if (value.data.root == 88) {
                               if ($.inArray(value.parent, arrayParentIdSelect) == -1) {
                                   objselected += value.text + "<br>";
                                   if (objselectedText == "") {
                                       objselectedText += value.text;
                                   }
                                   else {
                                       objselectedText += ", " + value.text;
                                   }

                                   objselectedId.push({ isStaff: value.data.isStaff, id: value.data.idData });
                                   arrayParentIdSelect.push(value.id);
                               }
                           }
                       });

                       $('#departmentSelected').html(objselected);
                       $ctrl.departmentSelected = r;
                       $ctrl.departmentSelectedText = objselectedText;
                       $ctrl.departmentSelectedId = objselectedId;
                       // document.getElementById("departmentSelected").value = $ctrl.departmentSelected + "<br>";
                   })
               },
               function (error) {
                   console.log(error);
               });
        }
        $ctrl.getDepartment = getDepartment;
        $ctrl.getDepartment();

        $ctrl.ok = function () {
            // alert($ctrl.departmentSelected);
            $uibModalInstance.close({ departmentSelected: $ctrl.departmentSelected, departmentSelectedText: $ctrl.departmentSelectedText, departmentSelectedId: $ctrl.departmentSelectedId });
        };
        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function addedDocumentBookAddController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $http,
                                    $stateParams,
                                    $ngBootbox,
                                    $rootScope,
                                    $uibModal,
                                    dateformatService,
                                    authenticationService,
                                    fogLoading) {
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;
        $scope.departmentSelected = {};
        $scope.departmentSelectedId = [];
        $scope.departmentSelectedText = "";
        $scope.typeId = 0;
        $scope.documentId = 0;
        $scope.documentReceived = {};
        $scope.save = save;
        $scope.BindList = BindList;
        $scope.receivedDocument = "";
        function BindList() {
            $state.go('addedDocumentBook', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
        }
        //Functions needs add when addedDocumentBook
        function getFolderSaveFile() {
            var folderName = $scope.authentication.departmentShortName + "/DocumentReceived/";
            $scope.documentDateString = dateformatService.formatToDDMMYY(new Date($scope.documentReceived.receivedDate));
            if ($scope.documentDateString != "") {
                var temp = $scope.documentDateString.split("/").reverse().join("/").substring(0, 7);
                folderName += temp;
                return folderName + "-";
            } else {
                folderName += dateformatService.formatToDDMMYY(new Date()).split("/").reverse().join("/").substring(0, 7);
            }
            return folderName + "-";
        }
        $scope.uploadFile = function () {
            var files = $("#fileAttachment").get(0).files;
            var folderSave = getFolderSaveFile();
            if (files.length > 0) {
                var data = new FormData();
                for (i = 0; i < files.length; i++) {
                    data.append(folderSave + i, files[i]);
                    if (files[i].size > 4194304) {
                        notificationService.displayError("Dung lượng tệp đính kèm vượt quá 4MB.")
                        return;
                    }
                    var filename = files[i].name.split('.').pop();
                    if (filename == 'xls' || filename == 'xlsx' || filename == 'doc' || filename == 'docx' || filename == 'rar' || filename == 'zip' || filename == 'pdf' || filename == 'jpg' || filename == 'jpeg' || filename == 'png' || filename == 'gif') {
                        allowfileType = true;
                    }
                    else {
                        notificationService.displayError('Định dạng tệp tin không hợp lệ');
                        return;
                    }
                }
                $http.post($rootScope.baseUrl + "api/FileUpload/PostAsync", data,
                    {
                        headers:
                            { 'Content-Type': undefined }
                    }).then(
                    function (response) {
                        $scope.documentReceived.attachmentPath = response.data.message;
                        var n = $scope.documentReceived.attachmentPath.lastIndexOf("/");
                        $scope.documentReceived.attachmentName = response.data.message.substring(n + 1, $scope.documentReceived.attachmentPath.length);
                        // tai file thanh cong thi save
                        // $scope.save();
                    },
                    function (error) {
                        console.log("Error while invoking the Web API");
                    });
            }
        }
        function checkReceivedNumber() {
            if ($scope.documentReceived.receivedNumber == null || $scope.documentReceived.receivedNumber == '')
                return true;
            else
                return false;
        }
        function checkReceivedDate() {
            if ($scope.documentReceived.receivedDate == null || $scope.documentReceived.receivedDate == '')
                return true;
            else
                return false;
        }
        function checkDocumentType() {
            if ($scope.typeId == 0 || $scope.typeId == null) {
                return true;
            }
            else
                return false;
        }
        function checkRecipent() {
            if ($scope.departmentSelectedId.length == 0)
                return true;
            else
                return false;
        }
        //end
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn vào sổ văn bản này?')
                             .then(function () {
                                 if (checkReceivedNumber() == false) {
                                     if (checkReceivedDate() == false) {
                                         if (checkRecipent() == false) {
                                             $scope.isValidData = true;
                                             fogLoading('fog-modal-small', 'block');
                                             $scope.uploadFile();
                                             $scope.documentReceived.documentTypeId = $scope.typeId;
                                             $scope.documentReceived.receivedDate = $scope.receivedDateString.split("/").reverse().join("-");
                                             $scope.documentReceived.addedDocumentBook = true;
                                             $scope.documentReceived.documentBookAddedOn = dateformatService.addMoreHours(new Date());
                                             $scope.documentReceived.documentBookAddedBy = userId;
                                             $scope.documentReceived.editedOn = dateformatService.addMoreHours(new Date());
                                             $scope.documentReceived.editedBy = userId;
                                             $scope.documentReceived.receivedNumber = $scope.documentReceived.receivedNumber;
                                             $scope.documentReceived.sendOut = false;
                                             apiService.put($rootScope.baseUrl + 'api/DocumentReceived/Update', $scope.documentReceived, function (success) {
                                                 if (success.data.isSuccess == true) {
                                                     var recipent = {};
                                                     //Update field addedbookDocument=true record of department
                                                     recipent = {
                                                         documentId: $scope.documentId,
                                                         userId: '',
                                                         departmentId: departmentId,
                                                         receivedDocument: true,
                                                         forwarded: false,
                                                         assigned: false,
                                                         addedDocumentBook: true,
                                                         forSending: false,
                                                         createdOn: new Date(),
                                                         createdBy: userId
                                                     }
                                                     apiService.put($rootScope.baseUrl + 'api/DocumentRecipent/UpdateDocumentRecipentByDocIdAndReceivedDoc', recipent, function (success) {
                                                         $scope.listRecipent = [];
                                                         //Add a record for createdBy
                                                         var objRecipent = {};
                                                         objRecipent = {
                                                             documentId: $scope.documentId,
                                                             userId: userId,
                                                             departmentId: null,
                                                             receivedDocument: true,
                                                             forwarded: false,
                                                             assigned: false,
                                                             addedDocumentBook: true,
                                                             forSending: false,
                                                             createdOn: new Date(),
                                                             createdBy: userId
                                                         }
                                                         $scope.listRecipent.push(objRecipent);
                                                         angular.forEach($scope.departmentSelectedId, function (item, key) {
                                                             if (item.isStaff == "true") {
                                                                 objRecipent = {
                                                                     documentId: $scope.documentId,
                                                                     userId: item.id,
                                                                     departmentId: null,
                                                                     receivedDocument: true,
                                                                     forwarded: false,
                                                                     assigned: false,
                                                                     addedDocumentBook: true,
                                                                     forSending: false,
                                                                     createdOn: new Date(),
                                                                     createdBy: userId
                                                                 }
                                                             }
                                                             else {
                                                                 objRecipent = {
                                                                     documentId: $scope.documentId,
                                                                     userId: null,
                                                                     departmentId: parseInt(item.id),
                                                                     receivedDocument: true,
                                                                     forwarded: false,
                                                                     assigned: false,
                                                                     addedDocumentBook: true,
                                                                     forSending: false,
                                                                     createdOn: new Date(),
                                                                     createdBy: userId
                                                                 }
                                                             }
                                                             $scope.listRecipent.push(objRecipent);
                                                         });
                                                         apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/AddDocumentRecipents', $scope.listRecipent, function (success) {
                                                             //Add a record for createdBy
                                                             var objDocumentField = {
                                                                 documentId: $scope.documentId,
                                                                 receivedDocument: true
                                                             };
                                                             apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/DeleteDocDocumentFieldsByDocIdAndReceivedDoc', objDocumentField, function (success) {
                                                                 $scope.arrDocumentField = [];
                                                                 var documentField = {};
                                                                 angular.forEach($scope.documentFields, function (val, key) {
                                                                     documentField = {
                                                                         documentId: $scope.documentId,
                                                                         documentFieldDepartmentId: val.id,
                                                                         receivedDocument: true,
                                                                         createdOn: new Date(),
                                                                         createdBy: userId
                                                                     };
                                                                     $scope.arrDocumentField.push(documentField);
                                                                 });
                                                                 apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/AddDocumentDocumentFields', $scope.arrDocumentField, function (success) {
                                                                     BindList();
                                                                 }, function (error) {

                                                                     console.log(error);
                                                                 });
                                                             }, function (error) {
                                                                 console.log(error);
                                                             });
                                                             //Add recipents
                                                         }, function (error) {
                                                             console.log(error);
                                                         });
                                                     }, function (error) {
                                                         console.log(error);
                                                     });
                                                     //BindList();
                                                 }
                                                 else {
                                                     $scope.isValidData = false;
                                                     fogLoading('fog-modal-small', 'none');
                                                     focus('txtDocumentNumber');
                                                     notificationService.displayError(success.data.message);
                                                 }
                                             }, function (error) {
                                                 $scope.isValidData = false;
                                                 fogLoading('fog-modal-small', 'none');
                                                 notificationService.displayError('Vào sổ văn bản không thành công');
                                             });
                                         }
                                         else {
                                             $scope.isValidData = false;
                                             fogLoading('fog-modal-small', 'none');
                                             notificationService.displayError('Không để trống nơi nhận');
                                         }
                                     }
                                     else {
                                         $scope.isValidData = false;
                                         fogLoading('fog-modal-small', 'none');
                                         notificationService.displayError('Không để trống ngày đến');
                                     }
                                 }
                                 else {
                                     $scope.isValidData = false;
                                     fogLoading('fog-modal-small', 'none');
                                     notificationService.displayError('Không để trống số đến');
                                 }
                             });
        }
        //Init
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadDocumentReceived();
        }
        function loadDocumentReceived() {
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.documentReceived = result.data.value;
                    $scope.typeId = $scope.documentReceived.documentTypeId;
                    $scope.documentId = $scope.documentReceived.id;
                    $scope.documentReceived.recipientsDivision = "";
                    $scope.receivedDateString = dateformatService.formatToDDMMYY(new Date($scope.documentReceived.receivedDate));
                    // $scope.documentReceived.receivedDate = $scope.documentReceived.receivedDate.split("-").reverse().join("/");
                    function getDocumentField() {
                        apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/GetDocFieldDeaprtmentByDocIdAndReceivedDoc?documentId=' + parseInt($scope.documentId) + '&receivedDocument=true', null,
                           function (result) {
                               $scope.documentFields = result.data.data;
                           },
                           function (error) {
                               console.log(error);
                           });
                    }
                    $scope.getDocumentField = getDocumentField;
                    $scope.getDocumentField();

                    function getDocumentType() {
                        apiService.get($rootScope.baseUrl + 'api/DocumentType/getall', null,
                            function (result) {
                                $scope.documentType = result.data.data;
                                angular.forEach($scope.documentType, function (val, key) {
                                    if (val.id == $scope.typeId)
                                        $scope.initialType = val.title;
                                });
                            },
                            function (error) {
                                console.log(error);
                            });
                    }
                    $scope.getDocumentType = getDocumentType;
                    $scope.getDocumentType();
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Get DocumentFile of department addedDocumentBook
        $scope.documentFields = [];
        $scope.loadDocumentField = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/Filter?departmentID=' + departmentId, { cache: true }).then(function (response) {
                documentFields = response.data.data;
                return documentFields.filter(function (field) {
                    return field.title.toLowerCase() != -1;
                });
            });
        };
        $scope.loadDocumentField();
        //end Get DocumentFile
        //Get DocumentType of Department addDocumentBook
        $scope.documentType = [];
        function getDocumentTypeSelected(documentType) {
            $scope.documentReceived.documentTypeId = documentType.originalObject.id;
            $scope.typeId = documentType.originalObject.id;
        }
        $scope.selectedDocumentType = getDocumentTypeSelected;
        //end
        $scope.openModalDepartment = function (departmentSelected, departmentSelectedText,
                                         departmentSelectedId, departmentConfig, departmentId) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalDepartment.html',
                controller: 'selectDepartmentBookController',
                controllerAs: '$ctrl',
                backdrop: 'static',
                windowClass: 'app-modal-window',
                keyboard: false,
                resolve: {
                    functionDepartmentSelected: function () {
                        return departmentSelected;
                    },
                    functionDepartmentSelectedText: function () {
                        return departmentSelectedText;
                    },
                    functionDepartmentSelectedId: function () {
                        return departmentSelectedId
                    },
                    functionDepartmentConfig: function () {
                        return departmentConfig;
                    },
                    departmentId: function () {
                        return $scope.authentication.departmentId;
                    }
                }
            })
            modalInstance.result.then(function (selectedItem) {
                $scope.departmentSelected = selectedItem.departmentSelected;
                $scope.documentReceived.recipientsDivision = selectedItem.departmentSelectedText;
                $scope.departmentSelectedId = selectedItem.departmentSelectedId;
            }, function () {
            });
        };
    }
})(angular.module('VOfficeApp.addedDocumentBook'));