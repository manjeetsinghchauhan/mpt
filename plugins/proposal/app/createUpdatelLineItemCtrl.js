app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('createUpdatelLineItemCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) {
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
	
	$scope.newLineItem = {};
	var valArr = $routeParams.id.split('-');
	$scope.proposalId = valArr[1];
	$scope.lineItemlId = valArr[3];
	$(document).ready(function () {
		setTimeout(function(){
			$('#lineItemStartDate').datetimepicker();
			$('#lineItemEndDate').datetimepicker();
			$('#lineItemStartDate').datetimepicker("option","minDate", new Date($rootScope.currentProposal.startDate));
			$('#lineItemEndDate').datetimepicker("option","maxDate", new Date($rootScope.currentProposal.endDate));
		},100) 
   });
//	$scope.$watch("newLineItem.startDate", function(newVal, oldVal) {
//		setTimeout(function(){$('#lineItemEndDate').datetimepicker( "option", "minDate", new Date($scope.newLineItem.startDate));},1000);
//	});
//	$scope.$watch("newLineItem.endDate", function(newVal, oldVal) {
//		setTimeout(function(){$('#lineItemStartDate').datetimepicker( "option", "maxDate", new Date($scope.newLineItem.endDate))},1000);
//	});
	$scope.targetTypeOptions = [
            { value: 'country', label: 'Country'},
            { value: 'age', label: 'Age'},
            { value: 'zipcodes', label: 'Zip Codes'}
           ];
  	
  	$scope.specTypeOptions = [
          { value: 'rich-media', label: 'Rich Media'},
          { value: 'html-5', label: 'HTML 5'},
          { value: 'standard', label: 'Standard'},
          { value: 'text', label: 'Text'},
          { value: 'video', label: 'Video'}
         ];
  	
  	$scope.priceTypeOptions = [
  	      { value: 'cpm', label: 'CPM'},
          { value: 'cpc', label: 'CPC'},
          { value: 'cpa', label: 'CPA'},
          { value: 'cpd', label: 'CPD'}
         ];
	
  	$scope.priorityTypeOptions = [
      	      { value: 'standarad', label: 'Standarad'},
              { value: 'preemptible', label: 'Preemptible'},
              { value: 'exclusive', label: 'Exclusive'}
         ];
      	$scope.statusTypeOptions = [
      	     
              { value: 'active', label: 'Active'},
              { value: 'delivering', label: 'Delivering'},
              { value: 'completed', label: 'Completed'},
              { value: 'ready', label: 'Ready'},
         ];
	$scope.product = 'eq';
	$scope.selectedProductVal = 'neq';
	$scope.salesTarget = 'eq';
	$scope.selectedSalesTarget = 'neq';
	$scope.newLineItem = {};
	
	$scope.getSalestargets = function () {
		var id = $scope.newLineItem.product;
		Data.get('products/'+id).then(function(data) {
			$scope.salesTargetList = data.data.salesTargetList;
		});
	};
	
	$scope.getBasePrice = function () {
		var id = $scope.newLineItem.product;
		Data.get('products/'+id).then(function(data) {
			$scope.newLineItem.basePrice = data.data.basePrice;
		});
		
	};
	
	$scope.productList = [];
	
	  Data.get('products').then(function(data) {
		  $scope.productList = data.data;
	  });
	  
	  	
	  
	  Data.get('proposals/'+$scope.proposalId).then(function(data) {
		  $scope.salesCategory = data.data.salesCategory;
	  });
	  
	  
/*	  $scope.getPlacementName = function () {
			var id = $scope.newLineItem.product;
			Data.get('products/'+id).then(function(data) {
				$scope.newLineItem.placeHolder = data.data.name+" in "+$scope.salesCategory;
				
			});
		};*/
	 
   $scope.cancelLineItem = function() {
			  $location.path('/proposal/proposal-line-item/'+$scope.proposalId );
   };
	  
	$scope.getLineItemData = function(id) {
		Data.get('line-items/'+id).then(function(data){
	    	$scope.lineItemData  = data.data;
	    	$scope.newLineItem.selectedProductVal = $scope.lineItemData.product.id;
	    	var tempStartDate = new Date($scope.lineItemData.startDate);
	    	var tempEndDate = new Date($scope.lineItemData.endDate);
	    	$('#lineItemStartDate').datetimepicker("setDate", tempStartDate);
	    	$('#lineItemEndDate').datetimepicker("setDate", tempEndDate);
			 $scope.newLineItem.price=$scope.lineItemData.price;
			 $scope.newLineItem.offeredQuantity=$scope.lineItemData.offeredQuantity;
			 $scope.newLineItem.basePrice=$scope.lineItemData.basePrice;
			 $scope.newLineItem.custom2=$scope.lineItemData.custom2;
			 $scope.newLineItem.id=$scope.lineItemData.id;
			 $scope.newLineItem.product=$scope.lineItemData.product.id;
			 $scope.newLineItem.paymentModel=$scope.lineItemData.paymentModel;
			 $scope.newLineItem.specTypeOption=$scope.lineItemData.custom3;
			 $scope.newLineItem.deliveryPriority=$scope.lineItemData.deliveryPriority;
			 $scope.newLineItem.deliveryStatus=$scope.lineItemData.deliveryStatus;
			 $scope.newLineItem.placeHolder=$scope.lineItemData.placeHolder;
			 $scope.newLineItem.investment=$scope.lineItemData.investment
			 Data.get('products/'+ $scope.newLineItem.product).then(function(data) {
				$scope.salesTargetList = data.data.salesTargetList;
				$scope.selectedSalesTarget = $scope.lineItemData.salesTargets;
				$scope.selectedSalesTarget.forEach(function(selectedValue,i){
					$scope.salesTargetList.forEach(function(value,j){
						if(selectedValue.id == value.id){
							value.ticked = true;
						}
					})
					selectedValue.ticked = true;
				})
				
			});
			 $scope.newLineItem.custom4=$scope.lineItemData.custom4;
			 var tempTargetList = [];
			 $scope.lineItemData.targets.forEach(function(value,i){
				 $scope.targetListElements.push({"name":{"id":value.category.id,"name":value.category.name},"value":{"id":value.id,"value":value.value}});
			 })
	   });
	} 
	
	if($scope.lineItemlId > 0){
		$scope.getLineItemData($scope.lineItemlId);
	} else {
		
	}
	$scope.targetListElements=[];
	$scope.isedittableItem=false;
	var selectedElementId;
	
	
	Data.get('proposals/'+$scope.proposalId).then(function(data) {
		$scope.proposal = data.data;
		$scope.proposalStartDate=$scope.proposal.startDate;
		$scope.proposalEndDate=$scope.proposal.endDate;
		
	});
	
	
	 $scope.getInvestment = function () {
		 var quentity=parseInt($scope.newLineItem.offeredQuantity);
		 var offeredPrice= $scope.newLineItem.price
		 if (quentity>0 &&  offeredPrice>0){
			 $scope.newLineItem.investment = ((quentity*offeredPrice)/1000);
	     }	else{
	    	 
	     }
			
		};
	
	$scope.$watch("selectedSalesTarget", function(newVal, oldVal) {
		var segmentName = "";
		if($scope.selectedSalesTarget !=null && $scope.selectedSalesTarget != ""){
			console.log($scope.selectedSalesTarget);
			for(var st in $scope.selectedSalesTarget){
				console.log($scope.selectedSalesTarget[st]);
				segmentName = segmentName + (segmentName != "" ? "-": '');
				segmentName = segmentName + $scope.selectedSalesTarget[st].name;
			}
		}
		if(segmentName != "") {
			var productName = "";
			for(var prodIndex in $scope.productList){
				if($scope.newLineItem.product == $scope.productList[prodIndex].id) {
					productName = $scope.productList[prodIndex].name;
				}
			}
			if(productName != "" ) { 
				$scope.newLineItem.placeHolder  = productName + ' in ' + segmentName;
			}
		} else {
			$scope.newLineItem.placeHolder = "";
		}
	});
		
		
	$scope.checkErrors = false;
	 $scope.showDateError = false;
	$scope.saveEdittedLineItem = function(){
		  $scope.checkErrors = true;
		  $scope.$broadcast('show-errors-check-validity');
		  if($scope.lineItemForm.$error.required != undefined && $scope.lineItemForm.$error.required.length > 0){
			  return;
		  } 			
		  if ($scope.lineItemForm.$invalid ){ 
			  return; 
		  }	
		  if(new Date($scope.newLineItem.startDate).getTime() > new Date($scope.newLineItem.endDate).getTime()){
			  $scope.showDateError = true;
			  return;
		  }
		var lineitemID=$scope.id;
		$scope.salesTarget =[];
		for(var val in $scope.selectedSalesTarget){
			$scope.salesTarget.push({id: $scope.selectedSalesTarget[val].id});
		}
		if($scope.salesTarget.length == 0){
			$scope.isSalesTargetListCheckErrors  = true;
			 return;
		} else {
			$scope.isSalesTargetListCheckErrors  = false;
		}
		
		var targets = []
		$scope.targetListElements.forEach(function(value,id){
			targets.push({"id":value.value.id});
		})
		var startDate1=new Date($scope.proposalStartDate).getTime();
		var endDate1=new Date($scope.proposalEndDate).getTime();
		
		$scope.inserted = {
				id:  $scope.newLineItem.id, 
				product:{"id": parseInt($scope.newLineItem.product)},
				proposal: {"id": parseInt($scope.proposalId)},
				startDate: new Date($scope.newLineItem.startDate).getTime(),
				endDate: new Date($scope.newLineItem.endDate).getTime(),
			    paymentModel:  $scope.newLineItem.paymentModel,
			    basePrice:  $scope.newLineItem.basePrice,
			    price:  $scope.newLineItem.price,
			    offeredQuantity:  parseInt($scope.newLineItem.offeredQuantity),
			    custom2:  $scope.newLineItem.custom2,
			    targets:targets,														// to be implemented
			    salesTargets:$scope.salesTarget,										// working
			    custom3: $scope.newLineItem.specTypeOption,
			    custom1:  $scope.targettingString,
			    deliveryPriority: $scope.newLineItem.deliveryPriority,
			    deliveryStatus: $scope.newLineItem.deliveryStatus,
			    placeHolder: $scope.newLineItem.placeHolder,
				custom4: $scope.newLineItem.custom4,
				investment: $scope.newLineItem.investment
		    };
		if($scope.newLineItem.id > 0){
			Data.put('line-items', $scope.inserted).then(function(result){
		      	console.log('result ',result);
				$location.path('/proposal/proposal-line-item/'+$scope.proposalId);
		    });
			
		}else{
			 Data.post('line-items', $scope.inserted).then(function(result){
			    	$location.path('/proposal/proposal-line-item/'+$scope.proposalId);
			   });
		}
	};
	
	
	
	// target list elements
	$scope.countries=[];
	
	Data.get('targetcategory').then(function(result){
      	$scope.targetTypeOptions=result.data;
    });
	
	 $scope.getElements=function(){
		 Data.get('targetcategory/'+ $scope.targetTypeOption.id).then(function(result){
		     console.log(result.data); 	
		    	 $scope.elementArray=result.data.values;
		 });
	 };
	 
	// add target list element
	$scope.addElement=function(){
	
	var newElement={};
		newElement.value={};
		newElement.name=$scope.targetTypeOption;
		if($scope.targetTypeOption.name==="Zip Code"){
			newElement.value.id=$scope.targetListElements.length+1;
			newElement.value.value=$scope.zipcode;
		}else{
			newElement.value=$scope.element;
		}

		//for adding new list element
		if($scope.isedittableItem==false){
			newElement.id=$scope.targetTypeOption.id;
			$scope.targetListElements.push(newElement);
		}
		// to save the editted element
		else{
			var index = -1;
			angular.forEach($scope.targetListElements, function(targetListElement, i) { 
			  index++;
			  if (selectedElementId === targetListElement.id) {
				index = i ;
			  }
			});
			$scope.targetListElements[index] = newElement;

			$scope.isedittableItem=false;
		}
		if($scope.targetTypeOption.name==="Zip Code"){
			
			$scope.zipcode="";
			$scope.element={};
		}else{
			$scope.element={};
		}
		$scope.targetTypeOption={};
	};
	
	//edit target list element
	$scope.editTargetListItem=function(targetListElement){
		$scope.targetTypeOption=targetListElement.name;
		$scope.element=targetListElement.value;
		selectedElementId=targetListElement.id;
		$scope.isedittableItem=true;
		};
		
	//delete target list item	
	$scope.deleteTargetListitem=function(targetListElement){
		var editableItemIndex = $scope.targetListElements.indexOf(targetListElement);
		$scope.targetListElements.splice(editableItemIndex,1);
		$scope.targets.splice(editableItemIndex,1);														// to be implemented
		
	};
	
});
