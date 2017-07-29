Template.campaign.rendered = function(){


    $('#form-campaign-dateStart').datepicker({
    	autoclose: true,
    	container: 'html',
    }).on('changeDate', function(selected){
        var startDate = new Date(selected.date.valueOf());
        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
        $('#form-campaign-dateEnd').datepicker('setStartDate', startDate);
    })
    $('#form-campaign-dateEnd').datepicker({
    	autoclose: true,
    	container: 'html',
    });


    /*
guiCtrlUser = (function(){
	var DOM = {
        notifications:{
        	notifications:'.dropdown-notification',
        	dropdown:'.dropdown-notification',
        	message:'.notification-system',
        	navTab:'.notification-nav-tag',
        	navNew:'.notification-tag',
        },
		newCampaign:{
			form:'.form-campaign',
			panelTerm:'.panel-term-switch',
			panelSet:'.panel-set-switch',
			panelTermCheckbox:'.panel-term-checkbox',
			panelSetCheckbox:'.panel-set-checkbox',
			bussinessLogic:'.bussiness-logic',
			campaignLogic:'.campaign-logic',
			flowchartAffix:'.logic-fixed',
			input:{
				binderField:'.binder-field',
				campaignName:'#campaign-name',
				campaignDescription:'#campaign-description',
				startDate:'#form-campaign-dateStart',
				endDate:'#form-campaign-dateEnd',
				text:'.campaign-input',
				number:'.campaign-number',
				dropbox:'.campaign-dropbox',
				single:'.campaign-single:checked', // checkbox
				checkbox:'.campaign-checkbox',
				textarea:'.campaign-textarea',
				multiselect:'.campaign-multiselect',
				// this is for numbers
				numberOption:'#number-function',
				range:'#if-range',
				binder:'.campaign-bind',
				binderVal:'.binder-value',
			},
			inputName:{
				campaignName:'#campaign-name',
				campaignDescription:'#campaign-description',
				startDate:'#form-campaign-dateStart',
				endDate:'#form-campaign-dateEnd',
				text:'[name="campaign-input"]',
				number:'[name="campaign-number"]',
				dropbox:'[name="campaign-dropbox"]',
				single:'[name="campaign-single"]:checked', // checkbox
				checkbox:'[name="campaign-checkbox"]',
				textarea:'[name="campaign-textarea"]',
				multiselect:'[name="campaign-multiselect"]',
			},
			btn:{
				submit:'#btn-submit-campaign',
			}
		}
	};
	var terms = dataCtrl.getTerms();
	var termSets = dataCtrl.getTermSets();
	var graphData = dataCtrl.getGraphs();
	var graphThumbs = dataCtrl.getGraphThumbs();
	var elements = {}; // this will be filled when user selects logic
	var binder = ''; // used to render binder select btn for selecting term binding

	var termType = ["textarea","number","dropbox","single","checkbox", "description", "multiselect"];


	var multiSelectOptions = {
			buttonClass: 'btn btn-secondary btn-multiselect',
			includeSelectAllOption: true,
			selectAllText: ' Select all',
			selectAllValue: 'multiselect-all',
			numberDisplayed: 6,
			maxHeight: 400,
			enableFiltering: false, // change this to enable search - future feature
			enableCaseInsensitiveFiltering: false,
			filterPlaceholder: 'Search',
			includeFilterClearBtn: false,
			enableHTML: true,
			filterBehavior: 'both',
			templates: {
			  button: '<button type="button" class="multiselect dropdown-toggle btn-block" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
			  ul: '<ul class="multiselect-container dropdown-menu"></ul>',
			  filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="icon-android-search"></i></span><input class="form-control multiselect-search" style="margin-left:0px" type="text"></div></li>',
			  filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="icon-android-cancel"></i></button></span>',
			  li: '<li><a tabindex="0"><label></label></a></li>',
			  divider: '<li class="multiselect-item divider"></li>',
			  liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
			}
		}

	// get them names and values
	var looper = function(elem){
		var obj = {};
			elem.each(function(){
				var key = $(this).attr("data-name");
				var val = $(this).val();
				obj[key]= val;
			})
		return obj
	}

	return {
		selectors: function(){
			return DOM;
		},
		getBinder: function(){
			return binder;
		},
		generateTermPanel: function(){
			var term_html = '';
			for (var i = 0; i < terms.length; i++){
				term_html += '<li class="list-group-item">';
				term_html += terms[i].term;
				term_html += '<div class="term-switch pull-right">';
				term_html += '<input class="panel-term-checkbox" id="panel-'+terms[i].id+'" name="panel-terms" type="checkbox"/>';
				term_html += '<label id="label-'+terms[i].id+'" for="panel-'+terms[i].id+'" class="label-success"></label>';
				term_html += '</div>';
				term_html += '</li>';
			}
			$(DOM.newCampaign.panelTerm).append(term_html);
		},
		generateSetPanel: function(){
			var set_html = '';
			for (var i = 0; i < termSets.length; i++){
				set_html += '<li class="list-group-item">';
				set_html += termSets[i].name;
				set_html += '<div class="term-switch pull-right">';
				set_html += '<input class="panel-set-checkbox" id="panel-'+termSets[i].id+'" name="panel-sets" type="checkbox"/>';
				set_html += '<label for="panel-'+termSets[i].id+'" class="label-success"></label>';
				set_html += '</div>';
				set_html += '</li>';
			}
			$(DOM.newCampaign.panelSet).append(set_html);
		},
		generateGraphLogic: function(){
			var logic_html = '';
			for (var i = 0; i < graphThumbs.length; i++){
				logic_html += '<div class="col-xs-6 col-md-2 align-center campaign-logic" id="'+graphThumbs[i].id+'">';
				logic_html += '<h5>'+graphThumbs[i].name+'</h5>';
				logic_html += graphThumbs[i].html;
				logic_html += '</div>';
			}
			$(DOM.newCampaign.bussinessLogic).append(logic_html);
		},
		insertSelectedGraph: function(graph){
			$("#flowchart-small").empty();
			var logic_html = '';
				logic_html += '<div class="col-xs-6 col-md-2 align-center campaign-logic" id="selected-'+graph.id+'">';
				logic_html += '<h5>'+graph.name+'</h5>';
				logic_html += graph.html;
				logic_html += '</div>';
			$("#flowchart-small").append(logic_html);

		// find out how many elements we can bind terms to
		var start =  $("#flowchart-small").children().find(".start");
		var circleElements = $("#flowchart-small").children().find("circle:not([class])").filter('[id]');
		var rectElements = $("#flowchart-small").children().find("rect:not([class])").filter('[id]');
		var pathElements = $("#flowchart-small").children().find("path:not([class])").filter('[id]');

		elements = {
			start: start,
			circle:{
				el:circleElements,
				ln:circleElements.length,
			},
			rect: {
				el:rectElements,
				ln:rectElements.length,
			},
			path: {
				el:pathElements,
				ln:pathElements.length,
			}
		}
		console.log(elements);
		guiCtrlUser.bindSelect(graph);

		},
		bindSelect: function (graph){
			// generate html and store it to binder variable to append it on demand
			if (!jQuery.isEmptyObject(elements)){
				var circle, circleLn, rect, rectLn, path, pathLn;

				circle = elements["circle"].el;
				circleLn = circle.length;
				rect = elements["rect"].el;
				rectLn = rect.length;
				path = elements["path"].el;
				pathLn = path.length;

				var select_html = '';

				select_html += '<div class="btn-group">';
				select_html += '<button type="button" class="btn btn-default dropdown-toggle btn-binder" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Binding <span class="caret"></span></button>';
				select_html += '<ul class="dropdown-menu">';
				select_html += '<li class="binder-value" data-id="'+elements.start[0].id+'"> Start</li>';

				for (var i = 0; i < circleLn; i++){
					select_html += '<li class="binder-value" data-id="'+circle[i].id+'"> End '+(i+1)+'</li>';
				}
				for (var i = 0; i < rectLn; i++){
					select_html += '<li class="binder-value" data-id="'+rect[i].id+'"> Action '+(i+1)+'</li>';
				}
				for (var i = 0; i < pathLn; i++){
					select_html += '<li class="binder-value" data-id="'+path[i].id+'"> Decision '+(i+1)+'</li>';
				}
				select_html += '</ul><br/>';

				binder = select_html;
			}
		},
		getTermsFromForm: function(){
			var text, number, dropbox, single, checkbox, textarea, multiselect;
			var textLength, numberLength, dropboxLength, singleLength, checkboxLength, textareaLength, multiselectLength;
			var campaignObj = {};

			// element
			text = $(DOM.newCampaign.input.text);
			number = $(DOM.newCampaign.input.number);
			dropbox = $(DOM.newCampaign.input.dropbox);
			single = $(DOM.newCampaign.input.single);
			checkbox = $(DOM.newCampaign.input.checkbox);
			textarea = $(DOM.newCampaign.input.textarea);
			multiselect = $(DOM.newCampaign.input.multiselect);

			// length
			textLength = $(DOM.newCampaign.input.text).length;
			numberLength = $(DOM.newCampaign.input.number).length;
			dropboxLength = $(DOM.newCampaign.input.dropbox).length;
			singleLength = $(DOM.newCampaign.input.single).length;
			checkboxLength = $(DOM.newCampaign.input.checkbox).length;
			textareaLength = $(DOM.newCampaign.input.textarea).length;
			multiselectLength = $(DOM.newCampaign.input.multiselect).length;

			
			// check if element exists than pump the object with data
			if (textLength > 0){
				campaignObj.text = looper(text);
			}

			if (numberLength > 0){
				campaignObj.number = looper(number);
			}

			if (dropboxLength > 0){
				campaignObj.dropbox = looper(dropbox);

			}

			if (singleLength > 0){
				campaignObj.single = looper(single);

			}

			if (checkboxLength > 0){
				campaignObj.checkbox = looper(checkbox);

			}

			if (textareaLength > 0){
				campaignObj.textarea = looper(textarea);

			}

			if (multiselectLength > 0){
				campaignObj.multiselect = looper(multiselect);

			}

			return campaignObj;
		},
		configureTermCampaign: function(obj, id){
			// generate if checked
			var term_html = '';
			for (var i = 0; i < terms.length; i++){
				if (terms[i].id === id){
					var term = terms[i];
					if (term.type === termType[0]){


						//console.log("textarea");
						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-7">';
						term_html += '<input type="text" name="campaign-input" data-name="'+obj.term+'" class="form-control campaign-input" id="form-campaign-'+id+'" placeholder="'+obj.term+'"></div>';
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div>';
						term_html += '</div>';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);
					}
					if (term.type === termType[1]){


						//console.log("number");
						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-2"><input type="number" name="campaign-number" data-name="'+obj.term+'" class="form-control campaign-number" id="form-campaign-'+id+'" placeholder="'+obj.term+'"></div>';
						term_html += '<div class="col-sm-3"><select class="form-control" name="campaign-number" id="number-function">';
						term_html += '<option value="equal">Equal</option>';
						term_html += '<option value="greater">Or greater</option>';
						term_html += '<option value="less">Or less</option>';
						term_html += '<option value="range">To</option>';
						term_html += '</select></div>';
						term_html += '<div class="col-sm-2 if-range"></div>';
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div>';
						term_html += '</div>';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);
              		}
					if (term.type === termType[2]){


						//console.log("dropbox");
						var dropbox = obj["dropbox"];

						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-7">';
						term_html += '<select class="form-control campaign-dropbox" name="campaign-dropbox" data-name="'+obj.term+'" id="form-campaign-'+id+'">';
						term_html += '<option value="none" selected disabled>Select '+obj.term.toLowerCase()+' value</option>';
						for (var i = 0; i < dropbox.length; i++){
							term_html += '<option value="'+dropbox[i]+'">'+dropbox[i]+'</option>';
						}
						term_html += '</select></div>';
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div>';
						term_html += '</div>';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);
						
					}
					if (term.type === termType[3]){

						var counter = 1;

						//console.log("single");
						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-7">';
						term_html += '<ul class="input-list">'
						term_html += '<li><div class="pure-radiobutton">'
						term_html += '<input type="radio" class="campaign-single" id="form-campaign-'+id+'-true" name="campaign-single" data-name="'+obj.term+'" value="true"><label for="form-campaign-'+id+'-true"> True</label>';
						term_html += '</div></li>';
						term_html += '<li><div class="pure-radiobutton">'
						term_html += '<input type="radio" class="campaign-single" id="form-campaign-'+id+'-false" name="campaign-single" data-name="'+obj.term+'" value="false"><label for="form-campaign-'+id+'-false"> False</label>';
						term_html += '</div></li>';
						term_html += '</ul></div>'
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div>';
						term_html += '</div>';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);
					}
					if (term.type === termType[4]){

						var counter = 1;
						//console.log("checkbox");
						var checkbox = obj["checkbox"];

						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-7">';
						term_html += '<ul class="input-list">'
						for (var i = 0; i < checkbox.length; i++){
							term_html += '<li>'
							term_html += '<div class="pure-checkbox">';
							term_html += '<input type="checkbox" class="campaign-checkbox" name="campaign-checkbox" data-name="'+obj.term+'" id="checkbox-'+counter+'" value="'+checkbox[i]+'"><label for="checkbox-'+counter+'"> '+checkbox[i]+'</label>';
							term_html += '</div>';
							term_html += '</li>'

							counter++;
						}
						term_html += '</ul></div>';
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div>';
						term_html += '</div>';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);
					}
					if (term.type === termType[5]){


						//console.log("description");
						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-7">';
						term_html += '<textarea rows="3" name="campaign-textarea" data-name="'+obj.term+'" class="form-control campaign-textarea" id="form-campaign-'+id+'" placeholder=""></div>';
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div>';
						term_html += '</div>';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);
					}
					if (term.type === termType[6]){


						//console.log("multiselect");
						var multiselect = obj["multiselect"];

						term_html += '<div class="row">';
						term_html += '<div class="form-group" id="form-container-'+id+'">';
						term_html += '<label for="form-campaign-'+id+'" class="col-sm-2 control-label">'+obj.term+'</label>';
						term_html += '<div class="col-sm-7">';
						term_html += '<select class="form-control campaign-multiselect" name="campaign-multiselect" data-name="'+obj.term+'" multiple="multiple" id="form-campaign-'+id+'">';
						//term_html += '<option value="none" selected disabled>Select '+obj.term.toLowerCase()+' value</option>';
						for (var i = 0; i < multiselect.length; i++){
							term_html += '<option value="'+multiselect[i]+'">'+multiselect[i]+'</option>';
						}
						term_html += '</select></div>';
						term_html += '<div class="col-sm-2 binder-field" term-id="'+id+'">'+binder+'</div></div>';
						term_html += '';
						term_html += '</div>';
						$(DOM.newCampaign.form).append(term_html);


						var ifRendered = setInterval(function() {
						   if ($('#form-campaign-'+id).length) {
						      $("#form-campaign-"+id).multiselect(multiSelectOptions);
						      clearInterval(ifRendered);
						   }
						}, 100);
						
						
					}

					break;
				}
			}
		},
		removeTermCampaign: function(id){
			var element = document.getElementById("form-container-"+id);
			element.parentNode.removeChild(element);
		}
	}
})();
*/



/* -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// global controller
/* -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


/*
globalCtrlUser = (function(){

	var DOM = guiCtrlUser.selectors();
	var terms = dataCtrl.getTerms();
	var termSets = dataCtrl.getTermSets();
	var graphData = dataCtrl.getGraphs();
	var graphThumbs = dataCtrl.getGraphThumbs();





	// clear notifications 
	$(DOM.notifications.dropdown).click(function(){
		var open = $(DOM.notifications.dropdown).hasClass("open");
		console.log(open);
		if (open){
			guiCtrl.clearNotifications();
		}
	});

	// if number is a ranged value
	$(DOM.newCampaign.form).on('change', DOM.newCampaign.input.numberOption, function(){
		var val = $(this).val();
		var div = $(this).parent().next("div .if-range");

		if (val === 'range'){
			var add_html = '';
			add_html += '<input type="number" name="campaign-number" class="form-control campaign-number-range">';
			//$("[name='campaign-number']").closest(".if-range").append(add_html);
			div.append(add_html);
			//.css("padding","100px")
		} else {
			div.empty();
		}
	})


	// binder logic - left plain DOM selector, who knows what will happend here
	$(".form-body").on('click', ".btn-binder", function(e){
			$(DOM.newCampaign.flowchartAffix).slideToggle("slow");
	})
		
	var oldEl = {};
	$(".form-body").on('mouseenter', ".binder-value", function(e){
		var id = $(this).attr("data-id");
		var selectorString = "#flowchart-small > .campaign-logic > #paper > svg > .joint-viewport > g > g > g > #"+id;
		var selectorAll = "#flowchart-small > .campaign-logic > #paper > svg > .joint-viewport > g > g > g";
		//check if this is important
		var modelId = $(selectorString).closest(".joint-element").attr("model-id");

		$(".binder-value").attr("data-element", modelId);

		oldEl.fill = $(selectorString).attr("fill");
		oldEl.select = selectorString;
		oldEl.trueId = modelId;
		$(selectorString).attr("fill","red");

	});

	$(".form-body").on('mouseleave', ".binder-value", function(e){
		$(oldEl.select).attr("fill",oldEl.fill);
		oldEl = {};
	});

	$(".form-body").on('click', ".binder-value", function(e){
		var modelId = $(this).attr("data-element");
		var id = $(this).attr("data-id");
		var txt = $(this).text();
		var uiSelector = $(this).parent().prev("button");

		// set all relevant data in attr of button
		uiSelector.text(txt);
		uiSelector.attr("data-id", id);
		uiSelector.attr("element-id", modelId);
		// close preview
		$(DOM.newCampaign.flowchartAffix).hide(400);


	});

	// fix flowchart popup bug if clicked outside button
	$(".btn-group").click(function(e){
		e.stopPropagation();
	});
	$(document).click(function(e){
			$(DOM.newCampaign.flowchartAffix).hide(400);
	})


	//submit form
	$(DOM.newCampaign.btn.submit).click(function(e){

		var campaign = {
			campaignName: $(DOM.newCampaign.input.campaignName).val(),
			campaignDescription:$(DOM.newCampaign.input.campaignDescription).val(),
			startDate:$(DOM.newCampaign.input.startDate).val(),
			endDate:$(DOM.newCampaign.input.endDate).val(),
			details: guiCtrlUser.getTermsFromForm(),
		}
		console.log(campaign);
	})

	// select logic
	var logicSelected = false;
	$(DOM.newCampaign.bussinessLogic).on('click', DOM.newCampaign.campaignLogic, function(){
		logicSelected = true;
		$(DOM.newCampaign.campaignLogic).removeClass("selected-logic");
		$(DOM.newCampaign.campaignLogic).addClass("opacity-for-nonSelected");
		$(this).removeClass("opacity-for-nonSelected").addClass("selected-logic");

		var id = $(this).attr("id");



		for (var i = 0, ln = graphThumbs.length; i < ln; i++){
			if (graphThumbs[i].id == id){
				guiCtrlUser.insertSelectedGraph(graphThumbs[i]);
				break;
			}
		}
		if($(DOM.newCampaign.input.binderField).length > 0){
			$(DOM.newCampaign.input.binderField).empty();
			$(DOM.newCampaign.input.binderField).append(guiCtrlUser.getBinder());
		}
	})

	// if panel term check, get id and send it to gui controller
	$(DOM.newCampaign.panelTerm).on('change', DOM.newCampaign.panelTermCheckbox, function(e){
		if (logicSelected){
			var idString = this.id.split("-")[1];
			var term;
			for (var i = 0; i < terms.length; i++){
				if (terms[i]["id"] === idString){
					term = terms[i];
					break;
				}
			}
			if ($(this).prop("checked") === true){
				guiCtrlUser.configureTermCampaign(term, idString);
			} else if ($(this).prop("checked") === false){

				for (var i = 0; i < termSets.length; i++){
					var termArr = termSets[i]["terms"];
					var setId = termSets[i]["id"];

					for (var j = 0; j < termArr.length; j++){
						if (termArr[j]["id"] === idString){
							$("#panel-"+setId).prop("checked", false);
							break;
						}
					}
				}
				guiCtrlUser.removeTermCampaign(idString);
			}
		} else {
			$(this).prop("checked", false);
			$(DOM.notifications.notifications).addClass("open");
			guiCtrl.notifications('tree','Alert','red','<strong>Logic</strong> for the campaign <strong>not</strong> selected.');

			return false;
		}

	})

	// setting up term sets and canceling them... bummer for logic
	$(DOM.newCampaign.panelSet).on('click', DOM.newCampaign.panelSetCheckbox, function(e){
		if (logicSelected){
			if ($(this).prop("checked") === true){
				var idString = this.id.split("-")[1];

				for (var i = 0; i < termSets.length; i++){
					if (termSets[i]["id"] === idString){
						var setTerms = termSets[i]["terms"];
						for (var j = 0; j < setTerms.length; j++){
							var id = setTerms[j]["id"];
							if ($("#panel-"+id).prop("checked") === false){
								$("#panel-"+id).prop("checked", true).change();
							}
						}
						break;
					}
				}
			} else if ($(this).prop("checked") === false){


				var inactiveSet = [];
				var activeSets = [];
				var deactivateTerms = [];
				var activeTerms = [];

				var idString = this.id.split("-")[1];
				var cbLength = $("input[name='panel-sets']:checked").length;
				console.log(cbLength);

				// if last unselected, remove those therms, else do the check-a-doo
				if(cbLength === 0){
					var term;
					for (var i = 0; i < terms.length; i++){
						if (termSets[i]["id"] === idString){
							term = termSets[i]["terms"];
							break;
						}
					}

					for (var i = 0; i < term.length; i++){
						$("#panel-"+term[i]["id"]).prop("checked", false).change();
					}

				} else {
					$(DOM.newCampaign.panelSetCheckbox).each(function(){
						if ($(this).prop("checked") === true){
							var idString = this.id.split("-")[1];
							activeSets.push(idString);

							for (var i = 0; i < termSets.length; i++){
								for (var j = 0; j < activeSets.length; j++){
									if (termSets[i]["id"] === activeSets[j]){
										var termsPresent = termSets[i]["terms"];
										for (var n = 0; n < termsPresent.length; n++){
											activeTerms.push(termsPresent[n]["id"]);
										}
										break;
									}
								}
							}
						} else {
							var idString = this.id.split("-")[1];
							inactiveSet.push(idString);

							for (var i = 0; i < termSets.length; i++){
								for (var j = 0; j < inactiveSet.length; j++){
									if (termSets[i]["id"] === inactiveSet[j]){
										var termsPresent = termSets[i]["terms"];
										for (var n = 0; n < termsPresent.length; n++){
											deactivateTerms.push(termsPresent[n]["id"]);
										}
										break;
									}
								}
							}
						}
					});			
				}

				// after getting all id's, lets deactivate the ones that do not share an active set
				deactivateTerms = deactivateTerms.filter(function(val){
					return activeTerms.indexOf(val) == -1;
				});
				//console.log("remove shit left: "+deactivateTerms);
				for (var i = 0; i < deactivateTerms.length; i++){
					$("#panel-"+deactivateTerms[i]).prop("checked", false).change();
				}
			}
		} else {
			$(this).prop("checked", false);
			$(DOM.notifications.notifications).addClass("open");
			guiCtrl.notifications('tree','Alert','red','<strong>Logic</strong> for the campaign <strong>not</strong> selected.');

			return false;
		}

	})
	
	return {
		init: function(){
			guiCtrlUser.generateTermPanel();
			guiCtrlUser.generateSetPanel();
			guiCtrlUser.generateGraphLogic();
		},
	}
})(guiCtrlUser);

globalCtrlUser.init();
*/

}