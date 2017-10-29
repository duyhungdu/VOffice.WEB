(function (app) {
    app.factory('notificationService', notificationService);

    notificationService.$inject = ['fogLoading'];

    function notificationService(fogLoading) {
        toastr.options = {
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": 3000,
            "extendedTimeOut": 1000
        };

        function displaySuccess(message) {
            fogLoading('fog-modal', 'none');
            toastr.success(message)
        }
        function displayError(error) {
            if (Array.isArray(error)) {
                error.each(function (err) {
                    fogLoading('fog-modal', 'none');
                    toastr.error(err);
                });
            }
            else {
                toastr.error(error);
            }
        }
        function displayWarning(message) {
            fogLoading('fog-modal', 'none');
            toastr.warning(message);
        }
        function displayInfo(message) {
            fogLoading('fog-modal', 'none');
            toastr.info(message);
        }

        return {
            displaySuccess: displaySuccess,
            displayError: displayError,
            displayWarning: displayWarning,
            displayInfo: displayInfo
        }

    }
})(angular.module('VOfficeApp.common'));