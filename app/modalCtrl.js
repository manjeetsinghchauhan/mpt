app.controller('ModalController',function($scope, close) {
	$scope.warnigMsg = 'Are you sure you want to delete this record?';
	$scope.editWarnigMsg = 'Please fill in all required fields';
	$scope.changeStatusMsg = 'Are you sure you want to change the current status?';

	$scope.close = function(result) {
	 	close(result, 500); // close, but give 500ms for bootstrap to animate
	 };
});