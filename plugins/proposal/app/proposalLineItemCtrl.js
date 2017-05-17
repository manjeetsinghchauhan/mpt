app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('proposalLineItemCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) { 
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
    };
		
	var proposal_id = $routeParams.id;
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
	
	
	$scope.assignedToUserList = [
         { value: 'admin@star.com', label: 'John Admin'},
         { value: 'mp1@star.com', label: 'Dave Planner'},
         { value: 'mp2@star.com', label: 'Nick Planner'}
       ];
	
	
	//proposals/{id}/user?user=<value>
	
	$scope.getAssignedTo = function() {
		$scope.proposalData.getAssignedToUser = $scope.proposalData.assignedToUser;
		$http({method:'PATCH',url:'http://10.193.66.132:9090/mp/proposals/'+proposal_id+'/user?user='+$scope.proposalData.getAssignedToUser}).success(function(){
		}).error(function(data,status){
			//alert("Fail");
		});
	}
	
	$scope.proposalData = {};
	$scope.lineItems=[];
	var isEditLineItem=false;
	/* $scope.editableLineItem={}; */
	/* $scope.name="klljfklsdf"; */
	
	$scope.getProposal = function(proposal_id) {
		var test1 ='';
    	Data.get('proposals/'+proposal_id).then(function(data){
    	$scope.proposalData  = data.data;
    	var tempData = angular.copy(data.data);
    	$scope.proposalData.nextStatus = nextStatus(tempData.status);
    	$scope.proposalData.startDate = String(new Date(tempData.startDate)).substring(0,21);
    	$scope.proposalData.endDate  = String(new Date(tempData.endDate)).substring(0,21);
    	$scope.proposalData.requestedOn  = String(new Date(tempData.requestedOn)).substring(0,21);
    	$scope.proposalData.dueOn  = String(new Date(tempData.dueOn)).substring(0,21);
    	$scope.proposalData.assignedToUser =$scope.proposalData.user.userId;
		$scope.lineItems= data.data.lineItems;
		$scope.totalItems = $scope.lineItems.length;
		/* $scope.editableLineItem=$scope.lineItems[0]; */
		$scope.currentPage = 1; // current page
        $scope.entryLimit = 10; // max no of items to display in a page
        // Initially for no filter
		/* $scope.predicate='id'; */
         $scope.sort_by('id');
    	});
	};
	
	$scope.sort_by = function(predicate) {
    	// console.log(predicate);
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
	
	// update Line items
   
	  
	  // remove LineItems
	  $scope.removeLineItem = function(variable) {
			$scope.show(variable);
	  };
	  
	  
	  // cancel insertion
		$scope.cancel=function(lineItem,index,lineform){
			if (lineItem.name==="") {
				$scope.lineItems.splice($scope.lineItems.length-1, 1);
			}else {
				lineform.$cancel();
			}
		};
		
		/*
		 * Removes current row from lineItem table
		 */
		  function removeCurrentLineItem(lineItem){
			  var index =$scope.lineItems.indexOf(lineItem);
			  $scope.lineItems.splice(index,1);
		  };
	
	if(proposal_id > 0){
		$scope.getProposal(proposal_id);
	} else {
		
	}
	$scope.editPropsal = function(proposal_id) {
		 $location.path('/proposal/create-proposal/'+proposal_id);
	};

	
	// alert before deleting the values
	$scope.show = function(variable) {
			ModalService.showModal({
		  	templateUrl: 'modal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    	if (result === 'Yes') {
		         	Data.delete('line-items/'+variable.lineItem.id).then(function(result){
		      	  	removeCurrentLineItem(variable.lineItem);
		       		});
		      }
		    });
		   });
		 };
		 
    $scope.showEditModal = function() {
			ModalService.showModal({
		  	templateUrl: 'editModal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    });
		   });
		 };

		 
		 
		 $scope.edit=function(lineItem){
			 $rootScope.currentProposal = {};
			 $rootScope.currentProposal = $scope.proposalData;
			 var val = "propID-"+ $routeParams.id + "-li-"+lineItem.id;
			 $location.path('/proposal/create-line-item/'+ val);
			 isEditLineItem=true;
		 };
	
	// for saving a line edited item
	 // $scope.propId = 0;
	   $scope.addLineItem = function(id) {
		   var val = "propID-"+id + "-li-"+ 0;
		  $location.path('/proposal/create-line-item/'+val);
		  $rootScope.currentProposal = $scope.proposalData;
	  }	 
	 
	// target list elements
	
	$scope.targetListElements=[];
	$scope.isedittableItem=false;
	var editableItemIndex;
	
	// add target list element
	$scope.addElement=function(){
	alert("addelement "+$scope.targetTypeOption.label);
	
	var newElement={};
	
	newElement.targetTypeOption=$scope.targetTypeOption;
	newElement.element=$scope.element;
	newElement.targettingString=$scope.targettingString;
	if($scope.isedittableItem==false){
	$scope.targetListElements.push(newElement);
	}else{
		$scope.targetListElements.splice(editableItemIndex,1);
		$scope.targetListElements.splice(1,editableItemIndex,newElement);
		$scope.isedittableItem=false;
	}
	};
	
	// edit target list element
	$scope.editTargetListItem=function(targetListElement){
		$scope.targetTypeOption=targetListElement.targetTypeOption;
		$scope.element=targetListElement.element;
		$scope.targettingString=targetListElement.targettingString;
		$scope.isedittableItem=true;
		};
		
	// delete target list item
	$scope.deleteTargetListitem=function(targetListElement){
		editableItemIndex = $scope.targetListElements.indexOf(targetListElement);
		//alert("delete "+editableItemIndex);
		$scope.targetListElements.splice(editableItemIndex,1);
		
	};
	$scope.showActionOptions = false; 
	
	function nextStatus(current){
		var statusList = [];
		switch(current){
		case 'Pending':
			if($rootScope.roleName=='ADMIN' || $rootScope.roleName=='PLANNER'){
				statusList.push({'name':'Propose','action':'success'});
			}
		break;
		case 'Proposed':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Reject','action':'fail'});
				statusList.push({'name':'Review','action':'success'});
			}
		break;
		case 'Rejected':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Pending','action':'success'});
			}
		break;
		case 'Review':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Pending','action':'fail'});
				statusList.push({'name':'Sold','action':'success'});
			}
		break;
		case 'Sold':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Signed','action':'success'});
			}
		break;
		}
		return statusList;
	}
	
	$scope.cloneProposal = function(id) {
		var msg = 'Do you want to clone this proposal ?';
		var ModalTemplate = warnigAlertBox(msg);
		ModalService.showModal({
			template: ModalTemplate,
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {
		    	if (result === 'yes') {
		    		Data.post('proposals/'+id+'/clone',{}).success( function(result) {
		    			$scope.editPropsal(result.id);
		        	}).error( function(result) {
		        		console.log(result);
		        	});
		    	}
		    });
		  });
	}
	
	$scope.changeStatus = function(id,action)
	{
		$scope.showStatusWarning(id,action);
	}
	
	$scope.showStatusWarning = function(id,action) {
		ModalService.showModal({
	  	templateUrl: 'changeStatusWarning.html',
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	    	if (result === 'Yes') {
	    		$http({method:'PATCH',url:'http://10.193.66.132:9090/mp/proposals/'+id+'/'+action}).success(function(data,status){
	    			//$scope.showActionOptions=! $scope.showActionOptions;
	    			$scope.proposalData.status = data.status;
	    			$scope.proposalData.nextStatus = nextStatus(data.status);
	    		}).error(function(data,status){});
	         	//Data.patch('proposal/'+id+'/'+action).then(function(result){
	      	  	//removeCurrentAttribute(variable.attribute);
	       	//});
	      }
	    });
	   });
	 };
	
	function alertBox(msg){
		var modalBody = '<div class="modal fade">'+
							'<div class="modal-dialog dialog-size-position">'+
								' <div class="modal-content">'+
								'  <div class="modal-header dialog-header-warnig">'+
								'    <button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
								'  <span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
								'<span class="modal_title">Warning'+
								'</span>'+
								'</div>'+
								'<div class="modal-body">'+
								'   <p>'+msg+'</p>'+
									'</div>'+
									'<div class="modal-footer modal-cuntom-footer">'+
								'   <button type="button" ng-click="close(\'editModal\')" class="btn btn-primary" data-dismiss="modal">Ok</button>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'	;
		return modalBody;
	}
	
	function warnigAlertBox(msg){
		var modalBody = '<div class="modal fade">'+
							'<div class="modal-dialog dialog-size-position">'+
								' <div class="modal-content">'+
								'  <div class="modal-header dialog-header-warnig">'+
								'    <button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
								'  <span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
								'<span class="modal_title">Confirmation'+
								'</span>'+
								'</div>'+
								'<div class="modal-body">'+
								'   <p>'+msg+'</p>'+
									'</div>'+
									'<div class="modal-footer modal-cuntom-footer">'+
								'   <button type="button" ng-click="close(\'yes\')" class="btn btn-primary" data-dismiss="modal">Yes</button>'+
								'   <button type="button" ng-click="close(\'no\')" class="btn btn-default" data-dismiss="modal">No</button>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'	;
		return modalBody;
	}
	
	
	$scope.showEditModal = function(msg) { 
		var ModalTemplate = alertBox(msg);
		ModalService.showModal({
	  	template: ModalTemplate,
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	
	    });
	   });
	 };
});
