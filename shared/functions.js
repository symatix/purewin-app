
alertPopUp = function(message, alert, timeout){
	var html = '';

	html += '<div id="floating_alert" class="alert alert-' + alert + ' fade in">';
	html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' + message;
	html += '&nbsp;&nbsp;</div>';
    $(html).appendTo('body');

    setTimeout(function () {
        $(".alert").alert('close');
	}, timeout);
}

getCampaignData = function(){

		var campaignObj = {};

		var logicId = $("#campaign-logic-thumb").attr("logic-id");
		var text = $(".campaign-input");
		var number = $(".number-function");
		var dropbox = $(".campaign-dropbox");
		var single = $(".campaign-single");
		var checkbox = $(".campaign-checkbox");
		var textarea = $(".campaign-textarea");
		var multiselect = $(".campaign-multiselect");


		var textLength = $(".campaign-input").length;
		var numberLength = $(".campaign-number").length;
		var dropboxLength = $(".campaign-dropbox").length;
		var singleLength = $(".campaign-single").length;
		var checkboxLength = $(".campaign-checkbox").length;
		var textareaLength = $(".campaign-textarea").length;
		var multiselectLength = $(".campaign-multiselect").length;

		// get them names and values
		var looper = function(elem, checkbox, single, number){
			var obj = {};
			var objArr = [];
			var id, key, val;
			var valArr = [];
			var idArr = [];

			// gotta get that array from checkbox
			if (checkbox){				
				var uniqueIds = function(arr) {
				    var result = [];
				    $.each(arr, function(i, e) {
				        if ($.inArray(e, result) == -1) result.push(e);
				    });
				    return result;
				}

				elem.each(function(){
					id = $(this).attr("data-id");
					idArr.push(id);
				})
				idArr = uniqueIds(idArr);

				for (var i = 0; i < idArr.length; i++){
					valArr = $("[data-id='"+idArr[i]+"']:checked").map(function(_, el) {
				        return $(el).val();
				    }).get();

				    key = $("[data-id='"+idArr[i]+"']").attr("data-name");
				    obj = {
				    	id:idArr[i],
				    	key:key,
				    	value:valArr,
				    }
				    objArr.push(obj);
				}
			} else if (single){
				// gotta get only checked radios
				elem.each(function(e){
					if (this.checked == true){
						id = $(this).attr("data-id");
						key = $(this).attr("data-name");
						val = $(this).val();
						obj= {
							id:id,
							key:key,
							value:val,
						};
						objArr.push(obj);
					}
				})
			
			} else if (number){
				//gotta get them numbers and ranges
				elem.each(function(){
					var id = $(this).attr("data-id");
					var key = $(this).attr("data-name");
					var numFunc = $(this).val();
					var firstVal = $(this).parent().prev().children("input").val();
					var lastVal = $(this).parent().next().children("input").val();

					if (numFunc === "range"){
						obj = {
							id:id,
							key:key,
							operator:numFunc,
							firstVal:firstVal,
							lastVal:lastVal,
						}
					objArr.push(obj);

					} else {
						obj = {
							id:id,
							key:key,
							operator:numFunc,
							firstVal:firstVal,
						}
					objArr.push(obj);
					} 
				});

			} else {
				elem.each(function(){
					id = $(this).attr("data-id");
					key = $(this).attr("data-name");
					val = $(this).val();
					obj= {
						id:id,
						key:key,
						value:val,
					};
					objArr.push(obj);
				});
				
			}
			return objArr;
		}

		// go thru all variables and do the magic
		if (textLength > 0){
			campaignObj.input = looper(text);
		}

		if (numberLength > 0){
			campaignObj.number = looper(number, false, false, true);
		}

		if (dropboxLength > 0){
			campaignObj.dropbox = looper(dropbox);
		}

		if (singleLength > 0){
			campaignObj.single = looper(single, false, true);
		}

		if (checkboxLength > 0){
			campaignObj.checkbox = looper(checkbox, true);
		}

		if (textareaLength > 0){
			campaignObj.textarea = looper(textarea);
		}

		if (multiselectLength > 0){
			campaignObj.multiselect = looper(multiselect);
		}

		var campaign = {
			meta:{
	        	owner:Meteor.userId(),
	        	added:new Date(),
			},
			campaignName: $("#campaign-name").val(),
			campaignDescription:tinyMCE.get("campaign-description").getContent(/* {format : 'raw'} */), // use raw format to get string
			startDate:$("#form-campaign-dateStart").val(),
			endDate:$("#form-campaign-dateEnd").val(),
			logic:logicId,
			_details: campaignObj,
		}
		return campaign;
}