Template.flowchart_actions.helpers({
	term: function(){
		return Terms.find();
	},
	set: function(){
		return Sets.find();
	},
})

Template.flowchart_top.helpers({
	graphThumbs: function(){
		return Graphs.find();
	},
	graphHtml:function(){
		var id = this._id;
		var html = Graphs.findOne(id).thumb;
		console.log(html);
		return Spacebars.SafeString(html);
	},
	link: function(){
		var id = this._id;
		return GraphThumbs.findOne({name:id+".png"}).link();
	}
})