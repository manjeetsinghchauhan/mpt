app.directive("managePricing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/pricing/partials/manage-pricing.html"
	  };
});

app.directive("pricingDetails", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/pricing/partials/pricing-details.html"
	  };
});

app.directive("managePremium", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/pricing/partials/manage-premium.html"
	  };
});

app.directive("premiumDetail", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/pricing/partials/premium-detail.html"
	  };
});

