
(function (app) {
    app.controller('documentDeliveredAddOrEditController', documentDeliveredAddOrEditController);

    app.controller('modelDepartmentDeliveredController', modelDepartmentDeliveredController);

    modelDepartmentDeliveredController.$inject = ['$uibModalInstance', '$rootScope', 'apiService',
                                          'notificationService', 'functionDepartmentSelected',
                                          'functionDepartmentSelectedText', 'functionDepartmentSelectedId', 'functionDepartmentConfig',
                                          'functionEdit']
    function modelDepartmentDeliveredController($uibModalInstance, $rootScope, apiService, notificationService,
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
                    type: "delivered",
                    action: functionEdit.action
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
                   var rootTree = [];
                   if (configDepartment.params.action == "Edit") {
                       rootTree = result.data.data.filter(function (item) { return item.id == configDepartment.params.departmentId; });
                   } else {
                       rootTree = result.data.data.filter(function (item) { return item.parentId == 0; });
                   }

                   angular.forEach($ctrl.department, function (value, key) {

                       if (value.idData == rootTree[0].id) {
                           treePhongban.push({
                               id: value.id.toString(), data: {
                                   code: value.code,
                                   idData: value.idData.toString(),
                                   isStaff: value.isStaff,
                                   root: value.root,
                                   shortName: value.shortName,
                                   office: value.office,
                                   internalDivision: (value.root == 1 && value.idData.toString() == functionDepartmentConfig.departmentId)
                               }, parent: "#", text: value.name, icon: "/", state: { open: true }
                           });
                       }
                       else {
                           if ($ctrl.departmentSelected != null) {
                               var exsit = $.inArray(value.code, $ctrl.departmentSelectedId)
                               if (exsit == -1) {
                                   treePhongban.push({
                                       id: value.id.toString(), data: {
                                           code: value.code,
                                           idData: value.idData.toString(),
                                           isStaff: value.isStaff,
                                           root: value.root,
                                           shortName: value.shortName,
                                           office: value.office,
                                           internalDivision: (value.root == 1 && value.idData.toString() == functionDepartmentConfig.departmentId)
                                       }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { open: false }
                                   });
                               }
                               else {
                                   treePhongban.push({
                                       id: value.id.toString(), data: {
                                           code: value.code,
                                           idData: value.idData.toString(),
                                           isStaff: value.isStaff,
                                           root: value.root,
                                           shortName: value.shortName,
                                           office: value.office,
                                           internalDivision: (value.root == 1 && value.idData.toString() == functionDepartmentConfig.departmentId)
                                       }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { open: false, selected: true }
                                   });
                               }
                           }
                           else {
                               treePhongban.push({
                                   id: value.id.toString(), data: {
                                       code: value.code,
                                       idData: value.idData.toString(),
                                       isStaff: value.isStaff,
                                       root: value.root,
                                       shortName: value.shortName,
                                       office: value.office,
                                       internalDivision: (value.root == 1 && value.idData.toString() == functionDepartmentConfig.departmentId)
                                   }, parent: value.parentId.toString(), text: value.name, icon: "/", state: { open: false }
                               });
                           }
                       }

                   });
                   if (configDepartment.params.action == "Edit") {
                       $('#departmentSelected').html(functionEdit.departmentSelectedText);
                       apiService.get($rootScope.baseUrl + 'api/DocumentRecipent/GetListRecipentsByDocIdAndReceivedDoc?documentId=' + functionEdit.documentId + '&receivedDocument=false', null,
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
                       // document.getElementById("departmentSelected").value = $ctrl.departmentSelected + "<br>";
                       //console.log($ctrl.departmentSelected);
                       //c//onsole.log(objselectedId);
                   })
               },
               function (error) {
                   //console.log(error);
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

    documentDeliveredAddOrEditController.$inject = ['$scope',
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
                                                  '$ngBootbox',
                                                  '$window',
                                                  'fogLoading']

    function documentDeliveredAddOrEditController($scope,
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
                                    $ngBootbox,
                                    $window,
                                    fogLoading) {

        //console.log($stateParams.typeOfDocument);
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
        $scope.documentReceiveds = [];// add array document received to database using one apiservice post

        // file upload
        function getFolderSaveFile() {
            var folderName = $scope.authentication.departmentShortName + "/DocumentDelivered/";
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
                if ($scope.signedBy == null || $scope.signedBy[0].id == 0) {
                    notificationService.displayError('Bạn chưa chọn người kí');
                    return;
                }

                $http.post($rootScope.baseUrl + "api/FileUpload/PostAsync", data,
                    {
                        headers:
                            { 'Content-Type': undefined }
                    }).then(
                    function (response) {
                        if (response.data.isSuccess == true) {
                            $scope.documentDelivered.attachmentPath = response.data.message;
                            var n = $scope.documentDelivered.attachmentPath.lastIndexOf("/");
                            $scope.documentDelivered.attachmentName = response.data.message.substring(n + 1, $scope.documentDelivered.attachmentPath.length);
                            // tai file thanh cong thi save
                            fogLoading('fog-modal-small', 'block');
                            $scope.isValidData = true;
                            $scope.saveAll(type);
                        } else {
                            notificationService.displayError(response.data.message);
                        }
                    },
                    function (error) {
                        console.log("Error while invoking the Web API");
                    });
            } else {
                if ($scope.action == "Edit") {
                    $scope.saveAll(type);
                }
                else {
                    fogLoading('fog-modal-small', 'none');
                    $scope.isValidData = false;
                    notificationService.displayError("Bạn chưa chọn tệp đính kèm.")
                    focus('fileAttachment');
                }
            }

        }
        // end file upload
        $scope.bindList = function () {
            $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(
                function () {
                    $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                });
        }

        function fetchDocumentFieldForDocumentDelivery(documentFieldDelivery, documentDeliveryId) {
            $scope.selectedDocumentFieldsForDocumentReceived = [];
            angular.forEach(documentFieldDelivery, function (value, key) {
                var newField = {
                    documentId: documentDeliveryId,
                    documentFieldDepartmentId: parseInt(value.documentFieldId),
                    receivedDocument: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId
                }
                $scope.selectedDocumentFieldsForDocumentReceived.push(newField);
            });
        }

        function fetchDocumentFieldForDivision(documentFieldForDivision, documentId) {
            $scope.selectedDocumentFieldsForDivision = [];
            angular.forEach(documentFieldForDivision, function (value, key) {
                var newField = {
                    documentId: documentId,
                    documentFieldDepartmentId: parseInt(value.documentFieldId),
                    receivedDocument: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId
                }
                $scope.selectedDocumentFieldsForDivision.push(newField);
            });
        }

        function createDocumentReceivedRecipent(departmentId, documentReceivedId) {
            var documentRecipent = {};
            // tao moi cho van thu van phong
            documentRecipent = {
                documentId: documentReceivedId,
                departmentId: departmentId,
                receivedDocument: true,
                forwarded: false,
                assigned: false,
                addedDocumentBook: false,
                createdOn: dateformatService.addMoreHours(new Date()),
                createdBy: $scope.authentication.userId,
                forSending: true
            };
            return documentRecipent;
        }

        function fetchDocumentField(documentFields) {
            $scope.selectedDocumentFields = [];
            angular.forEach(documentFields, function (value, key) {
                var newField = {
                    documentFieldDepartmentId: parseInt(value.id),
                    receivedDocument: false,
                    createdOn: dateformatService.addMoreHours(new Date()),
                    createdBy: $scope.authentication.userId
                }
                $scope.selectedDocumentFields.push(newField);
            });
        }

        function fetchDocumentRecipent(departmentIds) {
            $scope.divisionReceivedFromOffice = new Array();
            $scope.documentRecipents = new Array();

            var documentRecipent = {};
            //create document delivered for user id            
            documentRecipent = {
                userId: $scope.authentication.userId,
                receivedDocument: false,
                forwarded: false,
                assigned: false,
                addedDocumentBook: true,
                createdOn: dateformatService.addMoreHours(new Date()),
                createdBy: $scope.authentication.userId,
                forSending: false
            };
            $scope.documentRecipents.push(documentRecipent);
            var found = [];
            //end create recipent delivered
            if ($scope.departmentSelected.length > 0) {
                found = $scope.departmentSelected.filter(function (item) {
                    return item.data.root == 1 && item.data.internalDivision == false
                });
                $scope.divisionReceivedFromOffice = found;
            }
            //select all division received


            // create recipent for delivered for internal divison
            angular.forEach(departmentIds, function (value, key) {
                if (value.isStaff == "false") {
                    var obj = {};
                    if (found.length > 0) {
                        obj = found.filter(function (item) {
                            return item.id == value.id
                        });
                        if (obj.length == 0) {
                            documentRecipent = {
                                departmentId: parseInt(value.id),
                                receivedDocument: false,
                                forwarded: false,
                                assigned: false,
                                addedDocumentBook: true,
                                createdOn: dateformatService.addMoreHours(new Date()),
                                createdBy: $scope.authentication.userId,
                                forSending: false
                            };
                            $scope.documentRecipents.push(documentRecipent);
                        }
                    } else {
                        documentRecipent = {
                            departmentId: parseInt(value.id),
                            receivedDocument: false,
                            forwarded: false,
                            assigned: false,
                            addedDocumentBook: true,
                            createdOn: dateformatService.addMoreHours(new Date()),
                            createdBy: $scope.authentication.userId,
                            forSending: false
                        };
                        $scope.documentRecipents.push(documentRecipent);
                    }
                } else if (value.isStaff == "true") {
                    documentRecipent = {
                        userId: value.id,
                        receivedDocument: false,
                        forwarded: false,
                        assigned: false,
                        addedDocumentBook: true,
                        createdOn: dateformatService.addMoreHours(new Date()),
                        createdBy: $scope.authentication.userId,
                        forSending: false
                    };
                    $scope.documentRecipents.push(documentRecipent);
                }
            });
        }

        $scope.loadStaff = function ($query) {
            var listStaff = $scope.documentSignedBy;

            return listStaff.filter(function (staff) {
                console.log(staff);
                return staff.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        };

        $scope.forceOneTag = function (tags) {
            if ($scope.signedBy != null) {
                var array = $scope.signedBy;
                if (array.length > 1) {
                    var objRemove = {};
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].aspNetUserId == tags.aspNetUserId) {
                            objRemove = array[i];
                            array.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.signedBy = array;
                }
            }
            else {

            }
        }
        $scope.resetForm = function () {
            $scope.documentDelivered.id = 0;
            $scope.documentDelivered.documentNumber = "";
            $scope.documentDelivered.receivedNumber = "";
            $scope.documentDelivered.title = "";
            $scope.documentDelivered.documentDateString = "";
            $scope.documentDelivered.departmentId = 0;
            $scope.documentDelivered.externalReceiveDivisionId = 0;
            $scope.documentDelivered.externalReceiveDivision = "";
            $scope.documentDelivered.recipientsDivision = "";
            $scope.documentDelivered.signedById = 0;
            $scope.documentDelivered.signedBy = "";
            $scope.documentDelivered.documentTypeId = 0;
            $scope.documentDelivered.addedDocumentBook = false;
            $scope.documentDelivered.numberOfCopies = 1;
            $scope.documentDelivered.numberOfPages = 1;
            $scope.documentDelivered.secretLevel = 0;
            $scope.documentDelivered.urgencyLevel = 0;
            $scope.documentDelivered.note = "";

            $scope.documentDelivered.originalSavingPlace = "";
            $scope.documentDelivered.legalDocument = false;
            $scope.documentDelivered.attachmentName = "";
            $scope.documentDelivered.attachmentPath = "";
            $scope.documentDelivered.deliveredDocumentId = 0;
            $scope.documentDelivered.receivedDocumentId = 0;
            $scope.initialExternalDivision = "";
            $scope.initialDocumentSignBy = "";
            $scope.documentFields = [];
            $scope.documentDateString = "";
            $scope.selectedDocumentType = { id: 0 };

            $window.location.reload();
            if ($scope.action == "Edit") {
                $stateParams.id = 0;
            }
        }

        function getDocumentDelivered(id, callback) {
            if (id == 0) {
                var obj = {};

                obj.id = 0;
                obj.numberOfCopies = 1;
                obj.numberOfPages = 1;

                obj.recipientsDivision = "";
                obj.attachmentName = "";
                var result = { data: { value: {} } };
                result.data.value = obj;
                callback(result);
            }
            else {
                if (id != 0) {
                    if ($scope.receivedDocument == false) {
                        apiService.get($rootScope.baseUrl + 'api/DocumentDelivered/Get/' + parseInt($stateParams.id), null,
                            function (result) {
                                if (result.data.isSuccess == true) {
                                    callback(result);
                                }
                                else {
                                    console.log("Lỗi không lấy được văn bản đi: " + result.data.message);
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

        function getExternalSendReceiveDivisionSelected(externalSendReceiveDivision) {
            if (externalSendReceiveDivision != null) {
                $scope.documentDelivered.externalReceiveDivision = externalSendReceiveDivision.title;
                $scope.documentDelivered.externalReceiveDivisionId = externalSendReceiveDivision.originalObject.id;
            }
            else {
                $scope.documentDelivered.externalReceiveDivisionId = null;
            }
        }

        $scope.documentSignByInputChanged = function (str) {
            if (str == "") {
                //$scope.documentDeliveredAddOrEdit.$invalid = true;
                //console.log($scope.documentDeliveredAddOrEdit._documentSignBy.invalid);
                $scope.documentDeliveredAddOrEdit._documentSignBy.invalid = true;
            }
            else {
                //$scope.documentDeliveredAddOrEdit.$invalid = false;
                ///console.log($scope.documentDeliveredAddOrEdit._documentSignBy.invalid);
                $scope.documentDeliveredAddOrEdit._documentSignBy.invalid = false;
            }
            $scope.documentDelivered.signedBy = str;
            //console.log($scope.documentReceived.signedBy);
        }

        $scope.externalSendReceiveDivisionInputChanged = function (str) {
            $scope.documentDelivered.externalReceiveDivision = str;
        }

        //$scope.selectedDocumentType = getDocumentTypeSelected;

        $scope.selectedExternalSendReceiveDivision = getExternalSendReceiveDivisionSelected;

        function getExternalSendReceiveDivision() {
            apiService.get($rootScope.baseUrl + 'api/ExternalSendReceiveDivision/GetByDepartment?departmentId=' + $scope.authentication.departmentId, null,
                function (result) {
                    $scope.externalSendReceiveDivision = result.data.data;
                    if ($scope.documentDelivered.externalReceiveDivisionId != null) {
                        angular.forEach(result.data.data, function (value, key) {
                            if (value.id == $scope.documentDelivered.externalReceiveDivisionId) {
                                $scope.initialExternalDivision = value.title;
                            }
                        });
                    }
                    if ($scope.initialExternalDivision == null) {
                        if ($scope.documentDelivered != null) $scope.initialExternalDivision = $scope.documentDelivered.externalReceiveDivision;
                    }
                },
                function (error) {
                    console.log(error);
                });
        }

        function getDocumentSignedBy() {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetByDepartment?departmentId=' + $scope.authentication.departmentId, null,
                function (result) {
                    $scope.documentSignedBy = result.data.data;
                    angular.forEach($scope.documentSignedBy, function (value, key) {
                        if (value.avatar != null && value.avatar != '') {
                            value.avatar = $rootScope.baseUrl + value.avatar;
                        }
                        else {
                            value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                        }
                    });
                    //console.log($scope.documentSignedBy);
                    if ($scope.documentDelivered.signedById != 0 || $scope.documentDelivered.signedById != null) {
                        angular.forEach(result.data.data, function (value, key) {
                            if (value.id == $scope.documentDelivered.signedById) {
                                $scope.initialDocumentSignBy = value.fullName;
                            }
                        });
                    }
                },
                function (error) {
                    console.log(error);
                });
        }

        function getDocumentType() {
            apiService.get($rootScope.baseUrl + 'api/DocumentType/getall', null,
                function (result) {
                    $scope.documentType = result.data.data;
                    if ($scope.action == "Edit") {
                        angular.forEach(result.data.data, function (value, key) {
                            if (value.id == $scope.documentDelivered.documentTypeId) {
                                $scope.selectedDocumentType = value;
                            }
                        });
                    }
                },
                function (error) {
                    console.log(error);
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
                controller: 'modelDepartmentDeliveredController',
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
                            documentId: $scope.documentDelivered.id,
                            departmentSelectedText: $scope.documentDelivered.recipientsDivision,
                            departmentSelectedIdEdit: $scope.departmentSelectedIdEdit,
                            userId: $scope.authentication.userId
                        };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.departmentSelected = selectedItem.departmentSelected;
                $scope.documentDelivered.recipientsDivision = selectedItem.departmentSelectedText;
                $scope.departmentSelectedId = selectedItem.departmentSelectedId;
                //console.log(selectedItem.departmentSelectedId);
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
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
                            documentId: $scope.documentDelivered.id,
                            departmentSelectedText: $scope.documentDelivered.recipientsDivision,
                            departmentSelectedIdEdit: $scope.departmentSelectedIdEdit,
                            userId: $scope.authentication.userId
                        };
                    }
                }
            })

            modalInstance.result.then(function (selectedItem) {
                $scope.departmentSelected = selectedItem.departmentSelected;
                $scope.documentDelivered.recipientsDivision = selectedItem.departmentSelectedText;
                $scope.departmentSelectedId = selectedItem.departmentSelectedId;
                //console.log(selectedItem.departmentSelectedId);
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        //end open choice Department

        // begin save to database

        function cloneDocumentReceived(documentDelivered, departmentId) {
            fogLoading('fog-modal-small', 'block');
            $scope.isValidData = true;
            $scope.documentReceived = {};
            $scope.documentReceived.documentNumber = documentDelivered.documentNumber;
            $scope.documentReceived.title = documentDelivered.title;
            $scope.documentReceived.documentDate = documentDelivered.documentDate;
            $scope.documentReceived.receivedDate = documentDelivered.deliveredDate;
            $scope.documentReceived.departmentId = departmentId;
            $scope.documentReceived.internalFromDivisionId = parseInt($scope.authentication.departmentId);
            $scope.documentReceived.recipientsDivision = documentDelivered.recipientsDivision;
            //$scope.documentReceived.signedById = documentDelivered.signedById;
            $scope.documentReceived.signedBy = documentDelivered.signedBy;
            $scope.documentReceived.documentTypeId = documentDelivered.documentTypeId;
            $scope.documentReceived.addedDocumentBook = false;
            $scope.documentReceived.numberOfCopies = documentDelivered.numberOfCopies;
            $scope.documentReceived.numberOfPages = documentDelivered.numberOfPages;
            $scope.documentReceived.secretLevel = documentDelivered.secretLevel;
            $scope.documentReceived.urgencyLevel = documentDelivered.urgencyLevel;
            $scope.documentReceived.externalFromDivision = $scope.authentication.departmentName; //documentDelivered.externalReceiveDivision;
            $scope.documentReceived.externalFromDivisionId = documentDelivered.externalReceiveDivisionId;
            $scope.documentReceived.note = documentDelivered.note;
            $scope.documentReceived.originalSavingPlace = documentDelivered.originalSavingPlace;
            $scope.documentReceived.legalDocument = documentDelivered.legalDocument;
            $scope.documentReceived.attachmentName = documentDelivered.attachmentName;
            $scope.documentReceived.attachmentPath = documentDelivered.attachmentPath;
            $scope.documentReceived.deliveredDocumentId = documentDelivered.id;
            $scope.documentReceived.active = true;
            $scope.documentReceived.deleted = false;
            $scope.documentReceived.createdOn = dateformatService.addMoreHours(new Date());
            $scope.documentReceived.createdBy = $scope.authentication.userId;
            $scope.documentReceived.editedOn = dateformatService.addMoreHours(new Date());
            $scope.documentReceived.editedBy = $scope.authentication.userId;

            // add document recipent;
            $scope.documentReceived.documentRecipents = [{
                departmentId: departmentId,
                receivedDocument: true,
                forwarded: false,
                assigned: false,
                addedDocumentBook: false,
                createdOn: dateformatService.addMoreHours(new Date()),
                createdBy: $scope.authentication.userId,
                forSending: true
            }];

            // add document field
            $scope.documentReceived.customDocumentFileds = [];
            angular.forEach($scope.documentFields, function (value, key) {
                var obj = {
                    documentFieldId: parseInt(value.id),
                    departmentId: parseInt($scope.authentication.departmentId)
                }
                $scope.documentReceived.customDocumentFileds.push(obj);
            });

            return $scope.documentReceived;
        }

        function saveDocumentReceived(documentDelivered, type) {
            if ($scope.divisionReceivedFromOffice.length > 0) {
                $scope.documentReceiveds = new Array();
                angular.forEach($scope.divisionReceivedFromOffice, function (value, key) {
                    var objDocumentReceived = cloneDocumentReceived(documentDelivered, parseInt(value.id));
                    $scope.documentReceiveds.push(objDocumentReceived);
                });
            }
            apiService.post($rootScope.baseUrl + 'api/DocumentReceived/AddSetOfDocumentReceived', $scope.documentReceiveds,
                function (result) {
                    if (result.data.isSuccess == true) {
                        notificationService.displaySuccess("Tạo mới văn bản đi thành công");
                        if (type == "SaveAndClose") {

                            $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                        } else {

                            $scope.resetForm();
                            $scope.focusDocumentNumber();
                        }

                    } else {
                        $scope.isValidData = false;
                        fogLoading('fog-modal-small', 'none');
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displaySuccess(value.rule);
                        });
                    }
                },
                function (error) {
                    $scope.isValidData = false;
                    fogLoading('fog-modal-small', 'none');
                });
        }

        $scope.save = function (type) {
            fetchDocumentRecipent($scope.departmentSelectedId);
            fetchDocumentField($scope.documentFields);
            $scope.isValidData = true;
            fogLoading('fog-modal-small', 'block');
            if ($scope.action == "Add") {
                if ($scope.originalSavingPlace != null) $scope.documentDelivered.originalSavingPlace = $scope.originalSavingPlace.replace(/\n\r?/g, '<br />');
                if ($scope.note != null) $scope.documentDelivered.note = $scope.note.replace(/\n\r?/g, '<br />');
                $scope.documentDelivered.documentTypeId = $scope.selectedDocumentType.id;
                $scope.documentDelivered.documentDate = $scope.documentDateString.split("/").reverse().join("-");
                $scope.documentDelivered.deliveredDate = $scope.deliveredDateString.split("/").reverse().join("-");
                $scope.documentDelivered.departmentId = parseInt($scope.authentication.departmentId);
                $scope.documentDelivered.secretLevel = $scope.secretLevel.id;
                $scope.documentDelivered.urgencyLevel = $scope.urgencyLevel.id;
                $scope.documentDelivered.signedBy = $scope.signedBy[0].fullName;
                $scope.documentDelivered.signedById = $scope.signedBy[0].id;
                $scope.documentDelivered.active = true;
                $scope.documentDelivered.deleted = false;
                $scope.documentDelivered.createdOn = dateformatService.addMoreHours(new Date());
                $scope.documentDelivered.createdBy = $scope.authentication.userId;
                $scope.documentDelivered.editedOn = dateformatService.addMoreHours(new Date());
                $scope.documentDelivered.editedBy = $scope.authentication.userId;
                $scope.documentDelivered.documentRecipents = $scope.documentRecipents;
                $scope.documentDelivered.documentFields = $scope.selectedDocumentFields;
                if ($scope.divisionReceivedFromOffice.length > 0) {
                    $scope.documentDelivered.sendOut = true;
                }
                else
                {
                    $scope.documentDelivered.sendOut = false;
                }
                apiService.post($rootScope.baseUrl + 'api/DocumentDelivered/AddComplexDocumentDelivered', $scope.documentDelivered,
                    function (success) {
                        if (success.data.isSuccess == true) {
                            if ($scope.divisionReceivedFromOffice.length > 0) {
                                saveDocumentReceived(success.data.value, type);
                            } else {
                                notificationService.displaySuccess("Tạo mới văn bản đi thành công");
                                if (type == "SaveAndClose") {

                                    $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                                } else if (type == "SaveAndAdd") {

                                    $scope.resetForm();
                                    $scope.focusDocumentNumber();
                                }
                            }
                        }
                        else if (success.data.isSuccess == false) {
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
                                        case 'DocumentType':
                                            focus('txtDocumentType')
                                            break;
                                        default:
                                    }
                                }
                            });
                        }
                    }, function (error) {
                        $scope.isValidData = false;
                        fogLoading('fog-modal-small', 'none');
                        console.log(error);
                        notificationService.displaySuccess('Thêm mới văn bản không thành công');
                    });
            }
            else if ($scope.action == "Edit") {
                if ($scope.originalSavingPlace != null) $scope.documentDelivered.originalSavingPlace = $scope.originalSavingPlace.replace(/\n\r?/g, '<br />');
                if ($scope.note != null) $scope.documentDelivered.note = $scope.note.replace(/\n\r?/g, '<br />');
                $scope.documentDelivered.documentTypeId = $scope.selectedDocumentType.id;
                $scope.documentDelivered.documentDate = $scope.documentDateString.split("/").reverse().join("-");
                $scope.documentDelivered.deliveredDate = $scope.deliveredDateString.split("/").reverse().join("-");
                $scope.documentDelivered.departmentId = parseInt($scope.authentication.departmentId);
                $scope.documentDelivered.signedBy = $scope.signedBy[0].fullName;
                $scope.documentDelivered.signedById = $scope.signedBy[0].id;
                $scope.documentDelivered.active = true;
                $scope.documentDelivered.deleted = false;
                $scope.documentDelivered.editedOn = dateformatService.addMoreHours(new Date());
                $scope.documentDelivered.editedBy = $scope.authentication.userId;
                $scope.documentDelivered.documentRecipents = $scope.documentRecipents;
                $scope.documentDelivered.documentFields = $scope.selectedDocumentFields;
                $scope.documentDelivered.secretLevel = $scope.secretLevel.id;
                $scope.documentDelivered.urgencyLevel = $scope.urgencyLevel.id;
                apiService.put($rootScope.baseUrl + 'api/DocumentDelivered/UpdateComplexDocumentDelivered', $scope.documentDelivered,
                    function (success) {
                        if (success.data.isSuccess == true) {
                            notificationService.displaySuccess("Cập nhật văn bản đi thành công");
                            if (type == "SaveAndClose") {

                                $state.go('documentReceived', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, startDate: $stateParams.startDate, endDate: $stateParams.endDate, typeOfDocument: $stateParams.typeOfDocument });
                            }
                            else {

                                $scope.resetForm();
                                $scope.action = "Add";
                                $scope.focusDocumentNumber();
                            }
                        }
                        else if (success.data.isSuccess == false) {
                            $scope.isValidData = false;
                            fogLoading('fog-modal-small', 'none');
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
                        }
                    }, function (error) {
                        $scope.isValidData = false;
                        fogLoading('fog-modal-small', 'none');
                        notificationService.displaySuccess('Thêm mới văn bản không thành công');
                    });
            }
        }

        $scope.saveAll = function (type) {

            $scope.save(type);
        }

        $scope.saveAndClose = function () {
            if ($scope.action == "Edit") {
                $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật văn bản này?')
                            .then(function () {

                                $scope.uploadFile("SaveAndClose");
                            });
            } else {
                $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật văn bản này?')
                           .then(function () {

                               $scope.uploadFile("SaveAndClose");
                           });

            }
        }

        $scope.saveAndAdd = function () {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật văn bản này?')
                           .then(function () {
                               $scope.uploadFile("SaveAndAdd");
                           });

        }
        // end save to database
        function getDocumentFieldEdit() {
            if ($scope.action == "Edit") {
                apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/GetDocFieldDeaprtmentByDocIdAndReceivedDoc?documentId=' + $scope.documentDelivered.id + '&receivedDocument=false', null,
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

            //var docDate;
            //$scope.$watch('documentDateString', function (value) {
            //    try {
            //        docDate = new Date(value);
            //    } catch (e) { }

            //    if (!docDate) {
            //        $scope.errorDocDate = true;
            //    } else {
            //        $scope.errorDocDate = false;
            //    }
            //});

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

            getDocumentDelivered(id, function loadDocumentDeliverd(result) {
                $scope.documentDelivered = result.data.value;
                if ($scope.documentDelivered.originalSavingPlace != null) $scope.originalSavingPlace = $scope.documentDelivered.originalSavingPlace.replace(/<br\s*\/?>/gi, '\n');
                if ($scope.documentDelivered.note != null) $scope.note = $scope.documentDelivered.note.replace(/<br\s*\/?>/gi, '\n');
                $scope.deliveredDateString = id != 0 ? dateformatService.formatToDDMMYY(new Date($scope.documentDelivered.deliveredDate)) : dateformatService.formatToDDMMYY(new Date());
                $scope.documentDateString = id != 0 ? dateformatService.formatToDDMMYY(new Date($scope.documentDelivered.documentDate)) : "";

                if (id != 0) {
                    var secretLevel = $scope.listSecretLevel.filter(function (item) {
                        return item.id == $scope.documentDelivered.secretLevel;
                    });
                    if (secretLevel.length > 0) {
                        $scope.secretLevel = secretLevel[0];
                    }
                    else {
                        $scope.secretLevel = $scope.listSecretLevel[0];
                    }
                    var urgencyLevel = $scope.listUrgencyLevel.filter(function (item) {
                        return item.id == $scope.documentDelivered.urgencyLevel;
                    });
                    if (urgencyLevel.length > 0) {
                        $scope.urgencyLevel = urgencyLevel[0];
                    }
                    else {
                        $scope.urgencyLevel = $scope.listUrgencyLevel[0];
                    }

                    apiService.get($rootScope.baseUrl + 'api/DocumentRecipent/GetListRecipentsByDocIdAndReceivedDoc?documentId=' + $scope.documentDelivered.id + '&receivedDocument=false', null,
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
                                    //console.log($scope.departmentSelectedId);
                                });
                            }
                            else {

                            }
                        }, function (error) {
                            $scope.isValidData = false;
                            fogLoading('fog-modal-small', 'none');
                            //console.log(error);
                        });
                }
                else {
                    $scope.secretLevel = $scope.listSecretLevel[0];
                    $scope.urgencyLevel = $scope.listUrgencyLevel[0];
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

        $scope.focusInDocumentSignBy = function () {
            $scope.documentDeliveredAddOrEdit._documentSignBy.$pristine = false;
            if ($scope.documentDelivered.signedBy != null) {
                if ($scope.documentDelivered.signedBy.replace(/\s/g, "") == "") {
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$invalid = false;
                    //$scope.documentDeliveredAddOrEdit._documentSignBy.$pristine = true;
                }
                else {
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$invalid = false;
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$pristine = false;
                }
            }
            else {
                $scope.documentDeliveredAddOrEdit._documentSignBy.$invalid = false;
            }
        }

        $scope.focusOutDocumentSignBy = function () {
            if ($scope.documentDelivered.signedBy != null) {
                if ($scope.documentDelivered.signedBy.replace(/\s/g, "") == "") {
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$invalid = true;
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$pristine = false;
                }
                else {
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$invalid = true;
                    $scope.documentDeliveredAddOrEdit._documentSignBy.$pristine = true;
                }
            }
            else {
                $scope.documentDeliveredAddOrEdit._documentSignBy.$invalid = true;
                $scope.documentDeliveredAddOrEdit._documentSignBy.$pristine = false;
            }
        }

        $scope.addTagsDocumetnField = function (tag) {
            //console.log($scope.documentFields);
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

        $scope.blurDeliveredDateString = function () {
            if ($scope.deliveredDateString == null || $scope.deliveredDateString == "") {
                $scope.deliveredDateString = dateformatService.formatToDDMMYY(new Date());
            }
        }
    }
})(angular.module('VOfficeApp.documentReiceived'));