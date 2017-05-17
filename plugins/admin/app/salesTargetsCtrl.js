app.filter('startaAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('salesTargetsCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector, ModalService, Validation) { 
	cssInjector.add("plugins/admin/css/admin-style.css");
	
	$http.get('plugins/admin/js/sales-targets-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;    
      });
	
	$scope.salestargetFlag = true;
	
	$scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/admin/salestargets') > -1){
        	return true;
        }
		
    };
    $rootScope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };
	$scope.attributes = {};
    
    $scope.getSalestargets = function () {
    	  Data.get('salestargets').then(function(data){
    	        $scope.attributes = data.data;
    	        $scope.totalItems = $scope.attributes.length;
    	        $scope.currentPage = 1; //current page
    	        
    	        $scope.entryLimit = 10; //max no of items to display in a page
    	        $scope.filteredItems = $scope.attributes.length; 
    	        //Initially for no filter
    			/* $scope.predicate='id'; */
    	        $scope.sort_by_id('id');
    	        //$scope.reverse = true;
    	    });
    };
    
    $scope.getSalestargets();
    
    $scope.sort_by = function(predicate) {
    	//console.log(predicate);
		if ($scope.salestargetFlag) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		} 
    	
	};
	
	 $scope.sort_by_id = function(predicate) {
	    	//console.log(predicate);
			 $scope.predicate = predicate;
			 $scope.reverse = true;
	};
    
    // update Attribute
    $scope.saveAttribute = function(data, attribute) {
        //$scope.Attribute not updated yet
        angular.extend(data, {id: attribute.id});
        var validationResult = Validation.validationCheck("salesTargets",data);
        if(validationResult.value){
        	$scope.salesTargetsWarnigModal(validationResult.error);
        	rowform.$show();
        }
		else{
			Data.post('salestargets', data).success(function(result){
		      	var index =$scope.attributes.indexOf(attribute); 
		        $scope.attributes[index] = result;
		        $scope.salestargetFlag = true;
		        $scope.sort_by_id('id');
			}).error(function(result){
				$scope.getSalestargets();
				$scope.salestargetFlag = true;
			});
			
			
			$scope.inserted = {
		    		id:-1,
		      name: '',
		      url: '',
		      description: '',
		      custom1: '',
		      custom2:''
		    };
			}
      };
      
	  // remove Attribute
	  $scope.removeAttribute = function(variable,index) {
		  $scope.salesTargetsDeleteWarnigModal(variable);
	  };
	  
//		cancel insertion
		$scope.cancel=function(product,index,productform){
			if (product.name==="") {
				$scope.attributes.splice($scope.attributes.length-1, 1);
			}else {
				productform.$cancel()
			}
			$scope.salestargetFlag = true;
		};
	
	  // add Attribute
	  $scope.addAttribute = function() {
	    if($scope.salestargetFlag){
	    	$scope.sort_by_id('id');
	    	$scope.inserted = {
	    		      name: '',
	    		      url: '',
	    		      description: '',
	    		      custom1: '',
	    		      custom2:''
	    		    };
	    		    $scope.currentPage = 1;
	    		    $scope.attributes.push($scope.inserted);
	    		    $scope.totalItems = $scope.attributes.length;
	    		    $scope.filteredItems = $scope.attributes.length; 
	    		    $scope.salestargetFlag = false;
	    }
	   
	  };
	  
	  /*
	   *  Removes current row from attribute table
	   */
	  function removeCurrentAttribute(attribute){
		  var index =$scope.attributes.indexOf(attribute); 
		  $scope.attributes.splice(index,1);
	  };
	  
	  $scope.salesTargetsDeleteWarnigModal = function(variable) {
			ModalService.showModal({
		  	templateUrl: 'modal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    	if (result === 'Yes') {
		    		Data.delete('salestargets/'+variable.attribute.id).then(function(result){
						  removeCurrentAttribute(variable.attribute);
					  })
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
		};
		$scope.salesTargetsWarnigModal = function(msg) {
			 var modalTemplate = alertBox(msg);
			ModalService.showModal({
		  	template : modalTemplate,
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    });
		   });
		 };
		 $scope.bindTextareaAuto = function(){
				$(".editable-textarea").find("textarea").on("keydown", function(){
					$scope.textAreaAdjust(this);
				});
				$scope.salestargetFlag = false;
			}

			$scope.textAreaAdjust = function(o) {
			    o.style.height = (o.scrollHeight)+"px";
			}
			
			$scope.getSalestargetFlag  = function() {
			   return $scope.salestargetFlag;
			}
			
});
