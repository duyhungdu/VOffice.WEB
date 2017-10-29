(function (app) {
    app.controller('documentReceivedAddOrEditController', documentReceivedAddOrEditController);

    app.controller('modelDepartmentController', modelDepartmentController);

    modelDepartmentController.$inject = ['$uibModalInstance', '$rootScope', 'apiService',
                                          'notificationService', 'functionDepartmentSelected',
                                          'functionDepartmentSelectedText', 'functionDepartmentSelectedId', 'functionDepartmentConfig',
                                          'functionEdit']
    function modelDepartmentController($uibModalInstance, $rootScope, apiService, notificationService,
                                      functionDepartmentSelected, functionDepartmentSelectedText,
                                      functionDepartmentSelectedId, functionDepartmentConfig,
                                      functionEdit) {
        var $ctrl = this;
        var treePhongban = [];
        $ctrl.departmentSelectedId = new Array();
        $ctrl.departmentSelectedText = "";
        function getDepartment() {
            var configDepartment = {
                params: {
                    departmentId: functionDepartmentConfig.departmentId,
                    type: "received",
                    action: functionEdit.action
                }
            }
            if (functionDepartmentSelected != null) {
                $ctrl.departmentSelected = functionDepartmentSelected;
                angular.forEach(functionDepartmentSelected, function (value, key) {
                    // $ctrl.departmentSelectedId.push(value.data.code);
                });
            }
            if (functionDepartmentSelectedId != null) {
                $ctrl.departmentSelectedId = functionDepartmentSelectedId;
            }
            apiService.get($rootScope.baseUrl + 'api/Department/BuildOrganizationTree?', configDepartment,
               function (result) {
                   $ctrl.department = result.data.data;
                   angular.forEach($ctrl.department, function (value, key) {
                       if (functionDepartmentConfig.office == true) {
                           if (functionEdit.action == "Add") {
                               if (value.idData == functionDepartmentConfig.parentDepartmentId) {
                                   var exsit = $ctrl.departmentSelectedId.filter(function (item) {
                                       return value.idData == item.id;
                                   }); //$.inArray(value.id, $ctrl.departmentSelectedId)
                                   if (exsit.length > 0) {
                                       treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, icon: "/", state: { opened: false, selected: true } });
                                   } else {
                                       treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, icon: "/", state: { opened: false } });
                                   }
                               }
                               else {
                                   if ($ctrl.departmentSelected != null) {
                                       var exsit = $ctrl.departmentSelectedId.filter(function (item) {
                                           return value.id == item.id;
                                       }); //$.inArray(value.id, $ctrl.departmentSelectedId)
                                       if (exsit.length > 0) {
                                           treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false, selected: true } });
                                       }
                                       else {
                                           treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                                       }
                                   }
                                   else {
                                       treePhongban.push({
                                           id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: {
                                               opened: false
                                           }
                                       });
                                   }
                               }
                           }
                           else {
                               if (value.idData == functionDepartmentConfig.departmentId) {
                                   treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, icon: "/", state: { open: true } });
                               }
                               else {
                                   if ($ctrl.departmentSelected != null) {
                                       var exsit = $ctrl.departmentSelectedId.filter(function (item) {
                                           return value.idData == item.id;
                                       }); //$.inArray(value.id, $ctrl.departmentSelectedId)
                                       if (exsit.length > 0) {
                                           treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false, selected: true } });
                                       }
                                       else {
                                           treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                                       }
                                   }
                                   else {
                                       treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                                   }
                               }
                           }
                       }
                       else {
                           if (value.idData == functionDepartmentConfig.departmentId) {
                               var exsit = $ctrl.departmentSelectedId.filter(function (item) {
                                   return value.idData == item.id;
                               }); //$.inArray(value.id, $ctrl.departmentSelectedId)
                               if (exsit.length > 0) {
                                   treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, icon: "/", state: { opened: false, selected: true } });
                               } else {
                                   treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: "#", text: value.name, icon: "/", state: { opened: false } });
                               }

                           }
                           else {
                               if ($ctrl.departmentSelected != null) {
                                   var exsit = $ctrl.departmentSelectedId.filter(function (item) {
                                       return value.idData == item.id;
                                   }); //$.inArray(value.id, $ctrl.departmentSelectedId)
                                   if (exsit.length > 0) {
                                       treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false, selected: true } });
                                   }
                                   else {
                                       treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                                   }
                               }
                               else {
                                   treePhongban.push({ id: value.id.toString(), data: { code: value.code, idData: value.idData.toString(), isStaff: value.isStaff, root: value.root, shortName: value.shortName, office: value.office }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { opened: false } });
                               }
                           }

                           
                           
                       }
                   });
                   if (configDepartment.params.action == "Edit") {
                       $('#departmentSelected').html(functionEdit.departmentSelectedText);
                       apiService.get($rootScope.baseUrl + 'api/DocumentRecipent/GetListRecipentsByDocIdAndReceivedDoc?documentId=' + functionEdit.documentId + '&receivedDocument=true', null,
                           function (result) {
                               if (result.data.isSuccess) {
                                   angular.forEach(result.data.data, function (value, key) {
                                       angular.forEach(treePhongban, function (val, key) {
                                           if (val.data.isStaff == "false") {
                                               if (parseInt(val.id) == value.departmentId) {
                                                   val.state.selected = true;
                                               }
                                           }
                                           else {
                                               if (functionEdit.userId != val.data.idData) {
                                                   if (val.data.idData == value.userId) {
                                                       val.state.selected = true;
                                                   }
                                               }
                                           }
                                       });
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
                               }
                               else {
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
                               }
                           },
                           function (error) {
                           });
                   }
                   else {
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
                   }

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
                       
                   })
               },
               function (error) {
                   
               });
        }
        $ctrl.getDepartment = getDepartment;
        $ctrl.getDepartment();
        $ctrl.ok = function () {
            $uibModalInstance.close({ departmentSelected: $ctrl.departmentSelected, departmentSelectedText: $ctrl.departmentSelectedText, departmentSelectedId: $ctrl.departmentSelectedId });
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }


    documentReceivedAddOrEditController.$inject = ['$scope',
                                                  'apiService',
                                                  'focus',
                                                  'notificationService',
                                                  '$state',
                                                  '$http',
                                                  '$stateParams',
                                                  '$rootScope',
                                                  '$uibModal',
                                                  'dateformatService',
                                                  'authenticationService',
                                                  '$ngBootbox', 'fogLoading']



    function documentReceivedAddOrEditController($scope,
                                    apiService,
                                    focus,
                                    notificationService,
                                    $state,
                                    $http,
                                    $stateParams,
                                    $rootScope,
                                    $uibModal,
                                    dateformatService,
                                    authenticationService,
                                    $ngBootbox, fogLoading) {

        
        $scope.departmentSelected = {};
        $scope.documentReceived = {};
        $scope.documentDelivered = {};
        $scope.departmentSelectedText = "";
        $scope.selectedDocumentFields = [];
        $scope.documentRecipents = [];
        $scope.documentDeliverRecipents = [];
        $scope.documentDocumentFields = [];
        $scope.documentReceivedFromOffice = [];
        $scope.divisionReceivedFromOffice = [];

        function getFolderSaveFile() {
            var folderName = $scope.authentication.departmentShortName + "/DocumentReceived/";
            if ($scope.documentDateString != "") {
                var temp = $scope.documentDateString.split("/").reverse().join("/").substring(0, 7);
                folderName += temp;
                return folderName + "-";
            } else {
                folderName += dateformatService.formatToDDMMYY(new Date()).split("/").reverse().join("/").substring(0, 7);
            }
            return folderName + "-";
        }

        $scope.uploadFile = function (type) {

            //  
            var files = $("#fileAttachment").get(0).files;
            var folderSave = getFolderSaveFile();

            if (files.length > 0) {
                var data = new FormData();
                for (i = 0; i < files.length; i++) {
                    data.append(folderSave + i, files[i]);
                    if (files[i].size > 4194304) {
                        notificationService.displayError("Dung lượng tệp đính kèm vượt quá 4MB.")
                        fogLoading('fog-modal-small', 'none');
                        $scope.isValidData = false;
                        return;
                    }
                    var filename = files[i].name.split('.').pop();
                    if (filename == 'xls' || filename == 'xlsx' || filename == 'doc' || filename == 'docx' || filename == 'rar' || filename == 'zip' || filename == 'pdf' || filename == 'jpg' || filename == 'jpeg' || filename == 'png' || filename == 'gif') {
                        allowfileType = true;
                    }
                    else {
                        notificationService.displayError('Định dạng tệp tin không hợp lệ');
                        fogLoading('fog-modal-small', 'none');
                        $scope.isValidData = false;
                        return;
                    }
                }

                $http.post($rootScope.baseUrl + "api/FileUpload/PostAsync", data,
                    {
                        headers:
                            { 'Content-Type': undefined }
                    }).then(
                    function (response) {
                        if (response.data.isSuccess == true) {
                            $scope.documentReceived.attachmentPath = response.data.message;
                            var n = $scope.documentReceived.attachmentPath.lastIndexOf("/");
                            $scope.documentReceived.attachmentName = response.data.message.substring(n + 1, $scope.documentReceived.attachmentPath.length);
                            // tai file thanh cong thi save
                            $scope.saveAll(type);
                        } else {
                            notificationService.displayError(response.data.message);
                        }
                    },
                    function (error) {
                        
                    });
            } else {
                if ($scope.action == "Edit") {
                    $scope.saveAll(type);
                }
                else {
                    notificationService.displayError("Bạn chưa chọn tệp đính kèm.")
                    fogLoading('fog-modal-small', 'none');
                    $scope.isValidData = false;
                    focus('fileAttachment');
                }
            }
        }
        $scope.bindList = function () {
            $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(
                function () {
                    $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                });
        }

        function fetchDocumentFieldForDocumentDelivery(documentFieldDelivery, documentDeliveryId) {
            $scope.selectedDocumentFieldsForDocumentDelivery = [];
            angular.forEach(documentFieldDelivery, function (value, key) {
                var newField = {
                    documentId: documentDeliveryId,
                    documentFieldDepartmentId: parseInt(value.documentFieldId),
                    receivedDocument: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId
                }
                $scope.selectedDocumentFieldsForDocumentDelivery.push(newField);
            });
        }

        function fetchDocumentFieldForDivision(documentFieldForDivision, documentId) {
            $scope.selectedDocumentFieldsForDivision = [];
            angular.forEach(documentFieldForDivision, function (value, key) {
                var newField = {
                    documentId: documentId,
                    documentFieldDepartmentId: parseInt(value.documentFieldId),
                    receivedDocument: true,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId
                }
                $scope.selectedDocumentFieldsForDivision.push(newField);
            });
        }

        function fetchDocumentDeliveryRecipent(divisionReceivedFromOffice, documentDeliveryId) {
            $scope.documentDeliverRecipents = new Array();
            var documentRecipent = {};
            angular.forEach(divisionReceivedFromOffice, function (value, key) {
                documentRecipent = {
                    documentId: documentDeliveryId,
                    departmentId: parseInt(value.id),
                    receivedDocument: false,
                    forwarded: false,
                    assigned: false,
                    addedDocumentBook: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId,
                    forSending: true
                }
                $scope.documentDeliverRecipents.push(documentRecipent);
            });
            // tao moi cho van thu van phong
            documentRecipent = {
                documentId: documentDeliveryId,
                userId: $scope.authentication.userId,
                receivedDocument: false,
                forwarded: false,
                assigned: false,
                addedDocumentBook: false,
                createdOn: dateformatService.addMoreHours(new Date()),
                createdBy: $scope.authentication.userId,
                forSending: true
            };
            $scope.documentDeliverRecipents.push(documentRecipent);
        }

        function fetchSelectedDocumentField(documetFields, documentId) {
            angular.forEach(documetFields, function (value, key) {
                var newField = {
                    documentId: parseInt(documentId),
                    documentFieldDepartmentId: parseInt(value.id),
                    receivedDocument: true,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId
                }
                $scope.selectedDocumentFields.push(newField);
            });
        }

        function fetchDocumentRecipent(departmentIds, documentId) {
            $scope.divisionReceivedFromOffice = new Array();
            $scope.documentRecipents = new Array();
            if ($scope.departmentConfig.office == true) {
                angular.forEach(departmentIds, function (value, key) {
                    angular.forEach($scope.departmentSelected, function (val, key) {
                        if (val.id == value.id && val.data.root == 1 && val.data.office == false) {
                            $scope.divisionReceivedFromOffice.push(value);
                        }
                    });

                });
                var documentRecipent = {};
                angular.forEach(departmentIds, function (value, key) {
                    var found = $scope.divisionReceivedFromOffice.filter(function (item) {
                        return item.id == value.id
                    });
                    if (found.length == 0) {
                        if (value.isStaff == 'false') {
                            documentRecipent = {
                                documentId: parseInt(documentId),
                                departmentId: parseInt(value.id),
                                receivedDocument: true,
                                forwarded: false,
                                assigned: false,
                                addedDocumentBook: true,
                                createdOn: dateformatService.addMoreHours(new Date()),
                                createdBy: $scope.authentication.userId,
                                forSending: false
                            };
                        }
                        else {
                            documentRecipent = {
                                documentId: documentId,
                                userId: value.id,
                                receivedDocument: true,
                                forwarded: false,
                                assigned: false,
                                addedDocumentBook: true,
                                createdOn: dateformatService.addMoreHours(new Date()),
                                createdBy: $scope.authentication.userId,
                                forSending: false
                            };
                        }
                        $scope.documentRecipents.push(documentRecipent);
                    }
                });
                // Thêm mới 1 Recipent cho thằng tạo văn bản
                documentRecipent = {
                    documentId: documentId,
                    userId: $scope.authentication.userId,
                    receivedDocument: true,
                    forwarded: false,
                    assigned: false,
                    addedDocumentBook: true,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId,
                    forSending: false
                };
                $scope.documentRecipents.push(documentRecipent);
            }

            else {
                var documentRecipent = {};
                angular.forEach(departmentIds, function (value, key) {
                    if (value.isStaff == 'false') {
                        documentRecipent = {
                            documentId: documentId,
                            departmentId: parseInt(value.id),
                            receivedDocument: true,
                            forwarded: false,
                            assigned: false,
                            addedDocumentBook: true,
                            createdOn: dateformatService.addMoreHours(new Date()),
                            createdBy: $scope.authentication.userId,
                            forSending: false
                        };
                    }
                    else {
                        documentRecipent = {
                            documentId: documentId,
                            userId: value.id,
                            receivedDocument: true,
                            forwarded: false,
                            assigned: false,
                            addedDocumentBook: true,
                            createdOn: dateformatService.addMoreHours(new Date()),
                            createdBy: $scope.authentication.userId,
                            forSending: false
                        };
                    }
                    $scope.documentRecipents.push(documentRecipent);
                });
                // Thêm mới 1 Recipent cho thằng tạo văn bản
                documentRecipent = {
                    documentId: documentId,
                    userId: $scope.authentication.userId,
                    receivedDocument: true,
                    forwarded: false,
                    assigned: false,
                    addedDocumentBook: true,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId,
                    forSending: false
                };
                $scope.documentRecipents.push(documentRecipent);
            }
        }

        $scope.resetForm = function () {
            $scope.documentReceived.id = 0;
            $scope.documentReceived.documentNumber = "";
            $scope.documentReceived.receivedNumber = "";
            $scope.documentReceived.title = "";
            $scope.documentReceived.documentDateString = "";
            $scope.documentReceived.departmentId = 0;
            $scope.documentReceived.externalFromDivisionId = 0;
            $scope.documentReceived.externalFromDivision = "";
            $scope.documentReceived.recipientsDivision = "";
            $scope.documentReceived.signedById = 0;
            $scope.documentReceived.signedBy = "";
            $scope.documentReceived.documentTypeId = 0;
            $scope.documentReceived.addedDocumentBook = false;
            $scope.documentReceived.numberOfCopies = 1;
            $scope.documentReceived.numberOfPages = 1;
            $scope.documentReceived.secretLevel = 0;
            $scope.documentReceived.urgencyLevel = 0;
            $scope.documentReceived.note = "";
            $scope.documentReceived.originalSavingPlace = "";
            $scope.documentReceived.legalDocument = false;
            $scope.documentReceived.attachmentName = "";
            $scope.documentReceived.attachmentPath = "";
            $scope.documentReceived.deliveredDocumentId = 0;
            $scope.documentReceived.receivedDocumentId = 0;
            $scope.initialExternalDivision = "";
            $scope.documentFields = [];
            $scope.documentDateString = "";
            $scope.selectedDocumentType = { id: 0 };

        }

        function getDocumentReceived(id, callback) {
            if (id == 0) {
                var obj = {};

                obj.id = 0;
                obj.numberOfCopies = 1;
                obj.numberOfPages = 1;
                obj.secretLevel = $scope.listSecretLevel[0].id;
                obj.urgencyLevel = $scope.listUrgencyLevel[0].id;
                obj.recipientsDivision = "";
                obj.attachmentName = "";
                var result = { data: { value: {} } };
                result.data.value = obj;
                callback(result);
            }
            else {
                if (id != 0) {
                    if ($scope.receivedDocument == true) {
                        apiService.get($rootScope.baseUrl + 'api/DocumentReceived/Get/' + parseInt($stateParams.id), null,
                            function (result) {
                                if (result.data.isSuccess == true) {
                                    callback(result);
                                }
                                else {
                                    
                                }
                            },
                            function (error) {
                                notificationService.displayError(error);
                            });
                    }
                }
            }

        }

        $scope.focusDocumentNumber = function () {
            focus('txtDocumentNumber');
        }

        //begin binding default controll
        function getExternalSendReceiveDivisionSelected(externalSendReceiveDivision) {
            if (externalSendReceiveDivision != null) {
                $scope.documentReceived.externalFromDivision = externalSendReceiveDivision.title;
                $scope.documentReceived.externalFromDivisionId = externalSendReceiveDivision.originalObject.id;
            }
            else {
                $scope.documentReceived.externalFromDivisionId = null;
            }
        }

        function getDocumentSignBySelected(documentSignBy) {
            if (documentSignBy != null) {
                $scope.documentReceived.signedBy = documentSignBy.originalObject.fullName;
                $scope.documentReceived.signedById = documentSignBy.originalObject.id;
            }
            else {
                $scope.documentReceived.signedById = null;
            }
        }

        $scope.documentSignByInputChanged = function (str) {
            if (str == "") {
               
                $scope.documentReceivedAddOrEdit._documentSignBy.invalid = true;
            }
            else {
                
                $scope.documentReceivedAddOrEdit._documentSignBy.invalid = false;
            }
            $scope.documentReceived.signedBy = str;
         
        }

        $scope.externalSendReceiveDivisionInputChanged = function (str) {
            $scope.documentReceived.externalFromDivision = str;
        }

     
        $scope.selectedDocumentSignedBy = getDocumentSignBySelected;
        $scope.selectedExternalSendReceiveDivision = getExternalSendReceiveDivisionSelected;

        function getExternalSendReceiveDivision() {
            apiService.get($rootScope.baseUrl + 'api/ExternalSendReceiveDivision/GetByDepartment?departmentId=' + $scope.authentication.departmentId, null,
                function (result) {
                    $scope.externalSendReceiveDivision = result.data.data;
                    if ($scope.documentReceived.externalFromDivisionId != null) {
                        angular.forEach(result.data.data, function (value, key) {
                            if (value.id == $scope.documentReceived.externalFromDivisionId) {
                                $scope.initialExternalDivision = value.title;
                            } else if (value.id == $scope.documentReceived.internalFromDivisionId) {
                                $scope.initialExternalDivision = value.title;
                            }
                        });
                    }
                    if ($scope.initialExternalDivision == null) {
                        $scope.initialExternalDivision = $scope.documentReceived.externalFromDivision;
                    }
                },
                function (error) {// console.log(error);
                });
        }

        function getDocumentSignedBy() {
            apiService.get($rootScope.baseUrl + 'api/DocumentSignedBy/GetByDepartment?departmentId=' + $scope.authentication.departmentId, null,
                function (result) {
                    $scope.documentSignedBy = result.data.data;
                    if ($scope.documentReceived.signedById != null) {
                        angular.forEach(result.data.data, function (value, key) {
                            if (value.id == $scope.documentReceived.signedById) {
                                $scope.initialDocumentSignBy = value.fullName;
                            }
                        });
                    }
                    if ($scope.initialDocumentSignBy == null) {
                        $scope.initialDocumentSignBy = $scope.documentReceived.signedBy;
                    }
                },
                function (error) {
                    
                });
        }

        function getDocumentType() {
            apiService.get($rootScope.baseUrl + 'api/DocumentType/getall', null,
                function (result) {
                    $scope.documentType = result.data.data;
                    if ($scope.action == "Edit") {
                        angular.forEach(result.data.data, function (value, key) {
                            if (value.id == $scope.documentReceived.documentTypeId) {
                                $scope.selectedDocumentType = value;
                            }
                        });
                    }
                },
                function (error) {
                   
                });
        }

        $scope.loadDocumentField = function ($query) {
            return $http.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/Filter?departmentID=' + parseInt($scope.authentication.departmentId), { cache: true }).then(function (response) {
                var documentFields = response.data.data;
                return documentFields.filter(function (field) {
                    if ($query != null) {
                        return field.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
                    }
                });
            });
        };
        //end binding default controll
        $scope.openModalDepartmentTest = function (departmentSelected, departmentSelectedText
                                                    , departmentSelectedId, departmentConfig) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalDepartmentTest.html',
                controller: 'modelDepartmentController',
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
                    functionEdit: function () {
                        return {
                            action: $scope.action,
                            documentId: $scope.documentReceived.id,
                            departmentSelectedText: $scope.documentReceived.recipientsDivision,
                            departmentSelectedIdEdit: $scope.departmentSelectedIdEdit,
                            userId: $scope.authentication.userId
                        };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.departmentSelected = selectedItem.departmentSelected;
                $scope.documentReceived.recipientsDivision = selectedItem.departmentSelectedText;
                $scope.departmentSelectedId = selectedItem.departmentSelectedId;
               
            }, function () {
                
            });
        }
        //begin open choice Department
        $scope.openModalDepartment = function (departmentSelected, departmentSelectedText,
                                                departmentSelectedId, departmentConfig) {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modalDepartment.html',
                controller: 'selectDepartmentController',
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
                    functionEdit: function () {
                        return {
                            action: $scope.action,
                            documentId: $scope.documentReceived.id,
                            departmentSelectedText: $scope.documentReceived.recipientsDivision,
                            departmentSelectedIdEdit: $scope.departmentSelectedIdEdit,
                            userId: $scope.authentication.userId
                        };
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
        //end open choice Department

        // begin save to database

        function cloneDocumentDelivered(documentReceived) {
            $scope.documentDelivered.documentNumber = documentReceived.documentNumber;
            $scope.documentDelivered.title = documentReceived.title;
            $scope.documentDelivered.documentDate = documentReceived.documentDate;
            $scope.documentDelivered.deliveredDate = documentReceived.receivedDate;
            $scope.documentDelivered.departmentId = documentReceived.departmentId;
            $scope.documentDelivered.recipientsDivision = documentReceived.recipientsDivision;
            $scope.documentDelivered.signedById = documentReceived.signedById;
            $scope.documentDelivered.signedBy = documentReceived.signedBy;
            $scope.documentDelivered.documentTypeId = documentReceived.documentTypeId;
            $scope.documentDelivered.numberOfCopies = documentReceived.numberOfCopies;
            $scope.documentDelivered.numberOfPages = documentReceived.numberOfPages;
            $scope.documentDelivered.secretLevel = documentReceived.secretLevel;
            $scope.documentDelivered.urgencyLevel = documentReceived.urgencyLevel;
            $scope.documentDelivered.note = documentReceived.note;
            $scope.documentDelivered.originalSavingPlace = documentReceived.originalSavingPlace;
            $scope.documentDelivered.legalDocument = documentReceived.legalDocument;
            $scope.documentDelivered.attachmentName = documentReceived.attachmentName;
            $scope.documentDelivered.attachmentPath = documentReceived.attachmentPath;
            $scope.documentDelivered.receivedDocumentId = documentReceived.id;
            $scope.documentDelivered.active = true;
            $scope.documentDelivered.deleted = false;
            $scope.documentDelivered.createdOn = dateformatService.addMoreHours(new Date());
            $scope.documentDelivered.createdBy = $scope.authentication.userId;
            $scope.documentDelivered.editedOn = dateformatService.addMoreHours(new Date());
            $scope.documentDelivered.editedBy = $scope.authentication.userId;
        }

        function saveDocumentDelivered(documentReceived, type) {
            cloneDocumentDelivered(documentReceived);
            
            apiService.post($rootScope.baseUrl + 'api/DocumentDelivered/Add', $scope.documentDelivered,
                function (success) {
                    if (success.data.isSuccess == true) {
                       
                        documentReceived.deliveredDocumentId = success.data.value.id;
                        documentReceived.receivedDocumentId = documentReceived.id;
                        // add documentRecipent for document delivery
                        fetchDocumentDeliveryRecipent($scope.divisionReceivedFromOffice, success.data.value.id);
                        apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/AddDocumentRecipents', $scope.documentDeliverRecipents,
                            function (success) {
                                if (success.data.isSuccess == true) {
                                  
                                    fetchDocumentFieldForDocumentDelivery($scope.documentFields, documentReceived.deliveredDocumentId);
                                    apiService.post($scope.baseUrl + 'api/DocumentDocumentField/AddDocumentDocumentFields', $scope.selectedDocumentFieldsForDocumentDelivery,
                                        function (result) {
                                            if (result.data.isSuccess == true) {
                                              
                                            }
                                            else {
                                              
                                            }
                                        }, function () {
                                        });
                                }
                                else {
                                  
                                }
                            },
                            function (error) {
                                
                            });
                        // Add documentReceived For division children
                        angular.forEach($scope.divisionReceivedFromOffice, function (value, key) {
                            $scope.documentFieldAndDepartmentId = [];
                            angular.forEach($scope.documentFields, function (val, key) {
                                var objField = {
                                    documentFieldId: val.id,
                                    departmentId: parseInt(value.id)
                                };
                                $scope.documentFieldAndDepartmentId.push(objField);
                            });
                            /// get document Field for division child
                            apiService.post($rootScope.baseUrl + 'api/DocumentFieldDepartment/GetOutputDocFieldDepartment', $scope.documentFieldAndDepartmentId,
                                function (success) {
                                    if (success.data.isSuccess == true) {
                                        $scope.documentFieldOfDivisionChild = success.data.data;
                                        documentReceived.departmentId = parseInt(value.id);
                                        documentReceived.addedDocumentBook = false;
                                        documentReceived.documentBookAddedBy = null;
                                        documentReceived.documentBookAddedOn = null;
                                        // add to documentreceived
                                        apiService.post($rootScope.baseUrl + 'api/DocumentReceived/Add', documentReceived,
                                            function (success) {
                                                if (success.data.isSuccess == true) {
                                                    // Add to recipent
                                                    var objDocumentRecipent = {
                                                        documentId: success.data.value.id,
                                                        departmentId: parseInt(value.id),
                                                        addedDocumentBook: false,
                                                        receivedDocument: true,
                                                        forSending: true,
                                                        assigned: false,
                                                        forwarded: false,
                                                        createdOn: dateformatService.addMoreHours(new Date()),
                                                        createdBy: $scope.authentication.userId
                                                    };
                                                    // add to recipent 
                                                    apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/Add', objDocumentRecipent,
                                                        function (result) {
                                                            if (result.data.isSuccess == true) {
                                                                // add recipent success
                                                                // add document Field
                                                                fetchDocumentFieldForDivision($scope.documentFieldOfDivisionChild, success.data.value.id);
                                                                apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/AddDocumentDocumentFields', $scope.selectedDocumentFieldsForDivision,
                                                                    function (success) {
                                                                        if (success.data.isSuccess == true) {
                                                                          
                                                                            if (type == "SaveAndClose") {
                                                                                $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                                                                            }
                                                                            else if (type == "SaveAndAdd") {
                                                                                $scope.resetForm();
                                                                                $scope.focusDocumentNumber();
                                                                            }
                                                                        }
                                                                        else {
                                                                          
                                                                        }
                                                                    },
                                                                    function (error) {
                                                                      
                                                                    });
                                                            }
                                                            else {
                                                               
                                                            }

                                                        },
                                                        function (error) {
                                                           
                                                        });
                                                }
                                                else {
                                                 
                                                }
                                            },
                                            function (error) {
                                               
                                            });
                                    }
                                    else {
                                       
                                    }
                                },
                                function (error) {
                                    
                                });
                        });
                    }
                    else {
                       
                    }
                },
            function (error) {
                notificationService.displayError(error)
            });
        }
        $scope.save = function (type) {
            $scope.isValidData = true;
            fogLoading('fog-modal-small', 'block');
            if ($scope.action == "Add") {
                if ($scope.originalSavingPlace != null) $scope.documentReceived.originalSavingPlace = $scope.originalSavingPlace.replace(/\n\r?/g, '<br />');
                if ($scope.note != null) $scope.documentReceived.note = $scope.note.replace(/\n\r?/g, '<br />');
                $scope.documentReceived.documentTypeId = $scope.selectedDocumentType.id;
                $scope.documentReceived.documentDate = $scope.documentDateString.split("/").reverse().join("-");
                $scope.documentReceived.receivedDate = $scope.receivedDateString.split("/").reverse().join("-");
                $scope.documentReceived.addedDocumentBook = true;
                $scope.documentReceived.documentBookAddedOn = dateformatService.addMoreHours(new Date());
                $scope.documentReceived.departmentId = parseInt($scope.authentication.departmentId);
                $scope.documentReceived.secretLevel = $scope.secretLevel.id;
                $scope.documentReceived.urgencyLevel = $scope.urgencyLevel.id;
                $scope.documentReceived.documentBookAddedBy = $scope.authentication.userId;
                $scope.documentReceived.active = true;
                $scope.documentReceived.deleted = false;
                $scope.documentReceived.createdOn = dateformatService.addMoreHours(new Date());
                $scope.documentReceived.createdBy = $scope.authentication.userId;
                $scope.documentReceived.editedOn = dateformatService.addMoreHours(new Date());
                $scope.documentReceived.editedBy = $scope.authentication.userId;
                //Kiểm tra văn bản đến gửi nội bộ hay gửi ra ngoài
                $scope.placeSendOutFromOffice = new Array();
                if ($scope.departmentConfig.office == true) {
                    angular.forEach($scope.departmentSelectedId, function (value, key) {
                        angular.forEach($scope.departmentSelected, function (val, key) {
                            if (val.id == value.id && val.data.root == 1 && val.data.office == false) {
                                $scope.placeSendOutFromOffice.push(value);
                            }
                        });
                    });
                };
                if ($scope.placeSendOutFromOffice.length > 0)
                    $scope.documentReceived.sendOut = true;
                else
                    $scope.documentReceived.sendOut = false;
                apiService.post($rootScope.baseUrl + 'api/DocumentReceived/Add', $scope.documentReceived,
                    function (success) {
                        if (success.data.isSuccess == true) {
                            $scope.documentReceived.id = success.data.value.id;
                            if ($scope.departmentConfig.office == true) {
                                fetchDocumentRecipent($scope.departmentSelectedId, success.data.value.id);
                                apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/AddDocumentRecipents', $scope.documentRecipents,
                                    function (success) {
                                        if (success.data.isSuccess == true) {
                                            // thêm mới vào documentDocumentField
                                            fetchSelectedDocumentField($scope.documentFields, $scope.documentReceived.id);
                                            apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/AddDocumentDocumentFields', $scope.selectedDocumentFields,
                                                function (result) {
                                                    if (result.data.isSuccess == true) {
                                                        if ($scope.divisionReceivedFromOffice.length > 0) {
                                                            saveDocumentDelivered($scope.documentReceived, type);
                                                        }
                                                        else {
                                                            if (type == "SaveAndClose") {
                                                                notificationService.displaySuccess("Tạo mới văn bản thành công");
                                                                $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                                                            }
                                                            else if (type == "SaveAndAdd") {
                                                                notificationService.displaySuccess("Tạo mới văn bản thành công");
                                                                $scope.resetForm();
                                                                $scope.focusDocumentNumber();
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        fogLoading('fog-modal-small', 'none');
                                                        angular.forEach(result.data.brokenRules, function (value, key) {
                                                            notificationService.displayError(value.rule);
                                                        });
                                                    }
                                                },
                                                function (error) {
                                                    fogLoading('fog-modal-small', 'none');
                                                    notificationService.displayError(error);
                                                });
                                        }
                                        else {
                                            fogLoading('fog-modal-small', 'none');
                                            angular.forEach(success.data.brokenRules, function (value, key) {
                                                notificationService.displayError(value.rule);
                                            });
                                        }
                                    },
                                    function (error) {
                                        $scope.isValidData = false;
                                        fogLoading('fog-modal-small', 'none');
                                      });
                            }
                            else {
                                fetchDocumentRecipent($scope.departmentSelectedId, success.data.value.id);
                                apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/AddDocumentRecipents', $scope.documentRecipents,
                                    function (success) {
                                        if (success.data.isSuccess == true) {
                                            // thêm mới vào documentDocumentField
                                            fetchSelectedDocumentField($scope.documentFields, $scope.documentReceived.id);
                                            apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/AddDocumentDocumentFields', $scope.selectedDocumentFields,
                                                function (result) {
                                                    if (result.data.isSuccess == true) {
                                                        //notificationService.displaySuccess('Thêm mới văn bản thành công');
                                                        if (type == "SaveAndClose") {
                                                            $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                                                        }
                                                        else if (type == "SaveAndAdd") {
                                                            $scope.resetForm();
                                                            $scope.focusDocumentNumber();
                                                        }
                                                    }
                                                    else {
                                                        $scope.isValidData = false;
                                                        fogLoading('fog-modal-small', 'none');
                                                        angular.forEach(result.data.brokenRules, function (value, key) {
                                                            notificationService.displayError(value.rule);
                                                        });
                                                    }
                                                },
                                                function (error) {
                                                    fogLoading('fog-modal-small', 'none');
                                                    $scope.isValidData = false;
                                                    notificationService.displayError(error);
                                                });
                                        }
                                        else {
                                            $scope.isValidData = false;
                                            fogLoading('fog-modal-small', 'none');
                                            angular.forEach(success.data.brokenRules, function (value, key) {
                                                notificationService.displayError(value.rule);
                                            });
                                        }
                                    },
                                    function (error) {
                                        fogLoading('fog-modal-small', 'none');
                                        $scope.isValidData = false;
                                        notificationService.displayError('Thêm mới văn bản không thành công');
                                                                           });
                            }
                            
                        }
                        else if (success.data.isSuccess == false) {
                            angular.forEach(success.data.brokenRules, function (value, key) {
                                fogLoading('fog-modal-small', 'none');
                                notificationService.displayError(value.rule);
                                if (value.propertyName != "") {
                                    switch (value.propertyName) {
                                        case 'SignedBy':
                                            focus('txtSignedBy')
                                            break;
                                        case 'DocumentDate':
                                            focus('txtDocumentDate');
                                            break;
                                        case 'AttachmentName':
                                            focus('fileAttachment');
                                            break;
                                        case 'Title':
                                            focus('txtTitle')
                                            break;
                                        case 'DocumentType':
                                            focus('txtDocumentType')
                                            break;
                                        default:
                                    }
                                }
                            });
                            fogLoading('fog-modal-small', 'none');
                            $scope.isValidData = false;
                            if (success.data.message != null) notificationService.displayError(success.data.message);
                        }
                    }, function (error) {
                        fogLoading('fog-modal-small', 'none');
                        $scope.isValidData = false;
                        notificationService.displaySuccess('Thêm mới văn bản không thành công');
                    });
            }
            else if ($scope.action == "Edit") {
                if ($scope.originalSavingPlace != null) $scope.documentReceived.originalSavingPlace = $scope.originalSavingPlace.replace(/\n\r?/g, '<br />');
                if ($scope.note != null) $scope.documentReceived.note = $scope.note.replace(/\n\r?/g, '<br />');
                $scope.documentReceived.documentTypeId = $scope.selectedDocumentType.id;
                $scope.documentReceived.documentDate = $scope.documentDateString.split("/").reverse().join("-");
                $scope.documentReceived.receivedDate = $scope.receivedDateString.split("/").reverse().join("-");
                $scope.documentReceived.addedDocumentBook = true;
                $scope.documentReceived.documentBookAddedOn = dateformatService.addMoreHours(new Date());
                $scope.documentReceived.departmentId = parseInt($scope.authentication.departmentId);
                $scope.documentReceived.secretLevel = $scope.secretLevel.id;
                $scope.documentReceived.urgencyLevel = $scope.urgencyLevel.id;
                $scope.documentReceived.documentBookAddedBy = $scope.authentication.userId;
                $scope.documentReceived.active = true;
                $scope.documentReceived.deleted = false;
                $scope.documentReceived.createdOn = dateformatService.addMoreHours(new Date());
                $scope.documentReceived.createdBy = $scope.authentication.userId;
                $scope.documentReceived.editedOn = dateformatService.addMoreHours(new Date());
                $scope.documentReceived.editedBy = $scope.authentication.userId;
                apiService.put($rootScope.baseUrl + 'api/DocumentReceived/Update', $scope.documentReceived,
                    function (success) {
                        if (success.data.isSuccess == true) {
                            // clear recipent old
                            var paramDelDocumentRecipent = {
                                documentId: success.data.value.id,
                                receivedDocument: true
                            }
                           
                            apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/DeleteRecipentsByDocIdAndReceivedDoc', JSON.stringify(paramDelDocumentRecipent),
                                function (result) {
                                    // del success => add again recipent
                                    fetchDocumentRecipent($scope.departmentSelectedId, success.data.value.id);
                                    apiService.post($rootScope.baseUrl + 'api/DocumentRecipent/AddDocumentRecipents', $scope.documentRecipents,
                                            function (success) {
                                                if (success.data.isSuccess == true) {
                                                    // clear documentDocumentField

                                                    apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/DeleteDocDocumentFieldsByDocIdAndReceivedDoc', paramDelDocumentRecipent,
                                                        function (result) {
                                                            fetchSelectedDocumentField($scope.documentFields, $scope.documentReceived.id);
                                                            apiService.post($rootScope.baseUrl + 'api/DocumentDocumentField/AddDocumentDocumentFields', $scope.selectedDocumentFields,
                                                                 function (result) {
                                                                     if (result.data.isSuccess == true) {
                                                                         notificationService.displaySuccess('Cập nhật văn bản thành công');
                                                                         if (type == "SaveAndClose") {

                                                                             $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                                                                         } else if (type == "SaveAndAdd") {
                                                                             $scope.resetForm();
                                                                             $scope.focusDocumentNumber();
                                                                         }
                                                                         // 
                                                                     }
                                                                     else {
                                                                         angular.forEach(result.data.brokenRules, function (value, key) {
                                                                             notificationService.displayError(value.rule);
                                                                         });
                                                                     }
                                                                 },
                                                                function (error) {
                                                                    notificationService.displayError(error);
                                                                });
                                                        },
                                                        function (error) {
                                                    
                                                        });
                                                    // thêm mới vào documentDocumentField
                                                }
                                                else {
                                                    fogLoading('fog-modal-small', 'none');
                                                    $scope.isValidData = false;
                                                    angular.forEach(success.data.brokenRules, function (value, key) {
                                                        notificationService.displayError(value.rule);
                                                    });
                                                }
                                            },
                                       function (error) {
                                           fogLoading('fog-modal-small', 'none');
                                           $scope.isValidData = false;
                                           notificationService.displayError('Cập nhật văn bản không thành công');
                                          
                                       });
                                }, function (error) {
                                    fogLoading('fog-modal-small', 'none');
                                    $scope.isValidData = false;
                                    
                                });
                        }
                        else if (success.data.isSuccess == false) {
                            fogLoading('fog-modal-small', 'none');
                            $scope.isValidData = false;
                            angular.forEach(success.data.brokenRules, function (value, key) {
                                notificationService.displayError(value.rule);
                                if (value.propertyName != "") {
                                    switch (value.propertyName) {
                                        case 'SignedBy':
                                            focus('txtSignedBy')
                                            break;
                                        case 'DocumentDate':
                                            focus('txtDocumentDate');
                                            break;
                                        case 'AttachmentName':
                                            focus('fileAttachment');
                                            break;
                                        case 'Title':
                                            focus('txtTitle')
                                            break;
                                        default:
                                    }
                                }
                            });
                            if (success.data.message != null) notificationService.displayError(success.data.message);
                        }
                    }, function (error) {
                        fogLoading('fog-modal-small', 'none');
                        $scope.isValidData = false;
                        notificationService.displaySuccess('Thêm mới văn bản không thành công');
                    });
            }
        }

        $scope.saveAll = function (type) {
            fogLoading('fog-modal-small', 'block');
            if ($scope.documentReceived.externalFromDivisionId == null && $scope.action == "Add") {
                var externalSelectedNew = {
                    title: $scope.documentReceived.externalFromDivision,
                    receivedDocument: true,
                    active: true,
                    deleted: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId,
                    editedOn: dateformatService.addMoreHours(new Date()),
                    editedBy: $scope.authentication.userId,
                    departmentId: parseInt($scope.authentication.departmentId)
                }
                apiService.post($scope.baseUrl + 'api/ExternalSendReceiveDivision/Add', externalSelectedNew,
                    function (resultExternal) {
                        // kiem tra xem nguoi ki co chua.
                        if (resultExternal.data.isSuccess == true) {
                            $scope.documentReceived.externalFromDivisionId = resultExternal.data.value.id;
                            if ($scope.documentReceived.signedById == null) {
                                var singedNew = {
                                    fullName: $scope.documentReceived.signedBy,
                                    departmentId: parseInt($scope.authentication.departmentId),
                                    receivedDocument: true,
                                    active: true,
                                    deleted: false,
                                    createdOn: dateformatService.addMoreHours(new Date()),
                                    createdBy: $scope.authentication.userId,
                                    editedOn: dateformatService.addMoreHours(new Date()),
                                    editedBy: $scope.authentication.userId
                                }
                                apiService.post($scope.baseUrl + 'api/DocumentSignedBy/Add', singedNew,
                                    function (resultSigned) {
                                        if (resultSigned.data.isSuccess == true) {
                                            $scope.documentReceived.signedById = resultSigned.data.value.id;
                                            $scope.save(type);
                                        }
                                        else {
                                            fogLoading('fog-modal-small', 'none');
                                            $scope.isValidData = false;
                                            angular.forEach(resultSigned.brokenRules, function (value, key) {
                                                notificationService.displayError(value.rule);
                                            });
                                        }
                                    }, function (error) {
                                        fogLoading('fog-modal-small', 'none');
                                        $scope.isValidData = false;
                                        notificationService.displayError(error);
                                    });
                            }
                            else {
                                // Đã có người kí thì thêm văn bản
                                $scope.save(type);
                            }
                        }
                        else {
                            fogLoading('fog-modal-small', 'none');
                            $scope.isValidData = false;
                            angular.forEach(resultExternal.brokenRules, function (value, key) {
                                notificationService.displayError(value.rule);
                            });
                        }
                    },
                    function (error) {
                        fogLoading('fog-modal-small', 'none');
                        $scope.isValidData = false;
                        notificationService.displayError(error);
                    });
            }
            else if ($scope.documentReceived.signedById == null && $scope.action == "Add") {
                var singedNew = {
                    fullName: $scope.documentReceived.signedBy,
                    departmentId: parseInt($scope.authentication.departmentId),
                    receivedDocument: true,
                    active: true,
                    deleted: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId,
                    editedOn: dateformatService.addMoreHours(new Date()),
                    editedBy: $scope.authentication.userId
                }
                apiService.post($scope.baseUrl + 'api/DocumentSignedBy/Add', singedNew,
                                    function (resultSigned) {
                                        if (resultSigned.data.isSuccess == true) {
                                            $scope.documentReceived.signedById = resultSigned.data.value.id;
                                            $scope.save(type);
                                        }
                                        else {
                                            fogLoading('fog-modal-small', 'none');
                                            $scope.isValidData = false;
                                            angular.forEach(resultSigned.brokenRules, function (value, key) {
                                                notificationService.displayError(value.rule);
                                            });
                                        }
                                    }, function (error) {
                                        fogLoading('fog-modal-small', 'none');
                                        $scope.isValidData = false;
                                        notificationService.displayError(error);
                                    });
            }
            else {
                $scope.save(type);
            }
        }
        $scope.isValidData = false;
        $scope.saveAndClose = function () {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật văn bản này không?')
                            .then(function () {
                                $scope.isValidData = true;
                                $scope.uploadFile("SaveAndClose");
                            });
        }

        $scope.saveAndAdd = function () {
            $scope.uploadFile("SaveAndAdd");
        }
        // end save to database
        function getDocumentFieldEdit() {
            if ($scope.action == "Edit") {
                apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/GetDocFieldDeaprtmentByDocIdAndReceivedDoc?documentId=' + $scope.documentReceived.id + '&receivedDocument=true', null,
                    function (result) {
                        if (result.data.isSuccess == true) {
                            $scope.documentFields = result.data.data;

                        }
                    },
                    function () {
                    });
            }
        }

        function initData() {
            $scope.departmentConfig = {
                departmentId: parseInt($scope.authentication.departmentId),
                parentDepartmentId: parseInt($scope.authentication.parentDepartmentId),
                office: ($scope.authentication.office == "True")
            }
            $scope.receivedDocument = ($stateParams.receivedDocument == "1");

            $scope.listSecretLevel = [
                 { name: 'Thường', id: 0 },
                 { name: 'Mật', id: 1 },
                 { name: 'Tối mật', id: 2 },
                 { name: 'Tuyệt mật', id: 3 }
            ];

            $scope.listUrgencyLevel = [
                 { name: 'Thường', id: 0 },
                 { name: 'Khẩn', id: 1 },
                 { name: 'Thượng khẩn', id: 2 },
                 { name: 'Hỏa tốc', id: 2 }
            ];

            $scope.action = "Add";
            var id = 0

            if ($stateParams.id != null) {
                id = parseInt($stateParams.id);
                $scope.action = "Edit";
                $scope.showlink = true;
            }
            else {
                $scope.showlink = false;
            }

            getDocumentReceived(id, function loadDocumentReceived(result) {
                $scope.documentReceived = result.data.value;
                $scope.secretLevel = $scope.listSecretLevel[0];
                $scope.urgencyLevel = $scope.listUrgencyLevel[0];
                if ($scope.documentReceived.originalSavingPlace != null) $scope.originalSavingPlace = $scope.documentReceived.originalSavingPlace.replace(/<br\s*\/?>/gi, '\n');
                if ($scope.documentReceived.note != null) $scope.note = $scope.documentReceived.note.replace(/<br\s*\/?>/gi, '\n');
                $scope.receivedDateString = id != 0 ? dateformatService.formatToDDMMYY(new Date($scope.documentReceived.receivedDate)) : dateformatService.formatToDDMMYY(new Date());
                $scope.documentDateString = id != 0 ? dateformatService.formatToDDMMYY(new Date($scope.documentReceived.documentDate)) : "";
                if (id != 0) {
                    var secretLevel = $scope.listSecretLevel.filter(function (item) {
                        return item.id == $scope.documentReceived.secretLevel;
                    });
                    if (secretLevel.length > 0) {
                        $scope.secretLevel = secretLevel[0];
                    }
                    else {
                        $scope.secretLevel = $scope.listSecretLevel[0];
                    }
                    var urgencyLevel = $scope.listUrgencyLevel.filter(function (item) {
                        return item.id == $scope.documentReceived.urgencyLevel;
                    });
                    if (urgencyLevel.length > 0) {
                        $scope.urgencyLevel = urgencyLevel[0];
                    }
                    else {
                        $scope.urgencyLevel = $scope.listUrgencyLevel[0];
                    }
                    apiService.get($rootScope.baseUrl + 'api/DocumentRecipent/GetListRecipentsByDocIdAndReceivedDoc?documentId=' + $scope.documentReceived.id + '&receivedDocument=true', null,
                        function (success) {
                            if (success.data.isSuccess == true) {
                                $scope.departmentSelectedId = new Array();
                                angular.forEach(success.data.data, function (value, key) {
                                    var obj = {};
                                    if (value.departmentId != null) {
                                        obj.id = value.departmentId.toString();
                                        obj.isStaff = "false"
                                    }
                                    else {
                                        if (value.userId != $scope.authentication.userId) {
                                            obj.id = value.userId
                                            obj.isStaff = "true"
                                        }
                                    }
                                    if (obj.id != null) {
                                        $scope.departmentSelectedId.push(obj)
                                    }
                                   
                                });
                            }
                            else {

                            }
                        }, function (error) {
                           
                        });
                }
                else {
                    $scope.loadDocumentField();
                }

                $scope.getExternalSendReceiveDivision = getExternalSendReceiveDivision;
                $scope.getDocumentSignedBy = getDocumentSignedBy;
                $scope.getDocumentType = getDocumentType;
                $scope.getExternalSendReceiveDivision();
                $scope.getDocumentSignedBy();
                $scope.getDocumentType();
                $scope.loadDocumentField();
                getDocumentFieldEdit();
            });

        }
        $scope.initData = initData;
        $scope.initData();


        ///validation anguautocomplete empty
        $scope.focusIn = function () {
            $scope.documentReceivedAddOrEdit._externalDivision.$pristine = false;
            if ($scope.documentReceived.externalFromDivision != null) {
                if ($scope.documentReceived.externalFromDivision.replace(/\s/g, "") == "") {
                    $scope.documentReceivedAddOrEdit._externalDivision.$invalid = false;
                    
                }
                else {
                    $scope.documentReceivedAddOrEdit._externalDivision.$invalid = false;
                    $scope.documentReceivedAddOrEdit._externalDivision.$pristine = false;
                }
            }
            else {
                $scope.documentReceivedAddOrEdit._externalDivision.$invalid = false;
            }
        }

        $scope.focusOut = function () {
            // 
            if ($scope.documentReceived.externalFromDivision != null) {
                if ($scope.documentReceived.externalFromDivision.replace(/\s/g, "") == "") {
                    $scope.documentReceivedAddOrEdit._externalDivision.$invalid = true;
                    $scope.documentReceivedAddOrEdit._externalDivision.$pristine = false;
                }
                else {
                    $scope.documentReceivedAddOrEdit._externalDivision.$invalid = true;
                    $scope.documentReceivedAddOrEdit._externalDivision.$pristine = true;
                }
            }
            else {
                $scope.documentReceivedAddOrEdit._externalDivision.$invalid = true;
                $scope.documentReceivedAddOrEdit._externalDivision.$pristine = false;
            }
        }

        $scope.focusInDocumentSignBy = function () {
            $scope.documentReceivedAddOrEdit._documentSignBy.$pristine = false;
            if ($scope.documentReceived.signedBy != null) {
                if ($scope.documentReceived.signedBy.replace(/\s/g, "") == "") {
                    $scope.documentReceivedAddOrEdit._documentSignBy.$invalid = false;
                }
                else {
                    $scope.documentReceivedAddOrEdit._documentSignBy.$invalid = false;
                    $scope.documentReceivedAddOrEdit._documentSignBy.$pristine = false;
                }
            }
            else {
                $scope.documentReceivedAddOrEdit._documentSignBy.$invalid = false;
            }
        }

        $scope.focusOutDocumentSignBy = function () {
            if ($scope.documentReceived.signedBy != null) {
                if ($scope.documentReceived.signedBy.replace(/\s/g, "") == "") {
                    $scope.documentReceivedAddOrEdit._documentSignBy.$invalid = true;
                    $scope.documentReceivedAddOrEdit._documentSignBy.$pristine = false;
                }
                else {
                    $scope.documentReceivedAddOrEdit._documentSignBy.$invalid = true;
                    $scope.documentReceivedAddOrEdit._documentSignBy.$pristine = true;
                }
            }
            else {
                $scope.documentReceivedAddOrEdit._documentSignBy.$invalid = true;
                $scope.documentReceivedAddOrEdit._documentSignBy.$pristine = false;
            }
        }

        $scope.addTagsDocumetnField = function (tag) {
            
            if ($scope.documentFields != null) {
                if ($scope.documentFields.length > 0) {
                    if (tag.id == null) {
                        $scope.documentFields.splice($scope.documentFields.indexOf(tag), 1);
                    }
                }
            }
            else {
                if (tag.id == null) {
                    $scope.documentFields = [];
                }
            }
        }
        $scope.blurReceivedDateString = function () {
            if ($scope.receivedDateString == null) {
                $scope.receivedDateString = dateformatService.formatToDDMMYY(new Date())
            }
        }

    }
})(angular.module('VOfficeApp.documentReiceived'));