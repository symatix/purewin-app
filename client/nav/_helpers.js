Template.nav_search.helpers({
  termsIndex: () => TermsIndex,
  flowchartIndex: () => FlowchartIndex,
  campaignIndex: () => CampaignIndex,

  searchClass:function () {
    return {
    	class:'form-control search-input',
    	placeholder:'Type something...'
    };
  }, 
  termSearch:function(){
  	var route = Session.get("route");
  	if (route === '/terms'){
  		return true;
  	}
  },
  flowchartSearch: function(){
  	var route = Session.get("route");
  	if (route === '/workflow'){
  		return true;
  	}
  },
  campaignSearch: function(){
  	var route = Session.get("route");
  	if (route === '/campaign'){
  		return true;
  	}
  },
});