Template.breadcrumbs.helpers({
	route:function(){

		if (Session.get("route") === "/"){
			return "Dashboard";
		} else if (Session.get("route") === "/terms"){
			return "Terms";
		} else if (Session.get("route") === "/workflow"){
			return "Workflow";
		} else if (Session.get("route") === "/campaign-list"){
			return "Campaigns";
		} else if (Session.get("route") === "/campaign-new"){
			return "New Campaign";
		} else if (Session.get("route") === "/users"){
			return "Users";
		}
	}
})
Template.home.helpers({
	termCount:function(){
		return Terms.find().count();
	},
	setCount:function(){
		return Sets.find().count();
	},
	workflowCount:function(){
		return Graphs.find().count();
	},
	campaignCount:function(){
		return Campaigns.find().count();
	},
	userCount:function(){
		return Meteor.users.find().count();
	}
})