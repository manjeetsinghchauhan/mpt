app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data,cssInjector) {
	//Remove Scroll from Login page
	cssInjector.add("plugins/authentication/css/authentication-style.css");
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    
    $scope.doLogin = function (customer) {
    	
    	
        Data.login('authentication/login', {
            customer: customer
        }).success(function (results) {        
        	//Data.toast(results);
//        	$location.path('admin');
        	
        	 Data.get('authentication').success(function (results) {
             	if(results.userId){
     	        	 $rootScope.authenticated = true;
     	             $rootScope.userId = results.userId;
     	             $rootScope.name = results.firstName;
     	             $rootScope.email = results.email;
     	             $rootScope.roleName = results.roles[0].roleName.split('_')['1'];
     	             //$location.path('dashboard');
     	             
     	             if($rootScope.roleName == 'ADMIN' || $rootScope.roleName == 'PLANNER'){
     	            	 $location.path('dashboard');
     	             }
     	             if($rootScope.roleName == 'TRAFFICKER'){
     	            	$location.path('welcome');
     	             }
             	}
             }).error(function (results){
             	$rootScope.userId=null;
             	$location.path("/");
             });
        	
        	
        	
        	
        }).error(function(result){
        	$location.path('/login');
        });
        
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            //Data.toast(results);
            if (results.status == "success") {
                $location.path('welcome');
            }
        });
    };
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            //Data.toast(results);
            $location.path('login');
        });
    }
});