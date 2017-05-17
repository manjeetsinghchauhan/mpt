app.directive("searchProposal", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/search-proposal.html"
	  };
});

app.directive("filterProposal", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/filter-proposal.html"
	  };
});

app.directive("proposalListing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/proposal-listing.html"
	  };
});

app.directive("addLineitem", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/add-lineitem.html"
	  };
});

