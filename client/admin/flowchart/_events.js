Template.flowchart_top.events({
	'click .campaign-logic':function(e){
		// if element was highlightet on previous paper, remove reference
		globalCellId = false;
		globalCell = false;
		var id = this._id;
		var loadGraph = Graphs.findOne(id).graph;

		graph.fromJSON(JSON.parse(loadGraph));
	},

})

Template.flowchart_paper.events({
	'click #btn-submit-graph':function(e){
		var setsArr = [];
		var termsArr = [];
		var setItems = $("text[data-collection='sets']");
		var termItems = $("text[data-collection='terms']");

	    var getGraph = graph.toJSON();
	    var setGraph = JSON.stringify(getGraph);
	    var name = $("input[name='newGraph-name']").val();

	    // get the ids of terms and sets used and store them in an array
	    setItems.each(function(){
	    	var id = $(this).attr("data-id");
	    	var setTerms = Sets.findOne(id).terms;
	    	for (var i = 0; i < setTerms.length; i++){
	    		termsArr.push(setTerms[i]);
	    	}
	    })
	    termItems.each(function(){
	    	var id = $(this).attr("data-id");
	    	termsArr.push(id);
	    })

	    // trim all duplicate values in termArr
	    var uniqueTerms = function(arr) {
		    var result = [];
		    $.each(arr, function(i, e) {
		        if ($.inArray(e, result) == -1) result.push(e);
		    });
		    return result;
		}
		var terms = uniqueTerms(termsArr);

		// scale it for grabbing the smaller size
		if (globalCell){
		    paper.findViewByModel(globalCell).unhighlight([globalCell]);
		    globalCellId = false;
		    globalCell = false;
		}

	    var graphData = {
	        name: name,
	        graph:setGraph,
	        terms: terms,
			meta:{
	        	owner:Meteor.userId(),
	        	added:new Date(),
			},
	    }

    	Meteor.call("insertGraph", graphData, function(err, result){
    		if (result){
				// have to replace empty spaces written as &nbsp; before creating uri else image throws error
				$("tspan").each(function(){
					var str = $(this).text();
					str = str.replace(/\s+/g, ' ');
					$(this).text(str);
				})

				svgAsDataUri(document.querySelectorAll("svg")[1], {scale:0.1}, function(uri) {
					// callback used to get URI from onload function inside svgAsDataUri, create an object and insert it into FScollection
					var data = function(imgData){
						var graphThumb = {
							file: imgData,
							isBase64: true,
							fileName: result+".png",
						}
						// in collections.js enable insert after accounts are set up
						GraphThumbs.insert(graphThumb);
					};
					// create png uri and pass it to callback for data insert
				    var image = new Image();
				    image.src = uri;
					image.onload = function() {
						var canvas = document.createElement('canvas');
						canvas.width = image.width;
						canvas.height = image.height;
						var context = canvas.getContext('2d');
						context.drawImage(image, 0, 0);

						var dataUri = canvas.toDataURL('image/png');
						// initiate callback
						data(dataUri);
					}
					image.onerror = function(err){
						console.log(err);
					}
				});
				toastr["success"]("Workflow "+graphData.name+" successfully added!");
			} else {
				toastr["warning"]("Error while adding workflow: "+err);
			}
    	});
	}
})



