Template.breadcrumbs.helpers({
	route:function(){

		if (Session.get("route") === "/"){
			return "";
		} else if (Session.get("route") === "/terms"){
			return "Terms";
		} else if (Session.get("route") === "/workflow"){
			return "Workflow";
		} else if (Session.get("route") === "/campaign"){
			return "Campaign";
		} else if (Session.get("route") === "/users"){
			return "Users";
		}
	}
})