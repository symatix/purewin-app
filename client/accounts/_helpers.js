Template.profile.helpers({
	editProfile:function(){
		return Session.get("updateProfile");
	}
})
Template.users.helpers({
	users:function(){
		return Meteor.users.find();
	},
	editUser:function(){
		return Session.get("editUser");
	}
})