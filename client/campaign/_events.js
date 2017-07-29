Template.campaign.events({
	'click .campaign-logic':function(e){
		Session.set("campaignLogic", this._id);
		console.log(Session.get("campaignLogic"));
	},
	'click #btn-submit-campaign': function(e){
		e.preventDefault();
		var campaignObj = {};

		var text = $(".campaign-input");
		var number = $(".campaign-number");
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
		var looper = function(elem, checkbox){
			var obj = {};
			var id, key, val;
			var chkBox = [];
			var valArr = [];
			var idArr = [];


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
						console.log(el);
				        return $(el).val();
				    }).get();

				    key = $("[data-id='"+idArr[i]+"']").attr("data-name");
				    obj[key] = {
				    	id:idArr[i],
				    	value:valArr,
				    }
				    chkBox.push(obj);
				}
				return obj;
			} else {
				elem.each(function(){
					id = $(this).attr("data-id");
					key = $(this).attr("data-name");
					val = $(this).val();
					obj[key]= {
						id:id,
						value:val,
					};
				});
			}
			return obj;
		}

		// go thru all variables and do the magic
		if (textLength > 0){
			campaignObj.input = looper(text);
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
			campaignObj.checkbox = looper(checkbox, true);
		}

		if (textareaLength > 0){
			campaignObj.textarea = looper(textarea);
		}

		if (multiselectLength > 0){
			campaignObj.multiselect = looper(multiselect);
		}

		var campaign = {
			campaignName: $("#campaign-name").val(),
			campaignDescription:$("#campaign-description").val(),
			startDate:$("#form-campaign-dateStart").val(),
			endDate:$("#form-campaign-dateEnd").val(),
			_details: campaignObj,
		}
		console.log(campaign);
	}
})