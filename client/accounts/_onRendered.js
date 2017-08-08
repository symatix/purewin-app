Template.calendar.rendered = function(){
	var campaigns = [];
	var campaignData = Campaigns.find().fetch();

	campaignData.forEach(function(i){
		var startDate = new Date(i.startDate);
		var endDate = new Date(i.endDate);
		var currentDate = new Date();
		var today = new Date();


		if (startDate < currentDate && currentDate < endDate){
			var total = endDate - startDate;
			var progress = currentDate - startDate;
			var percent = Math.round(progress/ total * 100 ) + "%";
			var diff =  Math.floor(( Date.parse(endDate) - Date.parse(currentDate) ) / 86400000); 
			console.log(diff);
			var dateObj = {
				title: "Campaign: "+i.campaignName + " | Status: ACTIVE | Progress: "+percent+" ("+diff+" days left)",
				start: new Date(i.startDate),
				end: new Date(i.endDate),
				color:"#006622",
				textColor:"#ffffff",
			}
			campaigns.push(dateObj);
		} else  if (startDate > currentDate){
			var diff =  Math.floor(( Date.parse(startDate) - Date.parse(currentDate) ) / 86400000); 
			var dateObj = {
				title: "Campaign: "+i.campaignName + " | Status: PASSIVE | Progress: 0% ("+diff+" days until start)",
				start: new Date(i.startDate),
				end: new Date(i.endDate),
				color:"#bfbfbf",
				textColor:"#000000",
			}
			campaigns.push(dateObj);
		} else if (endDate < currentDate){
			var dateObj = {
				title: "Campaign: "+i.campaignName + " | Status: PASSIVE | Progress: 100%",
				start: new Date(i.startDate),
				end: new Date(i.endDate),
				color:"#262626",
				textColor:"#ffffff",
			}
			campaigns.push(dateObj);

		}

		
	})

    $('#calendar').fullCalendar({
       		
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			displayEventTime: false,
            editable: false,
            droppable: false, // this allows things to be dropped onto the calendar
			eventLimit: false, // allow "more" link when too many events
			events:campaigns
		});
}