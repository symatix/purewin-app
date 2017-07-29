
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