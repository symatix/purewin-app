
Template.campaign.helpers({
	graphThumbs: function(){
		return Graphs.find();
	},
	terms:function(){
		var id = this._id;
		var termIds = Graphs.findOne(id).terms;
		var termNames = [];
		for (var i = 0; i < termIds.length; i++){
			var name = Terms.findOne(termIds[i]).name;
			termNames.push(name);
		}
		return termNames;
	},
	values:function(){
		var id = this._id;
		return Terms.findOne(id).values;
	},
	link: function(){
		var id = this._id;
		return GraphThumbs.findOne({name:id+".png"}).link();
	},
	logicSelected:function(){
		if (Session.get("campaignLogic")){
			return true;
		}
	},
	textarea:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "textarea"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});
	},
	checkbox:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "checkbox"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});	
	},
	dropbox:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "dropbox"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});
	},
	single:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "single"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});
	},
	description:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "input"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});
	},
	multiselect:function(){
		Session.set("multiselect", true);
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "multiselect"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});
	},
	multiselectScript:function(){
		if (Session.get("multiselect")){
			return true;
		}
	},
	number:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "number"){
				idArr.push(termIds[i]);
			}
		}
		return Terms.find({_id:{$in:idArr}});
	},
})