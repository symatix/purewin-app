Template.flowchart_top.events({
    'click #btn-load-graph': function(e) {
        // if element was highlightet on previous paper, remove reference
        globalCellId = false;
        globalCell = false;
        var id = this._id;
        var loadGraph = Graphs.findOne(id).graph;
        Session.set("loadGraph", id);
        graph.fromJSON(JSON.parse(loadGraph));
    },
    'click #btn-delete-graph': function(e) {
        var id = this._id;
        Session.set("loadGraph", false);
        Meteor.call("deleteGraph", id, function(err, res) {
            if (!err) {
                toastr["success"]("Workflow deleted!");
                $("#clear-graph").click();
            } else {
                toastr["warning"]("Error while deleting workflow: " + err);
            }
        });
    }

})

graphData = {};
Template.flowchart_paper.events({
    'click #save-graph': function(e) {
        if (Session.get("loadGraph")) {
            var id = Session.get("loadGraph");
            var name = Graphs.findOne(id).name;
            $('[name="newGraph-name"]').val(name);
        }

    },
    'click #btn-submit-graph': function(e) {
        e.preventDefault();
        e.stopPropagation();

        $("tspan").each(function() {
            var str = $(this).text();
            str = str.replace(/\s+/g, ' ');
            $(this).text(str);
        })
        var setsArr = [];
        var termsArr = [];
        var setItems = $("text[data-collection='sets']");
        var termItems = $("text[data-collection='terms']");

        var getGraph = graph.toJSON();
        var setGraph = JSON.stringify(getGraph);

        // get the ids of terms and sets used and store them in an array
        setItems.each(function() {
            var id = $(this).attr("data-id");
            var setTerms = Sets.findOne(id).terms;
            for (var i = 0; i < setTerms.length; i++) {
                termsArr.push(setTerms[i]);
            }
        })
        termItems.each(function() {
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

        
        var trueCellId = $('.end-true:last').closest(".joint-cell").attr('model-id');
        var trueCell = graph.getCell(trueCellId); 
        var trueSignal = graph.getPredecessors(trueCell);
        trueSignal = JSON.stringify(trueSignal);

        var falseCellId = $('.end-false:last').closest(".joint-cell").attr('model-id');
        var falseCell = graph.getCell(falseCellId); 
        var falseSignal = graph.getPredecessors(falseCell);
        falseSignal = JSON.stringify(falseSignal);

        graphData.graph = setGraph;
        graphData.terms = terms,
        graphData.meta = {
            owner: Meteor.userId(),
            added: new Date(),
        }
        graphData.signal = {
            true:trueSignal,
            false:falseSignal,
        }
        console.log("------------------------------------------------");
        console.log(graphData);
        console.log("------------------------------------------------");

        var name = $("input[name='newGraph-name']").val();
        graphData.name = name;
        console.log(graphData);
        console.log("------------------------------------------------");
        var oldGraph = Session.get("loadGraph");

        Meteor.call("insertGraph", graphData, oldGraph, function(err, result) {
            if (result) {
                // have to replace empty spaces written as &nbsp; before creating uri else image throws error

                svgAsDataUri(document.querySelectorAll("svg")[1], { scale: 0.1 }, function(uri) {
                    // callback used to get URI from onload function inside svgAsDataUri, create an object and insert it into FScollection
                    var data = function(imgData) {
                        var graphThumb = {
                            file: imgData,
                            isBase64: true,
                            fileName: result + ".png",
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
                    image.onerror = function(err) {
                        console.log(err);
                    }
                });
                toastr["success"]("Workflow " + graphData.name + " successfully added!");
            } else {
                toastr["warning"]("Error while adding workflow: " + err);
            }
        });
    },
    'click #clear-graph': function() {
        Session.set("loadGraph", false);
    },
    'click #delete-graph': function() {
        var id = Session.get("loadGraph");
        Session.set("loadGraph", false);
        Meteor.call("deleteGraph", id, function(err, res) {
            if (!err) {
                toastr["success"]("Workflow deleted!");
                $("#clear-graph").click();
            } else {
                toastr["warning"]("Error while deleting workflow: " + err);
            }
        });
    }
})



/*
      <button class="btn btn-secondary" data-toggle="modal" data-target="#modal-newGraph" id="save-graph">Save graph</button>
              {{#if loadGraph}}
              <button class="btn btn-secondary" id="delete-graph">Delete graph</button>
              {{/if}}
              <button class="btn btn-secondary" id="clear-graph">Clear graph</button>
              <button class="btn btn-secondary" id="print-graph">Print graph</button>
              */