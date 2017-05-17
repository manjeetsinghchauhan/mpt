app.filter('startCampaignFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('campaignDashboardCtrl', function ($scope, $rootScope, $location, Data, cssInjector,$http) { 
	cssInjector.add("plugins/dashboard/css/dashboard-style.css");

	$http.get('plugins/dashboard/js/dashboard-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	$scope.isActive = function (viewLocation) {
        if(viewLocation == '/welcome'){
        	return true;
        }
    };
    
    $scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/welcome/pie') > -1){
        	return true;
        }
    };
	
	$scope.allCampaignsList = [];
	$scope.futureCampaignsList = [];
	$scope.pastCampaignsList = [];
	$scope.currentCampaignsList = [];
	$scope.noOfCampaignsPerPage = 5;
	$scope.daysToCalculate = 4;
	$scope.totalFutureCampaigns

	Data.get('authentication').success(function (results) {
		var queryString = '';
		if(results.userId){
            currentRoleName = results.roles[0].roleName.split('_')['1'];
            if(currentRoleName=='TRAFFICKER') var queryString='&userId='+results.userId; 
		}
		Data.get('proposals?status=Signed'+queryString).then(function(data){		
	        var orderList = data.data;
	        for (var i=0; i<orderList.length; i++){
	        	   var orderId=orderList[i].id;
	        		Data.get('proposals/'+orderId).success(function(data){
	        			var orderData  = data;
	        	    	var lineItemList = orderData.lineItems;
	        	    	lineItemList.forEach(function(value,index){
	        	    		 $scope.allCampaignsList.push({orderName:orderData.proposalName,
		        					status:orderData.status,
		        					proposalId:orderData.id,
		        					advertiserName:orderData.advertiserName,
		        					salesCategory:orderData.salesCategory,
		        					lineItemList:value
		        				});
		        			
		        			 });
	        	    	$scope.sortCampaigns();
	        		}).error(function(data){
	        			// do nothing
	        		});
	        }
	        
		});
	});
	$scope.sortCampaigns = function() {
		$scope.futureCampaigns();
		$scope.pastCampaigns();
		$scope.currentCampaigns();
		$scope.chartCampaigns();
	};
	
	$scope.futureCampaigns = function(){
		var tempData = angular.copy($scope.allCampaignsList);
		var currentDate = new Date().getTime(); 
		var next3aystimestamp = (currentDate + ($scope.daysToCalculate*24*60*60*1000)); // added value for 3 next three days
		$scope.futureCampaignsList.splice(0,$scope.futureCampaignsList.length); // empty array so that duplicate of campaigns should not be a case 
		tempData.forEach(function(value,i){
			if(value.lineItemList.deliveryStatus=='Ready' && value.lineItemList.startDate > currentDate && value.lineItemList.startDate < next3aystimestamp){
				tempData[i].lineItemList.daysToGoLive = Math.ceil((value.lineItemList.startDate - currentDate)/86400000);
				tempData[i].lineItemList.startDate = String(new Date(value.lineItemList.startDate)).substring(0,21);
				tempData[i].lineItemList.endDate = String(new Date(value.lineItemList.endDate)).substring(0,21);
				$scope.futureCampaignsList.push(value);
				//$scope.allCampaignsList[i].lineItemList.linkPath = $scope.getPath($rootScope.roleName,value.lineItemList.status,value.id);
			}
		});
		$scope.totalFutureCampaigns = $scope.futureCampaignsList.length;
	    $scope.futureCampaignsCurrentPage = 1;
	    $scope.futureCampaignsEntryLimit = $scope.noOfCampaignsPerPage;
	    $scope.futureCampaignsfilteredItems = $scope.futureCampaignsList.length;
	}
	
	$scope.pastCampaigns = function(){
		var tempData = angular.copy($scope.allCampaignsList);
		var currentDate = new Date().getTime(); 
		var past3aystimestamp = (currentDate - ($scope.daysToCalculate*24*60*60*1000)); // added value for 3 next three days
		$scope.pastCampaignsList.splice(0,$scope.pastCampaignsList.length); // empty array so that duplicate of campaigns should not be a case 
		tempData.forEach(function(value,i){
			if(value.lineItemList.deliveryStatus=='Completed' && value.lineItemList.endDate > past3aystimestamp && value.lineItemList.endDate < currentDate){
				tempData[i].lineItemList.impression = '52577887';
				tempData[i].lineItemList.startDate = String(new Date(value.lineItemList.startDate)).substring(0,21);
				tempData[i].lineItemList.endDate = String(new Date(value.lineItemList.endDate)).substring(0,21);
				$scope.pastCampaignsList.push(value);
				//$scope.allCampaignsList[i].lineItemList.linkPath = $scope.getPath($rootScope.roleName,value.lineItemList.status,value.id);
			}
		});
		$scope.totalPastCampaigns = $scope.pastCampaignsList.length;
	    $scope.pastCampaignsCurrentPage = 1;
	    $scope.pastCampaignsEntryLimit = $scope.noOfCampaignsPerPage;
	    $scope.pastCampaignsfilteredItems = $scope.pastCampaignsList.length;
	}
	
	$scope.currentCampaigns = function(){
		var tempData = angular.copy($scope.allCampaignsList);
		var currentDate = new Date().getTime(); 
		$scope.currentCampaignsList.splice(0,$scope.currentCampaignsList.length); // empty array so that duplicate of campaigns should not be a case 
		tempData.forEach(function(value,i){
			if(value.lineItemList.deliveryStatus=='Delivering' && value.lineItemList.startDate < currentDate && value.lineItemList.endDate > currentDate){
				tempData[i].lineItemList.impression = '52577887';
				tempData[i].lineItemList.startDate = String(new Date(value.lineItemList.startDate)).substring(0,21);
				tempData[i].lineItemList.endDate = String(new Date(value.lineItemList.endDate)).substring(0,21);
				$scope.currentCampaignsList.push(value);
				//$scope.allCampaignsList[i].lineItemList.linkPath = $scope.getPath($rootScope.roleName,value.lineItemList.status,value.id);
			}
		});
		$scope.totalCurrentCampaigns = $scope.currentCampaignsList.length;
	    $scope.currentCampaignsCurrentPage = 1;
	    $scope.currentCampaignsEntryLimit = $scope.noOfCampaignsPerPage;
	    $scope.currentCampaignsfilteredItems = $scope.currentCampaignsList.length;
	}
	
	$scope.chartCampaigns = function()
	{
		var inactiveCounter = 0;
		var activeCounter = 0;
		var readyCounter = 0;
		var deliveringCounter = 0;
		var completedCounter = 0;
		
		var tempData = angular.copy($scope.allCampaignsList);
		tempData.forEach(function(value,i){
			switch(value.lineItemList.deliveryStatus){
			case 'Inactive':
				inactiveCounter++;
				break;
			case 'Active':
				activeCounter++;
				break;
			case 'Ready':
				readyCounter++;
				break;
			case 'Delivering':
				deliveringCounter++;
				break;
			case 'Completed':
				completedCounter++
				break;
			}
		});
		var chart1 = {};
        chart1.type = "PieChart";
        chart1.cssStyle = "height:300px; width:700px;";
        chart1.data = {"cols": [
            {id: "status", label: "Status", type: "string"},
            {id: "status", label: "Status", type: "string"},
            {id: "status", label: "Status", type: "string"}
        ], "rows": [
            {c: [
                {v: "Inactive"},
                {v: inactiveCounter, f: inactiveCounter}
                
            ]},
            {c: [
                {v: "Active"},
                {v: activeCounter, f: activeCounter}
                
            ]},
            {c: [
                {v: "Ready"},
                {v: readyCounter, f: readyCounter}
            ]},
            {c: [
                 {v: "Delivering"},
                 {v: deliveringCounter, f: deliveringCounter}
             ]},
             {c: [
                  {v: "Completed"},
                  {v: completedCounter, f: completedCounter}
              ]}
        ]};

        chart1.options = {
            "title": "All Campaigns",
            "is3D": "true"
        };

        chart1.formatters = {};
        $scope.chart = chart1;
	}
	
	
	$scope.getDelayedCampaigns = function(checkBox)
	{
		if($scope.delayedCampaigns){
			var tempData = angular.copy($scope.allCampaignsList);
			var currentDate = new Date().getTime(); 
			$scope.futureCampaignsList.splice(0,$scope.futureCampaignsList.length); // empty array so that duplicate of campaigns should not be a case 
			tempData.forEach(function(value,i){
				if(value.lineItemList.deliveryStatus=='Ready' && value.lineItemList.startDate < currentDate){
					tempData[i].lineItemList.daysToGoLive = Math.ceil((value.lineItemList.startDate - currentDate)/86400000);
					tempData[i].lineItemList.startDate = String(new Date(value.lineItemList.startDate)).substring(0,21);
					tempData[i].lineItemList.endDate = String(new Date(value.lineItemList.endDate)).substring(0,21);
					$scope.futureCampaignsList.push(value);
					//$scope.allCampaignsList[i].lineItemList.linkPath = $scope.getPath($rootScope.roleName,value.lineItemList.status,value.id);
				}
			});
			
			$scope.totalFutureCampaigns = $scope.futureCampaignsList.length;
		    $scope.futureCampaignsCurrentPage = 1;
		    $scope.futureCampaignsEntryLimit = $scope.noOfCampaignsPerPage;
		    $scope.futureCampaignsfilteredItems = $scope.futureCampaignsList.length;
		}
		else
		{
			$scope.futureCampaigns();
		}
	}
	
    $scope.sort_by = function(predicate) {
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
    
});