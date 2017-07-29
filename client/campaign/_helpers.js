
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
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "textarea"){
				return Terms.findOne(termIds[i]);
			}
		}
	},
	checkbox:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "checkbox"){
				return Terms.findOne(termIds[i]);
			}
		}
		//console.log(arr);
		//return Terms.find({_id:{$in:arr}});
	},
	checkboxValue:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		var idArr = [];
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "checkbox"){
				idArr.push(termIds[i]);
			}
		}
		var values = Terms.find({_id:{$in:idArr}});
		console.log(values);
		return values;
	},
	test:function(){
		console.log(this);
		return this._id;
	},
	dropbox:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "dropbox"){
				return Terms.findOne(termIds[i]);
			}
		}
	},
	single:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "single"){
				return Terms.findOne(termIds[i]);
			}
		}
	},
	description:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "input"){
				return Terms.findOne(termIds[i]);
			}
		}
	},
	multiselect:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "multiselect"){
				return Terms.findOne(termIds[i]);
			}
		}
	},
	number:function(){
		var termIds = Graphs.findOne(Session.get("campaignLogic")).terms;
		for (var i = 0; i < termIds.length; i++){
			var type = Terms.findOne(termIds[i]).type;
			if (type === "number"){
				return Terms.findOne(termIds[i]);
			}
		}
	},
})