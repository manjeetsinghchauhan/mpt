var _URL = window.URL || window.webkitURL;
app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('assetsCtrl', function ($routeParams,$scope,$modalInstance,$rootScope, $location, $modal, Data,data123, $http,$q, cssInjector, $location,fileReader, ModalService, Validation,template)
{
	$scope.searchText = {};
	$scope.selectedCreativeId = '';
	$scope.creativeImageNameValidation = false;
	$scope.creativeURLValidation = false;
	$scope.creativeSizeValidation=false;
	
	$scope.creativeHtmlNameValidation=false;
	$scope.creativeHtmlSizeValidation=false;
	$scope.creativeHtmlCodeValidation=false;
	$scope.upladButtonDivErrorFlag = false;
	$scope.assetModel  = {};
	$scope.creativeSize;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
		};
		
	Data.get('/line-items/'+1).then(function(data){
		$scope.response = data.data;
			if($scope.response && $scope.response.product && $scope.response.product.creative)
				$scope.assetModel.creativeSize=$scope.response.product.creative.width1+'*'+$scope.response.product.creative.height1;
				$scope.assetModel.selectedImageOption=$scope.response.product.creative.width1+'*'+$scope.response.product.creative.height1;
				$scope.assetModel.selectedHTMLOption=$scope.response.product.creative.width1+'*'+$scope.response.product.creative.height1;
	    	});
	
	if(template == 'myModalImage.html'){
			
			 
		}else if(template == 'myModalContent.html'){
			
		}


	
	$('.chooseImage').css('display','none');
	$scope.imagePreview = false;
	var deferred = $q.defer();
	
	$scope.ok = function () {
		if(template == 'myModalContent.html'){
			if($scope.assetModel.creativeHTMLName == '' || $scope.assetModel.creativeHTMLName == undefined){
				$scope.creativeHtmlNameValidation = true;
				$scope.creativeHtmlNameValidationMsg = "Name Should not be empty.";
				$('input[type=text]:first').css('border-color','#a94442');
			}else{
				$scope.creativeHtmlNameValidation=false;
				$('input[type=text]').css('border-color','#3c763d');
			}
			
			if($scope.assetModel.selectedHTMLOption == '' || $scope.assetModel.selectedHTMLOption == undefined){
				$scope.creativeHtmlSizeValidation = true;
				$scope.creativeHtmlSizeValidationMsg = "Size should not be empty.";
				$('select').css('border-color','#a94442');
			}else{
				$scope.creativeHtmlSizeValidation = false;
				$('select').css('border-color','#3c763d');
			}
			
			if($scope.assetModel.htmlText=='' || $scope.assetModel.htmlText==undefined){
				$scope.creativeHtmlCodeValidation = true;
				$scope.creativeHtmlCodeValidationMsg = "Enter Html code.";
				$('textarea').css('border-color','#a94442');				
			}else{
				$scope.creativeHtmlCodeValidation = false;
				$('textarea').css('border-color','#3c763d');
			}
			
						
			if($scope.assetModel.selectedHTMLOption != '' && $scope.assetModel.selectedHTMLOption != undefined){
			
				if($scope.assetModel.creativeHTMLName != '' && $scope.assetModel.creativeHTMLName != undefined){
					$('input[type=text]').css('border-color','#3c763d');				
					if($scope.assetModel.htmlText != ''){
						$('textarea').css('border-color','#3c763d');
						if(window.myFrame.document.body.innerHTML != ''){
							var dimension = $scope.assetModel.selectedHTMLOption.split(" ");
							
							var data = {
									"name": $scope.assetModel.creativeHTMLName,
							        "creativeType": "html",
							        "htmlContent": $scope.assetModel.htmlText,
							        "height": dimension[2],
							        "weight": dimension[0],
							};
							
							var method = '';
							var dialogObj={};
							if($scope.selectedCreativeId != ''){
								data.id = $scope.selectedCreativeId;
								method = "PUT";								
							}else{			
								method = "POST";								
							}
							//TODO Need to make api call to save the html creative
						}else{
							alert('Creative HTML Compilation Error');
						}
					}else{
						$('textarea').css('border-color','#a94442');
					}
				}else{
					$('input[type=text]').css('border-color','#a94442');
				}
			}else{
				$('select').css('border-color','#a94442');
			}
		}else if(template == 'myModalImage.html'){
			if($scope.assetModel.creativeImageName == '' || $scope.assetModel.creativeImageName == undefined){
				$scope.creativeImageNameValidation = true;
				$scope.creativeImageNameValidationMsg = "Name Should not be empty.";
				$('input[type=text]:first').css('border-color','#a94442');
			}else{
				$scope.creativeImageNameValidation = false;
				$('input[type=text]:first').css('border-color','#3c763d');
			}
			
			if($scope.assetModel.creativeImageDestinationURL == '' || $scope.assetModel.creativeImageDestinationURL == undefined){
				$scope.creativeURLValidation = true;
				$scope.creativeURLValidationMsg = "URL should not be empty.";
				$('input[type=url]').css('border-color','#a94442');
			}else{
				if($scope.assetModel.creativeImageDestinationURL != ""){
					var urlexp = new RegExp( '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?[//]?' );
					if($scope.assetModel.creativeImageDestinationURL.match(urlexp) == null) {
						$scope.creativeURLValidation = true;
						$scope.creativeURLValidationMsg = "Invalid URL.";
						$('input[type=url]').css('border-color','#a94442');
					} else {
						$scope.creativeURLValidation = false;
						$('input[type=url]').css('border-color','#3c763d');	
					}
				} 
			}
			
			if($scope.assetModel.selectedImageOption == '' || $scope.assetModel.selectedImageOption == undefined){
				$scope.creativeSizeValidation = true;
				$scope.creativeSizeValidationMsg = "Size Should not be empty.";
				$('select').css('border-color','#a94442');
			}else{
				$scope.creativeSizeValidation = false;
				$('select').css('border-color','#3c763d');
			}
			
			if($scope.imagePreview == false){
				$('#upladButtonDiv').css('border-color','#a94442');
				$scope.upladButtonDivErrorFlag = true;
				$scope.upladButtonDivErrorMsg = "Please select image first";
			}else{
				$('#upladButtonDiv').css('border-color','#999');
				$scope.upladButtonDivErrorFlag = false;				
			}
			
			if($scope.creativeSizeValidation || $scope.creativeURLValidation || $scope.creativeImageNameValidation || !($scope.imagePreview)){
				return;
			}			
			
			if($scope.assetModel.creativeImageName != '' && $scope.assetModel.creativeImageName != undefined){
				$scope.imagePreviewDataObject.name = $scope.assetModel.creativeImageName;
				$('input[type=text]').css('border-color','#3c763d');
				if($scope.assetModel.creativeImageDestinationURL != '' && $scope.assetModel.creativeImageDestinationURL != undefined){					
					$scope.imagePreviewDataObject.clickThru = $scope.assetModel.creativeImageDestinationURL;
					$scope.imagePreviewDataObject.altText = $scope.assetModel.creativeAltTag;
					$('input[type=url]').css('border-color','#3c763d');
					if($scope.imageSrc != '' && $scope.imageSrc != undefined){
						
						
						var method = '';
						if($scope.selectedCreativeId != ''){
							$scope.imagePreviewDataObject.id = $scope.selectedCreativeId;
							method = "PUT";								
						}else{			
							method = "POST";								
						}
						
						
						//TODO need to make api call to save the image creative						
						
					}else{
						alert('please select the image.');
					}
				}else{
					$('input[type=url]').css('border-color','#a94442');
				}
			}else{
				$('input[type=text]:first').css('border-color','#a94442');
			}
		}else{
			$modalInstance.dismiss();
		}	 		
	};
	
	$scope.imageSelected = function(id){
		$("img").css('border','none');
		$('#img'+id).css('border','2px solid red');	
		$scope.selectedImageId = id;
	};
	
	$scope.imageSelectDone = function(){		
		for(var key in $scope.imageList){
			if($scope.imageList[key].id === $scope.selectedImageId){
				$scope.imagePreview = true;
				$scope.upladButtonDivErrorFlag = false;
				$('#upladButtonDiv').css('border-color','#999');
				$scope.imageSrc = $scope.imageList[key].imageBean.imgData;				
				$scope.imagePreviewDataObject = {
                      "creativeType": "image",       
                      "altText": $scope.assetModel.creativeAltTag,
                      "height": $scope.imageList[key].height,
                      "weight": $scope.imageList[key].weight,
                      "clickThru": $scope.imageList[key].clickThru,      
                      "campaignId": campaignService.campaignData.id,
                      "adId": campaignService.adData.id, 
                              "imageBean": {
                                        "imgData": $scope.imageList[key].imageBean.imgData,
                                         "imgName": $scope.imageList[key].imageBean.imgName
                              }
                  };
			}
		}
		$('.chooseImage').css('display','none');
		$('.addImage').show();	
	};
	
	$scope.chooseImageModal = function(){
		$scope.searchText = {};
		var dimension = $scope.assetModel.selectedImageOption.split(" ");
		
		$('.addImage').hide();
		$('.chooseImage').show();
	};
	
	$scope.addImageModal = function(){
		$('.chooseImage').css('display','none');
		$('.addImage').show();		
	};
	
	
	//HTML viewer dialog code function
	  
	$scope.assetModel.htmlText = '';
	$scope.previewCode=function(){
		  var text1 = $scope.assetModel.htmlText;
		  //var text2 = "";
		  //text2 = HTMLtoXML(text1);
		  if(text1==''){
			  $scope.htmlErrorClass = false;
			  $scope.creativeHtmlCodeValidation=true;
			  $scope.creativeHtmlCodeValidationMsg='Enter Html Code';
			  $('textarea').css('border-color','#a94442');
			  window.myFrame.document.body.innerHTML="";
		  }
		  else if(validateHTML(text1)){
			  window.myFrame.document.body.innerHTML=$scope.assetModel.htmlText;			  
			  $scope.htmlErrorClass = false;
			  $scope.creativeHtmlCodeValidation=false;
			  //$('.htmlErrorClass').css('border','none');
			  $('textarea').css('border-color','#3c763d');
		  }
		  else{
			  $('.htmlErrorClass').css('border','1px solid red');	
			  $scope.htmlErrorClass = true;
			  $scope.creativeHtmlCodeValidation=false;
			  window.myFrame.document.body.innerHTML="";
		  }
	}
	
	// end of HTML viewer dialog code function
	
	$scope.imagePreviewDataObject = '';
	$scope.getFile = function () {     
		var dimension = $scope.assetModel.selectedImageOption.split(" ");
      fileReader.readAsDataUrl($scope.assetModel.file, $scope)
                    .then(function(result) {
                  	  $scope.imagePreview = true;
                  	  $scope.upladButtonDivErrorFlag = false;
                  	  $('#upladButtonDiv').css('border-color','#999');
                        $scope.imageSrc = result;
                        var data = {
                            "creativeType": "image",       
                            "altText": "altText",
                            "height": dimension[2],                            
                            "weight": dimension[0],                                    
                            "campaignId": campaignService.campaignData.id,
                            "adId": campaignService.adData.id, 
                                    "imageBean": {
                                              "imgData": result,
                                               "imgName": $scope.assetModel.file.name
                                    }
                        }
                        
                        $scope.imagePreviewDataObject = data;
                    });
  }
	
	$scope.class1 = 'disabled';
	$scope.imageSizeSelect = function(){
		if($scope.assetModel.selectedImageOption != '' && $scope.assetModel.selectedImageOption != undefined){
			$scope.class1 = '';
		}
		if($scope.imagePreview == true){
			$scope.imagePreview = false;
		}
	};
	
	
	if(data123.length > 0 && template == 'myModalImage.html'){
		$scope.assetModel.creativeImageName = data123[0].name;		
		$scope.assetModel.creativeAltTag = data123[0].alt;
		
		$scope.assetModel.creativeImageDestinationURL = data123[0].url;
		$scope.imagePreview = data123[0].flag;
		$scope.imageSrc = data123[0].src;
		$scope.selectedCreativeId = data123[0].id;
		var dimension = data123[0].size.split(" ");
		
		$scope.imagePreviewDataObject = {
				"creativeType": "image",       
                "altText": data123[0].alt,
                "height": dimension[2],                            
                "weight": dimension[0],                                    
                "campaignId": campaignService.campaignData.id,
                "adId": campaignService.adData.id, 
                        "imageBean": {
                                  "imgData": data123[0].src,
                                   "imgName": data123[0].imgName
                        }
		};
		$scope.$apply();
	}else if(data123.length > 0 && template == 'myModalContent.html'){
		$scope.assetModel.creativeHTMLName = data123[0].name;				
		$scope.assetModel.htmlText = data123[0].textArea;
		//$scope.previewCode();
		$scope.selectedCreativeId = data123[0].id;
		$scope.$apply();
	}
});


