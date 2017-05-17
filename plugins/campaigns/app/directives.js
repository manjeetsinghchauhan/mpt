app.directive("leftNav", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/left-nav.html"
	  };
});

app.directive("ordersListing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/orders-listing.html"
	  };
});

app.directive("assetsTab", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/assets-tab.html"
	  };
});
app.directive("campaignsListing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/campaigns-listing.html"
	  };
});