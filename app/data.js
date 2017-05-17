app.factory("Data", ['$http', 'toaster', '$location', 'ModalService',
    function ($http, toaster, $location, ModalService) {

        //var serviceBase = 'http://192.168.64.121:9090/mp/';
	    var serviceBase = 'http://10.193.66.132:9090/mp/';
        
        var obj = {};

        obj.toast = function (data) { 
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).success(function (results,status) {
                return results.data;
            }).error(function(result,status){
            	inforToUser(status);
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).success(function (results,status) {
            	return results.data;
            }).error(function(results,status){
            	inforToUser(status);
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).success(function (results,status) {
                return results.data;
            }).error(function(result,status){
            	inforToUser(status);
            });
        };
        
        obj.patch = function (q) {
        	
        	$http({method:'PATCH',url:serviceBase+ q}).success(function(data,status){}).error(function(data,status){inforToUser(status);});
        };
        
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).success(function (results,status) {
                return results.data;
            }).error(function(result,status){
            	inforToUser(status);
            });
        };
        
        obj.login = function (q, object) {
        	var username = object.customer.username;
        	var password = object.customer.password;
        	
        	return $http.post(serviceBase + q, "username=" + username + "&password=" + password, {
        		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        		}).success(function(results,status,headers,config) {
        			return true;
        			
        		}).error(function(results,status,headers,config) {
        			showApiWarningMsg("Incorrect Email or Password.");
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
       
       function showApiWarningMsg(msg) {
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
		 
		 function inforToUser(status)
		 {
			 if(status=='409')
				 showApiWarningMsg("This element is in use and cannot be deleted.");
			 
			 if(status=='401'){
				 showApiWarningMsg("Session has expired. You will be redirected to the Login page."); 
				 $location.path('/login');
			 }
			 
			 if(status=='412')
				 showApiWarningMsg("Name already in use. Please enter a different name");
			 
			 if(status=='500')
				 showApiWarningMsg("There may be some network issue, please refresh your page and try again");
		
		 }
       
        return obj;
}]);
