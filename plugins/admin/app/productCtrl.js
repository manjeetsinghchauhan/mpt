app.filter('startProductFrom', function() {
	return function(input, start) {
		if (input  && Object.keys(input).length>0) {
			start = +start; // parse to int
			return input.slice(start);
		}
		return [];
	}
});

app.filter('startAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.splice(start);
	 }
	 return [];
	 }
});

app.controller('productCtrl', function($scope, $modal, $rootScope, $location, Data, $http, cssInjector, ModalService, Validation) {
	cssInjector.add("plugins/admin/css/admin-style.css");
	
	$http.get('plugins/admin/js/products-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;    
      });
	
	$scope.products = {};
	$scope.rowClicked = false;
	
	$scope.productFlag = true;
	$scope.productAttributeFlag  = true;
	
	$scope.types = [
	                {value: 'Expandable', text: 'Expandable'},
                    {value: 'Image', text: 'Image'},
	                {value: 'Rich Media', text: 'Rich Media'},
	                {value: 'Video', text: 'Video'},
                    {value: 'Video Interstitial', text: 'Video Interstitial'}
                ]; 
	
	$scope.classes = [
	                {value: 'Display Cross Platform', text: 'Display Cross Platform'},
	                {value: 'Email', text: 'Email'},
	                {value: 'Mobile', text: 'Mobile'},
	                {value: 'Programmatic', text: 'Programmatic'},
	                {value: 'Tablet', text: 'Tablet'},
	                {value: 'Web', text: 'Web'}                    
                ];
	
	$scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/admin/product') > -1){
        	return true;
        } 
		
    };
    
    $rootScope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };

// make a row selected
	$(document).ready(function(){
		 $('#productTable').on('click', 'tbody tr', function(event) {
		    $(this).addClass('selectedRow').siblings().removeClass('selectedRow');
		});
	 })	
	 
	 /*
	  * Removes current row from product table
	  */
	  function removeCurrentProduct(product){
		  var index =$scope.products.indexOf(product); 
		  $scope.products.splice(index,1);
	  };
		
	Data.get('salestargets').then(function(data) {
		$scope.salesTargets=data.data;	
	});
	
	Data.get('creatives').then(function(data) {
		$scope.creativesList = data.data;
	});
	
	  
	  /*
		 * Retrieves products data from backend and dispalys on screen
		 */
	

	$scope.getProducts = function () {
		Data.get('products').then(function(data) {
			var tempData = data.data.slice(0);
			tempData.forEach(function(value,i){
				var tempSTLData = angular.extend({},tempData[i]);
				data.data[i].salesTargetList = [];
				data.data[i].salesTargetData = [];
				for(var j=0;j<tempSTLData.salesTargetList.length;j++){
					data.data[i].salesTargetList.push({'id' :tempSTLData.salesTargetList[j].id});
					data.data[i].salesTargetData.push(tempSTLData.salesTargetList[j]);
				}
			});
			$scope.products = data.data;
			$scope.totalItems = $scope.products.length;
			$scope.currentPage = 1; // current page
			$scope.entryLimit = 10; // max no of items to display in a page
			$scope.filteredItems = $scope.products.length;
			$scope.sort_by_id('id');
			$scope.productAtrributes=$scope.products[0].attributes;
			$scope.filteredAttributeItems = $scope.products[0].attributes.length;
		});
	};
    
	$scope.getProducts();
	
	$scope.showSalesTargetName = function(product) {
		    var selected = [];
		    angular.forEach(product.salesTargetData, function(s) { 
		        selected.push(s.name);
		    });
		    return selected.length ? selected.join(', ') : 'Not set';
	  };
  
	$scope.reverse = false;
	$scope.sort_by = function(predicate) {
		if ($scope.productFlag) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		}
	};

	$scope.sort_by_id = function(predicate) {
		$scope.predicate = predicate;
		$scope.reverse = true;
	};
	
	// update Attribute
	$scope.saveProduct = function(data, product) {
		angular.extend(data, {id : product.id});
		data.attributes = [];
		for(var index  in product.attributes){
			data.attributes.push({'id': product.attributes[index].id});
		}
		var creativeId = data.creative;
		 var validationResult = Validation.validationCheck("products",data);
		if (validationResult.value) {
			$scope.showWarnigModal(validationResult.error);
			productform.$show();
			/* $scope.products.splice($scope.products.length-1, 1); */
		}else{
			var tempSalesTarget = [];
			for(var index  in data.salesTargetList){
				if(data.salesTargetList[index].id != undefined){
					tempSalesTarget.push({"id": data.salesTargetList[index].id});
				}
				else {
					tempSalesTarget.push({"id": data.salesTargetList[index]});
				}
			}
			data.salesTargetList.length = 0;
			data.salesTargetList  = tempSalesTarget;

			data.creative = {"id":data.creative};
			
			Data.post('products', data).success(function(result){
          	  var index =$scope.products.indexOf(product); 
                $scope.products[index].id = result.id; 
               $scope.creativesList.forEach(function(value,i){
            	  if(value.id == creativeId) {
            		  $scope.products[index].creative = value;
            		  data.creative = value;
            	  }
               });
               $scope.getProducts();
               $scope.productFlag = true;
          }).error(function(result){
        	  $scope.getProducts();
        	  $scope.productFlag = true;
          });
		  
		  
		  $scope.inserted = {
			id:-1,
			name : '',
			displayName : '',
			description : '',
			note : '',
			type : '',
			classs : '',
			custom1 : '',
			custom2 : ''
		};
		}
		
	};

	// delete Product
	$scope.removeProduct = function(variable) {
		$scope.productDeleteWarnigModal(variable);
	};
	
	// add Product
	$scope.addProduct = function() {
		if( $scope.productFlag){
			$scope.sort_by_id('id');
			$scope.inserted = {
					name : '',
					displayName : '',
					description : '',
					note : '',
					type : '',
					classs : '',
					custom1 : '',
					custom2 : '',
					salesTargetList:[],
					creative:'',
					basePrice:'',
				};
				$scope.currentPage = 1;
				$scope.products.push($scope.inserted);
				$scope.totalItems = $scope.products.length;
				$scope.filteredItems = $scope.products.length;
				$scope.filteredAttributeItems = $scope.products[0].attributes.length;
				$scope.productFlag = false;
		}
	};
	
