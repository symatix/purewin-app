Template.flowchart_actions.helpers({
	term: function(){
		return Terms.find();
	},
	set: function(){
		return Sets.find();
	},
})

Template.flowchart_top.helpers({
  	flowchartIndex: () => FlowchartIndex,
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
		var link = GraphThumbs.findOne({name:id+".png"}).link();
		return link;
	}
})

Template.flowchart_paper.helpers({
	loadGraph:function(){
		return Session.get("loadGraph");
	}
})