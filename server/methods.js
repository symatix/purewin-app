Meteor.methods({
	updateTerm:function(id, termObj){
		Terms.update({_id:id},{$set:termObj},{multi:true});// don't know why I put {multi:true} but promise an investigation
		var id = Terms.findOne(termObj)._id;
		return id;
	},
	insertTerm:function(termObj){
		Terms.insert(termObj);
		var id = Terms.findOne(termObj)._id;
		return id;
	},
	deleteTerm:function(id, setIds){
		var sets = Sets.find({"terms":{$elemMatch:{"$in":[id], "$exists":true}}});
		Sets.update(
			{"_id":{"$in": setIds }},
			{"$pull":{"terms":id}},
			{"multi": true}
			);
		console.log("brisem brate");

		Terms.remove(id);

	},
	removeTermFromSet:function(setId, termId){
		Sets.update(
			{"_id":setId},
			{"$pull":{"terms":termId}}
			);
		console.log("removed term ["+termId+"] from set ["+setId+"]");
	},
	insertSet:function(setObj){
		Sets.insert(setObj);// don't know why I put {multi:true} but promise an investigation
		var id = Sets.findOne(setObj)._id;
		return id;
	},
	updateSetName:function(id, newName){
		Sets.update({_id:id},{$set:{name:newName}});
	},
	deleteSet:function(id){
		Sets.remove(id);
		console.log("removed set with id ["+id+"]");
	},
	insertGraph:function(data, id){
		console.log(id);
		if (id){
			GraphThumbs.remove({"name":id+".png"});
			Graphs.update({_id:id}, {$set:data});
			return id;
		} else {
			return Graphs.insert(data, function(err, result){
				if (err){
				} else if (result){
					return result;
				}
			});
		}
	},
	updateGraph:function(data){
		GraphThumbs.remove({"name":data._id+".png"});
		Graphs.update({_id:data._id}, {$set:data});
	},
	insertGraphThumb:function(data){
		GraphThumbs.insert(data);
	},
	deleteGraph:function(id){
		Graphs.remove(id);
		GraphThumbs.remove({"name":id+".png"});
	},
	insertCampaign:function(data){
		Campaigns.insert(data, function(err, result){
			if(!err){
				return result;
			}
		});
	},
	deleteCampaign:function(id){
		Campaigns.remove(id);
	},
	editCampaign:function(data, id){
		var addedNew = data.meta.added;
		var addedOld = Campaigns.findOne(id).meta.added;
		if (addedOld != addedNew){
			data.meta.added = addedOld;
			data.meta.edited = addedNew;
		}
		Campaigns.update({_id:id},{$set:data}, {multi: true});
	},
	editUser:function(id, user){
		// checking for avatar
		if (!user.avatar){
			var avatar = Meteor.users.findOne(id).profile.avatar;
			user.avatar = avatar;
		}

		// changing email
		console.log(user);
		
		// update profile
		return Meteor.users.update({_id:id}, {$set: {profile: user}}, function(err, result){
			if (err){
				console.log(err);
			} else if (result){
				var oldMail = Meteor.users.findOne(id).profile.email;
				Accounts.removeEmail(id, oldMail);
				Accounts.addEmail(id, user.email);
				console.log("User updated: "+result);
				return result;
			}
		});
		
	},
	setPassword:function(userId, password){
		Accounts.setPassword(userId, password)
	},
	deleteUser:function(id){
		Meteor.users.remove({_id:id});
	}
});