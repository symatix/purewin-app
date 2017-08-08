Template.admin_flowchart.rendered = function() {

    /*
    bugs

    1. rotate class on link selection
    2. range input reset on modal (not the value, just the position)



    SETCELLNAME disabled for the QAD purposes


    */
    /*--- global variables  --*/
    // used to calcualte drop if paper is paned
    var dragX = 0;
    var dragY = 0;
    // used to successfuly drop if zoomed
    var currentScale = 1;
    // used to get id of cells to do stuff
    globalCellId = false;
    globalCell = false;




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CANVAS

    // container for shape selection
    var stencilGraph = new joint.dia.Graph,
        stencilPaper = new joint.dia.Paper({
            el: $('#stencil'),
            height: 100,
            width: 550,
            model: stencilGraph,
            background: {
                color: "white",
            },
            interactive: false
        });

    stencilPaper.scale(0.6, 0.6);


    // container for graph
    graph = new joint.dia.Graph,
        paper = new joint.dia.Paper({
            el: $('#paper'),
            model: graph,
            background: {
                color: "white",
            },
            width: 1050,
            height: 800,
            overflow: 'scroll',
            perpendicularLinks: true,
            model: graph,
            gridSize: 1,
            interactive: true,
            restrictTranslate: true,
            highlighting: {
                'default': {
                    name: 'stroke',
                    options: {
                        padding: 10,
                        'stroke': '#8f9ba3',
                        'stroke-dasharray': 5,
                    }
                },
                connecting: {
                    name: 'addClass',
                    options: {
                        className: 'highlight-connecting'
                    }
                }
            },
            defaultLink: new joint.dia.Link({
                router: { name: 'manhattan' },
                connector: { name: 'jumpover', args: { 'jump': 'gap' } },
                attrs: {
                    '.connection': {
                        stroke: '#333333',
                        'stroke-width': 3,
                    },
                    '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', 'stroke-width': 0, fill: '#000000' },
                },
                /*
                        labels: [
                            { attrs: { rect: { stroke: '#7c68fc', rx: 5, ry: 5 } }}
                        ]*/
            }),
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;
                // Prevent linking to input ports.
                return magnetT && magnetT.getAttribute('port-group') === 'in';
            },
            perpendicularLinks: true,
            snapLinks: true,
            // Enable marking available cells & magnets
            markAvailable: true
        });






    // init undo with basic state
    var undoInit = '{"cells":[{"type":"basic.Circle","size":{"width":50,"height":50},"position":{"x":50,"y":50},"angle":0,"outPorts":["out1"],"ports":{"groups":{"out":{"position":"absolute","attrs":{".port-body":{"fill":"#000000"},".port-label":{"fill":"rgba(0,0,0,0)"}}}},"items":[{"group":"out","attrs":{"circle":{"r":6,"magnet":true,"stroke":"#000000","stroke-width":1,"fill":"#000000"}},"args":{"x":"50%","y":"100%"},"id":"4196142c-6388-4a75-bca8-e494bfda957b"}]},"id":"1dd0c4b9-06f5-4421-b2cf-d582735f2c90","z":1,"attrs":{"circle":{"stroke":"#cbd2d7","class":"start","strokeWidth":8,"stroke-dasharray":"3"},"text":{"fill":"#2e3438","font-weight":"bold","font-variant":"small-caps","text-transform":"capitalize"}}}]}';
    var undo = [];
    var redo = [];

    graph.on("batch:start", function() {

        var getGraph = graph.toJSON();
        var setGraph = JSON.stringify(getGraph);
    })



    graph.on("batch:stop", function() {


        var getGraph = graph.toJSON();
        var setGraph = JSON.stringify(getGraph);
        undo.push(setGraph);

        if (undo.length < 1) {
            undo.push(undoInit);
        }
        //redo.push(setGraph);

    })




    // undo
    $('#undo-graph').on('click', function() {
        removeDuplicatesArr(undo);

        var pointer = undo.length - 1;
        //redo.push(undo[pointer]);

        if (undo.length > 0) {

            if (pointer > 0) {

                if (globalCell) {

                    paper.findViewByModel(globalCell).unhighlight([globalCell]);
                    globalCell = false;
                    globalCellId = false;
                }
                graph.fromJSON(JSON.parse(undo[pointer]));
                redo.push(undo[pointer]);
                undo.pop();
            } else if (pointer == 0) {

                graph.fromJSON(JSON.parse(undoInit));
                //redo = [];;
            }
        }
    });

    //redo
    $('#redo-graph').on('click', function() {
        removeDuplicatesArr(redo);

        if (globalCell) {

            paper.findViewByModel(globalCell).unhighlight([globalCell]);
            globalCell = false;
            globalCellId = false;
        }

        var pointer = redo.length - 1;
        if (redo.length > 0) {
            console.log("prosao");
            graph.fromJSON(JSON.parse(redo[pointer]));
            undo.push(redo[pointer]);
            if (pointer >= 0) {
                redo.pop();
            }
        }
    });









    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // EVENTS

    // save variable - add to admin.js and remove from global scope
    var graphTable = [];
    var graphToTable;

    function removeDuplicatesArr(arr) {
        // if duplicates because of reasons, remove them first
        arr = arr.filter(function(item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        });

    }

    function recordGraph() {

    }


    function clearCellText() {
        $("#cell-text-custom").val("");
    }




    function fillDbox() {
        // fill dropbox with data from term sets
        var option = globalCell.attr("text/text");
        var collection = globalCell.attr("text/data-collection");

        // if no name, reset all dboxes
        if (!option) {
            $(".custom-select").val($(".custom-select").find("option[selected]").val());
        } else {
            // if name...magic
            if (collection === "sets") {
                $('#cell-term-set').val(option);
            } else if (collection === "terms") {
                $('#cell-term').val(option);
            } else {
                $(".custom-select option:first").attr('selected', 'selected');
            }
        }

    }







    function setColors() {
        var textColor, textMultiColor, path, rect, circle, multi, textInput, bodyInput;
        textInput = $("#cell-text-color");
        bodyInput = $("#cell-color");
        textColor = globalCell.attr('text/fill');
        textMultiColor = globalCell.attr('.question-text/fill');
        path = globalCell.attr('path/fill');
        circle = globalCell.attr('circle/fill');
        rect = globalCell.attr('rect/fill');
        multi = globalCell.attr('.body/fill');

        if (path) {
            bodyInput.val(path);
        }
        if (circle) {
            bodyInput.val(circle);
        }
        if (rect) {
            bodyInput.val(rect);
        }
        if (multi) {
            bodyInput.val(multi);
            textInput.val(textMultiColor);
        } else {
            textInput.val(textColor);
        }

    }

    function setSize() {
        // can use only one variable as it will resize x&y the same
        var size = globalCell.size();
        $("#cell-size").val(size.width);
        $("output[name='cell-size']").text(size.width);
    }

    function setFontSize() {
        // can use only one variable as it will resize x&y the same
        var fontSize = globalCell.attr('text/font-size');
        var fontSizeMulti = globalCell.attr('.question-text/font-size');
        if (fontSizeMulti) {
            $("#cell-font-size").val(fontSizeMulti);
            $("output[name='cell-font-size']").text(fontSizeMulti);
        } else {
            $("#cell-font-size").val(fontSize);
            $("output[name='cell-font-size']").text(fontSize);
        }


    }

    function setCellName() {
        var collection, type, cellName, multiName, name, container, dbTerm, dbSet, customText;

        type = globalCell.attributes.type;
        collection = globalCell.attr("text/data-collection");
        cellName = globalCell.attr('text/text');
        multiName = globalCell.attr('.question-text/text');
        dbTerm = $("#cell-term");
        dbSet = $("#cell-term-set");

        //customText = $("input[name='cell-custom-text']");
        container = $("#cell-name");


        // if it was word wrapped, for checking \n has to be removed and replaced with space

        if (cellName !== undefined) {
            name = cellName.replace(/(\n)/g, " ");
        } else {
            name = multiName.replace(/(\n)/g, " ");
        }

        if (collection === "sets") {
            dbTerm.val(dbTerm.find("option[selected]").val());
            dbSet.val(name);
        } else if (collection === "terms") {
            dbSet.val(dbSet.find("option[selected]").val());
            dbTerm.val(name);
        }
        /*
        for (var i = 0; i < terms.length; i++){
            if (terms[i].term === name){
                dbTerm.val(name);
                dbSet.val(dbSet.find("option[selected]").val());
                customText.val("");
                break;
            }
        }
        for (var i = 0; i < termSets.length; i++){

            if (termSets[i].name === name){
                dbSet.val(name);
                dbTerm.val(dbTerm.find("option[selected]").val());
                customText.val("");
                break;
            }
        }

        if (dbSet.val() === null && dbTerm.val() === null){
            customText.val(name);
            //customText.text(name);
        }

        */
        if (name) {
            container.text(name);
        } else {
            container.text("::name::");
        }
    }

    function resetCellPanel() {
        fillDbox();
        setColors();
        setSize();
        setFontSize();
        clearCellText();
        setCellName();
    }

    function resizeOnText() {
        var text = globalCell.attr('text/text');
        var textMulti = globalCell.attr('.question-text/text');
        var fontSize = parseInt(globalCell.attr('text/font-size'));

        var svgDocument = V('svg').node;
        var textElement = V('<text><tspan></tspan></text>').node;
        var textSpan = textElement.firstChild;
        var textNode = document.createTextNode('');

        textSpan.appendChild(textNode);
        svgDocument.appendChild(textElement);
        document.body.appendChild(svgDocument);

        if (textMulti !== undefined) {
            var lines = textMulti.split('\n');
        } else {
            var lines = text.split('\n');
        }

        var width = 0;

        // find the longest line width
        _.each(lines, function(line) {

            textNode.data = line;
            var lineWidth = textSpan.getComputedTextLength();

            width = Math.max(width, lineWidth);
        });

        var height = lines.length * (fontSize * 1.2);

        V(svgDocument).remove();
        if (width > 90) {
            globalCell.resize(width + 20, width + 20);
        }
    }






    function fitAll() {

        // cache important svg elements
        var svg = V(paper.svg);
        var svgVertical = V('path').attr('d', 'M -10000 -1 L 10000 -1');
        var svgHorizontal = V('path').attr('d', 'M -1 -10000 L -1 10000');
        var svgRect = V('rect');
        var svgAxisX = svgVertical.clone().addClass('axis');
        var svgAxisY = svgHorizontal.clone().addClass('axis');
        var svgBBox = svgRect.clone().addClass('bbox');

        svgBBox.hide = _.debounce(function() {
            svgBBox.removeClass('active');
        }, 500);

        // svg Container - contains all non-jointjs svg elements
        var svgContainer = [];

        svgContainer.showAll = function() {
            _.each(this, function(v) { v.addClass('active'); });
        };

        svgContainer.hideAll = function() {
            _.each(this, function(v) { v.removeClass('active'); });
        };

        svgContainer.removeAll = function() {
            while (this.length > 0) {
                this.pop().remove();
            }
        };

        svgContainer.removeAll();

        var padding = 30;
        var gridW = 1;
        var gridH = 1;
        var allowNewOrigin = "negative";
        console.log("padding: " + padding);
        console.log("gridW: " + gridW);
        console.log("gridH: " + gridH);
        console.log("allowNewOrigin: " + allowNewOrigin);
        paper.fitToContent({
            padding: padding,
            gridWidth: gridW,
            gridHeight: gridH,
            allowNewOrigin: allowNewOrigin
        });

        var bbox = paper.getContentBBox();

        var translatedX = allowNewOrigin == 'any' || (allowNewOrigin == 'positive' && bbox.x - paper.options.origin.x >= 0) || (allowNewOrigin == 'negative' && bbox.x - paper.options.origin.x < 0);
        var translatedY = allowNewOrigin == 'any' || (allowNewOrigin == 'positive' && bbox.y - paper.options.origin.y >= 0) || (allowNewOrigin == 'negative' && bbox.y - paper.options.origin.y < 0);

        if (padding) {

            var svgPaddingRight = svgHorizontal.clone()
                .translate(paper.options.width - padding / 2, 0, { absolute: true })
                .attr('stroke-width', padding);

            var svgPaddingBottom = svgVertical.clone()
                .translate(0, paper.options.height - padding / 2, { absolute: true })
                .attr('stroke-width', padding);

            svg.append([svgPaddingBottom, svgPaddingRight]);
            svgContainer.push(svgPaddingBottom, svgPaddingRight);
        }

        if (padding && (translatedX || translatedY)) {

            var paddings = [];

            if (translatedY) {

                var svgPaddingTop = svgVertical.clone()
                    .translate(0, padding / 2, { absolute: true })
                    .attr('stroke-width', padding);

                paddings.push(svgPaddingTop);
            }

            if (translatedX) {

                var svgPaddingLeft = svgHorizontal.clone()
                    .translate(padding / 2, 0, { absolute: true })
                    .attr('stroke-width', padding);

                paddings.push(svgPaddingLeft);
            }

            if (paddings.length) {
                svg.append(paddings);
                svgContainer.push.apply(svgContainer, paddings);
            }
        }

        if (gridW > 2) {

            var x = gridW;

            if (translatedX) x += padding;

            do {

                var svgGridX = svgHorizontal.clone().translate(x, 0, { absolute: true }).addClass('grid');
                svg.append(svgGridX);
                svgContainer.push(svgGridX);

                x += gridW;

            } while (x < paper.options.width - padding);
        }

        if (gridH > 2) {

            var y = gridH;

            if (translatedY) y += padding;

            do {

                var svgGridY = svgVertical.clone().translate(0, y, { absolute: true }).addClass('grid');
                svg.append(svgGridY);
                svgContainer.push(svgGridY);
                y += gridH;

            } while (y < paper.options.height - padding);
        }

        svgContainer.showAll();
    }


    function makeSVG() {

        var element = document.getElementById("paper");
        //var svgDoc = element.svg;
        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(document.getElementById("paper"));
        var svgSmallString = serializer.serializeToString(element);
        console.log(svgSmallString);
        return svgSmallString;
    }

    function toCanvasImg(canvas, svgData) {
        var canvas = document.getElementById(canvas);
        var ctx = canvas.getContext('2d');

        var data = svgData;

        var DOMURL = window.URL || window.webkitURL || window;

        var img = new Image();
        var svg = new Blob([data], { type: 'image/svg+xml' });
        var url = DOMURL.createObjectURL(svg);

        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);
        }

        img.src = url;
    }


    function printSvg() {
        var headstr = '<html><head><title>Delaj BEBOOOOO!!!!</title><link type="text/css" rel="stylesheet" href="css/joint.min.css"><link type="text/css" rel="stylesheet" href="css/style.css"></head><body>';
        var footstr = '</body></html>';
        //var newstr = $("#paper")[0].childNodes[2];
        var element = document.getElementById("paper");
        var serializer = new XMLSerializer();
        var newstr = serializer.serializeToString(element);
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = headstr + newstr + footstr;
        window.print();
        document.body.innerHTML = oldstr;
        return false;
    }
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    /*
    // global variable used when saving graph to create thumbnail
    createSmallPreview = function()
    {

    if (globalCell){
        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        globalCellId = false;
        globalCell = false;
    }


    // scale it for grabbing the smaller size
    paper.setDimensions(210, 160);

    paper.scale(0.2);
    var element = document.getElementById("paper");
    var serializer = new XMLSerializer();
    var svg = serializer.serializeToString(element);

    // rescale it...
    paper.setDimensions(1050, 800);
    paper.scale(1);

    return svg;
    }
    */
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------
    graph.on('change:position', function(cell) {
        // has an obstacle been moved? Then reroute the link.
        if (_.contains(cell)) paper.findViewByModel(link).update();

        paper.fitToContent({
            minWidth: 1050,
            minHeight: 800
        });

    });



    // all things that happend when mous unpressed on element
    paper.on('cell:pointerup', function(cellView, evt) {
        // check if link ends in space, if it does, remove it
        var elem = cellView.model
        var source = elem.get('source')
        var target = elem.get('target')
        var labelExists = elem.attributes.labels;
        //var name = elem.attrs.labels;
        if (elem instanceof joint.dia.Link && (!source.id || !target.id)) {
            elem.remove();
        }
    });



    /* ----------------------------------------------------------------------------------------------------------*/
    // ENABLE THIS AFTER MVP (scaling problem on paper if this is in init state - server needed for png creation)
    /* ----------------------------------------------------------------------------------------------------------*/
    /*
    var paperDiv = $('#paper')[0];
    var panAndZoom = svgPanZoom(paperDiv.childNodes[2], 
        {
            viewportSelector: paperDiv.childNodes[2].childNodes[2],
            fit: false,
            dblClickZoomEnabled: false,
            mouseWheelZoomEnabled: false,
            zoomScaleSensitivity: 1,
            center: false,
            panEnabled: false, // enable this on blank:pointerdown in v2 - now too much trouble to calculate and scale everything to fit
            zoomScaleSensitivity: 0.2,
            minZoom: 0.1,
            maxZoom: 10,
            beforePan: function(oldpan, newpan){
                dragX = newpan.x;
                dragY = newpan.y;
            },
            beforeZoom: function(oldZoom, newZoom){
                console.log(oldZoom);
                console.log(newZoom);
            }
        });

    */
    /* ----------------------------------------------------------------------------------------------------------*/
    paper.on('cell:pointerdown', function(cellView, evt, x, y) {
        //hideTools();
    });
    paper.on('cell:pointerup blank:pointerup', function(cellView, event) {
        //panAndZoom.disablePan();
        //panAndZoom.updateBBox();
    });
    /* ----------------------------------------------------------------------------------------------------------*/
    paper.on('blank:pointerdown', function(evt, x, y) {

        //panAndZoom.enablePan(); //enable this in v2 (look at code line #587)

        $("#cell-panel").addClass("hidden");
        $("#cell-name").text("Select element");

        if (globalCell) {
            paper.findViewByModel(globalCell).unhighlight([globalCell]);
        }
        globalCellId = false;
        globalCell = false;
        $(".custom-select").val($(".custom-select").find("option[selected]").val());
    });
    /* ----------------------------------------------------------------------------------------------------------*/

    // paper size W/H

    var $w = $('#width');
    var $h = $('#height');
    $w.on('input change', function() {
        paper.setDimensions(parseInt(this.value, 10), parseInt($h.val(), 10));
        var val = $('#width').val();
        $("output[name='width']").text(val + "px");
    });
    $h.on('input change', function() {
        paper.setDimensions(parseInt($w.val(), 10), parseInt(this.value, 10));
        var val = $('#height').val();
        $("output[name='height']").text(val + "px");
    });

    // Signaling.
    // ----------
    // could be used to determine signal flow for the BRE logic
    graph.on('signal', function(cell, data) {

        if (cell instanceof joint.dia.Link) {

            var targetCell = graph.getCell(cell.get('target').id);

            paper.findViewByModel(cell).sendToken(V('circle', { r: 7, fill: 'red' }).node, 600, function() {
                targetCell.trigger('signal', targetCell);
            });

        } else {

            var outboundLinks = graph.getConnectedLinks(cell, { outbound: true });
            _.each(outboundLinks, function(link) {
                link.trigger('signal', link);
            });
        }
    });








    // delete when doubleclick on element - deprecated
    // now used to show tools
    // fuck me if i know, but something has to be done to reset rotate class if link selected
    paper.on('cell:pointerup', function(cellView, cell) {
        var temp = globalCell;
        globalCellId = cellView.model.id;
        globalCell = cellView.model;

        if (temp) {
            paper.findViewByModel(temp).unhighlight([temp]);
        }

        if (!globalCell.isLink()) {
            cellView.highlight(globalCell);
            $("#cell-panel").removeClass("hidden");
            resetCellPanel();
        } else {
            globalCellId = false;
            globalCell = false;
            $("#cell-panel").addClass("hidden");
            $("#cell-name").text(":select:"); // this should change heading
            if ($("#cell-collapse").hasClass("rotate")) {
                $("#cell-collapse").toggleClass("rotate");
            };
        }
    });
    paper.on('cell:pointerdblclick', function(cellView, cell) {
        var elem = cellView.model
        //showTools(elem);
        if (globalCell.isLink()) {
            var labelName = prompt("Enter link name: ");
            // clean this part a bit...make it an object
            elem.prop(['labels', 0, 'attrs', 'text', 'text'], '  ' + labelName + '  ');
            elem.prop(['labels', 0, 'attrs', 'text', 'fill'], 'white');
            elem.prop(['labels', 0, 'attrs', 'rect', 'fill'], 'black');
            elem.prop(['labels', 0, 'attrs', 'rect', 'fill'], 'black');
            elem.prop(['labels', 0, 'attrs', 'rect', 'rx'], '6');
            elem.prop(['labels', 0, 'attrs', 'rect', 'ry'], '6');
            elem.prop(['labels', 0, 'attrs', 'rect', 'stroke-height'], '30');
        }
    });




    $("#preview-graph").click(function() {
        //paper.setOrigin(dragX, dragY);
        createSmallPreview();
    })





    $("#save-graph").click(function() {
        $("input[name='newGraph-name']").val('');
        $("#newGraph-description").val('');
    });




    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    // CONVERT TO METEOR METHOD!! 
    //load
    $("#workflow-panel").on('click', '.workflow-load', function() {
        var id = this.id;
        var graphData = dataCtrl.getGraphs();
        var graphJSON;

        for (var i = 0; i < graphData.length; i++) {
            if (id === graphData[i]["id"]) {
                graphJSON = graphData[i];
                break;
            }
        }
        graph.fromJSON(JSON.parse(graphJSON.graph));
    });
    //delete
    $("#workflow-panel").on('click', '.btn-delete-graph', function() {
        var id = $(this).attr("data-id");
        var graphs = dataCtrl.getGraphs();
        dataCtrl.delete(graphs, id);
        $(this).parent().remove();
    });
    /*
    // ADDED TO METEOR 

    $("#btn-submit-graph").click(function(){
        var getGraph = graph.toJSON();
        var setGraph = JSON.stringify(getGraph);
        var name = $("input[name='newGraph-name']").val();
        var description = $("#newGraph-description").val();

        // save graph as is
        var graphData = {
            name: name,
            description: description,
            graph:setGraph,
        }
        dataCtrl.addGraph(graphData);


        // save thumb version
        var thumb_html = createSmallPreview();
        var thumbObj = {
            id:"small-"+graphData.id,
            name:name,
            html:thumb_html
        }
        dataCtrl.addGraphThumb(thumbObj);

        var graphs_html = '';
        graphs_html += '<li class="list-group-item">'
        graphs_html += '<i class="icon-ios-trash-outline btn-delete-graph" data-id="'+graphData.id+'"></i>';
        graphs_html += '<a href="#'+graphData.name+'" class="workflow-load" id="'+graphData.id+'">'+graphData.name+'</a>';
        graphs_html += '</li>';
        $("#workflow-panel").append(graphs_html);
    })
    */
    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------*/

    $(".tools-delete, .btn-delete").click(function(e) {
        if (globalCellId) {
            graph.getCell(globalCellId).remove();
            globalCellId = false;
            globalCell = false;
        } else {
            var parent = $(this.parentNode);
            var id = parent.attr("parentId");
            graph.getCell(id).remove();
            console.log("Element removed is: " + id);
        }
    });
    $(".tools-clearlink, .btn-clearlink").click(function(e) {
        if (globalCellId) {
            var elem = graph.getCell(globalCellId);
            graph.removeLinks(elem);
        } else {
            var parent = $(this.parentNode);
            var id = parent.attr("parentId");
            var elem = graph.getCell(id);
            graph.removeLinks(elem);
        }
    });
    $(".tools-edit").click(function(e) {
        var parent = $(this.parentNode);
        var id = parent.attr("parentId");
        var elem = graph.getCell(id);
        var labelName = prompt("Enter cell name: ");
        var wraptext = joint.util.breakText(labelName, {
            width: 70,
        });
        globalCell.attr('text/text', wraptext);
    })

    $('.tools-rotate, .btn-rotate').on('mousedown', function(evt) {
        var parent, id, angle, textAngle, elem, x, y, height, width, pointerX;
        if (globalCellId) {
            elem = graph.getCell(globalCellId)
        } else {
            isDown = true;
            parent = $(this.parentNode);
            id = parent.attr("parentId");
            elem = graph.getCell(id);
        }
        angle = elem.attributes.angle;
        x = elem.attributes.position.x;
        y = elem.attributes.position.y
        height = elem.attributes.size.height;
        width = elem.attributes.size.width;
        elem.rotate(angle + 90, [false, { x: x + width / 2, y: y + height / 2 }]);

        textAngle = elem.attributes.angle; // gets new angle
        elem.attr('text/transform', 'rotate(-' + textAngle + ')');
    });

    $("#cell-color").on("change", function() {
        var color, type, multi;
        color = $("#cell-color").val();
        type = globalCell.attributes.type;
        multi = 'qad.Question';

        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        if (type === multi) {
            globalCell.attr('.body/fill', color);
        } else {
            globalCell.attr('path/fill', color);
            globalCell.attr('circle/fill', color);
            globalCell.attr('rect/fill', color);
        }

        paper.findViewByModel(globalCell).highlight([globalCell]);
    })
    $("#cell-text-color").on("change", function() {
        var color, type, multi;
        color = $("#cell-text-color").val();
        type = globalCell.attributes.type;
        multi = 'qad.Question';

        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        if (type === multi) {
            globalCell.attr('.question-text/fill', color);
        } else {
            globalCell.attr('text/fill', color);
        }
        paper.findViewByModel(globalCell).highlight([globalCell]);
    })
    $("#cell-size").on("change", function() {
        var size = $("#cell-size").val();
        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        globalCell.set({ size: { width: size, height: size } });
        paper.findViewByModel(globalCell).highlight([globalCell]);
        $("output[name='cell-size']").text(size);
    });
    $("#cell-font-size").on("change", function() {
        var type, multi, size;
        type = globalCell.attributes.type;
        multi = 'qad.Question';
        size = $("#cell-font-size").val();
        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        if (type === multi) {
            globalCell.attr('.question-text/font-size', size);
        } else {
            globalCell.attr('text/font-size', size);
        }


        paper.findViewByModel(globalCell).highlight([globalCell]);
        $("output[name='cell-font-size']").text(size);
    });


    // change text label of element when changing TERM value
    $("#cell-term").on("change", function() {
        var type, collection, multi, termId, text, wraptext;

        type = globalCell.attributes.type;
        multi = 'qad.Question';
        termId = $("#cell-term").children(":selected").attr("data-id");
        collection = $("#cell-term").children(":selected").attr("data-collection");
        text = $("#cell-term").val();
        wraptext = joint.util.breakText(text, {
            width: 70,
        });
        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        if (type === multi) {
            globalCell.attr('.question-text/text', text);
            globalCell.attr('.question-text/data-id', termId);
            var optionsArr = [{ id: "true", text: "Yes" }, { id: "false", text: "No" }];
            globalCell.set("options", optionsArr);

        } else {
            globalCell.attr('text/text', text);
            globalCell.attr('text/data-id', termId);
            globalCell.attr('text/data-collection', collection);
        }

        paper.findViewByModel(globalCell).highlight([globalCell]);
        setCellName();
    });



    // change text label of element when changing SET value
    $("#cell-term-set").on("change", function() {
        var type, collection, multi, setId, text, wraptext;

        type = globalCell.attributes.type;
        multi = 'qad.Question';
        setId = $("#cell-term-set").children(":selected").attr("data-id");
        collection = $("#cell-term-set").children(":selected").attr("data-collection");


        text = $("#cell-term-set").val();
        wraptext = joint.util.breakText(text, {
            width: 70,
        });
        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        if (type === multi) {

            globalCell.attr('.question-text/text', text);
            globalCell.attr('.question-text/data-id', setId);

            var data = Sets.find().fetch();
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === setId) {
                    var termList = data[i].terms;
                    var optionsArr = [];
                    for (var j = 0; j < termList.length; j++) {
                        var optionsObj = {
                            id: termList[j].id,
                            text: termList[j].term
                        }
                        optionsArr.push(optionsObj);
                        console.log(optionsObj, optionsArr);
                    }
                    globalCell.set("options", optionsArr);
                }
            }
        } else {
            globalCell.attr('text/text', text);
            globalCell.attr('text/data-id', setId);
            globalCell.attr('text/data-collection', collection);
        }
        paper.findViewByModel(globalCell).highlight([globalCell]);
        setCellName();

    });

    $("#cell-text-custom").on("change", function() {
        var type = globalCell.attributes.type;
        var multi = 'qad.Question';

        $('#cell-term-set').val($('#cell-term-set').find("option[selected]").val());
        $('#cell-term').val($('#cell-term').find("option[selected]").val());
        var customText = $("#cell-text-custom").val();

        var txtArr = customText.split(" ");
        console.log(txtArr);
        for (var i = 0; i < txtArr.length; i++) {
            if (txtArr[i + 1] !== undefined) {
                var strLength = txtArr[i] + txtArr[i + 1];
                console.log(strLength.length);
                if (strLength.length > 6) {
                    txtArr[i + 1] += "\n";
                    console.log(txtArr);
                }
            }
            var cellText = txtArr.toString().replace(/,/g, " ");
            console.log(cellText);
        }
        var wraptext = joint.util.breakText(customText, {
            width: globalCell.size.width - 10,
        });

        paper.findViewByModel(globalCell).unhighlight([globalCell]);
        if (type === multi) {
            globalCell.attr(".question-text/text", cellText)
        } else {
            globalCell.attr('text/text', cellText);
        }


        resizeOnText();
        setCellName();

        paper.findViewByModel(globalCell).highlight([globalCell]);
    });
    $(".btn-signal").on('click', function() {
        var cellView = paper.findViewByModel(globalCell);
        cellView.model.trigger('signal', cellView.model);
    });
    // pure gui bliss on rotate upon collapse
    $(".btn-collapse").click(function() {

        $(this).toggleClass("rotate");
    });


    // Zooming
    // ------------

    //var panZoomTiger = svgPanZoom($('#paper')[0].childNodes[2]);

    var graphScale = 1;

    var paperScale = function(sx, sy) {
        paper.scale(sx, sy);
    };

    $('#zoom-in').on('click', function() {
        graphScale += 0.1;
        paperScale(graphScale, graphScale);
    });

    $('#zoom-reset').on('click', function() {
        graphScale = 1;
        paperScale(graphScale, graphScale);

    });

    $('#zoom-out').on('click', function() {
        graphScale -= 0.1;
        paperScale(graphScale, graphScale);

    });






    $('#clear-graph').on('click', function() {
        if (globalCell) {
            paper.findViewByModel(globalCell).unhighlight([globalCell]);
            globalCell = false;
            globalCellId = false;
        }
        graph.clear();
        graph.addCell(start);
    });
    $('#print-graph').on('click', function() {
        printSvg();
    });





    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // MODELS / CELLS

    // start object
    var start = new joint.shapes.basic.Circle({
        position: { x: 50, y: 50 },
        size: { width: 50, height: 50 },
        outPorts: ['out1'],
        ports: {
            groups: {
                'out': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
            }
        },
        attrs: {
            text: {
                //text: 'Start', 
                fill: '#2e3438',
                'ref-x': .5,
                'ref-y': .5,
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
            circle: {
                class: 'start',
                fill: '#ffffff',
                stroke: '#cbd2d7',
                strokeWidth: 8,
                'stroke-dasharray': '3',
            },
        },
    });
    start.addPort({ group: 'out', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '50%', y: '100%' } });

    var decision1 = new joint.shapes.basic.Path({
        position: { x: 580, y: 30 },
        size: { width: 100, height: 100 },
        inPorts: ['in1'],
        outPorts: ['out1', 'out2'],
        ports: {
            groups: {
                'in': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#ffffff'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
                'out1': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
                'out2': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    },
                },
            }
        },
        attrs: {
            //path: { d: 'M 90 0 L 180 0 200 25 200 50 200 75 175 100 25 100 0 75 0 25 z' },
            path: {
                d: 'M 30 0 L 60 30 0 30 z',
                fill: '#5c6870',
            },
            text: {
                width: -10,
                'ref-x': .5,
                'ref-dy': null,
                'ref-y': .8,
                //text: 'decisicon', 
                fill: '#ffffff',
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
        },
    });

    decision1.addPort({ group: 'in', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#ffffff' } }, args: { x: '50%', y: '0%' } });
    decision1.addPort({ group: 'out1', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '0%', y: '100%' } })
    decision1.addPort({ group: 'out2', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '100%', y: '100%' } })



    var decision2 = new joint.shapes.basic.Rhombus({
        position: { x: 440, y: 30 },
        size: { width: 100, height: 100 },
        attrs: {
            path: { fill: '#5c6870', },
            text: {
                //text: 'decision2', 
                fill: '#ffffff',
                'ref-x': .5,
                'ref-y': 0.5,
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
        },
        ports: {
            groups: {
                'in': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#ffffff',
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    },
                },
                'out1': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
                'out2': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
                'out3': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
            }
        },
    });
    decision2.addPort({ group: 'in', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#ffffff' } }, args: { x: '50%', y: '0%' } });
    decision2.addPort({ group: 'out1', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '100%', y: '50%' } })
    decision2.addPort({ group: 'out2', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '50%', y: '100%' } })
    decision2.addPort({ group: 'out3', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '0%', y: '50%' } })

    var action = new joint.shapes.basic.Rect({
        position: { x: 300, y: 30 },
        size: { width: 100, height: 100 },
        inPorts: ['in1'],
        outPorts: ['out1'],
        ports: {
            groups: {
                'in': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#ffffff'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
                'out': {
                    position: 'absolute',
                    attrs: {
                        '.port-body': {
                            fill: '#000000'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                }
            }
        },
        attrs: {
            rect: { fill: '#8f9ba3', rx: 5, ry: 5 },
            text: {
                //text: 'Action', 
                fill: '#000000',
                'ref-x': .5,
                'ref-y': .5,
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
        }
    });
    action.addPort({ group: 'in', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#ffffff' } }, args: { x: '50%', y: '0%' } });
    action.addPort({ group: 'out', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#000000' } }, args: { x: '50%', y: '100%' } })

    var success = new joint.shapes.basic.Circle({
        position: { x: 20, y: 30 },
        size: { width: 100, height: 100 },
        inPorts: ['in1'],
        ports: {
            groups: {
                'in': {
                    position: 'top',
                    attrs: {
                        '.port-body': {
                            fill: '#ffffff',
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
            }
        },
        attrs: {
            circle: { fill: '#f1f3f4' },
            text: {
                //text: 'Success', 
                fill: '#000000',
                'ref-x': .5,
                'ref-y': .5,
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
        }
    });
    success.addPort({ group: 'in', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#ffffff' } } });

    var stop = new joint.shapes.basic.Circle({
        position: { x: 160, y: 30 },
        size: { width: 100, height: 100 },
        inPorts: ['in1'],
        ports: {
            groups: {
                'in': {
                    position: 'top',
                    attrs: {
                        '.port-body': {
                            fill: '#ffffff'
                        },
                        '.port-label': {
                            fill: 'rgba(0,0,0,0)',
                        },
                    }
                },
            }
        },
        attrs: {
            circle: { fill: '#000000', rx: 50, ry: 50, },
            text: {
                //text: 'stop', 
                fill: '#f1f3f4',
                'ref-x': .5,
                'ref-y': .5,
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            },
        }
    });
    stop.addPort({ group: 'in', attrs: { circle: { r: 6, magnet: true, stroke: '#000000', 'stroke-width': 1, fill: '#ffffff' } } });




    /* ----------------------------------------------------------------------------------------------------------------------------------------*/


    var multi = new joint.shapes.qad.Question({
        position: { x: 720, y: 30 },
        size: { width: 100, height: 100 },
        question: '',
        inPorts: [{ id: 'in', label: 'In' }],
        options: [
            { id: 'yes', text: 'Yes' },
            { id: 'no', text: 'No' }
        ],
        attrs: {
            '.question-text': {
                fill: '#f1f3f4',
                'font-size': 14,
                'font-weight': 'bold',
                'font-variant': 'small-caps',
                'text-transform': 'capitalize'
            }
        }

    });

    /* ----------------------------------------------------------------------------------------------------------------------------------------*/






























    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DRAG FROM DASH TO PAPER


    stencilGraph.addCells([decision1, stop, success, action, decision2, multi]);
    graph.addCells([start]);
    //stencilGraph.addCells([cirlce, rectangle, rhombus, m1]);

    stencilPaper.on('cell:pointerdown', function(cellView, e, x, y) {

        if (globalCell) {
            paper.findViewByModel(globalCell).unhighlight([globalCell]);
        }
        $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;background-color:rgba(255,0,0,0);pointer-event:none;"></div>');
        var flyGraph = new joint.dia.Graph,
            flyPaper = new joint.dia.Paper({
                el: $('#flyPaper'),
                model: flyGraph,
                interactive: false
            }),
            flyShape = cellView.model.clone(),
            pos = cellView.model.position(),
            offset = {
                x: x - pos.x,
                y: y - pos.y
            };

        flyShape.position(12, 12);
        flyGraph.addCell(flyShape);
        $("#flyPaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });
        $('body').on('mousemove', function(e) {
            $("#flyPaper").offset({
                left: e.pageX - offset.x,
                top: e.pageY - offset.y
            });
        });
        $('body').on('mouseup', function(e) {
            var x = e.pageX,
                y = e.pageY,
                target = $("#paper").offset();


            // Dropped over paper ?
            if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
                var s = flyShape.clone();
                var zoomScale = paper.scale();
                var posX = (x - target.left - dragX) / zoomScale.sx;
                var posY = (y - target.top - dragY) / zoomScale.sy;

                s.position(posX, posY);
                graph.addCell(s);



                var getGraph = graph.toJSON();
                var setGraph = JSON.stringify(getGraph);
                undo.push(setGraph);



                globalCell = s;
                globalCellId = s.id;
                paper.findViewByModel(globalCell).highlight([globalCell]);

                $('body').off('mousemove').off('mouseup');
                flyShape.remove();
                $('#flyPaper').remove();
            }
            // now deal with the cell panel
            $("#cell-panel").removeClass("hidden");
            resetCellPanel();
        });
    });














    $("#test-graph").click(function() {
        var elementsArr = graph.getElements();
        var sysArr = [];
        for (var i = 0; i < elementsArr.length; i++) {
            var links = {};
            var cellId = elementsArr[i].id;


            links.id = cellId;


            var cell = graph.getCell(cellId);
            var inboundLinks = graph.getConnectedLinks(cell, { inbound: true });
            var outboundLinks = graph.getConnectedLinks(cell, { outbound: true });

            var inArr = [];
            var outArr = [];

            for (var j = 0; j < outboundLinks.length; j++) {
                outArr.push(outboundLinks[j].id);
            }
            links.out = outArr;

            for (var j = 0; j < inboundLinks.length; j++) {
                inArr.push(inboundLinks[j].id);
            }
            links.in = inArr;


            sysArr.push(links);

            outArr = [];
            inArr = [];
        }

        console.log(sysArr);
        for (var i = 0, ln = sysArr.length; i < ln; i++) {
            var arrIn = sysArr[i]["in"];
            var arrInSource = sysArr[i]["source"];
            var arrOut = sysArr[i]["out"];
        }


    });

    function compareArrays(arr1, arr2) {
        var ret = [];
        for (var i in arr1) {
            if (arr2.indexOf(arr1[i]) > -1) {
                console.log(arr1[i] + " is connected to " + arr);
            }
        }
        return ret;
    };
}