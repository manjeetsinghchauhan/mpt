app.controller('orderCampaignsCtrl', function ($scope, $location, $rootScope, Data, cssInjector, $filter, $http) { 
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	  
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
    
    $(document).ready(function () {
    	  $(function() {
    	    	setTimeout(function(){
    	    		$("#startDateFilter" ).datepicker({
    	    	        changeMonth: true,
    	    	        changeYear: true,
    	    	        dateFormat : 'mm/dd/yy',
    	    	        defaultDate: new Date()
    	    	    });
    	    		$("#endDateFilter" ).datepicker({
    	    	        changeMonth: true,
    	    	        changeYear: true,
    	    	        dateFormat : 'mm/dd/yy',
    	    	        defaultDate: new Date()
    	    	    });
    	    	},100);
    	   
    	  });
    	});
		
    
	$scope.proposalSortByOptions = [
	                   { value: 'advertiserName', label: 'Advertiser'},
	                   { value: 'accountManager', label: 'Account Manager'},
	                   { value: 'lineItemEndDate', label: 'End Date'},
	                   { value: 'orderName', label: 'Name'},
	                   { value: 'propsalId', label: 'Order ID'},
	                   { value: 'lineItemStartDate', label: 'Start Date'},
	                   { value: 'salesCategory', label: 'Sales Category'}
	                  ];
	
	$scope.proposalOrderByOptions = [
	         	                   { value: 'false', label: 'Asc'},
	         	                   { value: 'true', label: 'Desc'}
	         	                  ];
	
		
	$scope.proposalSortBy = $scope.proposalSortByOptions[0];
	$scope.proposalOrderBy = $scope.proposalOrderByOptions[0];
	$scope.noOfProposalsPerPage = 10;
	
	/*
	Data.get('proposals?status=Signed').then(function(data){
        $scope.proposalsBackup = data.data;
        $scope.sortProposal();
    });
    */
	$scope.newProposals=[];
	$scope.newProposalsBackup = [];
	$scope.proposalsBackup = [];

	
	Data.get('proposals?status=Signed').then(function(data){		
        var orderList = data.data;
        for (var i=0; i<orderList.length; i++){
        	   var orderId=orderList[i].id;
        		Data.get('proposals/'+orderId).success(function(data){
        			var orderData  = data;
        	    	var lineItemList = orderData.lineItems;
        	    	lineItemList.forEach(function(value,index){
        	    		 $scope.proposalsBackup.push({
        	    			    orderName:orderData.proposalName,
	        					status:orderData.status,
	        					propsalId:orderData.id,
	        					advertiserName:orderData.advertiserName,
	        					accountManager:orderData.accountManager,
	        					salesCategory:orderData.salesCategory,
	        					lineItemEndDate:value.endDate,
	        					lineItemStartDate:value.startDate,
	        					user:orderData.user,
	        					lineItemList:value
	        				});
	        			
	        			 });
        	    	$scope.sortProposal();
        		}).error(function(data){
        			// do nothing
        		});
        }
        
	});
	
	
	
	$scope.setCampainsStatus = function(lineItemdeliveryStatus){
		$scope.proposalsBackup.splice(0,$scope.proposalsBackup.length);
		if(lineItemdeliveryStatus=='Signed'){
			Data.get('proposals?status=Signed').then(function(data){		
		        var orderList = data.data;
		        for (var i=0; i<orderList.length; i++){
		        	   var orderId=orderList[i].id;
		        		Data.get('proposals/'+orderId).success(function(data){
		        			var orderData  = data;
		        	    	var lineItemList = orderData.lineItems;
		        	    	lineItemList.forEach(function(value,index){
		        	    		 $scope.proposalsBackup.push({
		        	    			    orderName:orderData.proposalName,
			        					status:orderData.status,
			        					propsalId:orderData.id,
			        					advertiserName:orderData.advertiserName,
			        					accountManager:orderData.accountManager,
			        					salesCategory:orderData.salesCategory,
			        					lineItemEndDate:value.endDate,
			        					lineItemStartDate:value.startDate,
			        					user:orderData.user,
			        					lineItemList:value
			        				});
			        			
			        			 });
		        	    	$scope.sortProposal();
		        		}).error(function(data){
		        			// do nothing
		        		});
		        }
		        
			});
		}else if(lineItemdeliveryStatus=='MyOrders'){
			Data.get('proposals?status=Signed&userId='+$rootScope.userId).then(function(data){		
		        var orderList = data.data;
		        for (var i=0; i<orderList.length; i++){
		        	   var orderId=orderList[i].id;
		        		Data.get('proposals/'+orderId).success(function(data){
		        			var orderData  = data;
		        	    	var lineItemList = orderData.lineItems;
		        	    	lineItemList.forEach(function(value,index){
		        	    		 $scope.proposalsBackup.push({
		        	    			    orderName:orderData.proposalName,
			        					status:orderData.status,
			        					propsalId:orderData.id,
			        					advertiserName:orderData.advertiserName,
			        					accountManager:orderData.accountManager,
			        					salesCategory:orderData.salesCategory,
			        					lineItemEndDate:value.endDate,
			        					lineItemStartDate:value.startDate,
			        					user:orderData.user,
			        					lineItemList:value
			        				});
			        			
			        			 });
		        	    	$scope.sortProposal();
		        		}).error(function(data){
		        			// do nothing
		        		});
		        }
		        
			});
		}
		
		else{
			        Data.get('proposals?status=Signed').then(function(data){	
			        var orderList = data.data;
			        for (var i=0; i<orderList.length; i++){
			        	   var orderId=orderList[i].id;
			        		Data.get('proposals/'+orderId).success(function(data){
			        			var orderData  = data;
			        	    	var lineItemList = orderData.lineItems;
			        	    	lineItemList.forEach(function(value,index){
			        	    		if(value.deliveryStatus==lineItemdeliveryStatus){
			        	    			$scope.proposalsBackup.push({
			        	    				orderName:orderData.proposalName,
				        					status:orderData.status,
				        					propsalId:orderData.id,
				        					advertiserName:orderData.advertiserName,
				        					accountManager:orderData.accountManager,
				        					salesCategory:orderData.salesCategory,
				        					lineItemEndDate:value.endDate,
				        					lineItemStartDate:value.startDate,
				        					user:orderData.user,
				        					lineItemList:value
				        				});
			        	    		}
			        	    		 
				        			
				        			 });
			        	    	$scope.sortProposal();
			        		}).error(function(data){
			        			// do nothing
			        		});
			        }
			        
				});
		}
	}
	
	$scope.sortProposal = function() {
		var tempData = angular.copy($scope.proposalsBackup);
		tempData.forEach(function(value,i){
			$scope.proposalsBackup[i].lineItemList.startDate = String(new Date(value.lineItemList.startDate)).substring(0,21);
			$scope.proposalsBackup[i].lineItemList.endDate = String(new Date(value.lineItemList.endDate)).substring(0,21);
			$scope.proposalsBackup[i].lineItemList.placeHolder = value.lineItemList.product.name +" in "+ $scope.proposalsBackup[i].salesCategory;
			$scope.proposalsBackup[i].lineItemList.linkPath = $scope.getPath($rootScope.roleName,value.lineItemList.deliveryStatus,value.propsalId);
			$scope.proposalsBackup[i].lineItemList.linkCampaignPath = $scope.getCampaignPath($rootScope.roleName,value.lineItemList.deliveryStatus,value.propsalId,value.lineItemList.id);
		});
		$scope.newProposalsBackup = $filter('orderBy')($scope.proposalsBackup, $scope.proposalSortBy.value, $scope.proposalOrderBy.value);
		$scope.newProposals = $scope.newProposalsBackup.slice(0, $scope.noOfProposalsPerPage);;
		$scope.totalProposal = $scope.newProposals.length;
	    $scope.currentPage = 1;
	    $scope.entryLimit = $scope.noOfProposalsPerPage;
	    $scope.filteredItems = $scope.proposalsBackup.length;
	    
	};

	
    $scope.sortByKey = function(array, key, order) {
	    return array.sort(function(a, b) {
	        var x = angular.lowercase(a[key]); var y = angular.lowercase(b[key]);
	        if(order == 'Desc'){
	        	return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	        } else {
	        	 return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	        }
	       
	    });
	};

	
	$scope.setPage = function(page){
		var currentPage = page -1; 
		var startVal = currentPage*$scope.noOfProposalsPerPage;
		var endVal = startVal + $scope.noOfProposalsPerPage;
		$scope.newProposals = $scope.newProposalsBackup.slice(startVal, endVal);;
	};
	
	$scope.getPath = function(roleName,status,id)
	{
		var linkPath = '#/campaigns/proposal-line-item/'+id;
		if(roleName=='PLANNER'){
			if(status!='Pending' && status!='Review')
				linkPath = '#/campaigns/proposal-line-item-view/'+id;
		}
		
		return linkPath;
				
	}
	
	//create-line-item/propID-6-li-5
	$scope.getCampaignPath = function(roleName,status,propsalId,id)
	{
		var linkPath = '#/campaigns/create-line-item/propID-'+propsalId+'-li-'+id;
		if(roleName=='PLANNER'){
			if(status!='Pending' && status!='Review')
				linkPath = '#/campaigns/create-line-item/propID-'+propsalId+'-li-'+id;
		}
		
		return linkPath;
				
	}
	
});
