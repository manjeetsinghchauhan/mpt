app.filter('startaAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('attributeCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector, ModalService, Validation) {
	
	cssInjector.add("plugins/admin/css/admin-style.css");
	$http.get('plugins/admin/js/attribute-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
    });

	$scope.attributeFlag = true;
	
	$scope.show = function(variable) { 
		ModalService.showModal({ 
			templateUrl: 'modal.html',
			controller: "ModalController"
		}).then(function(modal) {
			modal.element.modal();
		  	modal.close.then(function(result) {
		  		if (result === 'Yes') {
		  			Data.delete('attributes/'+variable.attribute.id).then(function(result) {
		  				removeCurrentAttribute(variable.attribute);
		  			});
		  		}
		  	});
		  });
	};

	function alertBox(msg) {
		var modalBody = '<div class="modal fade">'+
							'<div class="modal-dialog dialog-size-position">'+
								'<div class="modal-content">'+
									'<div class="modal-header dialog-header-warnig">'+
										'<button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
										'<span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
										'<span class="modal_title">Warning'+
										'</span>'+
									'</div>'+
									'<div class="modal-body">'+
										'<p>'+msg+'</p>'+
									'</div>'+
									'<div class="modal-footer modal-cuntom-footer">'+
										'<button type="button" ng-click="close(\'editModal\')" class="btn btn-primary" data-dismiss="modal">Ok</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'	;
				return modalBody;
	};
		
	$scope.showEditModal = function (msg) {
		var ModalTemplate = alertBox(msg);
		ModalService.showModal({
		  	template: ModalTemplate,
		    controller: "ModalController"
		}).then( function (modal) {
			modal.element.modal();
		    modal.close.then(function(result) {

		    });
		});
	};

	$scope.attributes = {};
	$scope.isActive = function (viewLocation) {
        if(viewLocation === '/admin') {
        	return true;
        }
    };

    $rootScope.isActive = function (viewLocation) {
        if(viewLocation === '/admin') {
        	return true;
        }
    };

    $scope.types = [
                       {value: 'Creative', text: 'Creative'},
                       {value: 'Product', text: 'Product'}
                   ];

   
    
    $scope.getAttributes = function () {
    	 Data.get('attributes').then ( function (data) {
    	        $scope.attributes = data.data;
    	        $scope.totalItems = $scope.attributes.length;
    	        $scope.currentPage = 1; // current page

    	        $scope.entryLimit = 10; // max no of items to display in a page
    	        $scope.filteredItems = $scope.attributes.length;
    	        // Initially for no filter
    			/* $scope.predicate='id'; */
    	         $scope.sort_by_id('id');
    	        // $scope.reverse = true;
    	    });
    }

    $scope.getAttributes();
    
    $scope.sort_by = function (predicate) {
    	// console.log(predicate);
		if ($scope.attributeFlag) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		} 
    	
	};
	$scope.sort_by_id = function (predicate) {
	    	// console.log(predicate);
			 $scope.predicate = predicate;
			 $scope.reverse = true;
	};

    // update Attribute
    $scope.saveAttribute = function (data, attribute) {
        // $scope.Attribute not updated yet
        angular.extend(data, {id: attribute.id});
        var validationResult = Validation.validationCheck("attribute",data);
        if (validationResult.value) {
        	$scope.showEditModal(validationResult.error);
        	rowform.$show();
        } else { 
			Data.post('attributes', data).success( function (result) {
				var index =$scope.attributes.indexOf(attribute);
		        $scope.attributes[index] = result;
		        $scope.sort_by_id('id');
		    }).error( function (result) {
		    	$scope.getAttributes();
		    });
			
			$scope.inserted = {
		      id: -1,
		      name: '',
		      type: '',
		      value: '',
		      description: ''
		    };
			$scope.attributeFlag = true;
		}
      };

	  // remove Attribute
	  $scope.removeAttribute = function (variable) {
			$scope.show(variable);
	  };

	  // add Attribute
	  $scope.addAttribute = function() {
	   if( $scope.attributeFlag) {
		   $scope.sort_by_id('id');
		   $scope.inserted = {
				      name: '',
				      type: '',
				      value: '',
				      description: ''
				    };
					$scope.currentPage = 1;
				    $scope.attributes.push($scope.inserted);
				    $scope.totalItems = $scope.attributes.length;
				    $scope.filteredItems = $scope.attributes.length; 
	   		};
	   		$scope.attributeFlag = false;
	  };

// cancel insertion
		$scope.cancel= function (product, index, productform) {
			if (product.name==="") {
				$scope.attributes.splice($scope.attributes.length-1, 1);
			}else {
				productform.$cancel()
			}
			$scope.attributeFlag = true;
		};

		/*
		 * Removes current row from attribute table
		 */
		  function removeCurrentAttribute(attribute) {
			  var index =$scope.attributes.indexOf(attribute);
			  $scope.attributes.splice(index,1);
		  };

		  /*
			 * $scope.showType = function(attribute) { var selected = [];
			 * if(attribute.type) { selected = $filter('filter')($scope.types,
			 * {value: attribute.type}); } return selected.length ?
			 * selected[0].text : 'Not set'; };
			 */
		  
		  $scope.bindTextareaAuto = function() {
				if($scope.attributeFlag){
					$(".editable-textarea").find("textarea").on("keydown", function() {
						$scope.textAreaAdjust(this);
					});
					$scope.attributeFlag = false;
				}
			  	
			}
		  	
		  $scope.getAttributeFlag = function () {
			  return $scope.attributeFlag;
		  }
		  
			$scope.textAreaAdjust = function(o) {
			    o.style.height = (o.scrollHeight)+"px";
			}
});
