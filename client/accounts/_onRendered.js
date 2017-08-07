Template.calendar.rendered = function(){
	var campaigns = [];
	var campaignData = Campaigns.find().fetch();

	campaignData.forEach(function(i){
		var startDate = new Date(i.startDate);
		var endDate = new Date(i.endDate);
		var currentDate = new Date();

		if (startDate < currentDate && currentDate < endDate){
			var dateObj = {
				title: i.campaignName + " | Status: ACTIVE",
				start: new Date(i.startDate),
				end: new Date(i.endDate),
				color:"#006622",
				textColor:"#ffffff",
			}
			campaigns.push(dateObj);
		} else  if (startDate > currentDate){
			var dateObj = {
				title: i.campaignName + " | Status: PASSIVE",
				start: new Date(i.startDate),
				end: new Date(i.endDate),
				color:"#bfbfbf",
				textColor:"#000000",
			}
			campaigns.push(dateObj);
		} else if (endDate < currentDate){
			var dateObj = {
				title: i.campaignName + " | Status: ENDED",
				start: new Date(i.startDate),
				end: new Date(i.endDate),
				color:"#262626",
				textColor:"#ffffff",
			}
			campaigns.push(dateObj);

		}

		
	})
	console.log(campaigns);
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    
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