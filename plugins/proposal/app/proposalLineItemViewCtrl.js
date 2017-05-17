app.controller('proposalLineItemViewCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) { 
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
     });
	$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
     });
		
	var proposal_id = $routeParams.id;
	$scope.isActive = function (viewLocation) { 
       return viewLocation === $location.path();
   };
	
	$scope.proposalData = {};
	$scope.lineItems=[];
	var isEditLineItem=false;
	
	$scope.getProposal = function(proposal_id) {
   	Data.get('proposals/'+proposal_id).then(function(data){
   	$scope.proposalData  = data.data;
   	var tempData = angular.copy(data.data);
   	$scope.proposalData.startDate = String(new Date(tempData.startDate)).substring(0,21);
   	$scope.proposalData.endDate  = String(new Date(tempData.endDate)).substring(0,21);
   	$scope.proposalData.requestedOn  = String(new Date(tempData.requestedOn)).substring(0,21);
   	$scope.proposalData.dueOn  = String(new Date(tempData.dueOn)).substring(0,21);
		$scope.lineItems= data.data.lineItems;
		$scope.totalItems = $scope.lineItems.length;
		$scope.currentPage = 1; // current page
       $scope.entryLimit = 10; // max no of items to display in a page
        $scope.sort_by('id');
   	});
	};
	
	$scope.sort_by = function(predicate) {
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
	
	
	if(proposal_id > 0){
		$scope.getProposal(proposal_id);
	} else {
		
	}
	$scope.editPropsal = function(proposal_id) {
		 $location.path('/proposal/create-proposal/'+proposal_id);
	};

});
