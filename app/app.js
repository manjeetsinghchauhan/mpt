var app = angular.module('adTech', ['mwl.calendar', 'ngAnimate','ngRoute', 'ui.bootstrap', 'toaster','xeditable', 'angularModalService',
                                    'angular.css.injector','multi-select','googlechart']);

app.config(function($routeProvider,$httpProvider) {
	$routeProvider.
	when('/', {
        title: 'Welcome',
        templateUrl: 'plugins/authentication/partials/login.html',
        controller: 'authCtrl'
      })
      .when('/welcome', {
        title: 'Welcome',
        templateUrl: 'plugins/dashboard/partials/welcome.html',
        controller: 'campaignDashboardCtrl',
        permission:['ADMIN','TRAFFICKER']	
      })
      .when('/logout', {
	        title: 'Logout',
	        templateUrl: 'plugins/authentication/partials/login.html',
	        controller: 'logoutCtrl'
	    })
	    .when('/dashboard', {
	        title: 'Dashboard',
	        templateUrl: 'plugins/dashboard/partials/dashboard.html',
	        controller: 'dashBoardCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/dashboard/calendar', {
	        title: 'Dashboard',
	        templateUrl: 'plugins/dashboard/partials/calendarDashboard.html',
	        controller: 'calendarDashBoardCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	  //Routing Rules For Proposal Module
		.when('/proposal', {
	        title: 'Proposal',
	        templateUrl: 'plugins/proposal/partials/proposal.html',
	        controller: 'proposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/proposal-line-item/:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-line-item.html',
	        controller: 'proposalLineItemCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/proposal-line-item-view/:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-line-item-view.html',
	        controller: 'proposalLineItemViewCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	     .when('/proposal/create-line-item/:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/add-lineitem.html',
	        controller: 'createUpdatelLineItemCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	     .when('/proposal/create-proposal', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/create-proposal.html',
	        controller: 'createUpdateProposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	     .when('/proposal/create-proposal/:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/create-proposal.html',
	        controller: 'createUpdateProposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/proposal-detail/:proposal_id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-detail.html',
	        controller: 'editProposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
		
		
		//Routing Rules For campaigns Module
		.when('/campaigns', {
	        title: 'Campaigns',
	        templateUrl: 'plugins/campaigns/partials/orders.html',
	        controller: 'campaignsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    .when('/list-campaigns', {
	        title: 'Campaigns List',
	        templateUrl: 'plugins/campaigns/partials/campaigns.html',
	        controller: 'campaignsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    .when('/campaigns/proposal-line-item/:id', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/order-details.html',
	        controller: 'campaignsLineItemCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	     .when('/campaigns/create-line-item/:id', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/update-campaigns.html',
	        controller: 'createUpdateCompainsLineItemCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	     .when('/campaigns/create-proposal/:id', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/update-order.html',
	        controller: 'createUpdateCompainsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    
	     .when('/campaigns/create-proposal', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/update-order.html',
	        controller: 'createUpdateCompainsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    
	   	
	    //Routing Rules For Pricing Module
	    .when('/pricing', {
	        title: 'Pricing',
	        templateUrl: 'plugins/pricing/partials/pricing.html',
	        controller: 'pricingCtrl'
	    })
	    
	    //Routing Rules For Admin Module
	    .when('/admin', {
	        title: 'Admin',
	        templateUrl: 'plugins/admin/partials/manage-attribute.html',
	        controller: 'attributeCtrl',
	        permission:['ADMIN']
	    })
		.when('/admin/creative', {
	        title: 'Creative',
	        templateUrl: 'plugins/admin/partials/manage-creative.html',
	        controller: 'creativeCtrl',
	        permission:['ADMIN']
	    })
	    .when('/admin/product', {
	        title: 'Product',
	        templateUrl: 'plugins/admin/partials/manage-product.html',
	        controller: 'productCtrl',
	        permission:['ADMIN']
	    })
	    .when('/admin/salestargets', {
	        title: 'Sales',
	        templateUrl: 'plugins/admin/partials/manage-salestargets.html',
	        controller: 'salesTargetsCtrl',
	        permission:['ADMIN']
	    })
    .otherwise({
      redirectTo: '/'
    });
	
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	$httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.patch = {'Content-Type':'application/json;charset=utf-8'};
})
.run(function ($rootScope, $location, Data) {
		$rootScope.isViewLoading = false;
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
        	$rootScope.isViewLoading = true;	
	        $rootScope.authenticated = false;
	        Data.get('authentication').success(function (results) {
	        	if(results.userId){
		        	 $rootScope.authenticated = true;
		             $rootScope.userId = results.userId;
		             $rootScope.name = results.firstName;
		             $rootScope.email = results.email;
		             $rootScope.roleName = results.roles[0].roleName.split('_')['1'];
		             
		             if (next.$$route && next.$$route.permission) {
		            	 var redirectToNext = false;
		            	for(var i=0;i<next.$$route.permission.length;i++){
		            		if($rootScope.roleName == next.$$route.permission[i]){
		            			 redirectToNext = true;
		            		 }
		            	}
		               }
		             
		             if(redirectToNext){
	        			return;
		             }
		             else $location.path('dashboard');
	        	}
	        }).error(function (results){
	        	$rootScope.userId=null;
	        	$location.path("/");
	        });
    });
    $rootScope.$on('$routeChangeSuccess', function() {
    	$rootScope.isViewLoading = false;
	});    
});


app.run(function(editableOptions) {
	  editableOptions.theme = 'bs2';
});