app.controller('logoutCtrl', function ($rootScope,$scope, $location, Data) { 
	
	Data.get('authentication/logout').then(function (results) {
         //Data.toast(results);
		$rootScope.authenticated = false;
        $rootScope.userId = null;
        $rootScope.name = null;
        $rootScope.email = null;
		$location.path('/login');
     });
});