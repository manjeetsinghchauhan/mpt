app.filter('startProposalFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('calendarDashBoardCtrl', function ($scope, $rootScope, $location, Data, cssInjector,$http, $modal, cssInjector, moment) { 
	
	cssInjector.add("plugins/dashboard/css/calendar/calendar.css");
	cssInjector.add("plugins/dashboard/css/calendar/main.css");
	
	$http.get('plugins/dashboard/js/dashboard-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
  
    $scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/dashboard/calendar') > -1){
        	return true;
        }
    };
    
    $rootScope.isActive = function (viewLocation) { 
    	if(viewLocation === '/dashboard'){
    		return true;
        } 
    };
    
    
	
    //These variables MUST be set as a minimum for the calendar to work
    
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();
    $scope.events = [];
    Data.get('proposals').then(function(data) {
   	 $scope.proposalsList = data.data;
   	 $scope.Map = {};
   	 $scope.proposalsList.forEach(function(value,i){
   		 if(value.dueOn != "" && value.dueOn != undefined) {
   			var dueDate = new Date(value.dueOn);
   			var key =  dueDate.getDate() + '/' + (dueDate.getMonth()+1) + '/' + dueDate.getFullYear();
   			value.showDueOn = key;
   			if (key in 	$scope.Map) {
   				$scope.Map[key].push(value);
   			} else {
   				$scope.subMap = [];
   				$scope.Map[key] = $scope.subMap
   				$scope.Map[key].push(value);
   			}
   			
  			
   		 }
   		 
   		value.linkPath = $scope.getPath(value);
   	 });
   	
   	
   	$scope.proposalMapByDay = {};
   	
   	for( var mapIndex in $scope.Map) {
   		$scope.subMap = $scope.Map[mapIndex];
   		
   		var Pending = [];
   		var Proposed = [];
   		var Review = [];
   		var Sold = [];
   		var Signed = [];
   		var Rejected = [];
   		$scope.tempArr = [];
   		$scope.proposalMapByStaurs = {};
   		
   		for( var subMapIndex in $scope.subMap) {
   			
   			var proStatus = $scope.subMap[subMapIndex].status;
   			
   			switch(proStatus){
	         	case 'Pending':
	         		if($scope.proposalMapByStaurs['Pending'] == undefined){
	         			$scope.proposalMapByStaurs['Pending'] = $scope.tempArr;
	         		}
	         		Pending.push($scope.subMap[subMapIndex]);
	         		break;
	         	case 'Proposed':
	         		if($scope.proposalMapByStaurs['Proposed'] == undefined){
	         			$scope.proposalMapByStaurs['Proposed'] = $scope.tempArr;
	         		}
	         		Proposed.push($scope.subMap[subMapIndex]);
	         		break;
	         	case 'Review':
	         		if($scope.proposalMapByStaurs['Review'] == undefined){
	         			$scope.proposalMapByStaurs['Review'] = $scope.tempArr;
	         		}
	         		Review.push($scope.subMap[subMapIndex]);
	         		break;
	         	case 'Sold':
	         		if($scope.proposalMapByStaurs['Sold'] == undefined){
	         			$scope.proposalMapByStaurs['Sold'] = $scope.tempArr;
	         		}
	         		Sold.push($scope.subMap[subMapIndex]);
	         		break;
	         	case 'Signed':
	         		if($scope.proposalMapByStaurs['Signed'] == undefined){
	         			$scope.proposalMapByStaurs['Signed'] = $scope.tempArr;
	         		}
	         		Signed.push($scope.subMap[subMapIndex]);
	         		break;
	         	case 'Rejected':
	         		if($scope.proposalMapByStaurs['Rejected'] == undefined){
	         			$scope.proposalMapByStaurs['Rejected'] = $scope.tempArr;
	         		}
	         		Rejected.push($scope.subMap[subMapIndex]);
	         		break;
	         	default:
	         		selectedRow='Pending';
   			}
   		}
   		
   		if($scope.proposalMapByStaurs['Pending'] != undefined) {
   			$scope.proposalMapByStaurs['Pending'] = Pending;
   		}
   		if($scope.proposalMapByStaurs['Proposed'] != undefined){
   			$scope.proposalMapByStaurs['Proposed'] = Proposed ;
   		}
   		if($scope.proposalMapByStaurs['Review'] != undefined){
   			$scope.proposalMapByStaurs['Review'] = Review;
   		}
   		if($scope.proposalMapByStaurs['Sold'] != undefined){
   			$scope.proposalMapByStaurs['Sold'] = Sold;
   		}
   		if($scope.proposalMapByStaurs['Signed'] != undefined){
   			$scope.proposalMapByStaurs['Signed'] = Signed;
   		}
   		if($scope.proposalMapByStaurs['Rejected'] != undefined){
   			$scope.proposalMapByStaurs['Rejected'] = Rejected;
   		}
   		
   		if($scope.proposalMapByStaurs != undefined) {
   			$scope.proposalMapByDay[mapIndex] = $scope.tempArr = [];
   			$scope.proposalMapByDay[mapIndex].push($scope.proposalMapByStaurs);
   		}
   	}
   	
		for( var dateKey in $scope.proposalMapByDay) {
   			$scope.tempProposalMapByStaurs = $scope.proposalMapByDay[dateKey][0];
   			var calenderTitle = ""; 
   			for( var statusKey in $scope.tempProposalMapByStaurs) {
   				var xyz = $scope.tempProposalMapByStaurs[statusKey];
   				if(xyz.length > 0 ){
   					var calenderTitle = statusKey + " ( " + $scope.tempProposalMapByStaurs[statusKey].length + " )"; 
   					var dueOn = xyz[0];
   					$scope.events.push({
   	  			        title: calenderTitle,
   	  			        type: 'warning',
   	  			        startsAt: new Date(dueOn.dueOn),
   	  			        endsAt: new Date(dueOn.dueOn) 
   	  			    });
   	   			}
   			}
   			
   		}
		
		$scope.dayClicked(new Date());
   });
    

    function showModal(action, event) {
      $modal.open({
        templateUrl: 'modalContent.html',
        controller: function($scope, $modalInstance) {
          $scope.$modalInstance = $modalInstance;
          $scope.action = action;
          $scope.event = event;
        }
      });
    }

    $scope.eventClicked = function(event) {

    	$scope.proposals = [];
		var dueDate = new Date(event.startsAt);
		var key =  dueDate.getDate() + '/' + (dueDate.getMonth()+1) + '/' + dueDate.getFullYear();
		
		for( var dateKey in $scope.proposalMapByDay) {
			if(dateKey == key){
				$scope.tempProposalMapByStaurs = $scope.proposalMapByDay[dateKey][0];
				var title = event.title.split('(');
				for( var statusKey in $scope.tempProposalMapByStaurs) {
					if(title[0].trim() == statusKey){
						$scope.proposals = $scope.tempProposalMapByStaurs[statusKey];
					}
				}
				
			}
		}
		
 		$scope.totalItems = $scope.proposals.length;
        $scope.currentPage = 1; //current page

        $scope.entryLimit = 5; //max no of items to display in a page
        $scope.filteredItems = $scope.proposals.length;
         $scope.sort_by('id');
    	
    	
    };

    $scope.eventEdited = function(event) {
      //showModal('Edited', event);
    	//alert(1234);
    };

    $scope.eventDeleted = function(event) {
      //showModal('Deleted', event);
    	alert(1235);
    };
    
    
    $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };
	
    $scope.sort_by = function(predicate) {
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};

	$scope.proposals = [];
	$scope.dayClicked = function(day) {
		$scope.setGridData(day);
	};
	
	$scope.setGridData = function(day) {
		//$scope.proposals.length = 0;
		$scope.proposals = [];
		var dueDate = new Date(day);
		var key =  dueDate.getDate() + '/' + (dueDate.getMonth()+1) + '/' + dueDate.getFullYear();
		for( var mapIndex in $scope.Map) {
	   		if(key == mapIndex){
	   			$scope.proposals = $scope.Map[mapIndex];
	   		}
	   	}
		
 		$scope.totalItems = $scope.proposals.length;
        $scope.currentPage = 1; //current page

        $scope.entryLimit = 5; //max no of items to display in a page
        $scope.filteredItems = $scope.proposals.length;
         $scope.sort_by('id');

	}

	$scope.getPath = function(proposal)
	{
		var linkPath = '#/proposal/proposal-line-item/'+proposal.id;
		return linkPath;
				
	}
	
  });