app.directive("ngFileSelect",function(){
	return {
		link: function($scope,el){	
			el.on('click',function(){				
				this.value = '';
			});
	      el.bind("change", function(e){	      
	        $scope.assetModel.file = (e.srcElement || e.target).files[0];
	        
	        var allowed = ["jpeg", "png", "gif", "jpg"];
	        var found = false;
	        var img;
	        img = new Image();
	        allowed.forEach(function(extension) {
	  	          if ($scope.assetModel.file.type.match('image/'+extension)) {
	  	            found = true;
	  	          }
	  	        });
	        if(!found){
	        	alert('file type should be .jpeg, .png, .jpg, .gif');
	        	return;
	        }
	        img.onload = function() {	            
	            var dimension = $scope.assetModel.creativeSize.split("*");
	            if(dimension[0] == this.width && dimension[1] == this.height){
		            allowed.forEach(function(extension) {
		  	          if ($scope.assetModel.file.type.match('image/'+extension)) {
		  	            found = true;
		  	          }
		  	        });
		  	        
		  	        
		  	        if(found){
		  	        	if($scope.assetModel.file.size <= 1048576){
		  	        		$scope.getFile();
		  	        	}else{
		  	        		alert('file size should not be grater then 1 mb.');
		  	        	}
		  	        }else{
		  	        	alert('file type should be .jpeg, .png, .jpg, .gif');
		  	        }
	  	        }else{
	  	        	alert('selected image dimension is not equal to size drop down.');
	  	        }
	        };
	        
	        img.src = _URL.createObjectURL($scope.assetModel.file);	        
	        
	      });	      
	    }
	    
	  };
	  
});