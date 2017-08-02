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
	insertGraph:function(data){
		return Graphs.insert(data, function(err, result){
			if (err){
				console.log(err);
			} else if (result){
				console.log(result);
				return result;
			}
		});
	},
	insertCampaign:function(data){
		Campaigns.insert(data, function(err, result){
			if(!err){
				return result;
			}
		});
	}
});