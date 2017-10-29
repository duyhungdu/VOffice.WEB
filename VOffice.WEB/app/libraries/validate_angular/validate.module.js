(function () {
	angular.module('VOfficeApp.validate_angular', ['VOfficeApp.common'])
            .config(config);
	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('doctypes', {
			url: "/doctypes",
			parent: 'base',
			templateUrl: "app/components/doctypes/docTypeListView.html",
			controller: "docTypeListController"
		}).state('add_edit_docType', {
			url: "/add_edit_docType/:id",
			parent: 'base',
			templateUrl: "app/components/doctypes/docTypeAddOrEditView.html",
			controller: "docTypeAddOrEditController"
		});
	}
})();
