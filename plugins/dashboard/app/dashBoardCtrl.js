app.filter('startProposalFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('dashBoardCtrl', function ($scope, $rootScope, $location, Data, cssInjector,$http) { 
	cssInjector.add("plugins/dashboard/css/dashboard-style.css");

	$http.get('plugins/dashboard/js/dashboard-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	$scope.isActive = function (viewLocation) {
        if(viewLocation == '/dashboard'){
        	return true;
        }
    };
    
    $scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/dashboard/bar') > -1){
        	return true;
        }
    };
    
    
    
    $scope.sort_by = function(predicate) {
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
    
    
    var currentUserId = null;
    var currentRoleName = null;
    var AheadPendingCounter = 0;
    var BehindPendingCounter = 0;
    
    var AheadProposedCounter = 0;
    var BehindProposedCounter = 0;
    
    var AheadReviewCounter = 0;
    var BehindReviewCounter = 0;
    
    var AheadRejectCounter = 0;
    var BehindRejectCounter = 0;
    
    var AheadSoldCounter = 0;
    var BehindSoldCounter = 0;
    
    var AheadSignedCounter = 0;
    var BehindSignedCounter = 0;
    
    var chartProposalsList = {};
    var currentDateTime =new Date().getTime();
    
    Data.get('authentication').success(function (results) {
    	if(results.userId){
             currentUserId = results.userId;
             currentRoleName = results.roles[0].roleName.split('_')['1'];
             if(currentRoleName=='ADMIN'){
            	 Data.get('proposals').then(function(data){
               		chartProposalsList=data.data;
		             if(chartProposalsList.length > -1){
		                 chartProposalsList.forEach(function(value,i){
		                 chartProposalsList[i].dueOn = String(new Date(value.dueOn)).substring(0,21);
		                 chartProposalsList[i].linkPath = '#/proposal/proposal-line-item/'+value.id;
		                 switch(value.status){
		                 	case 'Pending':
		                 		if(value.dueOn > currentDateTime) AheadPendingCounter++;
		                 		else BehindPendingCounter++;
		                 	break;
		                 	case 'Proposed':
		                 		if(value.dueOn > currentDateTime) AheadProposedCounter++;
		                 		else BehindProposedCounter++;
		                 	break;
		                 	case 'Rejected':
		                 		if(value.dueOn > currentDateTime) AheadRejectCounter++;
		                 		else BehindRejectCounter++;
		                 	break;
		                 	case 'Review':
		                 		if(value.dueOn > currentDateTime) AheadReviewCounter++;
		                 		else BehindReviewCounter++;
		                 	break;
		                 	case 'Sold':
		                 		if(value.dueOn > currentDateTime) AheadSoldCounter++;
		                 		else BehindSoldCounter++;
		                 	break;
		                 	case 'Signed':
		                 		if(value.dueOn > currentDateTime) AheadSignedCounter++;
		                 		else BehindSignedCounter++;
		                 	break;
		                 	}
		                 	
		                 });
		                 
		                 var chart1 = {};
		                 chart1.type = "ColumnChart";
		                 chart1.cssStyle = "height:300px; width:700px;";
		                 chart1.data = {"cols": [
		                     {id: "status", label: "Status", type: "string"},
		                     {id: "a-id", label: "Ahead Schedule", type: "number"},
		                     {id: "b-id", label: "Behind Schedule", type: "number"}
		                 ], "rows": [
		                     {c: [
		                         {v: "Pending"},
		                         {v: AheadPendingCounter, f: " "+AheadPendingCounter+" "},
		                         {v: BehindPendingCounter, f: " "+BehindPendingCounter+" "}
		                     ]},
		                     {c: [
		                         {v: "Prososed"},
		                         {v: AheadProposedCounter, f: " "+AheadProposedCounter+" "},
		                         {v: BehindProposedCounter, f: " "+BehindProposedCounter+" "}
		                     ]},
		                     {c: [
		                         {v: "Review"},
		                         {v: AheadReviewCounter, f: " "+AheadReviewCounter+" "},
		                         {v: BehindReviewCounter, f: " "+BehindReviewCounter+" "}
		                     ]},
		                     {c: [
		                          {v: "Sold"},
		                          {v: AheadSoldCounter, f: " "+AheadSoldCounter+" "},
		                          {v: BehindSoldCounter, f: " "+BehindSoldCounter+" "}
		                      ]},
		                      {c: [
		                           {v: "Signed"},
		                           {v: AheadSignedCounter, f: " "+AheadSignedCounter+" "},
		                           {v: BehindSignedCounter, f: " "+BehindSignedCounter+" "}
		                       ]},
		                       {c: [
		                            {v: "Rejected"},
		                            {v: AheadRejectCounter, f: " "+AheadRejectCounter+" "},
		                            {v: BehindRejectCounter, f: " "+BehindRejectCounter+" "}
		                        ]}
		                 ]};
		
		                 chart1.options = {
		                     "title": "All Prososals",
		                     "isStacked": "true",
		                     "fill": 20,
		                     "displayExactValues": true,
		                     "vAxis": {
		                         "title": "Numbers", "gridlines": {"count": 6}
		                     },
		                     "hAxis": {
		                         "title": "Status"
		                     }
		                 };
		
		                 chart1.formatters = {};
		                 $scope.chart = chart1;
		                 $scope.seriesSelected = function(selectedItem) {
		                     var col = selectedItem.column;
		                     var row = selectedItem.row;
		                     $scope.proposals = [];
		                     var selectedRow = 'Pending';
		                     switch(row){
		                     	case 0:
		                     		selectedRow='Pending';
		                     	break;
		                     	case 1:
		                     		selectedRow='Proposed';
		                     	break;
		                     	case 2:
		                     		selectedRow='Review';
		                     	break;
		                     	case 3:
		                     		selectedRow='Sold';
		                     	break;
		                     	case 4:
		                     		selectedRow='Signed';
		                     	break;
		                     	case 5:
		                     		selectedRow='Rejected';
		                     	break;
		                     	default:
		                     		selectedRow='Pending';
		                     }
		                     
		                     chartProposalsList.forEach(function(value,i){
		                     	if(value.status==selectedRow)
		                     	{
		                     		$scope.proposals.push(chartProposalsList[i]);
		                     		$scope.totalItems = $scope.proposals.length;
		                            $scope.currentPage = 1; //current page

		                            $scope.entryLimit = 5; //max no of items to display in a page
		                            $scope.filteredItems = $scope.proposals.length;
		                            //Initially for no filter
		                    		/* $scope.predicate='id'; */
		                             $scope.sort_by('id');
		                            //$scope.reverse = true;
		                     	}
		                     });
		                     
		                   };
		                 
		             }
		             
		           });
		    	}
		        else{
		        	Data.get('proposals?userId='+currentUserId).then(function(data){
	               		chartProposalsList=data.data;
			             if(chartProposalsList.length > -1){
			                 chartProposalsList.forEach(function(value,i){
			                 chartProposalsList[i].dueOn = String(new Date(value.dueOn)).substring(0,21);
			                 if(value.status=='Pending' || value.status=='Review'){
			                	 chartProposalsList[i].linkPath = '#/proposal/proposal-line-item/'+value.id;
			                 }
			                 else{
			                	 chartProposalsList[i].linkPath = '#/proposal/proposal-line-item-view/'+value.id;
			                 }
			                 switch(value.status){
			                 	case 'Pending':
			                 		if(value.dueOn > currentDateTime) AheadPendingCounter++;
			                 		else BehindPendingCounter++;
			                 	break;
			                 	case 'Proposed':
			                 		if(value.dueOn > currentDateTime) AheadProposedCounter++;
			                 		else BehindProposedCounter++;
			                 	break;
			                 	case 'Rejected':
			                 		if(value.dueOn > currentDateTime) AheadRejectCounter++;
			                 		else BehindRejectCounter++;
			                 	break;
			                 	case 'Review':
			                 		if(value.dueOn > currentDateTime) AheadReviewCounter++;
			                 		else BehindReviewCounter++;
			                 	break;
			                 	case 'Sold':
			                 		if(value.dueOn > currentDateTime) AheadSoldCounter++;
			                 		else BehindSoldCounter++;
			                 	break;
			                 	case 'Signed':
			                 		if(value.dueOn > currentDateTime) AheadSignedCounter++;
			                 		else BehindSignedCounter++;
			                 	break;
			                 	}
			                 	
			                 });
			                 
			                 var chart1 = {};
			                 chart1.type = "ColumnChart";
			                 chart1.cssStyle = "height:300px; width:700px;";
			                 chart1.data = {"cols": [
			                     {id: "status", label: "Status", type: "string"},
			                     {id: "a-id", label: "Ahead Schedule", type: "number"},
			                     {id: "b-id", label: "Behind Schedule", type: "number"}
			                 ], "rows": [
			                     {c: [
			                         {v: "Pending"},
			                         {v: AheadPendingCounter, f: " "+AheadPendingCounter+" "},
			                         {v: BehindPendingCounter, f: " "+BehindPendingCounter+" "}
			                     ]},
			                     {c: [
			                         {v: "Prososed"},
			                         {v: AheadProposedCounter, f: " "+AheadProposedCounter+" "},
			                         {v: BehindProposedCounter, f: " "+BehindProposedCounter+" "}
			                     ]},
			                     {c: [
			                         {v: "Review"},
			                         {v: AheadReviewCounter, f: " "+AheadReviewCounter+" "},
			                         {v: BehindReviewCounter, f: " "+BehindReviewCounter+" "}
			                     ]},
			                     {c: [
			                          {v: "Sold"},
			                          {v: AheadSoldCounter, f: " "+AheadSoldCounter+" "},
			                          {v: BehindSoldCounter, f: " "+BehindSoldCounter+" "}
			                      ]},
			                      {c: [
			                           {v: "Signed"},
			                           {v: AheadSignedCounter, f: " "+AheadSignedCounter+" "},
			                           {v: BehindSignedCounter, f: " "+BehindSignedCounter+" "}
			                       ]},
			                       {c: [
			                            {v: "Rejected"},
			                            {v: AheadRejectCounter, f: " "+AheadRejectCounter+" "},
			                            {v: BehindRejectCounter, f: " "+BehindRejectCounter+" "}
			                        ]}
			                 ]};
			
			                 chart1.options = {
			                     "title": "All Prososals",
			                     "isStacked": "true",
			                     "fill": 20,
			                     "displayExactValues": true,
			                     "vAxis": {
			                         "title": "Numbers", "gridlines": {"count": 6}
			                     },
			                     "hAxis": {
			                         "title": "Status"
			                     }
			                 };
			
			                 chart1.formatters = {};
			                 $scope.chart = chart1;
			                 $scope.seriesSelected = function(selectedItem) {
			                     var col = selectedItem.column;
			                     var row = selectedItem.row;
			                     $scope.proposals = [];
			                     var selectedRow = 'Pending';
			                     switch(row){
			                     	case 0:
			                     		selectedRow='Pending';
			                     	break;
			                     	case 1:
			                     		selectedRow='Proposed';
			                     	break;
			                     	case 2:
			                     		selectedRow='Review';
			                     	break;
			                     	case 3:
			                     		selectedRow='Sold';
			                     	break;
			                     	case 4:
			                     		selectedRow='Signed';
			                     	break;
			                     	case 5:
			                     		selectedRow='Rejected';
			                     	break;
			                     	default:
			                     		selectedRow='Pending';
			                     }
			                     
			                     chartProposalsList.forEach(function(value,i){
			                     	if(value.status==selectedRow)
			                     	{
			                     		$scope.proposals.push(chartProposalsList[i]);
			                     		$scope.totalItems = $scope.proposals.length;
			                            $scope.currentPage = 1; //current page

			                            $scope.entryLimit = 5; //max no of items to display in a page
			                            $scope.filteredItems = $scope.proposals.length;
			                            //Initially for no filter
			                    		/* $scope.predicate='id'; */
			                             $scope.sort_by('id');
			                            //$scope.reverse = true;

			                     	}
			                     });
			                     
			                   };
			                 
			             }
			             
			           }); 
		        
		        	}     
       }
    });     
});