// cancel insertion or editing
	$scope.cancelProductEdit=function(self){
		 var currentRow = self.product;
		  if(currentRow.name == ""){
			  removeCurrentProduct(currentRow);
		  }
		  $scope.productFlag = true;
	};

	$scope.productDeleteWarnigModal = function(variable) {
		ModalService.showModal({
	  	templateUrl: 'modal.html',
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	    	if (result === 'Yes') {
	    		Data.delete('products/'+variable.product.id).then(function(result){
		  			  removeCurrentProduct(variable.product);
		  		});
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
		 $scope.showWarnigModal = function(msg) {
			 var modalTemplate = alertBox(msg);
				ModalService.showModal({
			  	template: modalTemplate,
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
				$scope.productFlag = false;
			}

			$scope.textAreaAdjust = function(o) {
			    o.style.height = (o.scrollHeight)+"px";
			} 
	


			
			  $scope.selectedProduct = {};
			  var attributeContainer;
			  $scope.fetchAttributes = function(product_id){
				  $scope.rowClicked = true;
				  //$scope.selectedProduct = self.product;
				  for(var productDataIndex in $scope.products){
						 if($scope.products[productDataIndex].id == product_id) {
							 $scope.selectedProduct = $scope.products[productDataIndex];
						 }
				  }
				  
				  $scope.selectedProduct.attributeGrid = {};
				  $scope.selectedProduct.attributeGrid.attributes = [];
				  Data.get('products/'+product_id).then(function(result){
					    $scope.products.forEach(function(data,i){
					    	data.showAttributes = false;
					    })
						
						$scope.selectedProduct.attributeEdit = false;
				  		$scope.selectedProduct.attributeAssociate = true;
					  	$scope.selectedProduct.showAttributes = true;
					    $scope.selectedProduct.attributeGrid={};
						$scope.selectedProduct.attributeGrid.attributes = result.data.attributes;
						$scope.selectedProduct.totalAttributeItems = $scope.selectedProduct.attributeGrid.attributes.length;
						$scope.selectedProduct.attributeCurrentPage = 1; //current page
						$scope.selectedProduct.attributeEntryLimit = 5; //max no of items to display in a page
						$scope.selectedProduct.attributeFilteredItems = $scope.selectedProduct.attributeGrid.attributes.length;
						$scope.sortAttribute_by_id('id');
						$scope.productAttributeFlag = true;
						
				  });
			  }
			  
			  $scope.sortAttribute_by = function(predicate) {
				  if ($scope.productAttributeFlag) {
					  $scope.attributePredicate = predicate;
					  $scope.reverseAttribute = !$scope.reverseAttribute;
				  }
			  };

			  $scope.sortAttribute_by_id = function(predicate) {
				  $scope.attributePredicate = predicate;
				  $scope.reverseAttribute = true;
			  };
			  
				$scope.attributeList=[];

				/*
				 * Insert Blank row on the top of Attribute Table
				 */
				$scope.addAttribute = function() {
					
					if ($scope.productAttributeFlag) {
						$scope.sortAttribute_by_id('id');
						if(!$scope.selectedProduct.attributeGrid.attributes){
							$scope.selectedProduct.attributeGrid.attributes = [];
						}
						$scope.selectedProduct.attributeEdit = false;
					  	$scope.selectedProduct.attributeAssociate = true;
					  	$scope.selectedProduct.attributeList = [];
						
						Data.get('attributes').then(function(result){
							angular.forEach(result.data, function(list){
								if (list.type==="Product") {
									$scope.selectedProduct.attributeList.push(list);
								}
							});
						});

						 $scope.selectedProduct.inserted = {
								  name: '',
//								  type: '',
								  description: '',
								  value: '',
								  
						  };
						 $scope.selectedProduct.attributeGrid.attributes.splice(0,0,$scope.selectedProduct.inserted);
						 $scope.selectedProduct.attributeCurrentPage = 1; //current page
						 $scope.selectedProduct.attributeFilteredItems = $scope.selectedProduct.attributeGrid.attributes.length; 
						$scope.productAttributeFlag = false;
					}
					
				};

				
				  /*
				 * To select and populate attribute in attribute table in order to
				 * assocciate it with selected product
				 */
			  $scope.selectAttribute = function(self){
				  var index = $scope.selectedProduct.attributeGrid.attributes.indexOf(self.$parent.attribute); 
				  $scope.selectedProduct.attributeGrid.attributes[index].type = self.$data.type;
				  $scope.selectedProduct.attributeGrid.attributes[index].description = self.$data.description;
				  $scope.selectedProduct.attributeGrid.attributes[index].value = self.$data.value;
				  $scope.selectedProduct.attributeGrid.attributes[index].id = self.$data.id;
			  }
			  
			  /*
				 * Saves or Updates attribute for creative
				 */
			  $scope.saveAttribute = function(data, attribute,self) {
				  if(!$scope.selectedProduct.attributes){
					  $scope.selectedProduct.attributes = [];
				  }
				  $scope.selectedProduct.attributes.push({"id":attribute.id});
				  
				  var tempSalesTarget = [];
				  var backupSalesTarget =  $scope.selectedProduct.salesTargetList.slice(0);
				  
				  if($scope.selectedProduct.salesTargetList.length == 0 || $scope.selectedProduct.salesTargetList[0].id == undefined) {
					  $scope.selectedProduct.salesTargetList.forEach(function(value,i){
							tempSalesTarget.push({"id":value});
						});
					  $scope.selectedProduct.salesTargetList  = tempSalesTarget;  
				  }
				  
				  $scope.selectedProduct.creative = {"id":$scope.selectedProduct.creative.id};
				  var postData = prepareJSON($scope.selectedProduct);
				  var validationResult = Validation.validationCheck("attribute",data.id ? data : data.name);
			      
				  if(validationResult.value){
			        	$scope.selectedProduct.salesTargetList = tempSalesTarget;
			        	$scope.showWarnigModal(validationResult.error);
			        	attributeform.$show();
			        }
				  else{
					  if($scope.selectedProduct.attributeEdit){
						  Data.put('attributes', data.id ? data : data.name).then(function(result){
							  /* console.log(result); */
						  });
					  } else {
						  Data.put('products', postData).success(function(result){
							 // var index =$scope.selectedProduct.attributeGrid.attributes.indexOf(attribute); 
							 //$scope.selectedProduct.attributeGrid.attributes[index].name = attribute.name.name; 
							  
							  $scope.selectedProduct.attributeGrid.attributes = result.attributes;
							 // $scope.selectedProduct.salesTargetList = backupSalesTarget;
							  $scope.selectedProduct.inserted = {
									  	id:-1, name: '', // type: '',
									  	description: '', value: ''
							  		};
							  $scope.productAttributeFlag =  true;
						  }).error(function(result){
							  var currentRow = self.attribute;
							  removeCurrentAttribute(currentRow);
							  $scope.productAttributeFlag =  true;
						  });
					  }
				  }
			  };
		  
				/*
				 * Prepare Attribute JSON
				 */
				function prepareJSON (product){
					
					var tempJSON = {};
					tempJSON.id= product.id;
					tempJSON.name = product.name;
					tempJSON.type = product.type;
					tempJSON.description = product.description;
					tempJSON.attributes = product.attributes;
					tempJSON.salesTargetList = product.salesTargetList;
					tempJSON.classs = product.classs;
					tempJSON.basePrice = product.basePrice;
					tempJSON.creative = product.creative;
					return tempJSON; 
				}
				
				  /*
				 * Cancel Editing Row in Attribute Table
				 */
			  $scope.cancelAttributeEdit = function(self){
				  var currentRow = self.attribute;
				  if(currentRow.name == "" || currentRow.type == "" ||$scope.selectedProduct.attributeAssociate){
					  removeCurrentAttribute(currentRow);
				  }
				  $scope.productAttributeFlag = true;
			  	};
			  	
				  /*
				 * Removes current row from attribute table
				 */
			  function removeCurrentAttribute(attribute){
				  var indexToDelete;
				  $scope.selectedProduct.attributeGrid.attributes.forEach(function(value,i){
					  if(value.id == attribute.id){
						  indexToDelete = i;  
					  }
				  })
				  
				  
//				  var index =$scope.selectedProduct.attributeGrid.attributes.indexOf(attribute); 
				  $scope.selectedProduct.attributeGrid.attributes.splice(indexToDelete,1);
				  $scope.selectedProduct.attributeFilteredItems = $scope.selectedProduct.attributeGrid.attributes;
			  };
			  
			  
			  /*
				 * Delete Attribute from attribute table
				 */
				  $scope.removeAttribute = function(self) {
					  $scope.deleteWarnigAttributeModal(self);
				  };
				  
					 $scope.deleteWarnigAttributeModal = function(self) {
							ModalService.showModal({
						  	templateUrl: 'modal.html',
						    controller: "ModalController"
						  }).then(function(modal) {
						    modal.element.modal();
						    modal.close.then(function(result) {
						    	if (result === 'Yes') {
						    		removeCurrentAttribute(self.attribute);
						    		
						    		var productData = self.$parent.product;
						    		productData.attributes.length = 0;
						    		
						    		for(var prodAttIndex in $scope.selectedProduct.attributeGrid.attributes){
						    			if($scope.selectedProduct.attributeGrid.attributes[prodAttIndex].id != undefined && $scope.selectedProduct.attributeGrid.attributes[prodAttIndex].name != "") {
						    				productData.attributes.push({"id":$scope.selectedProduct.attributeGrid.attributes[prodAttIndex].id});
						    			}
						    		}
						    		var jsonString = prepareJSON(self.$parent.product);
						  		  	Data.put('products' , jsonString).then(function(result){
						  		  		console.log(result);
						  		  		$scope.productAttributeFlag = true;
						  		  	});
						      }
						    });
						   });
					 };
					 
						/*for hiding the inner grid*/
					  	
					  	$scope.hide=function(self){
					  		self.product.showAttributes = false;
					  		$scope.productAttributeFlag = true;
					  	}
					  	
					  	$scope.getProductFlag = function() {
							return $scope.productFlag;
						}
});
