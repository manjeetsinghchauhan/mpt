app.controller('createUpdateCompainsCtrl', function ($scope, $location, $rootScope, $routeParams, Data, cssInjector,$http) { 
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	$scope.getProposalMessageProperties = function (){
		$http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
			var propertyMessage = {};
			$scope.propertyMessage = response.data;
	      });
	};
	$scope.getProposalMessageProperties();
	$(document).ready(function () {
		 $('#requestedOn').datetimepicker();
		 $('#dueOn').datetimepicker();
		 $('#startDate').datetimepicker();
		 $('#endDate').datetimepicker();
   
    });
	
	
	$scope.accountManagerList = [
	                             { value: 'jason holder', label: 'Jason Holder'},
	                            { value: 'ricky martin', label: 'Ricky Martin'},
	                            { value: 'tom carey', label: 'Tom Carey'}
	                           ];
	$scope.salesCategoryList = [
	                            { value: 'Life Style', label: 'Life Style'},
	                            { value: 'Sports', label: 'Sports'},
	                            { value: 'Technology ', label: 'Technology '}
                       ];
	$scope.proposalCurrencyList = [
	                               	{ value: 'AUD', label: 'AUD'},
	                               	{ value: 'CAD', label: 'CAD'},
	                               	{ value: 'CHF', label: 'CHF'},
	                               	{ value: 'EUR', label: 'EUR'},
	                                { value: 'GBP', label: 'GBP'},
	                                { value: 'HKD', label: 'HKD'},
	                                { value: 'INR', label: 'INR'},
	                                { value: 'JPY', label: 'JPY'},
	                                { value: 'USD', label: 'USD'}
	                           ];
	
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
	
	$scope.$watch("requestedOn", function(newVal, oldVal) {
		if($scope.requestedOn !=null && $scope.requestedOn != ""){
			setTimeout(function(){
				$('#dueOn').datetimepicker( "option", "minDate", new Date($scope.requestedOn));
				$('#startDate').datetimepicker( "option", "minDate", new Date($scope.requestedOn));
			},100);
		}else{
			setTimeout(function(){$('#dueOn').datetimepicker( "option", "minDate", null)},100);
		}
	});
	$scope.$watch("dueOn", function(newVal, oldVal) {
		if($scope.dueOn != null && $scope.dueOn != ""){
			setTimeout(function(){$('#requestedOn').datetimepicker( "option", "maxDate", new Date($scope.dueOn))},100);
		}else{
			setTimeout(function(){$('#requestedOn').datetimepicker( "option", "maxDate", null)},100);
		}
	});
	
	$scope.$watch("startDate", function(newVal, oldVal) {
		if($scope.startDate !=null && $scope.startDate != ""){
			setTimeout(function(){
				$('#endDate').datetimepicker( "option", "minDate", new Date($scope.startDate));
			},100);
		}else{
			setTimeout(function(){$('#endDate').datetimepicker( "option", "minDate", null)},100);
		}
	});
	$scope.$watch("endDate", function(newVal, oldVal) {
		if($scope.endDate != null && $scope.endDate != ""){
			setTimeout(function(){$('#startDate').datetimepicker( "option", "maxDate", new Date($scope.endDate))},100);
		}else{
			setTimeout(function(){$('#startDate').datetimepicker( "option", "maxDate", null)},100);
		}
	});
	
	
	
	$scope.checkErrors= false;
	$scope.proposals = {};
	 // add Proposal
	  $scope.createProposal = function() {
		  console.log($scope.createUpdateProposalorm);
		  $scope.checkErrors = true;
		  $scope.$broadcast('show-errors-check-validity');
		  if($scope.createUpdateProposalorm.$error.required != undefined && $scope.createUpdateProposalorm.$error.required.length > 0){
//				$scope.dateCheck();
//				$('#saveCampaignBtn').removeAttr('disabled');
				return;
			} 			
			if ($scope.createUpdateProposalorm.$invalid ){ 
//				$scope.dateCheck();
//				$('#saveCampaignBtn').removeAttr('disabled');
				return; 
			}	
		  
		  
		  
		  
		  var proposal_id = $routeParams.id;
	    $scope.inserted = {
	      id:  proposal_id,
	      proposalName:  $scope.proposalName,
	      compaignName:  $scope.compaignName,
	      advertiserName: $scope.advertiserName,
	      accountManager:  $scope.accountManager,
	      agencyMargin:  $scope.agencyMargin,
	      agencyName:  $scope.agencyName,
	      salesCategory:  $scope.salesCategory,
	      requestedOn: new Date($scope.requestedOn).getTime(),
	      dueOn: new Date($scope.dueOn).getTime(),
	      startDate: new Date($scope.startDate).getTime(),
		  endDate: new Date($scope.endDate).getTime(),
		  lastProposedDate: new Date($scope.lastProposedDate).getTime(),
		  proposalCurrency:  $scope.proposalCurrency,
		  grossorNet:  $scope.grossorNet,
		  budget:  $scope.budget,
	      priority:  $scope.priority,
//	      clonedFrom:  $scope.clonedFrom,
	      conversionRate:  $scope.conversionRate,
		  custom1:  $scope.custom1,
	      //status: $scope.status,
	    };
	   //Data.post('proposals', $scope.inserted);
	    
	    
		  if(proposal_id > 0){
			  Data.put('proposals',$scope.inserted).success(function(){
		    	$location.path('/campaigns/proposal-line-item/'+proposal_id);
		    }).error(function(results){
		    	
		    });
			  
		  }else{
		    Data.post('proposals', $scope.inserted).then(function(result){
		    	//console.log(result);
		    	$location.path('/campaigns/proposal-line-item/'+result.data.id);
		    });
		  }
	    
	    
		//$scope.clearProposalFields();
	  };
	  
	  $scope.cancelProposal = function() {
		  if(proposal_id > 0){
			  $location.path('/campaigns/proposal-line-item/'+proposal_id);
		  } else {
			  $location.path('/campaigns');
		  }
		
	  }
	  
	  $scope.clearProposalFields = function() {
		   $scope.proposalName='';
		   $scope.compaignName='';
		   $scope.advertiserName='';
		   $scope.accountManager='';
		   $scope.agencyMargin='';
		   $scope.agencyName='';
		   $scope.salesCategory='';
		   $scope.requestedOn='';
		   $scope.dueOn='';
		   $scope.startDate='';
		   $scope.endDate='';
		   $scope.proposalCurrency='';
		   $scope.grossorNet='';
		   $scope.budget='';
		   $scope.priority='';
//		   $scope.clonedFrom='';
		   $scope.conversionRate='';
		   $scope.status='';
	  };
	
	  var proposal_id = $routeParams.id;
	  if(proposal_id > 0){
		  Data.get('proposals/'+proposal_id).then(function(data){
		        $scope.proposalData = data.data;
		        $scope.proposalName=$scope.proposalData.proposalName;
		        $scope.compaignName=$scope.proposalData.compaignName;
		        $scope.advertiserName=$scope.proposalData.advertiserName;
		        $scope.accountManager=$scope.proposalData.accountManager;
		        $scope.selectedAccountManager=$scope.proposalData.accountManager;
		        $scope.agencyMargin=$scope.proposalData.agencyMargin;
		        $scope.agencyName=$scope.proposalData.agencyName;
		        $scope.salesCategory=$scope.proposalData.salesCategory;
		        $('#requestedOn').datetimepicker("setDate", new Date($scope.proposalData.requestedOn));
		        $('#dueOn').datetimepicker("setDate", new Date($scope.proposalData.dueOn));
		        $('#startDate').datetimepicker("setDate", new Date($scope.proposalData.startDate) );
		        $('#endDate').datetimepicker("setDate", new Date($scope.proposalData.endDate) );
		        $scope.proposalCurrency=$scope.proposalData.proposalCurrency;
		        $scope.grossorNet=$scope.proposalData.grossorNet;
		        $scope.budget=$scope.proposalData.budget;
		        $scope.priority=$scope.proposalData.priority;
//		        $scope.clonedFrom=$scope.proposalData.clonedFrom;
		        $scope.conversionRate=$scope.proposalData.conversionRate;
		        $scope.status=$scope.proposalData.status;
				$scope.custom1=$scope.proposalData.custom1;
		    });
	  }
	
	  
});
