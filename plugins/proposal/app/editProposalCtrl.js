app.controller('editProposalCtrl', function ($scope, $location, $routeParams,Data, cssInjector) { 
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	var proposal_id = $routeParams.proposal_id;
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
	
	$scope.proposalData = {};
	
	$scope.getProposal = function(proposal_id) {
    	Data.get('proposals/'+proposal_id).then(function(data){
    		$scope.proposalData  = data.data;
    	});
	};
	
	if(proposal_id > 0){
		$scope.getProposal(proposal_id);
	} else {
		
	}
	
	
});
