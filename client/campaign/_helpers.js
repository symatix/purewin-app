Template.campaign_list.helpers({
	campaign:function(){
		return Campaigns.find();
	},
	unlockDetails:function(){
		if (Session.get("campaignDetails")){
			return true;
		}
	},
	campaignDetails:function(){
		return Campaigns.findOne(Session.get("campaignDetails"));
	},
	statusHtml:function(){
		var id = Session.get("campaignDetails");
		var startDate = new Date(Campaigns.findOne(id).startDate);
		var endDate = new Date(Campaigns.findOne(id).endDate);
		var currentDate = new Date();
		if (startDate < currentDate && currentDate < endDate){
			var string = '<span class="label label-success" style="font-size:1.1em">active</span>';
			return new Handlebars.SafeString(string);
		} else {
			var string = '<span class="label label-danger" style="font-size:1.1em">not active</span>';
			return new Handlebars.SafeString(string);
		}
	},
	descriptionHtml:function(){
		var id = Session.get("campaignDetails");
		var string = Campaigns.findOne(id).campaignDescription;
		return new Handlebars.SafeString(string);
	},
	status:function(){
		var id = this._id;
		var startDate = new Date(Campaigns.findOne(id).startDate);
		var endDate = new Date(Campaigns.findOne(id).endDate);
		var currentDate = new Date();
		if (startDate < currentDate && currentDate < endDate){
			return "ok";
		} else {
			return "remove";
		}
	},
	statusColor:function(){
		var id = this._id;
		var startDate = new Date(Campaigns.findOne(id).startDate);
		var endDate = new Date(Campaigns.findOne(id).endDate);
		var currentDate = new Date();
		if (startDate < currentDate && currentDate < endDate){
			return "#009900";
		} else {
			return "#e60000";
		}
	},
	operatorDisplay:function(){
		var operator = this.operator;
		if (operator === "equals"){
			return false;
		} else if (operator === "range"){
			return "to";
		} else if (operator === "greater"){
			return "or higher";
		} else if (operator === "less"){
			return "or lower";
		}
	}
})


Template.campaign_new.helpers({
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
	linkCampaign:function(){
		return GraphThumbs.findOne({name:Session.get("campaignLogic")+".png"}).link();
	},
	logicId:function(){
		var logicId = Session.get("campaignLogic");
		return logicId;
	},
	nameCampaign:function(){
		return Graphs.findOne(Session.get("campaignLogic")).name;
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

Template.campaign_edit.helpers({
	multipleValues:function(){
		var values = Terms.findOne(this.id).values;
		return values;
	},
})